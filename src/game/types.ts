export type Point = { x: number; y: number; type?: 'normal' | 'now' | 'rock' | 'tree' };
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type GameStatus = 'IDLE' | 'PLAYING' | 'GAME_OVER' | 'COUNTDOWN' | 'WAITING_REVIVE_MOVE';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface GameState {
  snake: Point[];
  direction: Direction;
  food: Point;
  rocks: Point[];
  status: GameStatus;
  score: number;
}
