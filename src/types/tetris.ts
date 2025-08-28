export interface Position {
  x: number;
  y: number;
  pivotPoint?: boolean;
}

export interface GridSize {
  x: number;
  y: number;
}

export type TetrisColor =
  | "cyan"
  | "yellow"
  | "purple"
  | "green"
  | "red"
  | "blue"
  | "orange";

export type Orientation = "N" | "E" | "S" | "W";

export type BlockName = "I" | "O" | "T" | "S" | "Z" | "J" | "L";

export interface TetrisBlock {
  name: BlockName;
  color: TetrisColor;
  orientation: Orientation;
  shape: Position[];
}

export type CurrentBlock = TetrisBlock | null;

export interface CellProps {
  pos: Position;
  currentBlock: CurrentBlock;
  dormantBlocks: TetrisBlock[];
  showGrids: boolean;
}
