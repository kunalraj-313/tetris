import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Cell from "./Cell";
import GameSettings from "./GameSettings";
import ScoresTable from "./ScoresTable";
import { useSupabase } from "../hooks/useSupabase";
import type {
  TetrisBlock,
  GridSize,
  Position,
  CurrentBlock,
  Orientation,
} from "../types/tetris";

function GameContainer() {
  const gridSize: GridSize = {
    x: 10,
    y: 20,
  };

  const { saveScore } = useSupabase();

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentBlock, setCurrentBlock] = useState<CurrentBlock>(null);
  const [dormantBlocks, setDormantBlocks] = useState<TetrisBlock[]>([]);
  const [score, setScore] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [delay, setDelay] = useState<number>(500);
  const [refreshScores, setRefreshScores] = useState<number>(0);
  const [isGameOverProcessing, setIsGameOverProcessing] =
    useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [showGrids, setShowGrids] = useState<boolean>(true);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const tetrisEntityTypes: TetrisBlock[] = useMemo(
    () => [
      {
        name: "I",
        color: "cyan",
        orientation: "N",
        shape: [
          { x: 4, y: -1 },
          { x: 4, y: -2, pivotPoint: true },
          { x: 4, y: -3 },
          { x: 4, y: -4 },
        ],
      },
      {
        name: "O",
        color: "yellow",
        orientation: "N",
        shape: [
          { x: 4, y: -1 },
          { x: 4, y: -2 },
          { x: 5, y: -1 },
          { x: 5, y: -2 },
        ],
      },
      {
        name: "T",
        color: "purple",
        orientation: "N",
        shape: [
          { x: 4, y: -2 },
          { x: 5, y: -3 },
          { x: 5, y: -2, pivotPoint: true },
          { x: 5, y: -1 },
        ],
      },
      {
        name: "S",
        color: "green",
        orientation: "N",
        shape: [
          { x: 4, y: -3 },
          { x: 4, y: -2, pivotPoint: true },
          { x: 5, y: -2 },
          { x: 5, y: -1 },
        ],
      },
      {
        name: "Z",
        color: "red",
        orientation: "N",
        shape: [
          { x: 5, y: -3 },
          { x: 5, y: -2, pivotPoint: true },
          { x: 4, y: -2 },
          { x: 4, y: -1 },
        ],
      },
      {
        name: "J",
        color: "blue",
        orientation: "N",
        shape: [
          { x: 4, y: -1 },
          { x: 4, y: -2, pivotPoint: true },
          { x: 4, y: -3 },
          { x: 5, y: -3 },
        ],
      },
      {
        name: "L",
        color: "orange",
        orientation: "N",
        shape: [
          { x: 5, y: -1 },
          { x: 5, y: -2, pivotPoint: true },
          { x: 5, y: -3 },
          { x: 4, y: -3 },
        ],
      },
    ],
    []
  );

  const collisionLayer: Position[] = useMemo(() => {
    return dormantBlocks.flatMap((block) => block.shape);
  }, [dormantBlocks]);

  const isCollided: boolean = useMemo(() => {
    if (!currentBlock) return false;
    const collision = currentBlock.shape.some((block) => {
      return collisionLayer.find(
        (pos) => block.x === pos.x && block.y + 1 === pos.y
      );
    });
    if (
      currentBlock.shape.some((pos) => pos.y >= gridSize.y - 1 || collision)
    ) {
      return true;
    }
    return false;
  }, [collisionLayer, currentBlock, gridSize.y]);

  const generateNewBlock = useCallback(() => {
    setCurrentBlock(
      tetrisEntityTypes[Math.floor(Math.random() * tetrisEntityTypes.length)]
    );
  }, [tetrisEntityTypes]);

  const initGame = useCallback(() => {
    if (!currentBlock) {
      generateNewBlock();
      return;
    }
    intervalIdRef.current = setInterval(() => {
      setCurrentBlock((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          shape: prev.shape.map((pos) => ({
            x: pos.x,
            y: pos.y + 1,
            pivotPoint: pos.pivotPoint,
          })),
        };
      });
    }, delay);
  }, [currentBlock, generateNewBlock, delay]);

  const handleStart = useCallback(() => {
    setIsRunning(!isRunning);
  }, [isRunning]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setCurrentBlock(null);
    setDormantBlocks([]);
    setScore(0);
    setElapsedTime(0);
    setIsGameOverProcessing(false);
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
  }, []);

  const handleQuit = useCallback(async () => {
    if (score === 0) return; // Don't save if no score

    setIsRunning(false);
    setCurrentBlock(null);

    const playerName = prompt(
      "Save your progress! Enter your name for the leaderboard:"
    );

    if (playerName && playerName.trim()) {
      setIsGameOverProcessing(true);

      const result = await saveScore({
        name: playerName.trim(),
        score: score,
        time_elapsed: elapsedTime,
      });

      setIsGameOverProcessing(false);

      if (result.success) {
        alert(
          `Score saved! Final Score: ${score}, Time: ${Math.floor(
            elapsedTime / 60
          )}:${(elapsedTime % 60).toString().padStart(2, "0")}`
        );
        setRefreshScores((prev) => prev + 1);
      } else {
        alert(
          `Score could not be saved to leaderboard. Final Score: ${score}, Time: ${Math.floor(
            elapsedTime / 60
          )}:${(elapsedTime % 60).toString().padStart(2, "0")}`
        );
      }
    }

    setDormantBlocks([]);
    setScore(0);
    setElapsedTime(0);
    setIsGameOverProcessing(false);
  }, [saveScore, score, elapsedTime]);

  const initAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/audio/tony-ferguson-theme.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newMuted = !prev;
      if (audioRef.current) {
        audioRef.current.muted = newMuted;
      }
      return newMuted;
    });
  }, []);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  const toggleGrids = useCallback(() => {
    setShowGrids((prev) => !prev);
  }, []);

  const playMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  }, []);

  const pauseMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const clearCompletedLines = useCallback(() => {
    const linesToClear: number[] = [];

    for (let y = gridSize.y - 1; y >= 0; y--) {
      const blocksInRow = dormantBlocks.filter((block) =>
        block.shape.some((pos) => pos.y === y)
      );

      const uniqueXPositions = new Set(
        blocksInRow.flatMap((block) =>
          block.shape.filter((pos) => pos.y === y).map((pos) => pos.x)
        )
      );

      if (uniqueXPositions.size === gridSize.x) {
        linesToClear.push(y);
      }
    }

    if (linesToClear.length > 0) {
      setDormantBlocks((prev) => {
        let updatedBlocks = [...prev];

        linesToClear.forEach((lineY) => {
          updatedBlocks = updatedBlocks
            .map((block) => ({
              ...block,
              shape: block.shape.filter((pos) => pos.y !== lineY),
            }))
            .filter((block) => block.shape.length > 0);
        });

        linesToClear.forEach(() => {
          updatedBlocks = updatedBlocks.map((block) => ({
            ...block,
            shape: block.shape.map((pos) => ({
              ...pos,
              y:
                pos.y +
                linesToClear.filter((clearedY) => clearedY > pos.y).length,
            })),
          }));
        });

        return updatedBlocks;
      });

      setScore((prev) => prev + linesToClear.length * 100);
    }
  }, [dormantBlocks, gridSize.x, gridSize.y]);

  const getRotatedCoordinates = useCallback(
    (block: Position, pivotPoint: Position) => {
      const dx = block.x - pivotPoint.x;
      const dy = block.y - pivotPoint.y;
      const newX = pivotPoint.x - dy;
      const newY = pivotPoint.y + dx;
      return { x: newX, y: newY };
    },
    []
  );

  const handleGameOver = useCallback(async () => {
    if (isGameOverProcessing) return;

    setIsGameOverProcessing(true);
    setIsRunning(false);
    setCurrentBlock(null);

    const playerName = prompt(
      "Game Over! Enter your name for the leaderboard:"
    );

    if (playerName && playerName.trim()) {
      const result = await saveScore({
        name: playerName.trim(),
        score: score,
        time_elapsed: elapsedTime,
      });

      if (result.success) {
        alert(
          `Score saved! Final Score: ${score}, Time: ${Math.floor(
            elapsedTime / 60
          )}:${(elapsedTime % 60).toString().padStart(2, "0")}`
        );
        setRefreshScores((prev) => prev + 1);
      } else {
        alert(
          `Game Over! Final Score: ${score}, Time: ${Math.floor(
            elapsedTime / 60
          )}:${(elapsedTime % 60)
            .toString()
            .padStart(2, "0")}\n(Score could not be saved to leaderboard)`
        );
      }
    } else {
      alert(
        `Game Over! Final Score: ${score}, Time: ${Math.floor(
          elapsedTime / 60
        )}:${(elapsedTime % 60).toString().padStart(2, "0")}`
      );
    }

    setDormantBlocks([]);
    setScore(0);
    setElapsedTime(0);
    setIsGameOverProcessing(false);
  }, [saveScore, score, elapsedTime, isGameOverProcessing]);

  const handleDelayChange = useCallback(
    (newDelay: number) => {
      setDelay(newDelay);
      if (isRunning && intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    },
    [isRunning]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!currentBlock) return;
      if (e.key === "ArrowLeft") {
        setCurrentBlock((prev) => {
          if (!prev) return prev;
          const movedBlock = {
            ...prev,
            shape: prev.shape.map((pos) => ({
              x: pos.x - 1,
              y: pos.y,
              pivotPoint: pos.pivotPoint,
            })),
          };
          const isOutOfBounds = movedBlock.shape.some(
            (pos) => pos.x < 0 || pos.x >= gridSize.x
          );
          const isColliding = movedBlock.shape.some((block) =>
            collisionLayer.find((pos) => block.x === pos.x && block.y === pos.y)
          );
          if (isOutOfBounds || isColliding) {
            return prev;
          }
          return movedBlock;
        });
      } else if (e.key === "ArrowRight") {
        setCurrentBlock((prev) => {
          if (!prev) return prev;
          const movedBlock = {
            ...prev,
            shape: prev.shape.map((pos) => ({
              x: pos.x + 1,
              y: pos.y,
              pivotPoint: pos.pivotPoint,
            })),
          };
          const isOutOfBounds = movedBlock.shape.some(
            (pos) => pos.x < 0 || pos.x >= gridSize.x
          );
          const isColliding = movedBlock.shape.some((block) =>
            collisionLayer.find((pos) => block.x === pos.x && block.y === pos.y)
          );
          if (isOutOfBounds || isColliding) {
            return prev;
          }
          return movedBlock;
        });
      } else if (e.key === "ArrowUp") {
        setCurrentBlock((prev) => {
          if (!prev) return prev;

          if (prev.name === "O") return prev;

          const pivotPoint = prev.shape.find((pos) => pos.pivotPoint);
          if (!pivotPoint) return prev;

          const rotatedShape = prev.shape.map((block) => {
            if (block.pivotPoint) {
              return { ...block };
            } else {
              const rotated = getRotatedCoordinates(block, pivotPoint);
              return {
                x: rotated.x,
                y: rotated.y,
              };
            }
          });

          let newOrientation = "";

          switch (prev.orientation) {
            case "N":
              newOrientation = "E";
              break;
            case "E":
              newOrientation = "S";
              break;
            case "S":
              newOrientation = "W";
              break;
            case "W":
              newOrientation = "N";
              break;
            default:
              newOrientation = prev.orientation;
              break;
          }

          const rotatedBlock = {
            ...prev,
            orientation: newOrientation as Orientation,
            shape: rotatedShape,
          };

          const isOutOfBounds = rotatedBlock.shape.some(
            (pos) => pos.x < 0 || pos.x >= gridSize.x || pos.y >= gridSize.y
          );
          const isColliding = rotatedBlock.shape.some((block) =>
            collisionLayer.find((pos) => block.x === pos.x && block.y === pos.y)
          );

          if (isOutOfBounds || isColliding) {
            return prev;
          }
          return rotatedBlock;
        });
      } else if (e.key === "ArrowDown") {
        setCurrentBlock((prev) => {
          if (!prev) return prev;
          const movedBlock = {
            ...prev,
            shape: prev.shape.map((pos) => ({
              x: pos.x,
              y: pos.y + 1,
              pivotPoint: pos.pivotPoint,
            })),
          };
          const isOutOfBounds = movedBlock.shape.some(
            (pos) => pos.y >= gridSize.y
          );
          const isColliding = movedBlock.shape.some((block) =>
            collisionLayer.find((pos) => block.x === pos.x && block.y === pos.y)
          );
          if (isOutOfBounds || isColliding) {
            return prev;
          }
          return movedBlock;
        });
      } else if (e.key === " ") {
        return;
      }
    },
    [
      currentBlock,
      gridSize.x,
      gridSize.y,
      collisionLayer,
      getRotatedCoordinates,
    ]
  );

  useEffect(() => {
    if (isRunning) {
      timerIdRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
      }
    }

    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    initAudio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [initAudio]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isRunning) {
      playMusic();
    } else {
      pauseMusic();
    }
  }, [isRunning, playMusic, pauseMusic]);

  useEffect(() => {
    if (isRunning) {
      initGame();
    }

    return () => {
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [initGame, isRunning]);

  useEffect(() => {
    if (isCollided && currentBlock) {
      setDormantBlocks((prev) => [...prev, currentBlock]);
      setCurrentBlock(null);
      generateNewBlock();
      setScore((prev) => prev + 10);
    }
  }, [currentBlock, generateNewBlock, isCollided]);

  useEffect(() => {
    clearCompletedLines();
  }, [dormantBlocks, clearCompletedLines]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentBlock, collisionLayer, gridSize.x, gridSize.y, handleKeyDown]);

  // useEffect(() => {
  //   for (const key in keysHeld) {
  //     if (keysHeld[key]) {
  //       setInterval(() => {
  //         handleKeyDown(new KeyboardEvent("keydown", { key }));
  //       }, 50);
  //     }
  //   }
  // }, [handleKeyDown, keysHeld]);

  useEffect(() => {
    if (
      !isGameOverProcessing &&
      dormantBlocks.some((block) => block.shape.some((pos) => pos.y < 0))
    ) {
      handleGameOver();
    }
  }, [dormantBlocks, handleGameOver, isGameOverProcessing]);

  return (
    <>
      <div className="lg:hidden flex items-center justify-center min-h-screen bg-black text-white p-8">
        <div className="text-center border border-white bg-transparent p-8 rounded-lg">
          <div className="text-6xl mb-4">📱</div>
          <h1 className="text-2xl font-bold mb-4 font-mono">TETRIS</h1>
          <h2 className="text-xl mb-6 font-mono">Coming Soon for Mobile!</h2>
          <p className="text-gray-300 mb-4 font-mono">
            This game is currently optimized for desktop and tablet devices.
          </p>
          <p className="text-gray-300 font-mono">
            Please visit us on a larger screen to play.
          </p>
          <div className="mt-8 text-sm text-gray-400 font-mono">
            Minimum resolution: 1024px width
          </div>
        </div>
      </div>

      <div className="hidden lg:flex gap-8">
        <ScoresTable refreshTrigger={refreshScores} />
        <div className="border border-white margin-0-auto w-fit h-fit">
          {Array.from({ length: gridSize.y }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex">
              {Array.from({ length: gridSize.x }).map((_, colIndex) => (
                <Cell
                  key={colIndex}
                  dormantBlocks={dormantBlocks}
                  currentBlock={currentBlock}
                  showGrids={showGrids}
                  pos={{
                    x: colIndex,
                    y: rowIndex,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <GameSettings
          isRunning={isRunning}
          score={score}
          elapsedTime={elapsedTime}
          delay={delay}
          isMuted={isMuted}
          volume={volume}
          showGrids={showGrids}
          onStart={handleStart}
          onReset={handleReset}
          onQuit={handleQuit}
          onDelayChange={handleDelayChange}
          onToggleMute={toggleMute}
          onVolumeChange={handleVolumeChange}
          onToggleGrids={toggleGrids}
        />
      </div>
    </>
  );
}

export default GameContainer;
