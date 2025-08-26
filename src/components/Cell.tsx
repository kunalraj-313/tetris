import React, { useMemo } from "react";
import type { CellProps } from "../types/tetris";

export default function Cell({ pos, currentBlock, dormantBlocks }: CellProps) {
  const isActive = useMemo(() => {
    if (!currentBlock) return false;
    return currentBlock.shape.some(
      (blockPos) => blockPos.x === pos.x && blockPos.y === pos.y
    );
  }, [currentBlock, pos.x, pos.y]);

  const isDormant = useMemo(
    () =>
      dormantBlocks.some((block) =>
        block.shape.some(
          (blockPos) => blockPos.x === pos.x && blockPos.y === pos.y
        )
      ),
    [dormantBlocks, pos.x, pos.y]
  );

  const dormantColour = useMemo(() => {
    const dormantBlock = dormantBlocks.find((block) =>
      block.shape.some(
        (blockPos) => blockPos.x === pos.x && blockPos.y === pos.y
      )
    );
    return dormantBlock ? dormantBlock.color : "transparent";
  }, [dormantBlocks, pos.x, pos.y]);

  return (
    <div
      style={{
        backgroundColor: isActive
          ? currentBlock?.color || "transparent"
          : isDormant
          ? dormantColour
          : "transparent",
      }}
      className="w-[50px] h-[50px] text-xs"
    >{`(${pos.x}, ${pos.y})`}</div>
  );
}
