import React from 'react';
import { Gamepad2, Trophy } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { GlobalStyle, AppContainer, ContentArea, NavBar, NavItem } from './styles';

// Import các màn hình (Screens) đã được tách ra
import { IntroScreen } from './components/IntroScreen';
import { GameScreen } from './components/GameScreen';
import { HistoryScreen } from './components/HistoryScreen';

/**
 * Component gốc của ứng dụng Rắn Săn Mồi (Shipper Lấy Hàng)
 * Quản lý việc chuyển đổi giữa các màn hình (Intro, Game, History)
 */
export const SnakeGameApp: React.FC = () => {
  const { currentScreen, setCurrentScreen } = useAppStore();

  return (
    <>
      {/* Global CSS (Reset, Font, Background) */}
      <GlobalStyle />
      
      {/* Khung ứng dụng chính (Mobile-first design) */}
      <AppContainer>
        
        {/* Khu vực hiển thị nội dung chính tùy theo màn hình hiện tại */}
        <ContentArea>
          {currentScreen === 'INTRO' && <IntroScreen onStart={() => setCurrentScreen('GAME')} />}
          {currentScreen === 'GAME' && <GameScreen />}
          {currentScreen === 'HISTORY' && <HistoryScreen />}
        </ContentArea>
        
        {/* Thanh điều hướng dưới cùng (Bottom Navigation Bar) */}
        <NavBar>
          <NavItem 
            active={currentScreen === 'INTRO' || currentScreen === 'GAME'} 
            onClick={() => setCurrentScreen('INTRO')}
          >
            <Gamepad2 size={24} />
            <span>Trò chơi</span>
          </NavItem>
          <NavItem 
            active={currentScreen === 'HISTORY'} 
            onClick={() => setCurrentScreen('HISTORY')}
          >
            <Trophy size={24} />
            <span>Lịch sử</span>
          </NavItem>
        </NavBar>
        
      </AppContainer>
    </>
  );
};
