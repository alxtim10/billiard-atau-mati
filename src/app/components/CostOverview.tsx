type Share = {
  id: number;
  name: string;
  hours: number;
  portion: number;
  amount: number;
};

type CostOverviewProps = {
  sessionDate: string;
  startTime: string;
  sessionName: string;
  location: string;
  totalHours: number;
  totalCost: number;
  totalPlayerHours: number;
  shares: Share[];
};

export function CostOverview(props: CostOverviewProps) {
  const {
    sessionDate,
    startTime,
    sessionName,
    location,
    totalHours,
    totalCost,
    totalPlayerHours,
    shares,
  } = props;

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-slate-900/90 p-4 md:p-5">
        <h2 className="mb-3 text-sm font-medium text-slate-100">
          Cost Split Overview
        </h2>

        {/* Session summary */}
        <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-3 text-xs">
          <div className="space-y-1 rounded-xl border border-slate-800 bg-slate-950/60 p-2">
            <div className="text-slate-400 uppercase tracking-wide">Date</div>
            <div className="text-sm font-semibold text-slate-100">
              {sessionDate || "-"}
            </div>
          </div>
          <div className="space-y-1 rounded-xl border border-slate-800 bg-slate-950/60 p-2">
            <div className="text-slate-400 uppercase tracking-wide">
              Start Time
            </div>
            <div className="text-sm font-semibold text-slate-100">
              {startTime || "-"}
            </div>
          </div>
          <div className="space-y-1 rounded-xl border border-slate-800 bg-slate-950/60 p-2">
            <div className="text-slate-400 uppercase tracking-wide">
              Duration
            </div>
            <div className="text-sm font-semibold text-neon-cyan">
              {totalHours || 0} jam
            </div>
          </div>
        </div>

        {/* Name & location chips */}
        <div className="mb-3 flex flex-wrap gap-2 text-[11px]">
          {sessionName && (
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/70 px-2.5 py-1 text-slate-200">
              <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan" />
              {sessionName}
            </span>
          )}
          {location && (
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/70 px-2.5 py-1 text-slate-300">
              📍 {location}
            </span>
          )}
        </div>

        {/* Cost cards */}
        <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
          <div className="space-y-1 rounded-xl border border-slate-800 bg-slate-950/60 p-2">
            <div className="text-slate-400 uppercase tracking-wide">
              Total Cost
            </div>
            <div className="text-base font-semibold text-neon-green">
              Rp {totalCost.toLocaleString("id-ID")}
            </div>
          </div>
          <div className="space-y-1 rounded-xl border border-slate-800 bg-slate-950/60 p-2">
            <div className="text-slate-400 uppercase tracking-wide">
              Player-Hours
            </div>
            <div className="text-base font-semibold text-slate-100">
              {totalPlayerHours.toFixed(2)}
            </div>
          </div>
        </div>

        {shares.length === 0 ? (
          null
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {shares.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5"
              >
                <div className="space-y-0.5">
                  <div className="text-sm font-medium text-slate-100">
                    {s.name}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {s.hours} jam • {Math.round(s.portion * 1000) / 10}% dari total
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-neon-green">
                    Rp {Math.round(s.amount).toLocaleString("id-ID")}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    ~ Rp{" "}
                    {Math.round(
                      (s.amount || 0) / (s.hours || 1)
                    ).toLocaleString("id-ID")}{" "}
                    / jam
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
