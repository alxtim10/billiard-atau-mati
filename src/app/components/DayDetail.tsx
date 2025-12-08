import type { Session } from "../types/types";

type DayDetailProps = {
  selectedDate: string;
  sessions: Session[];
  deletingSessionId: string | null;
  onDeleteSession: (id: string) => void;
  isAdmin: boolean;
};

export function DayDetail({
  selectedDate,
  sessions,
  deletingSessionId,
  onDeleteSession,
  isAdmin
}: DayDetailProps) {
  /* ---------------- Invoice Handler ---------------- */
  const handleDownloadInvoice = (
    session: Session,
    player: {
      name: string;
      hours: number;
      portion: number;
      amount: number;
      paid?: boolean;
    }
  ) => {
    import("../helpers/pdfGenerator").then(({ downloadInvoicePDF }) => {
      downloadInvoicePDF({
        invoiceNumber: `${session.date.replace(/-/g, "")}-${session.id.slice(
          0,
          4
        )}-${player.name.slice(0, 3).toUpperCase()}`,
        date: session.date,
        customerName: player.name,
        sessionName: session.sessionName,
        location: session.location,
        durationHours: player.hours,
        totalAmount: player.amount,
        isPaid: player.paid ?? false,
        items: [
          {
            description: "Billiard Session Share",
            quantity: player.hours,
            price: player.amount / player.hours,
            total: player.amount,
          },
        ],
      });
    });
  };

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
                        {s.sessionName}
                      </span>
                    )}
                    {s.location && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/70 px-2 py-1 text-slate-300">
                        {s.location}
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
                    {s.players.map((p, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-[11px]"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-100 flex items-center gap-1">
                            {p.name}
                            {p.paid === true && (
                              <span className="text-emerald-400 text-[10px]">✓</span>
                            )}
                          </span>
                          <span className="text-slate-500">
                            {p.hours} jam •{" "}
                            {Math.round(p.portion * 1000) / 10}% dari total
                          </span>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleDownloadInvoice(s, p)}
                            className="hidden group-hover:block rounded border border-slate-700 bg-slate-800/50 px-1.5 py-0.5 text-[9px] text-slate-400 hover:text-slate-200 hover:border-slate-500 transition"
                            title="Download Invoice"
                          >
                            PDF
                          </button>
                          <div>
                            <div
                              className={`font-semibold ${p.paid === true
                                  ? "text-slate-400"
                                  : "text-neon-green"
                                }`}
                            >
                              Rp {Math.round(p.amount).toLocaleString("id-ID")}
                            </div>
                            {p.paid === true && (
                              <div className="text-[10px] text-slate-500">
                                PAID
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
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
