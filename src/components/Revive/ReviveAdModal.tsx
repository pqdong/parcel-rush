import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const Modal = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 340px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
`;

const AdPlaceholder = styled.div`
  background: #eee;
  height: 150px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px 0;
  color: #999;
  font-weight: bold;
`;

const Button = styled.button<{ $primary?: boolean, $disabled?: boolean }>`
  background: ${props => props.$disabled ? '#ccc' : props.$primary ? '#0a68ff' : '#e0e0e0'};
  color: ${props => props.$disabled ? '#666' : props.$primary ? 'white' : '#333'};
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  width: 100%;
  margin-bottom: 8px;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: ${props => props.$disabled ? 1 : 0.9};
  }
`;

export interface ReviveAdModalProps {
  isOpen: boolean;
  onReviveSuccess: () => void;
  onCancel: () => void;
}

export const ReviveAdModal: React.FC<ReviveAdModalProps> = ({ isOpen, onReviveSuccess, onCancel }) => {
  const [countdown, setCountdown] = useState(5);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setShowConfirm(false);
      return;
    }
    
    if (countdown > 0 && !showConfirm) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, countdown, showConfirm]);

  if (!isOpen) return null;

  const handleCloseClick = () => {
    if (countdown > 0) {
      setShowConfirm(true);
    } else {
      onCancel();
    }
  };

  if (showConfirm) {
    return (
      <Overlay>
        <Modal>
          <h3 style={{ marginTop: 0, color: '#ff4d4f' }}>Bạn có chắc muốn đóng?</h3>
          <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: 20 }}>Bạn sẽ mất cơ hội hồi sinh nếu đóng quảng cáo lúc này.</p>
          <Button $primary onClick={() => setShowConfirm(false)}>Tiếp tục xem</Button>
          <Button onClick={onCancel}>Đóng hẳn</Button>
        </Modal>
      </Overlay>
    );
  }

  return (
    <Overlay>
      <Modal>
        <h3 style={{ marginTop: 0, color: '#0a68ff' }}>Xem quảng cáo để hồi sinh</h3>
        <AdPlaceholder>
          Video Quảng Cáo
        </AdPlaceholder>
        {countdown > 0 ? (
          <p style={{ color: '#666', fontWeight: 'bold' }}>Có thể hồi sinh sau {countdown}s...</p>
        ) : (
          <p style={{ color: '#52c41a', fontWeight: 'bold' }}>Quảng cáo đã xong!</p>
        )}
        <Button 
          $primary 
          $disabled={countdown > 0} 
          onClick={() => { if (countdown === 0) onReviveSuccess(); }}
        >
          Hồi sinh ngay
        </Button>
        <Button onClick={handleCloseClick}>
          Đóng
        </Button>
      </Modal>
    </Overlay>
  );
};
