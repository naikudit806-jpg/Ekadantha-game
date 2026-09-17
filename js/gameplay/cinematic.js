/**
 * EKADANTHA: Rise of the Remover
 * Opening Cinematic Director & Video Engine
 * Supports true HTML5 video file playback + 60 FPS Canvas Cinematic Sequence with camera motions,
 * volumetric golden lighting, particle swirls, divine narration subtitles & title card reveal.
 */

const CINEMATIC_TIMELINE = [
  {
    scene: 1,
    start: 0.0,
    duration: 6.0,
    subtitle: "In an ancient golden city, the sacred bells announce the auspicious festival of Ganesh Chaturthi..."
  },
  {
    scene: 2,
    start: 6.0,
    duration: 5.5,
    subtitle: "Diyas glow upon every doorstep, and the sweet aroma of modaks fills the celebratory air."
  },
  {
    scene: 3,
    start: 11.5,
    duration: 6.0,
    subtitle: "Suddenly, cosmic shadows stir. Dark clouds gather as the supernatural Vighnas awaken..."
  },
  {
    scene: 4,
    start: 17.5,
    duration: 6.5,
    subtitle: "Obstacles of fear and doubt spread across the land, seeking to extinguish the festive light."
  },
  {
    scene: 5,
    start: 24.0,
    duration: 7.0,
    subtitle: "Within the sacred sanctum sanctorum, a glorious golden radiance pierces the darkness..."
  },
  {
    scene: 6,
    start: 31.0,
    duration: 6.0,
    subtitle: "Lord Ekadanta emerges—majestic, fearless, wielding the divine Parashu of wisdom."
  },
  {
    scene: 7,
    start: 37.0,
    duration: 5.0,
    subtitle: "\"Where there is fear, there is an obstacle.\""
  },
  {
    scene: 8,
    start: 42.0,
    duration: 5.0,
    subtitle: "\"Where there is an obstacle, there must be courage.\""
  },
  {
    scene: 9,
    start: 47.0,
    duration: 5.5,
    subtitle: "\"The path before us is dark... but no darkness can stand forever.\""
  },
  {
    scene: 10,
    start: 52.5,
    duration: 6.5,
    subtitle: "\"I am Ekadanta. And I will clear the path.\""
  }
];

