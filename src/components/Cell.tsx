import React, { useMemo } from "react";

export default function Cell({ pos, currentBlock }) {
  const isActive = useMemo(() => {
    return currentBlock.shape.some(
      (blockPos) => blockPos.x === pos.x && blockPos.y === pos.y
    );
  }, [currentBlock.shape, pos.x, pos.y]);
  return (
    <div
      style={isActive ? { backgroundColor: currentBlock.color } : {}}
      className="w-[50px] h-[50px] text-xs"
    >{`(${pos.x}, ${pos.y})`}</div>
  );
}
