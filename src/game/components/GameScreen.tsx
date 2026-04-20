import React, { memo } from 'react';
import { motion } from 'motion/react';
import { Package, Play, RotateCcw, Video } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useSnakeGame } from '../useSnakeGame';
import { Direction } from '../types';
import { Button, GameHeader, BoardContainer, Grid, Cell, GameOverOverlay, CellProps } from '../styles';
import { ReviveAdModal } from '../../components/Revive/ReviveAdModal';
import { ReadyCountdownOverlay } from '../../components/Revive/ReadyCountdownOverlay';

const MotionButton = motion.create(Button);

// Sử dụng React.memo để tối ưu hóa
const MemoizedCell = memo(({ 
  type, direction, x, y, widthSize, heightSize, speed 
}: {
  type: 'empty' | 'head' | 'body' | 'body_now' | 'food' | 'rock' | 'tree' | 'nowItem';
  direction?: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  x: number;
  y: number;
  widthSize: number;
  heightSize: number;
  speed?: number;
}) => {
  return <Cell $type={type} $direction={direction} $x={x} $y={y} $widthSize={widthSize} $heightSize={heightSize} $speed={speed} />;
});

/**
 * Màn hình chính của trò chơi (Bàn cờ, Điểm số, Game Over)
 */
export const GameScreen: React.FC = () => {
  const { 
    snake, direction, food, rocks, nowItem, status, score, currentSpeed, 
    startGame, startReviveCountdown, finishReviveCountdown, canRevive,
    handleTouchStart, handleTouchEnd, gridWidth, gridHeight, gameId 
  } = useSnakeGame();
  const { setCurrentScreen } = useAppStore();
  const [isAdModalOpen, setIsAdModalOpen] = React.useState(false);
  const [isTouchDevice, setIsTouchDevice] = React.useState(true);

  React.useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);

    // Chặn triệt để hành động "Pull to refresh" / cuộn trang trên Safari và Android khi đang ở màn hình Game
    const preventOverscroll = (e: TouchEvent) => {
      // Chỉ chặn thao tác nháp vuốt di chuyển (không chặn touchstart để tránh liệt màn hình)
      if (e.touches.length === 1) {
        const target = e.target as HTMLElement;
        // Cho phép các thành phần tương tác (nút bấm, thanh cuộn) hoạt động bình thường
        const isInteractive = target.closest('button') || target.tagName === 'BUTTON' || target.tagName === 'A' || target.tagName === 'INPUT' || target.closest('.scrollable');
        
        if (!isInteractive) {
          e.preventDefault();
        }
      }
    };
    
    // Chỉ add sự kiện touchmove để chặn hành động vuốt quá tay (overscroll).
    document.addEventListener('touchmove', preventOverscroll, { passive: false });
    
    return () => {
      document.removeEventListener('touchmove', preventOverscroll);
    };
  }, []);

  const handleReviveSuccess = () => {
    setIsAdModalOpen(false);
    startReviveCountdown();
  };

  const handleReviveCancel = () => {
    setIsAdModalOpen(false);
  };

  // --- Sinh ra các thực thể (Entities) trên bàn cờ ---
  const cells = [];
  
  // 1. Thêm chướng ngại vật (đá, cây)
  rocks.forEach((r, i) => {
    cells.push(<MemoizedCell key={`rock-${i}`} type={r.type === 'tree' ? 'tree' : 'rock'} x={r.x} y={r.y} widthSize={gridWidth} heightSize={gridHeight} speed={0} />);
  });
  
  // 2. Thêm thức ăn
  cells.push(<MemoizedCell key="food" type="food" x={food.x} y={food.y} widthSize={gridWidth} heightSize={gridHeight} speed={0} />);
  
  // 3. Thêm vật phẩm NOW (nếu có)
  if (nowItem) {
    cells.push(<MemoizedCell key="nowItem" type="nowItem" x={nowItem.x} y={nowItem.y} widthSize={gridWidth} heightSize={gridHeight} speed={0} />);
  }
  
  // 4. Thêm rắn (đầu và thân)
  // Sử dụng index làm key giúp CSS transition hoạt động mượt mà khi các đốt di chuyển theo nhau
  const snakeSpeed = status === 'PLAYING' ? currentSpeed : 0;
  snake.forEach((segment, index) => {
    if (index === 0) {
      cells.push(
        <MemoizedCell 
          key="snake-head" 
          type="head" 
          direction={direction} 
          x={segment.x} 
          y={segment.y} 
          widthSize={gridWidth} 
          heightSize={gridHeight} 
          speed={snakeSpeed} 
        />
      );
    } else {
      cells.push(
        <MemoizedCell 
          key={`snake-body-${index}`} 
          type={segment.type === 'now' ? 'body_now' : 'body'} 
          x={segment.x} 
          y={segment.y} 
          widthSize={gridWidth} 
          heightSize={gridHeight} 
          speed={snakeSpeed} 
        />
      );
    }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header: Hiển thị điểm số và trạng thái */}
      <GameHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Package size={24} color="#0a68ff" />
          <motion.span
            key={score}
            initial={{ scale: 1.5, color: '#ff4d4f' }}
            animate={{ scale: 1, color: '#0a68ff' }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            {score}
          </motion.span>
        </div>
        {status === 'IDLE' && <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 600 }}>Sẵn sàng!</span>}
        {status === 'PLAYING' && (
          <motion.span 
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            style={{ fontSize: '0.9rem', color: '#0a68ff', fontWeight: 700 }}
          >
            Đang giao hàng...
          </motion.span>
        )}
        {status === 'WAITING_REVIVE_MOVE' && (
          <motion.span 
            animate={{ opacity: [1, 0, 1], scale: [1, 1.1, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
            style={{ fontSize: '0.95rem', color: '#ff4d4f', fontWeight: 800, textTransform: 'uppercase' }}
          >
            {isTouchDevice ? 'Vuốt để tiếp tục!' : 'Di chuyển để tiếp tục!'}
          </motion.span>
        )}
      </GameHeader>
      
      {/* Container bàn chơi: Hỗ trợ vuốt trên mobile */}
      <BoardContainer onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <Grid $widthSize={gridWidth} $heightSize={gridHeight} key={gameId}>
          {cells}
          
          {/* Màn hình Game Over */}
          {status === 'GAME_OVER' && (
            <GameOverOverlay>
              <h2 style={{ color: '#ff4d4f', fontSize: '2rem', margin: '0 0 10px 0' }}>GAME OVER</h2>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: 20 }}>Điểm của bạn: {score}</p>
              
              {canRevive && (
                <MotionButton 
                  onClick={() => setIsAdModalOpen(true)} 
                  style={{ width: '80%', backgroundColor: '#52c41a' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Video size={20} />
                  Hồi sinh (Xem QC)
                </MotionButton>
              )}

              <MotionButton 
                onClick={startGame} 
                style={{ width: '80%' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw size={20} />
                Chơi lại {canRevive ? 'từ đầu' : ''}
              </MotionButton>
              <Button variant="secondary" onClick={() => setCurrentScreen('INTRO')} style={{ width: '80%' }}>Về trang chủ</Button>
            </GameOverOverlay>
          )}
          
          {/* Màn hình chờ bắt đầu */}
          {status === 'IDLE' && (
            <GameOverOverlay style={{ background: 'rgba(255,255,255,0.7)' }}>
              <MotionButton 
                onClick={startGame}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: ["0px 0px 0px rgba(10, 104, 255, 0)", "0px 0px 20px rgba(10, 104, 255, 0.6)", "0px 0px 0px rgba(10, 104, 255, 0)"]
                }}
                transition={{
                  boxShadow: { duration: 1.5, repeat: Infinity }
                }}
              >
                <Play size={20} fill="currentColor" />
                Bắt đầu
              </MotionButton>
            </GameOverOverlay>
          )}
        </Grid>
      </BoardContainer>
      
      <ReviveAdModal 
        isOpen={isAdModalOpen} 
        onReviveSuccess={handleReviveSuccess} 
        onCancel={handleReviveCancel} 
      />
      <ReadyCountdownOverlay 
        isOpen={status === 'COUNTDOWN'} 
        onFinish={finishReviveCountdown} 
      />
    </div>
  );
};
