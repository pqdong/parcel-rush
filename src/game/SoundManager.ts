/**
 * Lớp quản lý âm thanh cho trò chơi
 * Chuyển sang dùng hoàn toàn HTMLAudioElement (Audio) theo yêu cầu.
 * Sử dụng kĩ thuật pooling (nhiều thẻ Audio) để không bị cắt tiếng khi âm thanh phát chồng chéo.
 */
class SoundManager {
  private bgmAudio: HTMLAudioElement;

  // Pools for SFX to allow overlapping sounds
  private sfxPools: Record<string, HTMLAudioElement[]> = {};
  private sfxPoolIndexes: Record<string, number> = {};

  private isBgmPlaying = false;
  private isUnlocked = false;

  constructor() {
    this.bgmAudio = new Audio('https://salt.tikicdn.com/ts/ecomGameHub/74/64/76/54acc707e4a854ade25afd51299629b3.mp3');
    this.bgmAudio.loop = true;
    this.bgmAudio.volume = 0.4;
    this.bgmAudio.preload = 'auto';

    // Tạo Pool (nhiều thẻ HTMLAudioElement) cho từng loại SFX để phát chồng chéo mà không cần cloneNode
    this.initPool('EAT', 'https://salt.tikicdn.com/ts/ecomGameHub/78/9c/78/25fd6fdf87e12314dbc11c6e37eefa48.mp3', 4);
    this.initPool('HIT', 'https://salt.tikicdn.com/ts/ecomGameHub/b9/d7/13/48bd2ed1f57f33238bda03f64c9631c9.mp3', 2);
    this.initPool('GAMEOVER', 'https://salt.tikicdn.com/ts/ecomGameHub/54/1f/bb/d920c53bf4f9071bb721acf394e2f40d.mp3', 1);
  }

  /**
   * Khởi tạo các mảng Audio dự phòng
   */
  private initPool(key: string, url: string, size: number) {
    const pool: HTMLAudioElement[] = [];
    for (let i = 0; i < size; i++) {
      const audio = new Audio(url);
      audio.preload = 'auto';
      
      // Thủ thuật giảm giật/delay (buffering stall) cho iOS: 
      // Ép audio tua sẵn về 0 ngay lập tức sau khi phát xong để lần play tiếp theo là zero-latency
      audio.onended = () => {
        audio.currentTime = 0;
      };
      
      pool.push(audio);
    }
    this.sfxPools[key] = pool;
    this.sfxPoolIndexes[key] = 0;
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
    
    // Mở khóa BGM
    unlockHTMLAudio(this.bgmAudio);
    
    // Mở khóa tất cả SFX trong Pools
    Object.values(this.sfxPools).forEach(pool => {
      pool.forEach(audio => unlockHTMLAudio(audio));
    });
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
   * Dừng tất cả mọi âm thanh (BGM và SFX), dùng khi chuyển qua màn hình khác
   */
  stopAll() {
    this.stopBGM();
    Object.values(this.sfxPools).forEach(pool => {
      pool.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    });
  }

  /**
   * Phát hiệu ứng âm thanh (SFX)

   * @param type Loại hiệu ứng ('EAT' | 'HIT' | 'GAMEOVER')
   * @param enabled Trạng thái bật/tắt hiệu ứng
   */
  playSFX(type: 'EAT' | 'HIT' | 'GAMEOVER', enabled: boolean) {
    if (!enabled) return;

    const pool = this.sfxPools[type];
    if (!pool || pool.length === 0) return;

    // Lấy thẻ Audio tiếp theo trong chuỗi xoay vòng (Round-Robin)
    const index = this.sfxPoolIndexes[type];
    const audio = pool[index];
    
    // Đảm bảo dừng hẳn tiếng cũ nếu nó chưa kịp chạy xong
    if (!audio.paused) {
      audio.pause();
    }
    
    // Nếu audio khác 0 (trường hợp bị pause giữa chừng), thì mới tua lại 0. 
    // Tránh tua lúc đang ở 0 gây đọng buffer (lag)
    if (audio.currentTime > 0) {
      audio.currentTime = 0;
    }
    
    audio.volume = 0.6;
    audio.play().catch(err => console.warn(`SFX ${type} play failed:`, err));

    // Tính toán index cho lần sử dụng tiếp theo
    this.sfxPoolIndexes[type] = (index + 1) % pool.length;
  }
}

export const soundManager = new SoundManager();
