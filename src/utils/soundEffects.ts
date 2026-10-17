/**
 * Web Audio API Ambient Soundscapes & Relaxation Chimes
 * Không phụ thuộc file âm thanh ngoài - chạy trực tiếp trên trình duyệt.
 */

class AmbientSoundManager {
  private ctx: AudioContext | null = null;
  private currentSource: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private activeSound: 'rain' | 'ocean' | 'none' = 'none';

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Tiếng chuông tĩnh tâm (Zen Chime) khi thở hoặc hoàn thành ghi nhật ký
  public playZenChime(frequency: number = 528) {
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
      // Giảm tần số nhẹ tạo độ ngân
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.99, this.ctx.currentTime + 3.0);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 3.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 3.3);
    } catch (e) {
      console.warn('Zen chime audio error:', e);
    }
  }

  // Phát âm thanh mưa rào dịu nhẹ
  public startRain() {
    this.stopAmbient();
    this.initContext();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter tiếng mưa
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start();
    this.currentSource = whiteNoise;
    this.gainNode = gain;
    this.activeSound = 'rain';
  }

  // Phát tiếng sóng biển rì rào
  public startOcean() {
    this.stopAmbient();
    this.initContext();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Pink noise nhẹ
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2 + white * 0.05) * 0.2;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    // LFO điều chế nhịp sóng (8 giây 1 đợt sóng)
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.125, this.ctx.currentTime);

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.06, this.ctx.currentTime);

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.09, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(masterGain.gain);

    noiseSource.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(this.ctx.destination);

    noiseSource.start();
    lfo.start();

    this.currentSource = noiseSource;
    this.gainNode = masterGain;
    this.activeSound = 'ocean';
  }

  public stopAmbient() {
    if (this.currentSource) {
      try {
        (this.currentSource as any).stop?.();
        this.currentSource.disconnect();
      } catch (e) {
        // ignore
      }
      this.currentSource = null;
    }
    this.activeSound = 'none';
  }

  public getActiveSound(): 'rain' | 'ocean' | 'none' {
    return this.activeSound;
  }
}

export const soundManager = new AmbientSoundManager();
