import type { Session } from "../types/types";
import { formatDateKey, isToday } from "../helpers/helpers";

type CalendarViewProps = {
  monthLabel: string;
  monthMatrix: (Date | null)[][];
  sessionsByDate: Record<string, Session[]>;
  selectedDate: string;
  setSelectedDate: (d: string) => void;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
};

export function CalendarView(props: CalendarViewProps) {
  const {
    monthLabel,
    monthMatrix,
    sessionsByDate,
    selectedDate,
    setSelectedDate,
    goToPrevMonth,
    goToNextMonth,
  } = props;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 md:p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={goToPrevMonth}
          className="rounded-full border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs text-slate-200 hover:border-neon-cyan hover:text-neon-cyan transition"
        >
          ◀
        </button>
        <div className="text-xs md:text-sm font-medium text-slate-100">
          {monthLabel}
        </div>
        <button
          type="button"
          onClick={goToNextMonth}
          className="rounded-full border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs text-slate-200 hover:border-neon-cyan hover:text-neon-cyan transition"
        >
          ▶
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-[10px] md:text-xs text-slate-400 mb-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs">
        {monthMatrix.map((week, wi) =>
          week.map((date, di) => {
            if (!date) {
              return (
                <div
                  key={`${wi}-${di}`}
                  className="h-10 md:h-11 rounded-xl border border-transparent"
                />
              );
            }
            const key = formatDateKey(date);
            const hasSessions = !!sessionsByDate[key];
            const isSelected = selectedDate === key;
            const today = isToday(date);
            const dayNumber = date.getDate();

            return (
              <button
                key={`${wi}-${di}`}
                type="button"
                onClick={() => setSelectedDate(key)}
                className={[
                  "h-10 md:h-11 w-full rounded-xl border text-center align-middle flex flex-col items-center justify-center gap-0.5 transition",
                  isSelected
                    ? "border-neon-cyan bg-slate-900/90"
                    : "border-slate-800 bg-slate-900/50 hover:border-neon-cyan/60 hover:bg-slate-900",
                ].join(" ")}
              >
                <span
                  className={[
                    "text-[11px] md:text-xs",
                    today ? "text-neon-green font-semibold" : "text-slate-100",
                  ].join(" ")}
                >
                  {dayNumber}
                </span>
                {hasSessions && (
                  <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan shadow-[0_0_6px_rgba(51,230,255,0.9)]" />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
