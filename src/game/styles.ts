import styled, { createGlobalStyle } from 'styled-components';

export const PRIMARY_COLOR = 'rgb(10, 104, 255)';

export const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    overflow: hidden; /* Prevent scrolling on mobile */
    overscroll-behavior: none; /* Prevent pull to refresh on mobile browsers */
    overscroll-behavior-y: none;
    touch-action: none; /* Prevent pull-to-refresh and swipe navigation */
  }

  #root {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: #f5f5f5;
    color: #333;
  }
  * {
    box-sizing: border-box;
  }
`;

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh; /* Fix for Safari iOS bottom bar */
  width: 100vw;
  max-width: 600px;
  margin: 0 auto;
  background-color: #fff;
  position: relative;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
`;

export const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

export const ScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 20px;
`;

export const Title = styled.h1`
  color: ${PRIMARY_COLOR};
  font-size: 2rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const InstructionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  color: #666;
  font-size: 0.9rem;
  text-align: center;
`;

export const MobileInstruction = styled.div`
  display: none;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

export const DesktopInstruction = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button = styled.button<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: ${props => 
    props.variant === 'secondary' ? '#e0e0e0' : 
    props.variant === 'danger' ? '#ff4d4f' : 
    PRIMARY_COLOR};
  color: ${props => props.variant === 'secondary' ? '#333' : '#fff'};
  border: none;
  border-radius: 12px;
  padding: 14px 24px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
  margin-bottom: 12px;
  transition: transform 0.1s, opacity 0.2s;
  
  &:active {
    transform: scale(0.96);
  }
  &:hover {
    opacity: 0.9;
  }
`;

// --- Game Board ---

export const GameHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  max-width: 400px;
  margin: 5px auto;
  padding: 6px 16px;
  background-color: white;
  color: ${PRIMARY_COLOR};
  font-weight: 800;
  font-size: 1.2rem;
  border-radius: 100px;
  box-shadow: 0 4px 12px rgba(10, 104, 255, 0.1);
  border: 2px solid rgba(10, 104, 255, 0.1);
`;

export const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex: 1;
  min-height: 0;
  padding: 0 10px 5px 10px;
  touch-action: none;
`;

export const GameAreaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  min-height: 0;
  position: relative;
`;

export const DpadContainer = styled.div<{ $mode: string, $isHidden?: boolean }>`
  display: ${props => props.$mode === 'hidden' || props.$isHidden ? 'none' : 'flex'};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  
  ${props => props.$mode === 'overlay' ? `
    position: absolute;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0.6;
    z-index: 50;
    pointer-events: auto;
  ` : `
    padding: 0px 5px 5px 5px;
    background: transparent;
    flex-shrink: 0;
    margin-bottom: 0px;
    margin-top: 5px;
  `}
`;

export const DpadRow = styled.div`
  display: flex;
  gap: 4px;
  justify-content: center;
`;

export const DpadButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background-color: rgba(243, 244, 246, 0.85); /* nhạt, light gray */
  color: #6b7280; /* Thu hút ít sự chú ý hơn */
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  
  &:active {
    transform: scale(0.92);
    background-color: #e5e7eb;
  }
  
  svg {
    width: 28px;
    height: 28px;
  }
