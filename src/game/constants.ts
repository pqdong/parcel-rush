import { Point, Direction } from './types';

export const GRID_WIDTH = 12;
export const GRID_HEIGHT = 20;
export const INITIAL_SNAKE: Point[] = [{ x: 6, y: 15, type: 'normal' }];
export const INITIAL_DIRECTION: Direction = 'UP';

export const SCORE_PER_FOOD = 10;
export const SCORE_PER_NOW_ITEM = 20;
export const PENALTY_PER_OBSTACLE = 10;
export const SPEED_BOOST_NOW_ITEM = 15;
export const NOW_ITEM_LIFESPAN = 5;
export const NOW_ITEM_SPAWN_RATE = 0.2;
