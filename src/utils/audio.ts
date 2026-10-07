class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentMelodyTimeouts: number[] = [];
  private currentAudioElement: HTMLAudioElement | null = null;
  private audioUrlCache: Map<string, string> = new Map();

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAll();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public stopAll() {
    this.currentMelodyTimeouts.forEach(id => window.clearTimeout(id));
    this.currentMelodyTimeouts = [];
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement = null;
    }
  }

  // Marimba/Xylophone note generator
  public playMarimbaNote(freq: number, duration: number = 0.4, startTimeOffset: number = 0) {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    const t = ctx.currentTime + startTimeOffset;

    // Pleasant rounded woodblock/marimba harmonic blend
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 3, t); // harmonic chime

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc2.start(t);
    osc.stop(t + duration);
    osc2.stop(t + duration);
  }

  // Play upbeat melody for song
  public playMelody(notes: number[], noteDurationMs: number = 360, onNotePlayed?: (index: number) => void) {
    if (this.isMuted) return;
    this.currentMelodyTimeouts.forEach(id => window.clearTimeout(id));
    this.currentMelodyTimeouts = [];

    notes.forEach((freq, idx) => {
      const timeoutId = window.setTimeout(() => {
        this.playMarimbaNote(freq, noteDurationMs / 1000 * 0.95);
        if (onNotePlayed) onNotePlayed(idx);
      }, idx * noteDurationMs);
      this.currentMelodyTimeouts.push(timeoutId);
    });
  }

  // Interactive UI sound effects
  public playSound(effect: 'pop' | 'star' | 'click' | 'success' | 'brush' | 'jump' | 'applause') {
    const ctx = this.getContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    switch (effect) {
      case 'pop': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, t);
        osc.frequency.exponentialRampToValueAtTime(800, t + 0.08);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.1);
        break;
      }

      case 'star': {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          this.playMarimbaNote(freq, 0.3, i * 0.09);
        });
        break;
      }

      case 'click': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, t);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.04);
        break;
      }

      case 'jump': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.exponentialRampToValueAtTime(550, t + 0.15);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.16);
        break;
      }

      case 'brush': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(700, t);
        osc.frequency.linearRampToValueAtTime(950, t + 0.08);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.1);
        break;
      }

      case 'success': {
        const chords = [392.00, 523.25, 659.25, 783.99];
        chords.forEach((freq, i) => {
          this.playMarimbaNote(freq, 0.6, i * 0.12);
        });
        break;
      }

      case 'applause': {
        [440, 554.37, 659.25, 880].forEach((freq, i) => {
          this.playMarimbaNote(freq, 0.4, i * 0.1);
        });
        break;
      }
    }
  }

  // Authentic human-like voice of Educadito (Powered by Gemini AI TTS)
  public async speak(text: string, onEnd?: () => void, isSinging: boolean = false) {
    if (this.isMuted) {
      if (onEnd) setTimeout(onEnd, 100);
      return;
    }

    this.stopAll();

    const cleanText = text.trim();
    const cacheKey = `${cleanText}_${isSinging ? 'sing' : 'talk'}`;
    let audioUrl = this.audioUrlCache.get(cacheKey);

    try {
      if (!audioUrl) {
        const res = await fetch('/api/speak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: cleanText, isSinging }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && typeof data.audioUrl === 'string') {
            audioUrl = data.audioUrl;
            this.audioUrlCache.set(cacheKey, data.audioUrl);
          }
        }
      }

      if (audioUrl) {
        const audio = new Audio(audioUrl);
        this.currentAudioElement = audio;
        audio.onended = () => {
          this.currentAudioElement = null;
          if (onEnd) onEnd();
        };
        audio.onerror = () => {
          this.currentAudioElement = null;
          if (onEnd) onEnd();
        };
        await audio.play();
        return;
      }
    } catch (err) {
      console.warn("Audio playback error:", err);
    }

    // No robotic computer speech fallback under any circumstances
    if (onEnd) setTimeout(onEnd, 1500);
  }

  // Sing cantito line specifically
  public sing(text: string, onEnd?: () => void) {
    return this.speak(text, onEnd, true);
  }

  // Play official greeting with custom voice if uploaded, otherwise friendly child voice
  public async playEduGreeting(onEnd?: () => void) {
    if (this.isMuted) {
      if (onEnd) onEnd();
      return;
    }

    try {
      const res = await fetch('/api/custom-greeting');
      if (res.ok) {
        const data = await res.json();
        if (data.hasCustomGreeting && data.url) {
          this.stopAll();
          const audio = new Audio(data.url);
          this.currentAudioElement = audio;
          audio.onended = () => {
            this.currentAudioElement = null;
            if (onEnd) onEnd();
          };
          audio.onerror = () => {
            this.currentAudioElement = null;
            // Fallback to friendly voice if audio file fails
            this.sing('¡Hola! Soy Edu Cadito. ¡Pórtate bien y cantemos juntos!', onEnd);
          };
          await audio.play();
          return;
        }
      }
    } catch (e) {
      console.warn("Could not check custom greeting:", e);
    }

    // Default friendly child singing voice
    return this.sing('¡Hola! Soy Edu Cadito. ¡Pórtate bien y cantemos juntos!', onEnd);
  }

  // Play creator's recorded audio for a specific song if available
  public async playSongAudio(songId: string, onEnd?: () => void): Promise<boolean> {
    if (this.isMuted) {
      if (onEnd) onEnd();
      return false;
    }

    const localData = localStorage.getItem(`edu_song_audio_${songId}`);
    if (localData) {
      const audio = new Audio(localData);
      this.currentAudioElement = audio;
      audio.onended = () => {
        this.currentAudioElement = null;
        if (onEnd) onEnd();
      };
      await audio.play();
      return true;
    }

    try {
      const res = await fetch(`/custom-audio/songs/${songId}.mp3`);
      if (res.ok) {
        const audio = new Audio(`/custom-audio/songs/${songId}.mp3?t=${Date.now()}`);
        this.currentAudioElement = audio;
        audio.onended = () => {
          this.currentAudioElement = null;
          if (onEnd) onEnd();
        };
        await audio.play();
        return true;
      }
    } catch {
      // not available
    }

    return false;
  }
}

export const sound = new SoundEngine();

