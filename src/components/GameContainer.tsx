import { useEffect } from "react";
import Cell from "./Cell";

function GameContainer() {
  const gridSize = {
    x: 10,
    y: 20,
  };

  const tetrisEntityTypes = [
    {
      name: "I",
      color: "cyan",
      orientation: "N",
      shape: [
        {
          x: 4,
          y: -1,
        },
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
        {
          x: 4,
          y: -1,
        },
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
        {
          x: 4,
          y: -2,
        },
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
        {
          x: 4,
          y: -3,
        },
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
        {
          x: 5,
          y: -3,
        },
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
        {
          x: 4,
          y: -1,
        },
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
        {
          x: 5,
          y: -1,
        },
        { x: 5, y: -2 },
        { x: 5, y: -3 },
        { x: 4, y: -3 },
      ],
    },
    {
      name: "test",
      color: "orange",
      orientation: "N",
      shape: [
        {
          x: 5,
          y: 5,
        },
      ],
    },
  ];

  //   useEffect(()=>{

  //   })

  return (
    <div className="border border-white p-4 margin-0-auto w-fit h-fit">
      {Array.from({ length: gridSize.y }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex">
          {Array.from({ length: gridSize.x }).map((_, colIndex) => (
            <Cell
              key={colIndex}
              pos={{
                x: colIndex,
                y: rowIndex,
              }}
            ></Cell>
          ))}
        </div>
      ))}
    </div>
  );
}

export default GameContainer;
