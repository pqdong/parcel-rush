import React from 'react';
import { X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Difficulty } from '../types';
import { ModalOverlay, ModalContent, ModalHeader, SettingRow, Select, Toggle } from '../styles';

interface SettingsModalProps {
  onClose: () => void;
}

/**
 * Component hiển thị cài đặt game (Độ khó, Âm thanh)
 */
export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { difficulty, setDifficulty, bgmEnabled, setBgmEnabled, sfxEnabled, setSfxEnabled } = useAppStore();
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <h2>Cài đặt</h2>
          <X onClick={onClose} />
        </ModalHeader>
        
        <SettingRow>
          <span>Độ khó</span>
          <Select value={difficulty} onChange={e => setDifficulty(e.target.value as Difficulty)}>
            <option value="EASY">Dễ</option>
            <option value="MEDIUM">Vừa</option>
            <option value="HARD">Khó</option>
          </Select>
        </SettingRow>
        
        <SettingRow>
          <span>Nhạc nền</span>
          <Toggle checked={bgmEnabled} onChange={e => setBgmEnabled(e.target.checked)} />
        </SettingRow>
        
        <SettingRow>
          <span>Hiệu ứng</span>
          <Toggle checked={sfxEnabled} onChange={e => setSfxEnabled(e.target.checked)} />
        </SettingRow>
        
      </ModalContent>
    </ModalOverlay>
  );
};
