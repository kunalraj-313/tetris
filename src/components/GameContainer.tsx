import { useCallback, useEffect, useRef, useState } from "react";
import Cell from "./Cell";

function GameContainer() {
  const gridSize = {
    x: 10,
    y: 20,
  };

  const tetrisEntityTypes = [
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
  ];

  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [currentBlock, setCurrentBlock] = useState(tetrisEntityTypes[0]);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const intervalIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalIdRef.current = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
        setCurrentBlock((prev) => {
          return {
            ...prev,
            shape: prev.shape.map((pos) => {
              return {
                x: pos.x,
                y: pos.y + 1,
              };
            }),
          };
        });
      }, 1000);
    }

    return () => {
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [isRunning]);

  const handleStart = useCallback(() => {
    setIsRunning(true);
  }, []);

  const handleStop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setElapsedTime(0);
  }, []);

  return (
    <div className="border border-white p-4 margin-0-auto w-fit h-fit">
      {Array.from({ length: gridSize.y }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex">
          {Array.from({ length: gridSize.x }).map((_, colIndex) => (
            <Cell
              key={colIndex}
              currentBlock={currentBlock}
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
