import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAppStore, DpadMode } from '../../store/useAppStore';
import { Difficulty } from '../types';
import { ModalOverlay, ModalContent, ModalHeader, SettingRow, Select, Toggle } from '../styles';

interface SettingsModalProps {
  onClose: () => void;
}

/**
 * Component hiển thị cài đặt game (Độ khó, Âm thanh, Điều khiển)
 */
export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { difficulty, setDifficulty, bgmEnabled, setBgmEnabled, sfxEnabled, setSfxEnabled, dpadMode, setDpadMode, controlType, setControlType } = useAppStore();
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

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

        {isTouchDevice && (
          <>
            <SettingRow>
              <span>Kiểu bộ điều khiển</span>
              <Select value={controlType} onChange={e => setControlType(e.target.value as 'joystick' | 'dpad')}>
                <option value="joystick">Joystick</option>
                <option value="dpad">D-pad (4 Nút)</option>
              </Select>
            </SettingRow>

            {(controlType === 'dpad' || controlType === 'joystick') && (
              <SettingRow>
                <span>Vị trí bộ điều khiển</span>
                <Select value={dpadMode} onChange={e => setDpadMode(e.target.value as DpadMode)}>
                  <option value="overlay">Nổi trên khung chơi</option>
                  <option value="separate">Tách biệt ở dưới</option>
                </Select>
              </SettingRow>
            )}
          </>
        )}
        
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
