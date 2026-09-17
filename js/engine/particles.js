/**
 * EKADANTHA: Rise of the Remover
 * High-Performance Particle Engine & Screen Shake
 */

class ParticleSystem {
  constructor() {
    this.particles = [];
    this.damageTexts = [];
    this.screenShake = {
      intensity: 0,
      duration: 0,
      decay: 0.9,
      offsetX: 0,
      offsetY: 0
    };
  }

  // Trigger camera screen shake
  triggerShake(intensity = 10, duration = 0.25) {
    const shakeSetting = window.GameSave?.data?.settings?.shake !== undefined 
      ? window.GameSave.data.settings.shake 
      : 0.75;
    
    this.screenShake.intensity = intensity * shakeSetting;
    this.screenShake.duration = duration;
  }

  update(dt) {
    // Update screen shake
    if (this.screenShake.duration > 0) {
      this.screenShake.duration -= dt;
      this.screenShake.offsetX = (Math.random() * 2 - 1) * this.screenShake.intensity;
      this.screenShake.offsetY = (Math.random() * 2 - 1) * this.screenShake.intensity;
      this.screenShake.intensity *= this.screenShake.decay;
    } else {
      this.screenShake.offsetX = 0;
      this.screenShake.offsetY = 0;
      this.screenShake.intensity = 0;
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += (p.gravity || 0) * dt;

      if (p.rotation !== undefined && p.rotSpeed) {
        p.rotation += p.rotSpeed * dt;
      }

      if (p.sizeDecay) {
        p.size = Math.max(0.5, p.size - p.sizeDecay * dt);
      }
    }

    // Update floating damage texts
    for (let i = this.damageTexts.length - 1; i >= 0; i--) {
      const dtObj = this.damageTexts[i];
      dtObj.life -= dt;
      if (dtObj.life <= 0) {
        this.damageTexts.splice(i, 1);
        continue;
      }
      dtObj.y -= dtObj.vy * dt;
      dtObj.scale = Math.min(1.3, dtObj.scale + dt * 1.5);
    }
  }

  draw(ctx, camera) {
    ctx.save();

    // Render particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const screenX = p.x - camera.x;
      const screenY = p.y - camera.y;

      const alpha = Math.max(0, Math.min(1, p.life / p.maxLife));

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(screenX, screenY);

      if (p.rotation) {
        ctx.rotate(p.rotation);
      }

      if (p.type === 'spark') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'petal') {
        // Lotus or Marigold petal
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 1.6, p.size * 0.9, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'shockwave') {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.lineWidth || 3;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.type === 'ember') {
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    // Render floating combat texts
    for (let i = 0; i < this.damageTexts.length; i++) {
      const dtObj = this.damageTexts[i];
      const screenX = dtObj.x - camera.x;
      const screenY = dtObj.y - camera.y;
      const alpha = Math.max(0, Math.min(1, dtObj.life / dtObj.maxLife));

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(screenX, screenY);
      ctx.scale(dtObj.scale, dtObj.scale);

      ctx.font = 'bold 18px Cinzel, sans-serif';
      ctx.textAlign = 'center';

      // Outline shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillText(dtObj.text, 2, 2);

      ctx.fillStyle = dtObj.color;
      ctx.fillText(dtObj.text, 0, 0);

      ctx.restore();
    }

    ctx.restore();
  }

  // Spawn Hit Sparks
  spawnHitSparks(x, y, count = 12, color = '#fbbf24') {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 100 + Math.random() * 240;
      this.particles.push({
        type: 'spark',
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2.5 + Math.random() * 2.5,
        sizeDecay: 1.5,
        color: color,
        life: 0.2 + Math.random() * 0.25,
        maxLife: 0.45,
        gravity: 180
      });
    }
  }

  // Spawn Divine Expanding Shockwave Ring
  spawnShockwave(x, y, maxRadius = 90, color = '#f59e0b', duration = 0.35) {
    const shockwave = {
      type: 'shockwave',
      x: x,
      y: y,
      vx: 0,
      vy: 0,
      size: 10,
      targetRadius: maxRadius,
      color: color,
      lineWidth: 4,
      life: duration,
      maxLife: duration
    };

    // Expand size over life
    this.particles.push(shockwave);
  }

  // Spawn Floating Flower Petals
  spawnPetals(x, y, count = 8) {
    const colors = ['#f472b6', '#fb923c', '#fbbf24', '#f87171'];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        type: 'petal',
        x: x + (Math.random() * 40 - 20),
        y: y + (Math.random() * 40 - 20),
        vx: (Math.random() * 60 - 30),
        vy: 20 + Math.random() * 50,
        size: 3.5 + Math.random() * 2.5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: Math.random() * 4 - 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1.5 + Math.random() * 1.5,
        maxLife: 3.0,
        gravity: 15
      });
    }
  }

  // Spawn Ambient Floating Diya Embers
  spawnEmbers(x, y, count = 3) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        type: 'ember',
        x: x + (Math.random() * 80 - 40),
        y: y,
        vx: (Math.random() * 30 - 15),
        vy: -40 - Math.random() * 60,
        size: 2 + Math.random() * 2.5,
        color: Math.random() > 0.4 ? '#fbbf24' : '#f97316',
        life: 1.2 + Math.random() * 1.0,
        maxLife: 2.2
      });
    }
  }

  // Spawn Floating Combat Damage Numbers
  spawnDamageNumber(x, y, amount, type = 'normal') {
    let color = '#ffffff';
    let text = `${Math.round(amount)}`;

    if (type === 'heavy' || type === 'crit') {
      color = '#f97316';
      text = `💥 ${text}`;
    } else if (type === 'divine') {
      color = '#fbbf24';
      text = `✨ ${text}`;
    } else if (type === 'shield') {
      color = '#38bdf8';
      text = `🛡️ BLOCK`;
    } else if (type === 'heal') {
      color = '#22c55e';
      text = `+${text} HP`;
    }

    this.damageTexts.push({
      x: x + (Math.random() * 24 - 12),
      y: y - 20,
      vy: 60,
      text: text,
      color: color,
      scale: 0.9,
      life: 0.75,
      maxLife: 0.75
    });
  }

  clear() {
    this.particles = [];
    this.damageTexts = [];
  }
}

window.GameParticles = new ParticleSystem();
