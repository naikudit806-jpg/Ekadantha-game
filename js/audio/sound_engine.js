/**
 * EKADANTHA: Rise of the Remover
 * Procedural Web Audio API Engine
 * Synthesizes authentic Indian festival instruments:
 * Dhol-Tasha rhythms, Shankha (Conch), Temple Bells, Tanpura drone, Sitar notes,
 * plus punchy mythological combat SFX. Zero external copyrighted audio dependencies!
 */

class MythologicalAudioEngine {
  constructor() {
    this.ctx = null;
    this.isInitialized = false;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    
    this.currentTrack = null;
    this.musicLoopTimer = null;
    this.tanpuraDroneNodes = [];
    
    this.volume = 0.8;
    this.musicEnabled = true;
    this.sfxEnabled = true;

    // Load initial settings from save if present
    if (window.GameSave && window.GameSave.data && window.GameSave.data.settings) {
      const s = window.GameSave.data.settings;
      this.volume = s.volume !== undefined ? s.volume : 0.8;
      this.musicEnabled = s.music !== undefined ? s.music : true;
      this.sfxEnabled = s.sfx !== undefined ? s.sfx : true;
    }
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.musicEnabled ? 0.6 : 0, this.ctx.currentTime);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxEnabled ? 0.75 : 0, this.ctx.currentTime);

      this.musicGain.connect(this.masterGain);
      this.sfxGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.isInitialized = true;
      console.log('[AudioEngine] Web Audio initialized successfully');
    } catch (e) {
      console.warn('[AudioEngine] Could not initialize Web Audio', e);
    }
  }

  ensureContext() {
    if (!this.isInitialized) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMasterVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  setMusicEnabled(enabled) {
    this.musicEnabled = !!enabled;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(this.musicEnabled ? 0.6 : 0, this.ctx.currentTime, 0.05);
    }
    if (!this.musicEnabled) {
      this.stopMusic();
    }
  }

  setSfxEnabled(enabled) {
    this.sfxEnabled = !!enabled;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setTargetAtTime(this.sfxEnabled ? 0.75 : 0, this.ctx.currentTime, 0.05);
    }
  }

  // ==========================================
  // SFX: Indian Classical & Mythological Combat
  // ==========================================

  // Temple Bell: High harmonic clusters with long exponential decay
  playTempleBell(pitch = 1) {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const baseFreqs = [1200, 1580, 2400, 3160, 4800];
    
    baseFreqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * pitch, t);

      const amp = 0.15 / (idx + 1);
      gain.gain.setValueAtTime(amp, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(t);
      osc.stop(t + 2.5);
    });
  }

  // Shankha (Conch Shell): Deep resonant spiritual trumpet drone
  playShankha() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const dur = 3.2;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'triangle';

    // Characteristic conch glide
    osc1.frequency.setValueAtTime(220, t);
    osc1.frequency.linearRampToValueAtTime(293.66, t + 0.4); // Glide up to D4
    osc1.frequency.exponentialRampToValueAtTime(220, t + dur);

    osc2.frequency.setValueAtTime(440, t);
    osc2.frequency.linearRampToValueAtTime(587.33, t + 0.4);
    osc2.frequency.exponentialRampToValueAtTime(440, t + dur);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(500, t);
    filter.Q.setValueAtTime(4.0, t);

    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + dur);
    osc2.stop(t + dur);
  }

  // Dhol Bass Strike (Deep Indian drum)
  playDholBass(pitchMod = 1) {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140 * pitchMod, t);
    osc.frequency.exponentialRampToValueAtTime(45 * pitchMod, t + 0.28);

    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.38);
  }

  // Tasha Rim Snap (Sharp festival percussion)
  playTashaSnap() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1800, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(t);
    noise.stop(t + 0.09);
  }

  // Light Divine Attack Whoosh & Slash
  playAttackLight() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(480, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.12);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, t);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  // Heavy Parashu Slam
  playAttackHeavy() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    this.playDholBass(0.75);
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.25);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.32);
  }

  // Hit Impact on Vighna
  playHitImpact() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.1);

    gain.gain.setValueAtTime(0.45, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.14);
  }

  // Dodge / Mushika Dash Whizz
  playDodge() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.linearRampToValueAtTime(880, t + 0.18);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.24);
  }

  // Divine Power Casts
  playPowerCast(powerId) {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    switch (powerId) {
      case 'vakratunda_sweep':
        this.playTempleBell(1.2);
        this.playDholBass(1.2);
        break;
      case 'siddhi_shield':
        this.playTempleBell(1.5);
        this.playTempleBell(2.0);
        break;
      case 'ekadanta_strike':
        this.playAttackHeavy();
        this.playShankha();
        break;
      case 'modaka_burst':
        this.playTempleBell(1.8);
        this.playTempleBell(1.4);
        break;
      case 'mushika_dash':
        this.playDodge();
        break;
      case 'vighna_breaker':
        this.playShankha();
        this.playDholBass(0.6);
        this.playTempleBell(0.8);
        break;
      default:
        this.playTempleBell(1.0);
    }
  }

  // Modak Coin Pickup (High golden sparkle chime)
  playCoinPickup() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, t); // B5
    osc.frequency.setValueAtTime(1318.51, t + 0.06); // E6

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.22);
  }

  // UI Button Click
  playButtonClick() {
    if (!this.sfxEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.05);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(t);
    osc.stop(t + 0.07);
  }

  // ==========================================
  // Music: Procedural Festival & Mythological Loops
  // ==========================================

  playTrack(trackName) {
    if (!this.musicEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;
    if (this.currentTrack === trackName) return;

    this.stopMusic();
    this.currentTrack = trackName;

    // Start Tanpura harmonic drone
    this.startTanpuraDrone();

    // Start rhythmic step loops based on track
    let bpm = 100;
    if (trackName === 'combat') bpm = 128;
    if (trackName === 'boss') bpm = 138;
    if (trackName === 'victory') bpm = 112;
    if (trackName === 'menu') bpm = 92;

    const stepDuration = 60 / bpm / 2; // 8th notes
    let stepIndex = 0;

    const stepLoop = () => {
      if (!this.musicEnabled || this.currentTrack !== trackName) return;
      
      // Dhol-Tasha festive rhythm patterns
      if (trackName === 'combat' || trackName === 'boss') {
        // Dhol on 0, 3, 4, 6
        if ([0, 3, 4, 6].includes(stepIndex % 8)) {
          this.playDholBass(stepIndex % 8 === 0 ? 1 : 1.2);
        }
        // Tasha snap on 2, 5, 7
        if ([2, 5, 7].includes(stepIndex % 8)) {
          this.playTashaSnap();
        }
      } else if (trackName === 'menu') {
        // Gentle meditative temple rhythm
        if (stepIndex % 16 === 0) {
          this.playTempleBell(1.0);
        }
        if (stepIndex % 8 === 0) {
          this.playDholBass(0.9);
        }
      } else if (trackName === 'victory') {
        // Triumphant joyous Dhol Tasha
        if (stepIndex % 4 === 0) {
          this.playDholBass(1.1);
        }
        if (stepIndex % 2 === 1) {
          this.playTashaSnap();
        }
        if (stepIndex % 16 === 0) {
          this.playTempleBell(1.4);
        }
      }

      stepIndex++;
      this.musicLoopTimer = setTimeout(stepLoop, stepDuration * 1000);
    };

    stepLoop();
  }

  startTanpuraDrone() {
    if (!this.ctx || !this.musicGain) return;
    this.stopTanpuraDrone();

    const t = this.ctx.currentTime;
    // Sa-Pa harmonic chord (C3: 130.81Hz, G3: 196.00Hz, C4: 261.63Hz)
    const notes = [130.81, 196.00, 261.63];

    notes.forEach(freq => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);

      // Lowpass filter for warm acoustic tanpura resonance
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, t);

      gain.gain.setValueAtTime(0.08, t);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(t);
      this.tanpuraDroneNodes.push({ osc, gain });
    });
  }

  stopTanpuraDrone() {
    this.tanpuraDroneNodes.forEach(({ osc, gain }) => {
      try {
        osc.stop();
        osc.disconnect();
        gain.disconnect();
      } catch (e) {}
    });
    this.tanpuraDroneNodes = [];
  }

  stopMusic() {
    if (this.musicLoopTimer) {
      clearTimeout(this.musicLoopTimer);
      this.musicLoopTimer = null;
    }
    this.stopTanpuraDrone();
    this.currentTrack = null;
  }
}

window.SoundEngine = new MythologicalAudioEngine();
