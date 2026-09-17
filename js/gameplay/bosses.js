/**
 * EKADANTHA: Rise of the Remover
 * Boss System: 5 Unique Chapter Bosses with Multi-Phase Attack Patterns
 */

class ChapterBoss {
  constructor(chapterIndex, x = 1600, y = 480) {
    this.chapterIndex = chapterIndex;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.facingRight = false;
    this.isGrounded = true;

    this.isDead = false;
    this.phase = 1;
    this.state = 'IDLE'; // IDLE, ATTACK_1, ATTACK_2, SPECIAL, ENRAGE
    this.stateTimer = 0;
    this.attackCooldown = 2.0;

    this.setupBossData();
    this.updateHUD();
  }

  setupBossData() {
    switch (this.chapterIndex) {
      case 1:
        this.name = "DHARANI VIGHNA";
        this.title = "Stone Guardian of Doubt";
        this.width = 96;
        this.height = 120;
        this.maxHp = 500;
        this.hp = 500;
        this.color = '#52525b';
        this.rewardCoins = 300;
        this.unlockPower = 'vakratunda_sweep';
        break;

      case 2:
        this.name = "ARANYA VIGHNA";
        this.title = "Warden of the Thorny Maze";
        this.width = 105;
        this.height = 130;
        this.maxHp = 750;
        this.hp = 750;
        this.color = '#15803d';
        this.rewardCoins = 450;
        this.unlockPower = 'siddhi_shield';
        break;

      case 3:
        this.name = "KOLHAL VIGHNA";
        this.title = "Commander of Discord";
        this.width = 90;
        this.height = 115;
        this.maxHp = 1100;
        this.hp = 1100;
        this.color = '#991b1b';
        this.rewardCoins = 600;
        this.unlockPower = 'ekadanta_strike';
        break;

      case 4:
        this.name = "CHHAYA VIGHNA";
        this.title = "Obsidian Citadel Titan";
        this.width = 115;
        this.height = 140;
        this.maxHp = 1500;
        this.hp = 1500;
        this.color = '#3b0764';
        this.rewardCoins = 800;
        this.unlockPower = 'mushika_dash';
        break;

      case 5:
      default:
        this.name = "MAHA VIGHNA";
        this.title = "The Primordial Obstacle";
        this.width = 128;
        this.height = 155;
        this.maxHp = 2200;
        this.hp = 2200;
        this.color = '#18181b';
        this.rewardCoins = 1500;
        this.unlockPower = 'vighna_breaker';
        break;
    }
  }

  takeDamage(amount, damageType = 'normal', attackerX = null) {
    if (this.isDead) return;

    this.hp -= amount;
    window.GameParticles?.spawnDamageNumber(this.x, this.y - 40, amount, damageType);
    window.SoundEngine?.playHitImpact();

    // Check Phase Shift
    if (this.phase === 1 && this.hp <= this.maxHp * 0.5) {
      this.phase = 2;
      window.GameParticles?.triggerShake(15, 0.4);
      window.SoundEngine?.playTempleBell(0.6);
      window.GameParticles?.spawnShockwave(this.x, this.y, 220, '#dc2626', 0.5);
    } else if (this.chapterIndex === 5 && this.phase === 2 && this.hp <= this.maxHp * 0.2) {
      this.phase = 3;
      window.GameParticles?.triggerShake(20, 0.6);
      window.SoundEngine?.playShankha();
    }

    this.updateHUD();

    if (this.hp <= 0) {
      this.die();
    }
  }

  die() {
    this.isDead = true;
    this.hideHUD();
    window.GameParticles?.triggerShake(25, 0.8);
    window.GameParticles?.spawnHitSparks(this.x, this.y, 40, '#fbbf24');
    window.SoundEngine?.playTempleBell(1.5);
    window.SoundEngine?.playShankha();

    // Spawn massive coin reward
    window.EnemyManager?.spawnCoins(this.x, this.y, this.rewardCoins);

    // Unlock reward power if any
    if (this.unlockPower) {
      window.GameSave?.unlockPower(this.unlockPower);
    }
  }

