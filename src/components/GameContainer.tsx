import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Cell from "./Cell";
import type {
  TetrisBlock,
  GridSize,
  Position,
  CurrentBlock,
} from "../types/tetris";

function GameContainer() {
  const gridSize: GridSize = {
    x: 10,
    y: 20,
  };

  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [currentBlock, setCurrentBlock] = useState<CurrentBlock>(null);
  const [dormantBlocks, setDormantBlocks] = useState<TetrisBlock[]>([]);
  const intervalIdRef = useRef<number | null>(null);

  const tetrisEntityTypes: TetrisBlock[] = useMemo(
    () => [
      {
        name: "I",
        color: "cyan",
        orientation: "N",
        shape: [
          { x: 4, y: -1 },
          { x: 4, y: -2 },
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
          { x: 5, y: -2 },
          { x: 5, y: -1 },
        ],
      },
      {
        name: "S",
        color: "green",
        orientation: "N",
        shape: [
          { x: 4, y: -3 },
          { x: 4, y: -2 },
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
          { x: 5, y: -2 },
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
          { x: 4, y: -2 },
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
          { x: 5, y: -2 },
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
          })),
        };
      });
    }, 200);
  }, [currentBlock, generateNewBlock]);

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
    }
  }, [currentBlock, generateNewBlock, isCollided]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!currentBlock) return;
      if (e.key === "ArrowLeft") {
        setCurrentBlock((prev) => {
          if (!prev) return prev;
          const movedBlock = {
            ...prev,
            shape: prev.shape.map((pos) => ({
              x: pos.x - 1,
              y: pos.y,
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
      } else if (e.key === "ArrowDown") {
        setCurrentBlock((prev) => {
          if (!prev) return prev;
          const movedBlock = {
            ...prev,
            shape: prev.shape.map((pos) => ({
              x: pos.x,
              y: pos.y + 1,
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
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentBlock, collisionLayer, gridSize.x, gridSize.y]);

  useEffect(() => {
    if (dormantBlocks.some((block) => block.shape.some((pos) => pos.y < 0))) {
      alert("Game Over");
      setIsRunning(false);
      setCurrentBlock(null);
      setDormantBlocks([]);
    }
  }, [dormantBlocks]);

  return (
    <div className="border border-white p-4 margin-0-auto w-fit h-fit">
      {Array.from({ length: gridSize.y }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex">
          {Array.from({ length: gridSize.x }).map((_, colIndex) => (
            <Cell
              key={colIndex}
              dormantBlocks={dormantBlocks}
              currentBlock={currentBlock}
              pos={{
                x: colIndex,
                y: rowIndex,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default GameContainer;
