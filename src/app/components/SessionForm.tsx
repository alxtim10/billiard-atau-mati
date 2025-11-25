import type { PlayerInput } from "../types/types";

type SessionFormProps = {
  sessionDate: string;
  startTime: string;
  sessionName: string;
  location: string;
  totalHoursInput: string;
  totalCostInput: string;
  players: PlayerInput[];
  totalPlayerHours: number;
  saving: boolean;
  onChangeDate: (date: string) => void;
  onChangeStartTime: (time: string) => void;
  onChangeSessionName: (name: string) => void;
  onChangeLocation: (location: string) => void;
  onChangeTotalHours: (value: string) => void;
  onChangeTotalCost: (value: string) => void;
  onChangePlayer: (
    id: number,
    field: "name" | "hoursInput",
    value: string
  ) => void;
  onAddPlayer: () => void;
  onRemovePlayer: (id: number) => void;
  onSaveSession: () => void;
};

export function SessionForm(props: SessionFormProps) {
  const {
    sessionDate,
    startTime,
    sessionName,
    location,
    totalHoursInput,
    totalCostInput,
    players,
    totalPlayerHours,
    saving,
    onChangeDate,
    onChangeStartTime,
    onChangeSessionName,
    onChangeLocation,
    onChangeTotalHours,
    onChangeTotalCost,
    onChangePlayer,
    onAddPlayer,
    onRemovePlayer,
    onSaveSession,
  } = props;

  return (
    <div className="space-y-4 md:space-y-5">
      {/* Session Info */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-5">
        <h2 className="mb-3 text-sm font-medium text-slate-200">
          Session Info
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wide text-slate-400">
              Date
            </label>
            <input
              type="date"
              value={sessionDate}
              onChange={(e) => onChangeDate(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm outline-none ring-0 transition focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wide text-slate-400">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => onChangeStartTime(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm outline-none ring-0 transition focus:border-neon-green focus:ring-2 focus:ring-neon-green/50"
            />
          </div>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wide text-slate-400">
              Session Name (optional)
            </label>
            <input
              type="text"
              placeholder="Input Session Name"
              value={sessionName}
              onChange={(e) => onChangeSessionName(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm outline-none ring-0 transition focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wide text-slate-400">
              Location
            </label>
            <input
              type="text"
              placeholder="Input Location"
              value={location}
              onChange={(e) => onChangeLocation(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm outline-none ring-0 transition focus:border-neon-green focus:ring-2 focus:ring-neon-green/50"
            />
          </div>
        </div>
      </div>

      {/* Session Settings */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-5">
        <h2 className="mb-3 text-sm font-medium text-slate-200">
          Session Settings
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wide text-slate-400">
              Total Duration (hours)
            </label>
            <input
              type="number"
              min={0.5}
              step={0.5}
              value={totalHoursInput}
              onChange={(e) => onChangeTotalHours(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm outline-none ring-0 transition focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wide text-slate-400">
              Total Cost (Rp)
            </label>
            <input
              type="number"
              min={0}
              step={1000}
              value={totalCostInput}
              onChange={(e) => onChangeTotalCost(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm outline-none ring-0 transition focus:border-neon-green focus:ring-2 focus:ring-neon-green/50"
            />
          </div>
        </div>
      </div>

      {/* Players */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-5">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-medium text-slate-200">
            Players & Hours
          </h2>
          <button
            type="button"
            onClick={onAddPlayer}
            disabled={saving}
            className="self-start rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs text-slate-200 hover:border-neon-cyan hover:text-neon-cyan transition disabled:opacity-50 disabled:hover:border-slate-700 disabled:hover:text-slate-200"
          >
            + Add player
          </button>
        </div>

        <div className="space-y-2">
          {players.map((player) => (
            <div
              key={player.id}
              className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-3 sm:flex-row sm:items-center"
            >
              <div className="flex-1 space-y-1">
                <input
                  value={player.name}
                  placeholder={`Player ${player.id}`}
                  onChange={(e) =>
                    onChangePlayer(player.id, "name", e.target.value)
                  }
                  className="w-full bg-transparent text-sm font-medium text-slate-100 outline-none"
                  disabled={saving}
                />
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-neon-cyan" />
                  <span>Hours played</span>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:w-40 sm:justify-end">
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={player.hoursInput}
                  onChange={(e) =>
                    onChangePlayer(player.id, "hoursInput", e.target.value)
                  }
                  className="w-24 rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1.5 text-right text-sm outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green/60 disabled:opacity-60"
                  disabled={saving}
                />
                <button
                  type="button"
                  onClick={() => onRemovePlayer(player.id)}
                  disabled={players.length <= 1 || saving}
                  className="rounded-full p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-500"
                  title="Remove player"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onSaveSession}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-neon-cyan/60 bg-slate-950/80 px-4 py-2 text-xs md:text-sm font-medium text-neon-cyan hover:bg-slate-900 hover:border-neon-cyan transition disabled:opacity-60 disabled:hover:bg-slate-950/80"
          >
            {saving && (
              <span className="inline-block h-3 w-3 animate-spin rounded-full border border-neon-cyan border-t-transparent" />
            )}
            {saving ? "Saving..." : "Save Session"}
          </button>
        </div>
      </div>
    </div>
  );
}