`;

export interface GridProps {
  $widthSize: number;
  $heightSize: number;
}

export const Grid = styled.div<GridProps>`
  aspect-ratio: ${props => props.$widthSize} / ${props => props.$heightSize};
  min-height: 0;
  flex: 1;
  max-width: 100%;
  max-height: 100%;
  background-color: #e8f0fe;
  background-image: 
    linear-gradient(rgba(10, 104, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(10, 104, 255, 0.1) 1px, transparent 1px);
  background-size: calc(100% / ${props => props.$widthSize}) calc(100% / ${props => props.$heightSize});
  border: 4px solid ${PRIMARY_COLOR};
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`;

export interface CellProps {
  $type: 'empty' | 'head' | 'body' | 'body_now' | 'food' | 'rock' | 'tree' | 'nowItem';
  $direction?: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  $x: number;
  $y: number;
  $widthSize: number;
  $heightSize: number;
  $speed?: number;
}

export const Cell = styled.div.attrs<CellProps>(props => ({
  style: {
    width: `calc(100% / ${props.$widthSize})`,
    height: `calc(100% / ${props.$heightSize})`,
    left: `calc(${props.$x} * 100% / ${props.$widthSize})`,
    top: `calc(${props.$y} * 100% / ${props.$heightSize})`,
    transition: `left ${props.$speed !== undefined ? props.$speed + 'ms' : '100ms'} linear, top ${props.$speed !== undefined ? props.$speed + 'ms' : '100ms'} linear`
  }
}))<CellProps>`
  position: absolute;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  
  ${props => {
    switch(props.$type) {
      case 'head':
        let transformStr = 'scale(1.3)';
        // Giả sử ảnh gốc của shipper đang hướng sang PHẢI (RIGHT)
        if (props.$direction === 'RIGHT') transformStr = 'scale(1.3) rotate(0deg)';
        else if (props.$direction === 'LEFT') transformStr = 'scale(1.3) scaleX(-1)'; // Lật ngược ảnh khi đi sang trái để không bị lộn đầu
        else if (props.$direction === 'UP') transformStr = 'scale(1.3) rotate(-90deg)';
        else if (props.$direction === 'DOWN') transformStr = 'scale(1.3) rotate(90deg)';
        
        return `
          background-image: url('https://salt.tikicdn.com/ts/ecomGameHub/f4/91/e4/04718d9f3a7cd5443185adecd8173f79.png');
          transform: ${transformStr};
          z-index: 10;
        `;
      case 'body':
        return `
          background-image: url('https://salt.tikicdn.com/ts/ecomGameHub/91/bd/79/b2fb3ea031f08b001435ebfc2a4efc0c.png');
          transform: scale(1.1);
          z-index: 5;
        `;
      case 'body_now':
        return `
          background-image: url('https://salt.tikicdn.com/ts/upload/04/da/1e/eac32401f048ffd380e50dfeda2a1c55.png');
          transform: scale(1.1);
          z-index: 5;
        `;
      case 'food':
        return `
          background-image: url('https://salt.tikicdn.com/ts/ecomGameHub/91/bd/79/b2fb3ea031f08b001435ebfc2a4efc0c.png');
          animation: pulse 1s infinite alternate;
          z-index: 4;
        `;
      case 'rock':
        return `
          background-image: url('https://salt.tikicdn.com/ts/ecomGameHub/3b/38/73/56f1068d499e845aac3a234298161e84.png');
          border-radius: 4px;
          transform: scale(1.2);
          z-index: 4;
        `;
      case 'tree':
        return `
          background-image: url('https://salt.tikicdn.com/ts/ecomGameHub/1e/e4/3d/ce0edd360543c5c74b17584baf3c4d20.png');
          border-radius: 4px;
          transform: scale(1.3);
          z-index: 4;
        `;
      case 'nowItem':
        return `
          background-image: url('https://salt.tikicdn.com/ts/upload/04/da/1e/eac32401f048ffd380e50dfeda2a1c55.png');
          animation: pulseNow 0.5s infinite alternate;
          z-index: 6;
        `;
      default:
        return '';
    }
  }}

  @keyframes pulse {
    from { transform: scale(1.0); }
    to { transform: scale(1.3); }
  }
  
  @keyframes pulseNow {
    from { transform: scale(1.0) rotate(-5deg); filter: drop-shadow(0 0 5px rgba(255, 77, 79, 0.5)); }
    to { transform: scale(1.4) rotate(5deg); filter: drop-shadow(0 0 15px rgba(255, 77, 79, 0.8)); }
  }
`;

export const GameOverOverlay = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 20;
  border-radius: 4px;
`;

// --- Navigation Bar ---

export const NavBar = styled.div`
  flex-shrink: 0;
  height: 60px;
  background-color: white;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
  z-index: 100;
`;

export interface NavItemProps {
  active: boolean;
}

export const NavItem = styled.div<NavItemProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${props => props.active ? PRIMARY_COLOR : '#999'};
  cursor: pointer;
  flex: 1;
  height: 100%;
  transition: color 0.2s;
  
  svg {
    margin-bottom: 4px;
  }
  
  span {
    font-size: 0.75rem;
    font-weight: 600;
  }
`;

// --- Popups ---

export const ModalOverlay = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 20px;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 340px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  
  h2 {
    margin-top: 0;
    color: ${PRIMARY_COLOR};
    text-align: center;
  }
`;

export const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-weight: 500;
`;

export const Select = styled.select`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  outline: none;
  &:focus {
    border-color: ${PRIMARY_COLOR};
  }
`;

export const Toggle = styled.input.attrs({ type: 'checkbox' })`
  width: 40px;
  height: 20px;
  appearance: none;
  background: #ccc;
  border-radius: 20px;
  position: relative;
  cursor: pointer;
  outline: none;
  
  &:checked {
    background: ${PRIMARY_COLOR};
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    transition: 0.2s;
  }
  
  &:checked::after {
    left: 22px;
  }
`;

// --- History ---

export const HistoryList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
  max-width: 400px;
  margin: 0;
`;

export interface HistoryItemProps {
  rank?: number;
}

export const HistoryItem = styled.li<HistoryItemProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  margin-bottom: 12px;
  background: ${props => 
    props.rank === 1 ? 'linear-gradient(135deg, #fffcf0 0%, #fff 100%)' :
    props.rank === 2 ? 'linear-gradient(135deg, #f8f9fa 0%, #fff 100%)' :
    props.rank === 3 ? 'linear-gradient(135deg, #fff5f0 0%, #fff 100%)' :
    'white'};
  border-radius: 16px;
  box-shadow: ${props => 
    props.rank === 1 ? '0 8px 20px rgba(255, 215, 0, 0.15)' :
    '0 2px 10px rgba(0,0,0,0.04)'};
  border: 1px solid ${props => 
    props.rank === 1 ? 'rgba(255, 215, 0, 0.3)' :
    props.rank === 2 ? 'rgba(192, 192, 192, 0.3)' :
    props.rank === 3 ? 'rgba(205, 127, 50, 0.3)' :
    '#f0f0f0'};
  border-left: 6px solid ${props => 
    props.rank === 1 ? '#ffd700' :
    props.rank === 2 ? '#c0c0c0' :
    props.rank === 3 ? '#cd7f32' :
    PRIMARY_COLOR};
  
  .rank-info {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .rank-number {
    font-size: 1.2rem;
    font-weight: 800;
    color: #999;
  }

  .score-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .score {
    font-weight: 900;
    color: ${PRIMARY_COLOR};
    font-size: 1.5rem;
    line-height: 1;
  }
  
  .date {
    color: #888;
    font-size: 0.8rem;
    margin-top: 4px;
  }
`;

// --- Intro Screen Specific ---
export const LogoImage = styled.img`
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
`;

export const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  background: white;
  padding: 10px 16px;
  border-radius: 100px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
`;

export const ToggleCheckbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: ${PRIMARY_COLOR};
  cursor: pointer;
`;

export const ToggleLabel = styled.label`
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const ToggleIcon = styled.img`
  height: 18px;
  object-fit: contain;
`;

export const ActionButtonsRow = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  max-width: 300px;
`;

export const ActionButton = styled(Button)`
  flex: 1;
  padding: 12px 4px;
  font-size: 0.85rem;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 0;
  
  &.danger {
    color: #ff4d4f;
  }
`;

export const InstructionIconWrapper = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const DesktopIconWrapper = styled.div`
  position: relative;
  width: 100px;
  height: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

export const KeyRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
`;

export const KeyBox = styled.div`
  width: 24px;
  height: 24px;
  border: 1px solid #ccc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PointerWrapper = styled.div<{ $top: number; $left: number }>`
  position: absolute;
  top: ${props => props.$top}px;
  left: ${props => props.$left}px;
  color: ${PRIMARY_COLOR};
`;

// --- Modal Specific ---
export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h2 {
    margin: 0;
  }
  
  svg {
    cursor: pointer;
  }
`;

export const ScrollableModalContent = styled(ModalContent)`
  max-height: 85vh;
  overflow-y: auto;
`;

export const SectionContainer = styled.div`
  margin-bottom: 16px;
  line-height: 1.5;
  font-size: 0.95rem;
`;

export const SectionTitle = styled.h3`
  font-size: 1.1rem;
  color: ${PRIMARY_COLOR};
  margin: 0 0 8px 0;
`;

export const SectionText = styled.p`
  margin: 0 0 8px 0;
  
  &.no-margin {
    margin: 0 0 4px 0;
  }
`;

export const DangerText = styled.h3`
  margin-top: 0;
  color: #ff4d4f;
`;

export const SubText = styled.p`
  color: #666;
  margin-bottom: 20px;
`;
