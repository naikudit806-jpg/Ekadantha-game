/**
 * EKADANTHA: Rise of the Remover
 * Canvas 2D Rendering Engine with Multi-Layered Parallax,
 * Dynamic Festival Lighting, Camera Tracking & Atmosphere
 */

class Renderer {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.camera = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      minX: 0,
      maxX: 2400,
      minY: 0,
      maxY: 650,
      viewportWidth: this.width,
      viewportHeight: this.height
    };

    this.ambientPetals = [];
    this.initAmbientAtmosphere();
    this.handleResize();

    window.addEventListener('resize', () => this.handleResize());
  }

  handleResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);

    this.camera.viewportWidth = this.width;
    this.camera.viewportHeight = this.height;
  }

  initAmbientAtmosphere() {
    this.ambientPetals = [];
    for (let i = 0; i < 45; i++) {
      this.ambientPetals.push({
        x: Math.random() * 3000,
        y: Math.random() * 800,
        speedX: -20 - Math.random() * 40,
        speedY: 25 + Math.random() * 45,
        size: 3 + Math.random() * 3,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: Math.random() * 2 - 1,
        color: ['#fbbf24', '#fb923c', '#f472b6', '#f87171'][Math.floor(Math.random() * 4)]
      });
    }
  }

  updateCamera(targetX, targetY, dt) {
    // Center camera on target
    const desiredX = targetX - this.width / 2;
    const desiredY = targetY - this.height / 2;

    // Smooth Lerp
    this.camera.x += (desiredX - this.camera.x) * 6 * dt;
    this.camera.y += (desiredY - this.camera.y) * 4 * dt;

    // Clamp camera within level bounds
    this.camera.x = Math.max(this.camera.minX, Math.min(this.camera.maxX - this.width, this.camera.x));
    this.camera.y = Math.max(this.camera.minY, Math.min(this.camera.maxY - this.height, this.camera.y));

    // Update ambient petals
    for (let p of this.ambientPetals) {
      p.x += p.speedX * dt;
      p.y += p.speedY * dt;
      p.rot += p.rotSpeed * dt;
      if (p.y > 800) {
        p.y = -20;
        p.x = Math.random() * 3000;
      }
      if (p.x < 0) {
        p.x = 3000;
      }
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  // Draw complete background based on active Chapter (1 to 5)
  drawBackground(chapterIndex = 1) {
    const ctx = this.ctx;
    const camX = this.camera.x;
    const camY = this.camera.y;

    // Layer 0: Sky Gradient
    this.drawSky(chapterIndex);

    // Layer 1: Distant Parallax Silhouettes (Factor 0.15)
    this.drawDistantLayer(chapterIndex, camX * 0.15);

    // Layer 2: Midground Architectural / Natural Elements (Factor 0.45)
    this.drawMidgroundLayer(chapterIndex, camX * 0.45);

    // Layer 3: Main Battle Floor & Pillars (Factor 1.0)
    this.drawForegroundFloor(chapterIndex, camX, camY);
  }

  drawSky(ch) {
    const ctx = this.ctx;
    const grad = ctx.createLinearGradient(0, 0, 0, this.height);

    if (ch === 1) {
      // Sanctum Temple: Warm golden temple night
      grad.addColorStop(0, '#1c1328');
      grad.addColorStop(0.6, '#311b38');
      grad.addColorStop(1, '#6b2d18');
    } else if (ch === 2) {
      // Forest of Durva: Mystical deep emerald night with moonlight
      grad.addColorStop(0, '#061a14');
      grad.addColorStop(0.6, '#0f3829');
      grad.addColorStop(1, '#1b4d3e');
    } else if (ch === 3) {
      // City of Pandals: Vibrant festive vermilion twilight
      grad.addColorStop(0, '#1a0b1e');
      grad.addColorStop(0.5, '#4a1525');
      grad.addColorStop(1, '#9a3412');
    } else if (ch === 4) {
      // Shadow Fortress: Deep cosmic purple & obsidian
      grad.addColorStop(0, '#080511');
      grad.addColorStop(0.6, '#180d2b');
      grad.addColorStop(1, '#3b0764');
    } else {
      // Visarjan River: Glorious golden sunset over the river
      grad.addColorStop(0, '#431407');
      grad.addColorStop(0.4, '#9a3412');
      grad.addColorStop(0.8, '#ea580c');
      grad.addColorStop(1, '#fbbf24');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);
  }

  drawDistantLayer(ch, offsetX) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(15, 10, 25, 0.45)';

    const horizonY = this.height * 0.65;

    // Distant silhouettes
    for (let i = -1; i < 15; i++) {
      const x = i * 260 - (offsetX % 260);

      if (ch === 1 || ch === 3) {
        // Temple Mandir spires (Shikhara)
        ctx.beginPath();
        ctx.moveTo(x, horizonY);
        ctx.lineTo(x + 40, horizonY - 140);
        ctx.lineTo(x + 50, horizonY - 160); // Kalash peak
        ctx.lineTo(x + 60, horizonY - 140);
        ctx.lineTo(x + 100, horizonY);
        ctx.fill();
      } else if (ch === 2) {
        // Sacred giant banyan & durva trees
        ctx.beginPath();
        ctx.arc(x + 50, horizonY - 80, 75, 0, Math.PI * 2);
        ctx.arc(x + 110, horizonY - 110, 90, 0, Math.PI * 2);
        ctx.fill();
      } else if (ch === 4) {
        // Jagged fortress ramparts
        ctx.fillRect(x, horizonY - 120, 110, 120);
        ctx.fillRect(x + 20, horizonY - 160, 40, 160);
      } else {
        // Visarjan riverbank silhouettes with holy flags
        ctx.beginPath();
        ctx.moveTo(x, horizonY);
        ctx.lineTo(x + 50, horizonY - 110);
        ctx.lineTo(x + 100, horizonY);
        ctx.fill();
        // Flag
        ctx.fillRect(x + 48, horizonY - 150, 4, 40);
        ctx.fillStyle = 'rgba(234, 88, 12, 0.5)';
        ctx.beginPath();
        ctx.moveTo(x + 52, horizonY - 150);
        ctx.lineTo(x + 80, horizonY - 135);
        ctx.lineTo(x + 52, horizonY - 120);
        ctx.fill();
        ctx.fillStyle = 'rgba(15, 10, 25, 0.45)';
      }
    }

    ctx.restore();
  }

  drawMidgroundLayer(ch, offsetX) {
    const ctx = this.ctx;
    ctx.save();
    const floorY = 560 - this.camera.y;

    for (let i = -1; i < 12; i++) {
      const x = i * 360 - (offsetX % 360);

      if (ch === 1) {
        // Carved temple pillars & glowing hanging lamps
        ctx.fillStyle = '#261828';
        ctx.fillRect(x, floorY - 260, 45, 260);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(x + 5, floorY - 250, 35, 8); // pillar capital

        // Hanging Diya Lamp
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 22, floorY - 260);
        ctx.lineTo(x + 22, floorY - 190);
        ctx.stroke();

        // Glowing flame
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(x + 22, floorY - 185, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      } else if (ch === 2) {
        // Glowing sacred flora & mossy stone torana
        ctx.fillStyle = '#0f291e';
        ctx.beginPath();
        ctx.arc(x + 60, floorY - 70, 60, Math.PI, Math.PI * 2);
        ctx.fill();

        // Floating fireflies
        ctx.fillStyle = '#4ade80';
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(x + 80 + Math.sin(Date.now() * 0.002 + i) * 20, floorY - 120, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      } else if (ch === 3) {
        // Festive Pandal Arches with marigold flower torans
        ctx.fillStyle = '#3a121d';
        ctx.fillRect(x, floorY - 240, 20, 240);
        ctx.fillRect(x + 140, floorY - 240, 20, 240);
        // Arch
        ctx.strokeStyle = '#fb923c';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(x + 80, floorY - 230, 70, Math.PI, Math.PI * 2);
        ctx.stroke();
      } else if (ch === 4) {
        // Dark stone monoliths with glowing runes
        ctx.fillStyle = '#1c1429';
        ctx.fillRect(x + 20, floorY - 220, 50, 220);
        // Rune glow
        ctx.strokeStyle = '#c084fc';
        ctx.shadowColor = '#9333ea';
        ctx.shadowBlur = 12;
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 35, floorY - 160, 20, 40);
        ctx.shadowBlur = 0;
      } else {
        // Visarjan riverbank boats & floating lotus lamps
        ctx.fillStyle = '#38160c';
        ctx.beginPath();
        ctx.ellipse(x + 100, floorY - 15, 60, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        // Water reflection glow
        ctx.fillStyle = 'rgba(251, 191, 36, 0.25)';
        ctx.fillRect(x + 40, floorY - 5, 120, 20);
      }
    }

    ctx.restore();
  }

  drawForegroundFloor(ch, camX, camY) {
    const ctx = this.ctx;
    const floorY = 560 - camY;

    ctx.save();

    // Battle Ground Base
    let floorColor = '#1e1424';
    let trimColor = '#d97706';

    if (ch === 2) {
      floorColor = '#0d2419';
      trimColor = '#22c55e';
    } else if (ch === 3) {
      floorColor = '#2d111b';
      trimColor = '#ea580c';
    } else if (ch === 4) {
      floorColor = '#130d21';
      trimColor = '#9333ea';
    } else if (ch === 5) {
      floorColor = '#2e1208';
      trimColor = '#f59e0b';
    }

    ctx.fillStyle = floorColor;
    ctx.fillRect(0, floorY, this.width, this.height - floorY + 200);

    // Ornate sacred border along the battle floor edge
    ctx.strokeStyle = trimColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, floorY);
    ctx.lineTo(this.width, floorY);
    ctx.stroke();

    // Decorative Rangoli / Floor Pattern tiles
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.2)';
    ctx.lineWidth = 2;
    for (let x = - (camX % 120); x < this.width + 120; x += 120) {
      ctx.strokeRect(x, floorY + 6, 110, 40);
      // Center lotus diamond in tile
      ctx.beginPath();
      ctx.moveTo(x + 55, floorY + 12);
      ctx.lineTo(x + 85, floorY + 26);
      ctx.lineTo(x + 55, floorY + 40);
      ctx.lineTo(x + 25, floorY + 26);
      ctx.closePath();
      ctx.stroke();
    }

    ctx.restore();
  }

  // Draw floating atmospheric petals
  drawAtmosphere() {
    const ctx = this.ctx;
    ctx.save();
    for (let p of this.ambientPetals) {
      ctx.save();
      ctx.translate(p.x - this.camera.x, p.y - this.camera.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 1.5, p.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }
}

window.GameRenderer = new Renderer();
