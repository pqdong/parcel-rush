/**
 * Lớp quản lý âm thanh cho trò chơi
 * Sử dụng Web Audio API cho SFX (để không bị delay) và HTMLAudioElement cho BGM
 */
class SoundManager {
  private bgmAudio: HTMLAudioElement;
  private sfxElements: Record<string, HTMLAudioElement> = {};
  private isBgmPlaying = false;
  private isUnlocked = false;

  private audioCtx: AudioContext | null = null;
  private sfxBuffers: Record<string, AudioBuffer> = {};
  private useWebAudio = false;
  private sfxMasterGain: GainNode | null = null;
  private activeSources: Set<AudioBufferSourceNode> = new Set();

  constructor() {
    this.bgmAudio = new Audio('https://salt.tikicdn.com/ts/ecomGameHub/74/64/76/54acc707e4a854ade25afd51299629b3.mp3');
    this.bgmAudio.loop = true;
    this.bgmAudio.volume = 0.4;
    this.bgmAudio.preload = 'auto';

    // Fallback HTMLAudioElements
    this.sfxElements['EAT'] = new Audio('https://salt.tikicdn.com/ts/ecomGameHub/78/9c/78/25fd6fdf87e12314dbc11c6e37eefa48.mp3');
    this.sfxElements['HIT'] = new Audio('https://salt.tikicdn.com/ts/ecomGameHub/b9/d7/13/48bd2ed1f57f33238bda03f64c9631c9.mp3');
    this.sfxElements['GAMEOVER'] = new Audio('https://salt.tikicdn.com/ts/ecomGameHub/54/1f/bb/d920c53bf4f9071bb721acf394e2f40d.mp3');

    Object.values(this.sfxElements).forEach(audio => {
      audio.preload = 'auto';
    });

    this.initWebAudio();
  }

  private async initWebAudio() {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      this.audioCtx = new AudioContextClass();
      
      this.sfxMasterGain = this.audioCtx.createGain();
      this.sfxMasterGain.gain.value = 0.6;
      this.sfxMasterGain.connect(this.audioCtx.destination);
      
      await Promise.all([
        this.loadSFX('EAT', 'https://salt.tikicdn.com/ts/ecomGameHub/78/9c/78/25fd6fdf87e12314dbc11c6e37eefa48.mp3'),
        this.loadSFX('HIT', 'https://salt.tikicdn.com/ts/ecomGameHub/b9/d7/13/48bd2ed1f57f33238bda03f64c9631c9.mp3'),
        this.loadSFX('GAMEOVER', 'https://salt.tikicdn.com/ts/ecomGameHub/54/1f/bb/d920c53bf4f9071bb721acf394e2f40d.mp3')
      ]);
      
      this.useWebAudio = true;
    } catch (e) {
      console.warn('Web Audio API init failed, falling back to HTMLAudioElement:', e);
    }
  }

  private async loadSFX(key: string, url: string) {
    if (!this.audioCtx) return;
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
      this.sfxBuffers[key] = audioBuffer;
    } catch (e) {
      console.warn(`Failed to load SFX ${key}:`, e);
    }
  }

  /**
   * Khởi tạo (để tương thích với code cũ nếu có gọi init)
   */
  init() {
    // Không cần khởi tạo AudioContext nữa
  }

  /**
   * Mở khóa âm thanh trên iOS bằng cách phát một đoạn âm thanh rỗng trong tương tác của người dùng
   */
  unlockAudio() {
    if (this.isUnlocked) return;
    this.isUnlocked = true;

    // Unlock Web Audio API
    if (this.audioCtx) {
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      // Play silent sound to unlock
      const buffer = this.audioCtx.createBuffer(1, 1, 22050);
      const source = this.audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(this.audioCtx.destination);
      source.start(0);
      
      source.onended = () => source.disconnect();
    }

    // Đăng ký sự kiện để liên tục giữ AudioContext không bị suspend trên iOS
    const resumeContext = () => {
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
    };
    window.addEventListener('touchstart', resumeContext, { passive: true });
    window.addEventListener('touchend', resumeContext, { passive: true });
    window.addEventListener('click', resumeContext, { passive: true });
    window.addEventListener('keydown', resumeContext, { passive: true });

    const unlockHTMLAudio = (audio: HTMLAudioElement) => {
      const originalVolume = audio.volume;
      audio.volume = 0; // Mute during unlock
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          // Nếu đây là nhạc nền và đang được yêu cầu phát, không pause
          if (audio === this.bgmAudio && this.isBgmPlaying) {
            audio.volume = originalVolume;
            return;
          }
          audio.pause();
          audio.currentTime = 0;
          audio.volume = originalVolume;
        }).catch(() => {
          audio.volume = originalVolume;
        });
      }
    };
    
    unlockHTMLAudio(this.bgmAudio);
    if (!this.useWebAudio) {
      Object.values(this.sfxElements).forEach(unlockHTMLAudio);
    }
  }

  /**
   * Phát nhạc nền (BGM)
   * @param enabled Trạng thái bật/tắt nhạc nền
   */
  playBGM(enabled: boolean) {
    if (!enabled) {
      this.stopBGM();
      return;
    }
    if (this.isBgmPlaying) return;

    this.isBgmPlaying = true;
    this.bgmAudio.currentTime = 0;
    this.bgmAudio.play().catch(e => console.warn('BGM play failed:', e));
  }

  /**
   * Dừng phát nhạc nền
   */
  stopBGM() {
    this.isBgmPlaying = false;
    this.bgmAudio.pause();
  }

  /**
   * Phát hiệu ứng âm thanh (SFX)
   * @param type Loại hiệu ứng ('EAT' | 'HIT' | 'GAMEOVER')
   * @param enabled Trạng thái bật/tắt hiệu ứng
   */
  playSFX(type: 'EAT' | 'HIT' | 'GAMEOVER', enabled: boolean) {
    if (!enabled) return;

    if (this.useWebAudio && this.audioCtx && this.sfxBuffers[type]) {
      // Đảm bảo context luôn chạy trước khi phát
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      
      try {
        const source = this.audioCtx.createBufferSource();
        source.buffer = this.sfxBuffers[type];
        
        if (this.sfxMasterGain) {
          source.connect(this.sfxMasterGain);
        } else {
          source.connect(this.audioCtx.destination);
        }
        
        // Ngăn Safari dọn dẹp rác (Garbage Collection) nhầm khi âm thanh đang phát gây mất tiếng
        this.activeSources.add(source);
        
        source.onended = () => {
          source.disconnect();
          this.activeSources.delete(source);
        };
        
        source.start(0);
      } catch (e) {
        console.warn('Web Audio SFX play failed:', e);
      }
    } else {
      // Fallback cho trình duyệt không hỗ trợ Web Audio API hoặc bị lỗi CORS
      const audio = this.sfxElements[type];
      if (audio) {
        audio.currentTime = 0;
        audio.volume = 0.6;
        audio.play().catch(err => console.warn('SFX fallback original play failed:', err));
      }
    }
  }
}

export const soundManager = new SoundManager();
