interface GameSettingsProps {
  isRunning: boolean;
  score: number;
  elapsedTime: number;
  level: number;
  isMuted: boolean;
  volume: number;
  showGrids: boolean;
  onStart: () => void;
  onReset: () => void;
  onQuit: () => void;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
  onToggleGrids: () => void;
}

export default function GameSettings({
  isRunning,
  score,
  elapsedTime,
  level,
  isMuted,
  volume,
  showGrids,
  onStart,
  onReset,
  onQuit,
  onToggleMute,
  onVolumeChange,
  onToggleGrids,
}: GameSettingsProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="border border-white bg-transparent p-4 w-96 text-white font-mono max-h-[600px] overflow-y-auto">
      <div className="flex flex-row flex-wrap gap-3">
        <div className="border border-white bg-transparent p-2 flex-1 min-w-[140px]">
          <h3 className="text-lg font-bold mb-2">SCORE</h3>
          <div className="text-2xl font-bold">{score}</div>
        </div>

        <div className="border border-white bg-transparent p-2 flex-1 min-w-[140px]">
          <h3 className="text-lg font-bold mb-2">TIME</h3>
          <div className="text-xl font-mono">{formatTime(elapsedTime)}</div>
        </div>

        <div className="border border-white bg-transparent p-2 w-full">
          <h3 className="text-lg font-bold mb-2">CONTROLS</h3>
          <div className="space-y-2">
            <button
              onClick={onStart}
              className="w-full border border-white bg-transparent text-white px-3 py-2 hover:bg-white hover:text-black transition-colors text-sm"
            >
              {isRunning ? "PAUSE" : "START"}
            </button>
            <button
              onClick={onReset}
              className="w-full border border-white bg-transparent text-white px-3 py-2 hover:bg-white hover:text-black transition-colors text-sm"
            >
              RESET
            </button>
            <button
              onClick={onQuit}
              className="w-full border border-white bg-transparent text-white px-3 py-2 hover:bg-white hover:text-black transition-colors text-sm"
              disabled={!isRunning && score === 0}
            >
              QUIT & SAVE
            </button>
          </div>
        </div>

        <div className="border border-white bg-transparent p-2 flex-1 min-w-[140px]">
          <h3 className="text-lg font-bold mb-2">LEVEL</h3>
          <div className="text-2xl font-bold">{level}</div>
          <div className="text-xs text-gray-300">
            Speed increases every 500 points
          </div>
        </div>

        <div className="border border-white bg-transparent p-2 flex-1 min-w-[140px]">
          <h3 className="text-lg font-bold mb-2">AUDIO</h3>
          <div className="space-y-2">
            <button
              onClick={onToggleMute}
              className="w-full border border-white bg-transparent text-white px-3 py-2 hover:bg-white hover:text-black transition-colors text-sm"
            >
              {isMuted ? "🔇 UNMUTE" : "🔊 MUTE"}
            </button>
            <div>
              <label className="block text-xs mb-1">
                Volume: {Math.round(volume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                className="w-full bg-transparent border border-white accent-white"
              />
            </div>
          </div>
        </div>

        <div className="border border-white bg-transparent p-2 flex-1 min-w-[140px]">
          <h3 className="text-lg font-bold mb-2">DISPLAY</h3>
          <button
            onClick={onToggleGrids}
            className="w-full border border-white bg-transparent text-white px-3 py-2 hover:bg-white hover:text-black transition-colors text-sm"
          >
            {showGrids ? "⊞ HIDE GRIDS" : "⊟ SHOW GRIDS"}
          </button>
        </div>
      </div>
    </div>
  );
}
