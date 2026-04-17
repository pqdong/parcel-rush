import { Point, Difficulty } from './types';
import { GRID_WIDTH, GRID_HEIGHT } from './constants';

/**
 * Lấy tốc độ cơ bản của game dựa trên độ khó
 * @param diff Độ khó (EASY, MEDIUM, HARD)
 * @returns Thời gian delay giữa mỗi khung hình (ms)
 */
export const getBaseSpeed = (diff: Difficulty): number => {
  switch (diff) {
    case 'EASY': return 350;
    case 'MEDIUM': return 280;
    case 'HARD': return 200;
  }
};

/**
 * Sinh ra một tọa độ ngẫu nhiên trên bàn chơi, không trùng lặp với các vật thể đã có
 * @param exclude Mảng các tọa độ cần tránh (rắn, thức ăn, chướng ngại vật...)
 * @returns Tọa độ mới
 */
export const generateRandomPoint = (exclude: Point[]): Point => {
  let point: Point;
  let isOccupied = true;
  while (isOccupied) {
    point = {
      x: Math.floor(Math.random() * GRID_WIDTH),
      y: Math.floor(Math.random() * GRID_HEIGHT),
    };
    isOccupied = exclude.some(p => p.x === point.x && p.y === point.y);
  }
  return point!;
};

/**
 * Sinh ra danh sách các chướng ngại vật (đá hoặc cây)
 * @param count Số lượng chướng ngại vật cần sinh
 * @param exclude Mảng các tọa độ cần tránh
 * @returns Mảng tọa độ chướng ngại vật
 */
export const generateObstacles = (count: number, exclude: Point[]): Point[] => {
  const obstacles: Point[] = [];
  for (let i = 0; i < count; i++) {
    const obstacle = generateRandomPoint([...exclude, ...obstacles]);
    // Random 50% là đá, 50% là cây
    obstacle.type = Math.random() > 0.5 ? 'rock' : 'tree';
    obstacles.push(obstacle);
  }
  return obstacles;
};
