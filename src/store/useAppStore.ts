import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Difficulty } from '../game/types';

export type DpadMode = 'overlay' | 'separate';

/**
 * Interface định nghĩa cấu trúc state toàn cục của ứng dụng
 */
interface AppState {
  currentScreen: 'INTRO' | 'GAME' | 'HISTORY';
  setCurrentScreen: (screen: 'INTRO' | 'GAME' | 'HISTORY') => void;
  
  difficulty: Difficulty;
  setDifficulty: (diff: Difficulty) => void;
  
  bgmEnabled: boolean;
  setBgmEnabled: (enabled: boolean) => void;
  
  sfxEnabled: boolean;
  setSfxEnabled: (enabled: boolean) => void;
  
  tikiNowMode: boolean;
  setTikiNowMode: (enabled: boolean) => void;

  dpadMode: DpadMode;
  setDpadMode: (mode: DpadMode) => void;
  
  controlType: 'joystick' | 'dpad';
  setControlType: (type: 'joystick' | 'dpad') => void;
  
  highScores: { score: number; date: string; gameId?: number }[];
  addHighScore: (score: number, gameId?: number) => void;
}

/**
 * Store quản lý state toàn cục sử dụng Zustand
 * Được lưu trữ cục bộ (localStorage) thông qua middleware persist
 */
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentScreen: 'INTRO',
      setCurrentScreen: (screen) => set({ currentScreen: screen }),
      
      difficulty: 'MEDIUM',
      setDifficulty: (diff) => set({ difficulty: diff }),
      
      bgmEnabled: true,
      setBgmEnabled: (enabled) => set({ bgmEnabled: enabled }),
      
      sfxEnabled: true,
      setSfxEnabled: (enabled) => set({ sfxEnabled: enabled }),
      
      tikiNowMode: false,
      setTikiNowMode: (enabled) => set({ tikiNowMode: enabled }),

      dpadMode: 'separate',
      setDpadMode: (mode) => set({ dpadMode: mode }),
      
      controlType: 'dpad',
      setControlType: (type) => set({ controlType: type }),
      
      highScores: [],
      addHighScore: (score, gameId) => set((state) => {
        // Chỉ lưu điểm lớn hơn 0
        if (score <= 0) return state;
        
        let currentScores = [...state.highScores];
        
        if (gameId !== undefined) {
          const existingIndex = currentScores.findIndex(s => s.gameId === gameId);
          if (existingIndex !== -1) {
            // Cập nhật điểm nếu cao hơn (cộng dồn sau khi hồi sinh)
            if (score > currentScores[existingIndex].score) {
              currentScores[existingIndex].score = score;
              currentScores[existingIndex].date = new Date().toISOString();
            }
          } else {
            currentScores.push({ score, date: new Date().toISOString(), gameId });
          }
        } else {
          currentScores.push({ score, date: new Date().toISOString() });
        }
        
        const newScores = currentScores
          .sort((a, b) => b.score - a.score)
          .slice(0, 10); // Giữ lại top 10 điểm cao nhất
        return { highScores: newScores };
      }),
    }),
    {
      name: 'shipper-game-storage', // Tên key trong localStorage
    }
  )
);
