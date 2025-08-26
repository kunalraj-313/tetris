import React from "react";

export default function Cell({ pos }) {
  return (
    <div className="w-[50px] h-[50px] text-xs">{`(${pos.x}, ${pos.y})`}</div>
  );
}