  update(dt, player, projectiles) {
    if (this.isDead) return;

    this.stateTimer += dt;
    if (this.attackCooldown > 0) this.attackCooldown -= dt;

    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.hypot(dx, dy);

    this.facingRight = dx > 0;

    // Movement toward player
    const moveSpeed = this.phase >= 2 ? 110 : 85;
    if (dist > 110) {
      this.vx = (this.facingRight ? 1 : -1) * moveSpeed;
    } else {
      this.vx = 0;
    }

    // Boss Attack Patterns
    if (this.attackCooldown <= 0) {
      this.executeBossAttack(player, projectiles, dist);
      this.attackCooldown = this.phase >= 2 ? 1.8 : 2.6;
    }

    window.GamePhysics?.updateEntity(this, dt, [], { minX: 100, maxX: 2300 });
  }

  executeBossAttack(player, projectiles, dist) {
    // Attack 1: Ground Slam Shockwave
    if (dist < 160 || Math.random() < 0.45) {
      player.takeDamage(22 + this.chapterIndex * 4, this.x);
      window.GameParticles?.spawnShockwave(this.x, this.y + 40, 140, this.color, 0.35);
      window.GameParticles?.triggerShake(12, 0.3);
      window.SoundEngine?.playAttackHeavy();
      return;
    }

    // Attack 2: Ranged Projectile Volley
    const count = this.phase >= 2 ? 3 : 1;
    for (let i = 0; i < count; i++) {
      const angle = Math.atan2(player.y - this.y, player.x - this.x) + (i - 1) * 0.25;
      projectiles.push({
        x: this.x,
        y: this.y - 20,
        vx: Math.cos(angle) * 350,
        vy: Math.sin(angle) * 350,
        damage: 16 + this.chapterIndex * 3,
        radius: 10,
        color: '#dc2626',
        life: 3.5
      });
    }
    window.SoundEngine?.playAttackLight();
  }

  updateHUD() {
    const bossHud = document.getElementById('boss-hud');
    const bossName = document.getElementById('boss-name');
    const phaseTag = document.getElementById('boss-phase-tag');
    const hpFill = document.getElementById('boss-hp-fill');

    if (!bossHud) return;

    bossHud.classList.remove('hidden');
    if (bossName) bossName.textContent = this.name;
    if (phaseTag) phaseTag.textContent = `PHASE ${this.phase}`;

    if (hpFill) {
      const pct = Math.max(0, Math.min(100, (this.hp / this.maxHp) * 100));
      hpFill.style.width = `${pct}%`;
    }
  }

  hideHUD() {
    const bossHud = document.getElementById('boss-hud');
    if (bossHud) bossHud.classList.add('hidden');
  }

  draw(ctx, camera) {
    if (this.isDead) return;

    const screenX = this.x - camera.x;
    const screenY = this.y - camera.y;

    ctx.save();
    ctx.translate(screenX, screenY);

    if (!this.facingRight) {
      ctx.scale(-1, 1);
    }

    // Boss Shadow Aura
    ctx.shadowColor = this.phase >= 2 ? '#ef4444' : this.color;
    ctx.shadowBlur = 24;

    // Colossal Body
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.roundRect(-this.width / 2, -this.height / 2, this.width, this.height, 14);
    ctx.fill();

    // Dark Spikes & Horns of the Vighna
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.moveTo(-25, -this.height / 2);
    ctx.lineTo(-40, -this.height / 2 - 30);
    ctx.lineTo(-10, -this.height / 2);
    ctx.moveTo(25, -this.height / 2);
    ctx.lineTo(40, -this.height / 2 - 30);
    ctx.lineTo(10, -this.height / 2);
    ctx.fill();

    // Fiery Glowing Eyes of the Obstacle Titan
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(14, -this.height / 4, 6, 0, Math.PI * 2);
    ctx.arc(32, -this.height / 4, 6, 0, Math.PI * 2);
    ctx.fill();

    // Chest Core
    ctx.fillStyle = this.phase >= 2 ? '#ef4444' : '#a855f7';
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

window.ChapterBoss = ChapterBoss;
