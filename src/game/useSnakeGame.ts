import { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction, GameStatus } from './types';
import { useAppStore } from '../store/useAppStore';
import { soundManager } from './SoundManager';
import { 
  GRID_WIDTH, GRID_HEIGHT, INITIAL_SNAKE, INITIAL_DIRECTION, 
  SCORE_PER_FOOD, SCORE_PER_NOW_ITEM, PENALTY_PER_OBSTACLE, 
  SPEED_BOOST_NOW_ITEM, NOW_ITEM_LIFESPAN, NOW_ITEM_SPAWN_RATE 
} from './constants';
import { getBaseSpeed, generateRandomPoint, generateObstacles } from './utils';

/**
 * Hook chính quản lý toàn bộ logic của trò chơi (Rắn săn mồi / Shipper giao hàng)
 * - Quản lý trạng thái: Rắn, thức ăn, chướng ngại vật, điểm số, tốc độ.
 * - Xử lý va chạm: Tường, tự cắn đuôi, ăn hàng, đụng chướng ngại vật.
 * - Quản lý vòng lặp game (Game Loop) và điều khiển (Bàn phím, Vuốt).
 */
export const useSnakeGame = () => {
  const { difficulty, sfxEnabled, bgmEnabled, addHighScore } = useAppStore();
  
  // --- Game State ---
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [rocks, setRocks] = useState<Point[]>([]);
  const [nowItem, setNowItem] = useState<Point | null>(null);
  const [nowItemLifespan, setNowItemLifespan] = useState<number>(0);
  const [speedBoost, setSpeedBoost] = useState<number>(0);
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [score, setScore] = useState(0);
  const [gameId, setGameId] = useState(0);
  const [canRevive, setCanRevive] = useState(true);

  // --- Refs for Performance ---
  // Dùng ref để lưu hướng đi hiện tại, tránh việc re-render không cần thiết
  const directionRef = useRef<Direction>(INITIAL_DIRECTION);
  const lastMoveDirectionRef = useRef<Direction>(INITIAL_DIRECTION);
  const directionQueueRef = useRef<Direction[]>([]);
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  /**
   * Khởi tạo và bắt đầu trò chơi mới
   */
  const startGame = useCallback(() => {
    soundManager.unlockAudio();
    
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    lastMoveDirectionRef.current = INITIAL_DIRECTION;
    directionQueueRef.current = [];
    setScore(0);
    setNowItem(null);
    setNowItemLifespan(0);
    setSpeedBoost(0);
    setStatus('PLAYING');
    setCanRevive(true);
    setGameId(Date.now());
    
    // Khởi tạo thức ăn và chướng ngại vật ban đầu
    const initialFood = generateRandomPoint(INITIAL_SNAKE);
    setFood(initialFood);
    setRocks(generateObstacles(3, [...INITIAL_SNAKE, initialFood]));
    
    soundManager.playBGM(bgmEnabled);
  }, [bgmEnabled]);

  /**
   * Kết thúc trò chơi và lưu điểm cao
   */
  const stopGame = useCallback(() => {
    setStatus('GAME_OVER');
    soundManager.stopBGM();
    soundManager.playSFX('GAMEOVER', sfxEnabled);
    addHighScore(score, gameId);
  }, [score, sfxEnabled, addHighScore, gameId]);

  /**
   * Bắt đầu quá trình đếm ngược để hồi sinh
   */
  const startReviveCountdown = useCallback(() => {
    setStatus('COUNTDOWN');
    setCanRevive(false);
  }, []);

  /**
   * Kết thúc đếm ngược và tiếp tục chơi
   */
  const finishReviveCountdown = useCallback(() => {
    setStatus('WAITING_REVIVE_MOVE');
    lastTimeRef.current = 0; // Reset timer để không bị nhảy frame
    soundManager.playBGM(bgmEnabled);
  }, [bgmEnabled]);

  /**
   * Thay đổi hướng di chuyển của rắn
   * @param newDir Hướng mới
   */
  const changeDirection = useCallback((newDir: Direction) => {
    const queue = directionQueueRef.current;
    
    // Lấy hướng cuối cùng trong hàng đợi, hoặc hướng di chuyển cuối cùng nếu hàng đợi rỗng
    const lastDirInQueue = queue.length > 0 
      ? queue[queue.length - 1] 
      : lastMoveDirectionRef.current;

    // Ngăn chặn việc quay đầu 180 độ (rắn không thể đi lùi)
    if (
      (newDir === 'UP' && lastDirInQueue === 'DOWN') ||
      (newDir === 'DOWN' && lastDirInQueue === 'UP') ||
      (newDir === 'LEFT' && lastDirInQueue === 'RIGHT') ||
      (newDir === 'RIGHT' && lastDirInQueue === 'LEFT') ||
      newDir === lastDirInQueue
    ) {
      return;
    }
    
    // Giới hạn hàng đợi tối đa 2 lệnh để tránh spam phím
    if (queue.length < 2) {
      queue.push(newDir);
    }
  }, []);

  /**
   * Logic di chuyển chính của rắn, được gọi mỗi khung hình (frame)
   */
  const moveSnake = useCallback(() => {
    let currentDir = directionRef.current;
    
    // Xử lý lệnh chuyển hướng từ hàng đợi
    if (directionQueueRef.current.length > 0) {
      currentDir = directionQueueRef.current.shift()!;
      directionRef.current = currentDir;
    }

    lastMoveDirectionRef.current = currentDir;
    setDirection(currentDir); // Cập nhật state direction đồng bộ với lúc rắn thực sự di chuyển

    const head = snake[0];
    const newHead: Point = { ...head, type: 'normal' };

    // 1. Tính toán tọa độ đầu mới
    switch (currentDir) {
      case 'UP': newHead.y -= 1; break;
      case 'DOWN': newHead.y += 1; break;
      case 'LEFT': newHead.x -= 1; break;
      case 'RIGHT': newHead.x += 1; break;
    }

    // 2. Kiểm tra va chạm tường
    if (
      newHead.x < 0 || newHead.x >= GRID_WIDTH ||
      newHead.y < 0 || newHead.y >= GRID_HEIGHT
    ) {
      stopGame();
      return;
    }

    // 3. Kiểm tra tự cắn đuôi
    // Chỉ kiểm tra va chạm với các đốt từ thứ 3 trở đi (vì không thể quay đầu 180 độ ngay lập tức)
    // và bỏ qua đốt đuôi cùng vì nó sẽ di chuyển đi chỗ khác
    for (let i = 3; i < snake.length - 1; i++) {
        const segment = snake[i];
        if (segment && segment.x === newHead.x && segment.y === newHead.y) {
            stopGame();
            return;
        }
    }

    // 4. Tạo mảng rắn mới (dịch chuyển thân rắn theo đầu)
    // Tối ưu hóa: Thay vì tạo mới toàn bộ mảng, ta chỉ thêm đầu mới và cắt đuôi cũ
    const newSnake = [newHead, ...snake];

    const nowCount = snake.filter(s => s.type === 'now').length;
    const currentItemScore = 10 + (nowCount * 10);

    let ateFood = false;
    let ateNow = false;
    let hitRockIndex = rocks.findIndex(r => r.x === newHead.x && r.y === newHead.y);
    const { tikiNowMode } = useAppStore.getState();

    // 5. Kiểm tra ăn vật phẩm NOW (TikiNOW)
    if (nowItem && newHead.x === nowItem.x && newHead.y === nowItem.y) {
      ateNow = true;
      setScore(s => s + currentItemScore);
      soundManager.playSFX('EAT', sfxEnabled);
      setSpeedBoost(prev => prev + SPEED_BOOST_NOW_ITEM); // Tăng tốc độ chạy
      setNowItem(null);
      setNowItemLifespan(0);
    }

    // 6. Kiểm tra ăn thức ăn (Hàng hóa thường)
    if (newHead.x === food.x && newHead.y === food.y) {
      ateFood = true;
      setScore(s => s + currentItemScore);
      soundManager.playSFX('EAT', sfxEnabled);
      
      // Sinh thức ăn mới
      const nextFood = generateRandomPoint([...newSnake, ...rocks, ...(nowItem ? [nowItem] : [])]);
      setFood(nextFood);
      
      // Xử lý vòng đời của vật phẩm NOW
      if (tikiNowMode) {
        if (nowItem) {
          setNowItemLifespan(prev => {
            if (prev <= 1) {
              setNowItem(null);
              return 0;
            }
            return prev - 1;
          });
        } else {
          // Tỉ lệ xuất hiện ngẫu nhiên của vật phẩm NOW
          if (Math.random() < NOW_ITEM_SPAWN_RATE) {
            const nextNowItem = generateRandomPoint([...newSnake, ...rocks, nextFood]);
            setNowItem(nextNowItem);
            setNowItemLifespan(NOW_ITEM_LIFESPAN); // Biến mất sau khi ăn 5 món hàng thường
          }
        }
      }
      
      // Cập nhật lại chướng ngại vật ngẫu nhiên khi ăn hàng
      if (Math.random() > 0.5) {
         setRocks(generateObstacles(Math.floor(Math.random() * 3) + 2, [...newSnake, nextFood, ...(nowItem ? [nowItem] : [])]));
      }
    }

    // 7. Kiểm tra va chạm chướng ngại vật (Đá/Cây)
    if (hitRockIndex !== -1) {
      soundManager.playSFX('HIT', sfxEnabled);
      setScore(s => Math.max(0, s - PENALTY_PER_OBSTACLE)); // Trừ điểm
      
      // Xóa chướng ngại vật bị đụng trúng
      setRocks(prev => prev.filter((_, i) => i !== hitRockIndex));
      
      // Cắt bớt đuôi rắn (phạt)
      if (newSnake.length > 2) { 
         newSnake.pop(); // Xóa đuôi cũ (do di chuyển)
         newSnake.pop(); // Xóa thêm 1 đốt để giảm độ dài
      } else {
         newSnake.pop(); // Giữ nguyên độ dài tối thiểu là 1
      }
      setSnake(newSnake);
      return;
    }

    // 8. Nếu không ăn gì, cắt bỏ phần đuôi thừa (vì đầu đã tiến lên 1 bước)
    if (!ateFood && !ateNow) {
      newSnake.pop(); 
    }

    // Cập nhật type cho các đốt thân rắn để giữ đúng vị trí của các thùng hàng
    for (let i = 1; i < newSnake.length; i++) {
      const currentSegment = newSnake[i];
      if (!currentSegment) continue;

      if (i === newSnake.length - 1 && (ateFood || ateNow)) {
        // Đốt mới được thêm vào ở đuôi khi ăn
        newSnake[i] = { ...currentSegment, type: ateNow ? 'now' : 'normal' };
      } else {
        // Giữ nguyên type ở cùng một index để các thùng hàng chạy theo đầu rắn
        const oldSnakeSegment = snake[i];
        if (oldSnakeSegment) {
          newSnake[i] = { ...currentSegment, type: oldSnakeSegment.type };
        } else {
          newSnake[i] = { ...currentSegment, type: 'normal' };
        }
      }
    }

    setSnake(newSnake);
  }, [snake, food, rocks, nowItem, stopGame, sfxEnabled]);

  // --- Game Loop Optimization ---
  // Sử dụng ref để luôn lấy được hàm moveSnake mới nhất mà không cần re-render
  const moveSnakeRef = useRef(moveSnake);
  useEffect(() => {
    moveSnakeRef.current = moveSnake;
  }, [moveSnake]);

  // Lưu trữ trạng thái mới nhất để vòng lặp game không bị gián đoạn
  const latestStateRef = useRef({ score, speedBoost, difficulty });
  useEffect(() => {
    latestStateRef.current = { score, speedBoost, difficulty };
  }, [score, speedBoost, difficulty]);

  const speedDecrease = Math.floor(score / 50) * 10; 
  const currentSpeed = Math.max(40, getBaseSpeed(difficulty) - speedDecrease - speedBoost);

  // Vòng lặp chính của game (Game Loop)
  useEffect(() => {
    if (status !== 'PLAYING') {
      lastTimeRef.current = 0;
      return;
    }

    const loop = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      
      // Giới hạn deltaTime tối đa để tránh "spiral of death" khi chuyển tab
      let deltaTime = time - lastTimeRef.current;
      if (deltaTime > 1000) {
        lastTimeRef.current = time;
        deltaTime = 0;
      }

      const { score, speedBoost, difficulty } = latestStateRef.current;
      
      // Tính toán tốc độ hiện tại: Điểm càng cao, tốc độ càng nhanh
      const loopSpeedDecrease = Math.floor(score / 50) * 10; 
      const loopCurrentSpeed = Math.max(40, getBaseSpeed(difficulty) - loopSpeedDecrease - speedBoost);

      if (deltaTime >= loopCurrentSpeed) {
        moveSnakeRef.current();
        // Cập nhật lastTimeRef sao cho giữ lại phần dư của deltaTime để không bị mất nhịp,
        // nhưng không cộng dồn quá nhiều gây ra hiện tượng chạy bù (lag burst)
        lastTimeRef.current = time - (deltaTime % loopCurrentSpeed);
      }
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [status]);

  // --- Controls ---
  // Điều khiển bằng bàn phím (WASD / Mũi tên)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault(); // Chặn scroll trang khi dùng phím mũi tên
      }
      
      if (status !== 'PLAYING' && status !== 'COUNTDOWN' && status !== 'WAITING_REVIVE_MOVE') return;
      
      let newDir: Direction | null = null;
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': newDir = 'UP'; break;
        case 'ArrowDown': case 's': case 'S': newDir = 'DOWN'; break;
        case 'ArrowLeft': case 'a': case 'A': newDir = 'LEFT'; break;
        case 'ArrowRight': case 'd': case 'D': newDir = 'RIGHT'; break;
      }
      
      if (newDir) {
        changeDirection(newDir);
        if (status === 'WAITING_REVIVE_MOVE') {
          setStatus('PLAYING');
          lastTimeRef.current = performance.now();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, changeDirection]);

  // Điều khiển bằng thao tác vuốt (Swipe) trên màn hình cảm ứng
  const touchStartRef = useRef<{x: number, y: number} | null>(null);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current || (status !== 'PLAYING' && status !== 'COUNTDOWN' && status !== 'WAITING_REVIVE_MOVE')) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const dx = touchEndX - touchStartRef.current.x;
    const dy = touchEndY - touchStartRef.current.y;
    
    let newDir: Direction | null = null;
    // Xác định hướng vuốt dựa trên trục có độ lệch lớn hơn
    if (Math.abs(dx) > Math.abs(dy)) {
      if (Math.abs(dx) > 30) {
        newDir = dx > 0 ? 'RIGHT' : 'LEFT';
      }
    } else {
      if (Math.abs(dy) > 30) {
        newDir = dy > 0 ? 'DOWN' : 'UP';
      }
    }
    
    if (newDir) {
      changeDirection(newDir);
      if (status === 'WAITING_REVIVE_MOVE') {
        setStatus('PLAYING');
        lastTimeRef.current = performance.now();
      }
    }
    touchStartRef.current = null;
  }, [status, changeDirection]);

  return {
    snake,
    direction,
    food,
    rocks,
    nowItem,
    status,
    score,
    currentSpeed,
    startGame,
    startReviveCountdown,
    finishReviveCountdown,
    canRevive,
    handleTouchStart,
    handleTouchEnd,
    gridWidth: GRID_WIDTH,
    gridHeight: GRID_HEIGHT,
    gameId
  };
};
