import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Award, PackageX } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ScreenContainer, Title, HistoryList, HistoryItem } from '../styles';

const MotionHistoryItem = motion.create(HistoryItem);

/**
 * Màn hình hiển thị Bảng xếp hạng / Lịch sử điểm cao
 * Được thiết kế lại với hiệu ứng animation và huy chương cho Top 3
 */
export const HistoryScreen: React.FC = () => {
  const { highScores } = useAppStore();
  
  // Animation variants cho danh sách
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Animation variants cho từng item
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  // Hàm lấy icon huy chương dựa trên thứ hạng
  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy size={28} color="#ffd700" fill="#ffd700" style={{ filter: 'drop-shadow(0 2px 4px rgba(255,215,0,0.4))' }} />;
    if (index === 1) return <Medal size={28} color="#c0c0c0" fill="#c0c0c0" />;
    if (index === 2) return <Award size={28} color="#cd7f32" fill="#cd7f32" />;
    return <span className="rank-number">#{index + 1}</span>;
  };

  // Hàm lấy danh hiệu vui nhộn dựa trên thứ hạng
  const getRankTitle = (index: number) => {
    if (index === 0) return 'Shipper Huyền Thoại';
    if (index === 1) return 'Shipper Xuất Sắc';
    if (index === 2) return 'Shipper Tiềm Năng';
    return 'Shipper Chăm Chỉ';
  };

  return (
    <ScreenContainer style={{ justifyContent: 'flex-start', paddingTop: 40, paddingBottom: 40 }}>
      
      {/* Header Bảng xếp hạng */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}
      >
        <div style={{ background: '#e8f0fe', padding: '16px', borderRadius: '50%', marginBottom: '12px' }}>
          <Trophy size={40} color="#0a68ff" />
        </div>
        <Title style={{ fontSize: '1.8rem', marginBottom: 0 }}>Bảng Xếp Hạng</Title>
        <p style={{ color: '#666', marginTop: 8, fontWeight: 500 }}>Top 10 chuyến giao hàng đỉnh nhất của bạn</p>
      </motion.div>
      
      {/* Trạng thái trống (Chưa có điểm) */}
      {highScores.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40, color: '#999' }}
        >
          <PackageX size={64} strokeWidth={1.5} style={{ marginBottom: 16, opacity: 0.5 }} />
          <p style={{ fontSize: '1.1rem', fontWeight: 500, margin: '0 0 8px 0' }}>Chưa có chuyến giao hàng nào.</p>
          <p style={{ fontSize: '0.9rem' }}>Hãy chơi ngay để ghi danh lên bảng vàng!</p>
        </motion.div>
      ) : (
        /* Danh sách điểm cao */
        <HistoryList
          as={motion.ul}
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {highScores.map((item, index) => (
            <MotionHistoryItem 
              key={`${item.date}-${index}`} 
              variants={itemVariants}
              rank={index + 1}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="rank-info">
                <div style={{ width: 36, display: 'flex', justifyContent: 'center' }}>
                  {getRankIcon(index)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 700, color: '#333', fontSize: '1.05rem', marginBottom: '2px' }}>
                    {getRankTitle(index)}
                  </span>
                  <span className="date">
                    {new Date(item.date).toLocaleString('vi-VN', { 
                      hour: '2-digit', minute: '2-digit', 
                      day: '2-digit', month: '2-digit', year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
              <div className="score-info">
                <span className="score">{item.score}</span>
                <span style={{ fontSize: '0.7rem', color: '#0a68ff', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Điểm</span>
              </div>
            </MotionHistoryItem>
          ))}
        </HistoryList>
      )}
    </ScreenContainer>
  );
};
