"use client";

import { useEffect, useMemo, useState } from "react";
import type { Session } from "../types/types";
import { buildMonthMatrix } from "../helpers/helpers";
import { CalendarView } from "./CalendarView";
import { DayDetail } from "./DayDetail";

type HistorySectionProps = {
  history: Session[];
  loadingHistory: boolean;
  clearingHistory: boolean;
  deletingSessionId: string | null;
  updatingPaidPlayerId: string | null;
  onDeleteSession: (id: string) => void;
  onClearHistory: () => void;
  onTogglePaid: (
    sessionId: string,
    playerId: string,
    currentPaid: boolean
  ) => void;
  isAdmin: boolean;
};

export function HistorySection({
  history,
  deletingSessionId,
  updatingPaidPlayerId,
  onDeleteSession,
  onTogglePaid,
  isAdmin,
}: HistorySectionProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );

  useEffect(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setSelectedDate(last.date);
    const d = new Date(last.date);
    if (!Number.isNaN(d.getTime())) setCurrentMonth(d);
  }, [history]);

  const monthLabel = useMemo(
    () =>
      currentMonth.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    [currentMonth]
  );

  const sessionsByDate = useMemo(() => {
    const map: Record<string, Session[]> = {};
    for (const s of history) {
      if (!map[s.date]) map[s.date] = [];
      map[s.date].push(s);
    }
    return map;
  }, [history]);

  const sessionsForSelectedDate = sessionsByDate[selectedDate] || [];

  const monthKey = useMemo(() => {
    const y = currentMonth.getFullYear();
    const m = String(currentMonth.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
  }, [currentMonth]);

  const monthlySessions = useMemo(
    () => history.filter((s) => s.date.startsWith(monthKey)),
    [history, monthKey]
  );

  const monthlySummary = useMemo(() => {
    const playersMap = new Map<
      string,
      { totalAmount: number; totalHours: number; totalPaid: number }
    >();
    const locationsSet = new Set<string>();

    let totalCost = 0;
    let totalHours = 0;
    let totalPaid = 0;

    for (const s of monthlySessions) {
      totalCost += s.totalCost;
      totalHours += s.totalHours;
      if (s.location) locationsSet.add(s.location);

      for (const p of s.players) {
        const current = playersMap.get(p.name) || {
          totalAmount: 0,
          totalHours: 0,
          totalPaid: 0,
        };
        current.totalAmount += p.amount;
        current.totalHours += p.hours;
        if (p.paid === true) {
          current.totalPaid += p.amount;
          totalPaid += p.amount;
        }
        playersMap.set(p.name, current);
      }
    }

    return {
      totalSessions: monthlySessions.length,
      totalCost,
      totalHours,
      totalPaid,
      players: Array.from(playersMap.entries())
        .map(([name, v]) => ({ name, ...v }))
        .sort((a, b) => b.totalAmount - a.totalAmount),
      locations: Array.from(locationsSet),
    };
  }, [monthlySessions]);

  const monthMatrix = useMemo(
    () => buildMonthMatrix(currentMonth),
    [currentMonth]
  );

  const goToPrevMonth = () => {
    setCurrentMonth((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  const sessionsCountText =
    monthlySummary.totalSessions === 1
      ? "1 session"
      : `${monthlySummary.totalSessions} sessions`;

  const handleDownloadMonthlyInvoice = (
    player: {
      name: string;
      totalAmount: number;
      totalHours: number;
      totalPaid: number;
    },
    monthLabel: string
  ) => {
    import("../helpers/pdfGenerator").then(({ downloadInvoicePDF }) => {
      downloadInvoicePDF({
        invoiceNumber: `MONTHLY-${monthLabel.replace(
          /\s/g,
          "-"
        )}-${player.name.slice(0, 3).toUpperCase()}`,
        date: new Date().toISOString(), // Today's invoice date
        customerName: player.name,
        sessionName: `Monthly Summary - ${monthLabel}`,
        durationHours: player.totalHours,
        totalAmount: player.totalAmount - player.totalPaid,
        totalPaid: player.totalPaid,
        isPaid: player.totalPaid >= player.totalAmount,
        items: [
          {
            description: `Billiard Sessions - ${monthLabel}`,
            quantity: player.totalHours,
            price: player.totalAmount / (player.totalHours || 1),
            total: player.totalAmount,
          },
        ],
      });
    });
  };

  return (
    <div className="border-t border-slate-800 px-4 py-5 md:px-6 md:py-6">
      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h2 className="text-sm md:text-base font-semibold text-slate-100">
          Play History Calendar
        </h2>
      </div>

      {/* Monthly summary */}
      <div className="mb-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-3 md:p-4 text-[11px] md:text-xs text-slate-300">
        <div className="mb-2 flex items-center justify-between">
          <div className="font-semibold text-slate-100">
            Monthly Summary – {monthLabel}
          </div>
          <div className="text-slate-400">{sessionsCountText}</div>
        </div>
        {monthlySummary.totalSessions === 0 ? (
          <p className="text-slate-500">
            Belum ada sesi yang tersimpan di bulan ini.
          </p>
        ) : (
          <>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 mb-3">
              <div className="space-y-1 rounded-xl border border-slate-800 bg-slate-900/70 p-2">
                <div className="text-slate-400 uppercase tracking-wide">
                  Total Cost
                </div>
                <div className="text-sm font-semibold text-neon-green">
                  Rp {monthlySummary.totalCost.toLocaleString("id-ID")}
                </div>
              </div>
              <div className="space-y-1 rounded-xl border border-slate-800 bg-slate-900/70 p-2">
                <div className="text-slate-400 uppercase tracking-wide">
                  Total Paid
                </div>
                <div className="text-sm font-semibold text-neon-cyan">
                  Rp {monthlySummary.totalPaid.toLocaleString("id-ID")}
                </div>
              </div>
              <div className="space-y-1 rounded-xl border border-slate-800 bg-slate-900/70 p-2">
                <div className="text-slate-400 uppercase tracking-wide">
                  Total Hours
                </div>
                <div className="text-sm font-semibold text-neon-cyan">
                  {monthlySummary.totalHours} jam
                </div>
              </div>
              <div className="space-y-1 rounded-xl border border-slate-800 bg-slate-900/70 p-2">
                <div className="text-slate-400 uppercase tracking-wide">
                  Locations
                </div>
                <div className="text-sm font-semibold text-slate-100">
                  {monthlySummary.locations.length > 0
                    ? monthlySummary.locations.join(", ")
                    : "-"}
                </div>
              </div>
            </div>

            {monthlySummary.players.length > 0 && (
              <div>
                <div className="mb-1 text-slate-400">
                  Per-player recap (bulan ini):
                </div>
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {monthlySummary.players.map((p) => {
                    const isPaid = p.totalPaid >= p.totalAmount;
                    return (
                      <div
                        key={p.name}
                        className="group flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/70 px-2.5 py-1.5"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-100 flex items-center gap-1">
                            {p.name}
                            {isPaid === true && (
                              <span className="text-emerald-400 text-[10px]">
                                ✓
                              </span>
                            )}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {p.totalHours} jam total
                          </span>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleDownloadMonthlyInvoice(p, monthLabel)
                            }
                            className="hidden group-hover:block rounded border border-slate-700 bg-slate-800/50 px-1.5 py-0.5 text-[9px] text-slate-400 hover:text-slate-200 hover:border-slate-500 transition"
                            title="Download Monthly Invoice"
                          >
                            PDF
                          </button>
                          <div>
                            <div className="text-[11px] text-slate-400">
                              Total bayar
                            </div>
                            <div
                              className={`text-sm font-semibold ${isPaid ? "text-slate-400" : "text-neon-green"
                                }`}
                            >
                              Rp{" "}
                              {Math.round(p.totalAmount).toLocaleString(
                                "id-ID"
                              )}
                            </div>
                            {p.totalPaid > 0 && !isPaid && (
                              <div className="text-[10px] text-slate-500">
                                Paid: Rp{" "}
                                {Math.round(p.totalPaid).toLocaleString(
                                  "id-ID"
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
        <CalendarView
          monthLabel={monthLabel}
          monthMatrix={monthMatrix}
          sessionsByDate={sessionsByDate}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          goToPrevMonth={goToPrevMonth}
          goToNextMonth={goToNextMonth}
        />

        <DayDetail
          selectedDate={selectedDate}
          sessions={sessionsForSelectedDate}
          deletingSessionId={deletingSessionId}
          updatingPaidPlayerId={updatingPaidPlayerId}
          onDeleteSession={onDeleteSession}
          onTogglePaid={onTogglePaid}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
}
