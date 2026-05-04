import React from 'react';
import { Button, ModalOverlay, ScrollableModalContent, SectionContainer, SectionTitle, SectionText } from '../styles';

interface TutorialModalProps {
  onClose: () => void;
}

/**
 * Component hiển thị hướng dẫn chơi game
 */
export const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => (
  <ModalOverlay onClick={onClose}>
    <ScrollableModalContent onClick={e => e.stopPropagation()}>
      <h2>Hướng dẫn chơi</h2>
      
      <SectionContainer>
        <SectionTitle>🎯 Mục tiêu</SectionTitle>
        <SectionText>Lấy thật nhiều đơn hàng để đạt điểm cao nhất!</SectionText>
      </SectionContainer>

      <SectionContainer>
        <SectionTitle>🎮 Di chuyển</SectionTitle>
        <SectionText className="no-margin">📱 <b>Mobile:</b> Dùng nút điều hướng trên màn hình.</SectionText>
        <SectionText>💻 <b>PC:</b> Phím W, A, S, D hoặc các phím mũi tên.</SectionText>
      </SectionContainer>

      <SectionContainer>
        <SectionTitle>📜 Luật chơi</SectionTitle>
        <SectionText>📦 <b>Ăn hàng:</b> +10 điểm, đuôi xe dài ra và chạy nhanh dần.</SectionText>
        <SectionText>⚡ <b>Gói NOW (Tùy chọn):</b> +10 điểm vĩnh viễn cho <i>mọi đơn hàng</i> lấy sau đó. Xe sẽ tăng tốc. Sẽ biến mất nếu không ăn sớm.</SectionText>
        <SectionText>🪨 <b>Tránh chướng ngại vật:</b> Đụng phải sẽ rớt 1 thùng hàng cuối cùng & bị -10 điểm (mất cả hiệu ứng NOW nếu rơi trúng thùng NOW).</SectionText>
        <SectionText>💥 <b>Thua cuộc:</b> Tông vào tường hoặc tông vào đuôi chở hàng của chính mình.</SectionText>
      </SectionContainer>

      <Button onClick={onClose} style={{ marginTop: 10 }}>Đã hiểu, chiến thôi!</Button>
    </ScrollableModalContent>
  </ModalOverlay>
);
