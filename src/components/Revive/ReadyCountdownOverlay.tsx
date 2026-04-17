import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 50;
  border-radius: 4px;
`;

const CountText = styled.div`
  font-size: 6rem;
  font-weight: 900;
  color: white;
  text-shadow: 0 4px 10px rgba(0,0,0,0.5);
  animation: pulse 1s infinite alternate;

  @keyframes pulse {
    from { transform: scale(1); }
    to { transform: scale(1.2); }
  }
`;

const HintText = styled.div`
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 20px;
  text-shadow: 0 2px 5px rgba(0,0,0,0.5);
  text-align: center;
`;

export interface ReadyCountdownOverlayProps {
  isOpen: boolean;
  onFinish: () => void;
}

export const ReadyCountdownOverlay: React.FC<ReadyCountdownOverlayProps> = ({ isOpen, onFinish }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (!isOpen) {
      setCount(3);
      return;
    }

    if (count > 0) {
      const timer = setTimeout(() => setCount(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onFinish();
    }
  }, [isOpen, count, onFinish]);

  if (!isOpen || count === 0) return null;

  return (
    <Overlay>
      <CountText>{count}</CountText>
      <HintText>Đổi hướng ngay để tránh va chạm!</HintText>
    </Overlay>
  );
};
