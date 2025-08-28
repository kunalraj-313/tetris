interface GameSettingsProps {
  isRunning: boolean;
  score: number;
  elapsedTime: number;
  delay: number;
  onStart: () => void;
  onReset: () => void;
  onDelayChange: (delay: number) => void;
}

export default function GameSettings({
  isRunning,
  score,
  elapsedTime,
  delay,
  onStart,
  onReset,
  onDelayChange,
}: GameSettingsProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="border border-white bg-transparent p-6 w-fit h-fit text-white font-mono">
      <div className="border border-white bg-transparent p-3 mb-4">
        <h3 className="text-lg font-bold mb-2">SCORE</h3>
        <div className="text-2xl font-bold">{score}</div>
      </div>

      <div className="border border-white bg-transparent p-3 mb-4">
        <h3 className="text-lg font-bold mb-2">TIME</h3>
        <div className="text-xl font-mono">{formatTime(elapsedTime)}</div>
      </div>

      <div className="border border-white bg-transparent p-3 mb-4">
        <h3 className="text-lg font-bold mb-3">CONTROLS</h3>
        <div className="space-y-2">
          <button
            onClick={onStart}
            className="w-full border border-white bg-transparent text-white px-4 py-2 hover:bg-white hover:text-black transition-colors"
          >
            {isRunning ? "PAUSE" : "START"}
          </button>
          <button
            onClick={onReset}
            className="w-full border border-white bg-transparent text-white px-4 py-2 hover:bg-white hover:text-black transition-colors"
          >
            RESET
          </button>
        </div>
      </div>

      <div className="border border-white bg-transparent p-3">
        <h3 className="text-lg font-bold mb-3">SPEED</h3>
        <div className="mb-2">
          <label className="block text-sm mb-1">Delay: {delay}ms</label>
          <input
            type="range"
            min="50"
            max="1000"
            step="50"
            value={delay}
            onChange={(e) => onDelayChange(Number(e.target.value))}
            className="w-full bg-transparent border border-white accent-white"
          />
        </div>
        <div className="text-xs text-gray-300">Lower delay = Faster blocks</div>
      </div>
    </div>
  );
}
