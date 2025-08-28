import { memo, useEffect, useState } from "react";
import { useSupabase } from "../hooks/useSupabase";
import { Filter } from "bad-words";

interface Score {
  id: number;
  name: string;
  score: number;
  time_elapsed: number;
  created_at: string;
}

interface ScoresTableProps {
  refreshTrigger?: number;
}

const ScoresTable = memo(function ScoresTable({
  refreshTrigger,
}: ScoresTableProps) {
  const filter = new Filter();
  const { getHighScores } = useSupabase();
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshTrigger, setLastRefreshTrigger] = useState<number>(0);
  const [isRequestInProgress, setIsRequestInProgress] =
    useState<boolean>(false);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  const MIN_FETCH_INTERVAL = 2000;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getTrophyEmoji = (position: number): string => {
    switch (position) {
      case 1:
        return "🏆";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "";
    }
  };

  const fetchScores = async () => {
    const now = Date.now();

    if (now - lastFetchTime < MIN_FETCH_INTERVAL) {
      return;
    }

    if (isRequestInProgress) {
      return;
    }

    setIsRequestInProgress(true);
    setLoading(true);
    setError(null);
    setLastFetchTime(now);

    try {
      const result = await getHighScores(10);

      if (result.success && result.data) {
        setScores(result.data);
      } else {
        setError("Failed to load scores");
        console.error("Failed to fetch scores:", result.error);
      }
    } catch (err) {
      setError("Failed to load scores");
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
      setIsRequestInProgress(false);
    }
  };

  useEffect(() => {
    fetchScores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      refreshTrigger &&
      refreshTrigger > 0 &&
      refreshTrigger !== lastRefreshTrigger
    ) {
      setLastRefreshTrigger(refreshTrigger);
      fetchScores();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger, lastRefreshTrigger]);

  return (
    <div className="border border-white bg-transparent p-6 min-w-[400px] h-fit text-white font-mono">
      <div className="border border-white bg-transparent p-3 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold">HIGH SCORES</h3>
          <button
            onClick={fetchScores}
            disabled={loading || isRequestInProgress}
            className="p-1 border border-white bg-transparent hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh scores"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={loading ? "animate-spin" : ""}
            >
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="m20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-400">{error}</div>
        ) : scores.length === 0 ? (
          <div className="text-center py-4 text-gray-400">No scores yet</div>
        ) : (
          <div className="space-y-1">
            <div className="border-b border-white pb-2 mb-2">
              <div className="flex text-xs font-bold">
                <div className="w-8 text-left">#</div>
                <div className="w-24 text-left">NAME</div>
                <div className="flex-1 text-right">SCORE</div>
                <div className="w-16 text-right">TIME</div>
              </div>
            </div>

            {scores.map((score, index) => (
              <div key={score.id} className="flex text-sm py-1">
                <div className="w-8 text-left text-yellow-400">{index + 1}</div>
                <div className="w-24 text-left truncate" title={score.name}>
                  {filter.clean(score.name)}
                </div>
                <div className="flex-1 text-right font-bold">
                  {getTrophyEmoji(index + 1)} {score.score}
                </div>
                <div className="w-16 text-right text-gray-300">
                  {formatTime(score.time_elapsed)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default ScoresTable;
