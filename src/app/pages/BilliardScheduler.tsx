"use client";

import { useEffect, useMemo, useState } from "react";
import { SchedulerHeader } from "../components/SchedulerHeader";
import { SessionForm } from "../components/SessionForm";
import { CostOverview } from "../components/CostOverview";
import { HistorySection } from "../components/HistorySection";
import type { PlayerInput, Session, PlayerShare } from "../types/types";
import { parseNumber } from "../helpers/helpers";
import { supabase } from "@/lib/supabaseClient";
import { useSearchParams } from "next/navigation";

type SessionRow = {
  id: string;
  date: string;
  start_time: string | null;
  total_hours: number;
  total_cost: number;
  total_player_hours: number;
  session_name: string | null;
  location: string | null;
  created_at: string;
  players?: {
    id: string;
    name: string;
    hours: number;
    portion: number;
    amount: number;
    paid: boolean;
  }[];
};

export function BilliardScheduler() {
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get("isAdmin") === "true";
  const [sessionDate, setSessionDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );

  const [startTime, setStartTime] = useState<string>("");
  const [sessionName, setSessionName] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  const [totalHoursInput, setTotalHoursInput] = useState<string>("");
  const [totalCostInput, setTotalCostInput] = useState<string>("");

  const [players, setPlayers] = useState<PlayerInput[]>([
    { id: 1, name: "", hoursInput: "" },
  ]);

  const [history, setHistory] = useState<Session[]>([]);

  // 🔹 loading flags
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);
  const [clearingHistory, setClearingHistory] = useState<boolean>(false);

  /* ---------- Load history dari Supabase ---------- */

  useEffect(() => {
    const loadHistory = async () => {
      setLoadingHistory(true);
      const { data, error } = await supabase
        .from("billiard_sessions")
        .select(
          `
          id,
          date,
          start_time,
          total_hours,
          total_cost,
          total_player_hours,
          session_name,
          location,
          created_at,
          players:billiard_session_players (
            id,
            name,
            hours,
            portion,
            amount
          )
        `
        )
        .order("date", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error loading history from Supabase:", error);
        setLoadingHistory(false);
        return;
      }

      const mapped: Session[] = (data as SessionRow[]).map((row) => ({
        id: row.id,
        date: row.date,
        startTime: row.start_time ?? "",
        totalHours: row.total_hours,
        totalCost: row.total_cost,
        totalPlayerHours: row.total_player_hours,
        sessionName: row.session_name ?? undefined,
        location: row.location ?? undefined,
        createdAt: row.created_at,
        players: (row.players ?? []).map((p) => ({
          name: p.name,
          hours: p.hours,
          portion: p.portion,
          amount: p.amount,
          paid: p.paid ?? false,
        })),
      }));

      setHistory(mapped);
      setLoadingHistory(false);
    };

    loadHistory();
  }, []);

  /* ---------- Derived values ---------- */

  const totalHours = useMemo(
    () => parseNumber(totalHoursInput),
    [totalHoursInput]
  );
  const totalCost = useMemo(
    () => parseNumber(totalCostInput),
    [totalCostInput]
  );

  const numericPlayers = useMemo(
    () =>
      players.map((p) => ({
        id: p.id,
        name: p.name || `Player ${p.id}`,
        hours: parseNumber(p.hoursInput),
      })),
    [players]
  );

  const totalPlayerHours = useMemo(
    () => numericPlayers.reduce((sum, p) => sum + (p.hours || 0), 0),
    [numericPlayers]
  );

  const shares = useMemo(() => {
    if (totalPlayerHours <= 0 || totalCost <= 0) return [];
    return numericPlayers.map((p) => {
      const portion = (p.hours || 0) / totalPlayerHours;
      const amount = portion * totalCost;
      return {
        id: p.id,
        name: p.name,
        hours: p.hours,
        portion,
        amount,
      };
    });
  }, [numericPlayers, totalCost, totalPlayerHours]);

  /* ---------- Handlers ---------- */

  const handlePlayerChange = (
    id: number,
    field: "name" | "hoursInput",
    value: string
  ) => {
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
            ...p,
            [field]: value,
          }
          : p
      )
    );
  };

  const handleAddPlayer = () => {
    const nextId = players.length ? Math.max(...players.map((p) => p.id)) + 1 : 1;
    setPlayers((prev) => [
      ...prev,
      { id: nextId, name: "", hoursInput: "" },
    ]);
  };

  const handleRemovePlayer = (id: number) => {
    if (players.length <= 1) return;
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSaveSession = async () => {
    if (saving) return; // guard double click
    if (!sessionDate) {
      alert("Tanggal belum diisi.");
      return;
    }
    if (totalHours <= 0) {
      alert("Total durasi harus lebih dari 0.");
      return;
    }
    if (totalCost <= 0) {
      alert("Total cost harus lebih dari 0.");
      return;
    }
    if (totalPlayerHours <= 0) {
      alert("Total player-hours harus lebih dari 0.");
      return;
    }
    if (shares.length === 0) {
      alert("Belum ada pemain / jam main yang valid.");
      return;
    }

    setSaving(true);

    const playerShares: PlayerShare[] = shares.map((s) => ({
      name: s.name,
      hours: s.hours,
      portion: s.portion,
      amount: Math.round(s.amount),
      paid: false,
    }));

    const { data: insertedSession, error: sessionError } = await supabase
      .from("billiard_sessions")
      .insert({
        date: sessionDate,
        start_time: startTime || null,
        total_hours: totalHours,
        total_cost: Math.round(totalCost),
        total_player_hours: totalPlayerHours,
        session_name: sessionName || null,
        location: location || null,
      })
      .select("id, created_at")
      .single();

    if (sessionError || !insertedSession) {
      console.error("Error inserting session:", sessionError);
      alert("Gagal menyimpan session ke database.");
      setSaving(false);
      return;
    }

    const sessionId: string = insertedSession.id;

    const { error: playersError } = await supabase
      .from("billiard_session_players")
      .insert(
        playerShares.map((p) => ({
          session_id: sessionId,
          name: p.name,
          hours: p.hours,
          portion: p.portion,
          amount: p.amount,
          paid: false,
        }))
      );

    if (playersError) {
      console.error("Error inserting players:", playersError);
      alert("Session tersimpan, tapi gagal menyimpan detail pemain.");
      setSaving(false);
      return;
    }

    const newSession: Session = {
      id: sessionId,
      date: sessionDate,
      startTime,
      totalHours,
      totalCost: Math.round(totalCost),
      totalPlayerHours,
      sessionName: sessionName || undefined,
      location: location || undefined,
      createdAt: insertedSession.created_at,
      players: playerShares,
    };

    setHistory((prev) => [...prev, newSession]);

    // ✅ Auto reset input (kecuali tanggal)
    setStartTime("");
    setSessionName("");
    setLocation("");
    setTotalHoursInput("");
    setTotalCostInput("");
    setPlayers([{ id: 1, name: "", hoursInput: "" }]);

    setSaving(false);
  };

  const handleDeleteSession = async (id: string) => {
    if (deletingSessionId) return;
    setDeletingSessionId(id);

    const { error } = await supabase
      .from("billiard_sessions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting session:", error);
      alert("Gagal menghapus session dari database.");
      setDeletingSessionId(null);
      return;
    }

    setHistory((prev) => prev.filter((s) => s.id !== id));
    setDeletingSessionId(null);
  };

  const handleClearHistory = async () => {
    if (clearingHistory) return;
    if (history.length === 0) return;
    if (
      typeof window !== "undefined" &&
      !window.confirm("Yakin hapus semua history billiard dari database?")
    ) {
      return;
    }

    setClearingHistory(true);

    const { error } = await supabase
      .from("billiard_sessions")
      .delete()
      .neq("id", "");

    if (error) {
      console.error("Error clearing history:", error);
      alert("Gagal menghapus semua history dari database.");
      setClearingHistory(false);
      return;
    }

    setHistory([]);
    setClearingHistory(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-3 py-8 md:px-6 md:py-12 lg:py-16">
      <div className="relative w-full max-w-6xl">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-neon-cyan/30 blur-3xl" />
          <div className="absolute -bottom-40 right-4 h-64 w-64 rounded-full bg-neon-green/25 blur-3xl" />
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl shadow-[0_0_60px_rgba(15,23,42,0.9)]">
          <SchedulerHeader />

          <div className="grid gap-6 px-4 py-5 md:px-6 md:py-6 lg:gap-8 md:grid-cols-[1.15fr_1fr]">
            <SessionForm
              sessionDate={sessionDate}
              startTime={startTime}
              sessionName={sessionName}
              location={location}
              totalHoursInput={totalHoursInput}
              totalCostInput={totalCostInput}
              players={players}
              totalPlayerHours={totalPlayerHours}
              saving={saving}
              onChangeDate={setSessionDate}
              onChangeStartTime={setStartTime}
              onChangeSessionName={setSessionName}
              onChangeLocation={setLocation}
              onChangeTotalHours={setTotalHoursInput}
              onChangeTotalCost={setTotalCostInput}
              onChangePlayer={handlePlayerChange}
              onAddPlayer={handleAddPlayer}
              onRemovePlayer={handleRemovePlayer}
              onSaveSession={handleSaveSession}
            />

            <CostOverview
              sessionDate={sessionDate}
              startTime={startTime}
              sessionName={sessionName}
              location={location}
              totalHours={totalHours}
              totalCost={totalCost}
              totalPlayerHours={totalPlayerHours}
              shares={shares}
            />
          </div>

          <HistorySection
            history={history}
            loadingHistory={loadingHistory}
            clearingHistory={clearingHistory}
            deletingSessionId={deletingSessionId}
            onDeleteSession={handleDeleteSession}
            onClearHistory={handleClearHistory}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </div>
  );
}
