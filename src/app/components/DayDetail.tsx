import type { Session } from "../types/types";

type DayDetailProps = {
  selectedDate: string;
  sessions: Session[];
  deletingSessionId: string | null;
  updatingPaidPlayerId: string | null;
  onDeleteSession: (id: string) => void;
  onTogglePaid: (
    sessionId: string,
    playerId: string,
    currentPaid: boolean
  ) => void;
  isAdmin: boolean;
};

export function DayDetail({
  selectedDate,
  sessions,
  deletingSessionId,
  updatingPaidPlayerId,
  onDeleteSession,
  onTogglePaid,
  isAdmin,
}: DayDetailProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 md:p-4 text-xs">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <div className="text-[11px] text-slate-400 uppercase tracking-wide">
            Sessions on
          </div>
          <div className="text-sm font-semibold text-slate-100">
            {selectedDate || "-"}
          </div>
        </div>
        <div className="text-[11px] text-slate-400">
          {sessions.length} session{sessions.length !== 1 && "s"}
        </div>
      </div>

      {sessions.length === 0 ? (
        <p className="mt-3 text-[11px] text-slate-500">
          Belum ada sesi tersimpan di tanggal ini. Save sesi di atas untuk mulai isi
          history.
        </p>
      ) : (
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {sessions.map((s) => {
            const isDeleting = deletingSessionId === s.id;
            return (
              <div
                key={s.id}
                className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-400">
                    Start:{" "}
                    <span className="text-slate-100 font-medium">
                      {s.startTime || "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-[11px] text-neon-cyan font-medium">
                      {s.totalHours} jam
                    </div>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => onDeleteSession(s.id)}
                        disabled={isDeleting}
                        className="rounded-full border border-red-500/60 bg-slate-950/80 px-2 py-0.5 text-[10px] text-red-400 hover:bg-red-500/10 transition disabled:opacity-60 disabled:hover:bg-slate-950/80"
                      >
                        {isDeleting ? (
                          <span className="inline-flex items-center gap-1">
                            <span className="inline-block h-3 w-3 animate-spin rounded-full border border-red-400 border-t-transparent" />
                            Deleting...
                          </span>
                        ) : (
                          "Delete"
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {(s.sessionName || s.location) && (
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    {s.sessionName && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/70 px-2 py-1 text-slate-200">
                        🎱 {s.sessionName}
                      </span>
                    )}
                    {s.location && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/70 px-2 py-1 text-slate-300">
                        📍 {s.location}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Total Cost</span>
                  <span className="text-neon-green font-semibold">
                    Rp {s.totalCost.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="border-t border-slate-800 pt-2 mt-1">
                  <div className="mb-1 text-[11px] text-slate-400">
                    Split per player:
                  </div>
                  <div className="space-y-1.5">
                    {s.players.map((p) => {
                      const isUpdatingPaid = updatingPaidPlayerId === p.id;
                      return (
                        <div
                          key={p.id}
                          className="flex items-center justify-between text-[11px]"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-100">
                              {p.name}
                            </span>
                            <span className="text-slate-500">
                              {p.hours} jam •{" "}
                              {Math.round(p.portion * 1000) / 10}% dari total
                            </span>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <div className="font-semibold text-neon-green">
                              Rp {Math.round(p.amount).toLocaleString("id-ID")}
                            </div>

                            {isAdmin ? (
                              <button
                                type="button"
                                onClick={() =>
                                  onTogglePaid(s.id, p.id, p.paid)
                                }
                                disabled={isUpdatingPaid}
                                className={[
                                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] border transition",
                                  p.paid
                                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                                    : "border-slate-600 bg-slate-900 text-slate-300 hover:border-neon-cyan hover:text-neon-cyan",
                                  isUpdatingPaid && "opacity-60",
                                ].join(" ")}
                              >
                                {isUpdatingPaid ? (
                                  <span className="inline-block h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                                ) : p.paid ? (
                                  <>✅ Paid</>
                                ) : (
                                  <>Mark as paid</>
                                )}
                              </button>
                            ) : (
                              <span
                                className={[
                                  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px]",
                                  p.paid
                                    ? "bg-emerald-500/10 text-emerald-300"
                                    : "bg-slate-800 text-slate-400",
                                ].join(" ")}
                              >
                                {p.paid ? "Paid" : "Unpaid"}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
