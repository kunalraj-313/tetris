import { memo } from "react";
import type { TetrisBlock } from "../types/tetris";

interface NextBlockProps {
  nextBlock: TetrisBlock | null;
}

const NextBlock = memo(function NextBlock({ nextBlock }: NextBlockProps) {
  const gridSize = { x: 4, y: 6 };

  const isBlockAtPosition = (x: number, y: number): boolean => {
    if (!nextBlock) return false;

    return nextBlock.shape.some((pos) => {
      const adjustedX = pos.x - 2.5;
      const adjustedY = pos.y + 5;
      return Math.round(adjustedX) === x && adjustedY === y;
    });
  };

  const getBlockColorAtPosition = (x: number, y: number): string => {
    if (!nextBlock || !isBlockAtPosition(x, y)) return "transparent";
    return nextBlock.color;
  };

  return (
    <div className="border border-white bg-transparent p-4 mb-4 min-w-[150px]">
      <h3 className="text-white font-mono text-sm font-bold mb-3 text-center">
        NEXT
      </h3>
      <div className="border border-white flex justify-center">
        <div>
          {Array.from({ length: gridSize.y }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex">
              {Array.from({ length: gridSize.x }).map((_, colIndex) => {
                const blockColor = getBlockColorAtPosition(colIndex, rowIndex);
                return (
                  <div
                    key={colIndex}
                    style={{
                      backgroundColor: blockColor,
                    }}
                    className="w-6 h-6 border border-gray-600"
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default NextBlock;
