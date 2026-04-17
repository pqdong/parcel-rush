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
        <SectionText>Hóa thân thành anh Shipper chăm chỉ, thu thập càng nhiều thùng hàng càng tốt để đạt điểm cao!</SectionText>
      </SectionContainer>

      <SectionContainer>
        <SectionTitle>🎮 Cách di chuyển</SectionTitle>
        <SectionText className="no-margin">📱 <b>Điện thoại:</b> Vuốt ngón tay (lên, xuống, trái, phải) trên màn hình khu vực chơi.</SectionText>
        <SectionText>💻 <b>Máy tính:</b> Dùng các phím mũi tên (⬆️ ⬇️ ⬅️ ➡️) hoặc phím W, A, S, D.</SectionText>
      </SectionContainer>

      <SectionContainer>
        <SectionTitle>📜 Luật chơi</SectionTitle>
        <SectionText>📦 <b>Lấy hàng:</b> Mỗi vật phẩm lấy được mặc định cộng <b>10 điểm</b>. Thùng hàng sẽ nối đuôi theo sau xe, làm đoàn xe dài ra và tốc độ chạy sẽ tăng dần lên.</SectionText>
        <SectionText>⚡ <b>Vật phẩm NOW:</b> Nếu bật chế độ "Tiki NOW", vật phẩm NOW sẽ xuất hiện ngẫu nhiên. Khi ăn được vật phẩm NOW, điểm số của <b>mỗi vật phẩm ăn được tiếp theo</b> sẽ tăng thêm <b>10 điểm</b> (cộng dồn). Đồng thời xe sẽ được tăng tốc độ đáng kể! Nếu bỏ qua, vật phẩm sẽ tự biến mất sau vài lượt.</SectionText>
        <SectionText>🪨 <b>Tránh chướng ngại vật:</b> Cẩn thận đá tảng và cây cối! Tông phải sẽ bị trừ <b>10 điểm</b> và đánh rơi mất 1 thùng hàng ở phía sau. Nếu thùng hàng bị rơi là vật phẩm NOW, bạn sẽ bị mất đi mức điểm thưởng cộng dồn tương ứng.</SectionText>
        <SectionText>💥 <b>Thua cuộc (Game Over):</b> Trò chơi kết thúc nếu Shipper tông xe vào tường (cạnh màn hình) hoặc tông vào chính đoàn xe của mình.</SectionText>
      </SectionContainer>

      <Button onClick={onClose} style={{ marginTop: 10 }}>Đã hiểu, chiến thôi!</Button>
    </ScrollableModalContent>
  </ModalOverlay>
);