class CinematicDirector {
  constructor() {
    this.screen = document.getElementById('cinematic-screen');
    this.video = document.getElementById('cinematic-video');
    this.canvas = document.getElementById('cinematic-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.subtitleEl = document.getElementById('cinematic-subtitle');
    this.titleCard = document.getElementById('cinematic-title-card');
    
    this.skipBtn = document.getElementById('btn-skip-cinematic');
    this.audioBtn = document.getElementById('btn-cinematic-audio');
    this.audioIcon = document.getElementById('cinematic-audio-icon');
    this.beginBtn = document.getElementById('btn-begin-journey');

    this.isPlaying = false;
    this.elapsedTime = 0;
    this.totalDuration = 59.0;
    this.currentTimelineIndex = -1;
    this.hasFinished = false;

    this.cinematicParticles = [];
    this.initParticles();
    this.bindEvents();
  }

  initParticles() {
    this.cinematicParticles = [];
    for (let i = 0; i < 70; i++) {
      this.cinematicParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() * 40 - 20),
        vy: -20 - Math.random() * 40,
        size: 2 + Math.random() * 3.5,
        color: Math.random() > 0.3 ? '#fbbf24' : '#f97316',
        alpha: Math.random() * 0.8 + 0.2
      });
    }
  }

  bindEvents() {
    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', () => {
        this.skip();
      });
    }

    if (this.audioBtn) {
      this.audioBtn.addEventListener('click', () => {
        if (window.SoundEngine) {
          const newState = !window.SoundEngine.musicEnabled;
          window.SoundEngine.setMusicEnabled(newState);
          window.SoundEngine.setSfxEnabled(newState);
          this.audioIcon.textContent = newState ? '🔊' : '🔇';
        }
      });
    }

    if (this.beginBtn) {
      this.beginBtn.addEventListener('click', () => {
        this.finishToMenu();
      });
    }
  }

  start() {
    this.isPlaying = true;
    this.elapsedTime = 0;
    this.currentTimelineIndex = -1;
    this.hasFinished = false;
    this.screen.classList.remove('hidden');
    this.screen.classList.add('active');
    this.titleCard.classList.add('hidden');

    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    // Play shankha fanfare and drone
    if (window.SoundEngine) {
      window.SoundEngine.ensureContext();
      window.SoundEngine.playShankha();
      window.SoundEngine.playTrack('menu');
    }

    // Check if video file is loadable and play
    if (this.video) {
      this.video.src = 'assets/video/intro_cinematic.webm';
      this.video.play().catch(() => {
        // Autoplay policy or no video file -> falls back seamlessly to high-fidelity Canvas Cinematic
        console.log('[Cinematic] Canvas director active');
      });
    }
  }

  update(dt) {
    if (!this.isPlaying || this.hasFinished) return;

    this.elapsedTime += dt;

    // Check timeline entry
    let activeEntry = null;
    for (let i = 0; i < CINEMATIC_TIMELINE.length; i++) {
      const entry = CINEMATIC_TIMELINE[i];
      if (this.elapsedTime >= entry.start && this.elapsedTime < entry.start + entry.duration) {
        activeEntry = entry;
        if (this.currentTimelineIndex !== i) {
          this.currentTimelineIndex = i;
          this.onTimelineEntry(entry);
        }
        break;
      }
    }

    if (!activeEntry && this.subtitleEl) {
      this.subtitleEl.classList.remove('visible');
    }

    // Check end of cinematic
    if (this.elapsedTime >= this.totalDuration && !this.hasFinished) {
      this.showTitleCard();
    }

    // Update cinematic particles
    for (let p of this.cinematicParticles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.y < -20) {
        p.y = window.innerHeight + 20;
        p.x = Math.random() * window.innerWidth;
      }
    }
  }

  onTimelineEntry(entry) {
    if (!this.subtitleEl) return;
    this.subtitleEl.textContent = entry.subtitle;
    this.subtitleEl.classList.add('visible');

    // Subtle audio beats
    if (entry.scene === 1 || entry.scene === 5) {
      window.SoundEngine?.playTempleBell(1.0);
    } else if (entry.scene === 3) {
      window.SoundEngine?.playDholBass(0.7);
    } else if (entry.scene === 6) {
      window.SoundEngine?.playShankha();
    }
  }

  render() {
    if (!this.isPlaying || !this.ctx) return;

    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const t = this.elapsedTime;

    ctx.clearRect(0, 0, w, h);

    // ==========================================
    // 5 NARRATIVE SCENES VISUAL DIRECTION
    // ==========================================

    if (t < 11.5) {
      // SCENE 1 & 2: Ancient City Preparing for Ganesh Chaturthi
      // Deep festive twilight sky
      const grad = ctx.createRadialGradient(w / 2, h * 0.7, 50, w / 2, h * 0.7, w * 0.8);
      grad.addColorStop(0, '#78350f');
      grad.addColorStop(0.5, '#451a03');
      grad.addColorStop(1, '#09080e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Temple Mandir silhouettes
      ctx.fillStyle = '#1c1917';
      const camZoom = 1 + (t / 11.5) * 0.08;
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.scale(camZoom, camZoom);
      ctx.translate(-w / 2, -h / 2);

      for (let i = 0; i < 9; i++) {
        const tx = i * (w / 7) - 60;
        ctx.beginPath();
        ctx.moveTo(tx, h * 0.75);
        ctx.lineTo(tx + 45, h * 0.45);
        ctx.lineTo(tx + 55, h * 0.4);
        ctx.lineTo(tx + 65, h * 0.45);
        ctx.lineTo(tx + 110, h * 0.75);
        ctx.fill();
      }
      ctx.restore();

      // Glowing Diyas in rows along the foreground
      for (let i = 0; i < 18; i++) {
        const dx = i * (w / 16);
        const dy = h * 0.82 + Math.sin(i * 1.2) * 12;

        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.ellipse(dx, dy, 14, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Diya Flame with golden halo
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(dx, dy - 8, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    } else if (t < 24.0) {
      // SCENE 3 & 4: Dark Clouds Gather, Vighnas Awaken
      const stormProgress = (t - 11.5) / 12.5;
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#090812');
      grad.addColorStop(0.5, '#1e112a');
      grad.addColorStop(1, '#050308');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Dark swirling mystical clouds
      ctx.fillStyle = 'rgba(88, 28, 135, 0.25)';
      for (let c = 0; c < 6; c++) {
        const cx = (w * 0.2 * c + t * 25) % (w + 200) - 100;
        const cy = h * 0.3 + Math.sin(t * 0.8 + c) * 40;
        ctx.beginPath();
        ctx.arc(cx, cy, 140 * stormProgress, 0, Math.PI * 2);
        ctx.fill();
      }

      // Supernatural Vighna Eyes in the shadows
      ctx.fillStyle = '#dc2626';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 12;
      for (let e = 0; e < 5; e++) {
        const ex = w * 0.2 + e * (w * 0.15) + Math.sin(t * 2 + e) * 20;
        const ey = h * 0.45 + (e % 2) * 50;
        ctx.beginPath();
        ctx.arc(ex, ey, 4.5, 0, Math.PI * 2);
        ctx.arc(ex + 18, ey, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    } else {
      // SCENE 5: Divine Emergence of Ekadanta
      const divineProgress = Math.min(1, (t - 24.0) / 10.0);
      const grad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w * 0.7);
      grad.addColorStop(0, `rgba(251, 191, 36, ${0.4 * divineProgress})`);
      grad.addColorStop(0.6, `rgba(217, 119, 6, ${0.2 * divineProgress})`);
      grad.addColorStop(1, '#0c0a13');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Volumetric Golden Sunbeams
      ctx.save();
      ctx.translate(w / 2, h * 0.42);
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.18)';
      ctx.lineWidth = 12;
      for (let r = 0; r < 14; r++) {
        const angle = (r / 14) * Math.PI * 2 + t * 0.08;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * w, Math.sin(angle) * h);
        ctx.stroke();
      }
      ctx.restore();

      // Majestic Divine Silhouette of Ekadanta / Ganesha
      const gX = w / 2;
      const gY = h * 0.52;
      const gScale = 1.6;

      ctx.save();
      ctx.translate(gX, gY);
      ctx.scale(gScale, gScale);

      // Golden Prabhavali Halo
      ctx.fillStyle = 'rgba(251, 191, 36, 0.85)';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 35;
      ctx.beginPath();
      ctx.arc(0, -32, 60, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Saffron Robes & Body
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.roundRect(-24, 0, 48, 48, 8);
      ctx.fill();

      // Head & Ears
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.ellipse(-32, -26, 18, 22, -0.2, 0, Math.PI * 2);
      ctx.ellipse(32, -26, 18, 22, 0.2, 0, Math.PI * 2);
      ctx.arc(0, -26, 25, 0, Math.PI * 2);
      ctx.fill();

      // Golden Mukut
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(-20, -38);
      ctx.lineTo(20, -38);
      ctx.lineTo(12, -65);
      ctx.lineTo(0, -75);
      ctx.lineTo(-12, -65);
      ctx.closePath();
      ctx.fill();

      // Curved Trunk with Modak
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, -18);
      ctx.quadraticCurveTo(-6, -4, -18, -4);
      ctx.quadraticCurveTo(-22, -12, -16, -14);
      ctx.stroke();

      // Golden Modaka
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(-14, -16, 5, 0, Math.PI * 2);
      ctx.fill();

      // Parashu (Divine Axe of Righteousness)
      ctx.fillStyle = '#78350f';
      ctx.fillRect(28, -50, 6, 75);
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(44, -36, 20, -Math.PI / 2, Math.PI / 2);
      ctx.fill();

      ctx.restore();
    }

    // Ambient floating golden embers & flower petals
    for (let p of this.cinematicParticles) {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  }

  showTitleCard() {
    this.hasFinished = true;
    this.titleCard.classList.remove('hidden');
    if (this.subtitleEl) this.subtitleEl.classList.remove('visible');
    if (this.video) {
      try { this.video.pause(); } catch (e) {}
    }
    window.SoundEngine?.playShankha();
    window.SoundEngine?.playTempleBell(1.2);
  }

  skip() {
    if (!this.hasFinished) {
      this.showTitleCard();
    } else {
      this.finishToMenu();
    }
  }

  finishToMenu() {
    this.isPlaying = false;
    this.screen.classList.remove('active');
    this.screen.classList.add('hidden');
    if (this.video) {
      try { this.video.pause(); } catch (e) {}
    }

    // Reveal main menu
    window.UIManager?.showScreen('menu-screen');
    window.SoundEngine?.playTrack('menu');
  }
}

window.CinematicEngine = new CinematicDirector();
