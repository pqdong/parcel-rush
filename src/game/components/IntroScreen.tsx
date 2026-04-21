import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HelpCircle, Settings, Play, Smartphone, Pointer, Keyboard, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, LogOut } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { 
  ScreenContainer, Title, Button, InstructionContainer, MobileInstruction, DesktopInstruction,
  ModalOverlay, ModalContent, LogoImage, ToggleContainer, ToggleCheckbox, ToggleLabel, ToggleIcon,
  ActionButtonsRow, ActionButton, InstructionIconWrapper, DesktopIconWrapper, KeyRow, KeyBox,
  PointerWrapper, DangerText, SubText
} from '../styles';
import { TutorialModal } from './TutorialModal';
import { SettingsModal } from './SettingsModal';
import { soundManager } from '../SoundManager';

const MotionButton = motion.create(Button);
const MotionLogo = motion.create(LogoImage);
const MotionPointer = motion.create(PointerWrapper);

interface IntroScreenProps {
  onStart: () => void;
}

/**
 * Màn hình chào mừng (Intro) của trò chơi
 * Cho phép người chơi bắt đầu, xem hướng dẫn, cài đặt và chọn chế độ TikiNOW
 */
export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  
  const tikiNowMode = useAppStore(state => state.tikiNowMode);
  const setTikiNowMode = useAppStore(state => state.setTikiNowMode);
  const dpadMode = useAppStore(state => state.dpadMode);

  const handleStart = () => {
    soundManager.unlockAudio();
    onStart();
  };

  return (
    <ScreenContainer>
      <MotionLogo 
        src="https://salt.tikicdn.com/ts/ecomGameHub/f4/91/e4/04718d9f3a7cd5443185adecd8173f79.png" 
        alt="Shipper" 
        animate={{ 
          y: [0, -20, 0],
          x: [-10, 10, -10],
          rotate: [-10, 10, -10],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        referrerPolicy="no-referrer"
      />
      <Title>Shipper<br/>Lấy Hàng</Title>
      
      {/* Tùy chọn chế độ Tiki NOW */}
      <ToggleContainer>
        <ToggleCheckbox 
          type="checkbox" 
          id="tikiNow" 
          checked={tikiNowMode} 
          onChange={(e) => setTikiNowMode(e.target.checked)}
        />
        <ToggleLabel htmlFor="tikiNow">
          Tiki <ToggleIcon src="https://salt.tikicdn.com/ts/upload/04/da/1e/eac32401f048ffd380e50dfeda2a1c55.png" alt="NOW" referrerPolicy="no-referrer" /> - Giao siêu tốc 2h
        </ToggleLabel>
      </ToggleContainer>

      <InstructionContainer>
        <MobileInstruction>
          <InstructionIconWrapper>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
               <div style={{ display: 'flex', justifyContent: 'center' }}><ArrowUp size={20} /></div>
               <div style={{ display: 'flex', gap: '4px' }}>
                  <ArrowLeft size={20} /><ArrowDown size={20} /><ArrowRight size={20} />
               </div>
            </div>
          </InstructionIconWrapper>
          <span>Dùng bộ nút ảo để điều hướng</span>
        </MobileInstruction>
        
        <DesktopInstruction>
          <DesktopIconWrapper>
            <KeyRow>
              <KeyBox><ArrowUp size={16} /></KeyBox>
            </KeyRow>
            <KeyRow>
              <KeyBox><ArrowLeft size={16} /></KeyBox>
              <KeyBox><ArrowDown size={16} /></KeyBox>
              <KeyBox><ArrowRight size={16} /></KeyBox>
            </KeyRow>
            <MotionPointer 
              $top={30} $left={60}
              animate={{ x: [-5, 5, -5], y: [-5, 5, -5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Pointer size={20} fill="currentColor" />
            </MotionPointer>
          </DesktopIconWrapper>
          <span>Dùng phím mũi tên để điều hướng</span>
        </DesktopInstruction>
      </InstructionContainer>

      {/* Nút Bắt đầu với hiệu ứng nhấp nháy (Pulse) */}
      <MotionButton 
        onClick={handleStart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: ["0px 0px 0px rgba(10, 104, 255, 0)", "0px 0px 20px rgba(10, 104, 255, 0.6)", "0px 0px 0px rgba(10, 104, 255, 0)"]
        }}
        transition={{
          boxShadow: { duration: 1.5, repeat: Infinity }
        }}
      >
        <Play size={22} fill="currentColor" />
        Bắt đầu chơi
      </MotionButton>
      
      <ActionButtonsRow>
        <ActionButton variant="secondary" onClick={() => setShowTutorial(true)}>
          <HelpCircle size={22} />
          Hướng dẫn
        </ActionButton>
        
        <ActionButton variant="secondary" onClick={() => setShowSettings(true)}>
          <Settings size={22} />
          Cài đặt
        </ActionButton>

        <ActionButton variant="secondary" className="danger" onClick={() => setShowExitConfirm(true)}>
          <LogOut size={22} />
          Thoát
        </ActionButton>
      </ActionButtonsRow>

      {/* Modals */}
      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showExitConfirm && (
        <ModalOverlay>
          <ModalContent style={{ textAlign: 'center' }}>
            <DangerText>Thoát trò chơi?</DangerText>
            <SubText>Bạn có chắc chắn muốn thoát khỏi trò chơi không?</SubText>
            <Button variant="danger" onClick={() => window.location.href = 'about:blank'}>Đồng ý thoát</Button>
            <Button variant="secondary" onClick={() => setShowExitConfirm(false)} style={{ marginBottom: 0 }}>Hủy</Button>
          </ModalContent>
        </ModalOverlay>
      )}
    </ScreenContainer>
  );
};
