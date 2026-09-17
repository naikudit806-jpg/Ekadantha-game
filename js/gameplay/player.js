/**
 * EKADANTHA: Rise of the Remover
 * Player Controller: Lord Ganesha / Ekadanta
 * Portrayed with majestic reverence, golden mukut, divine trunk, radiant halo, and sacred parashu.
 */

class PlayerController {
  constructor() {
    this.x = 200;
    this.y = 480;
    this.vx = 0;
    this.vy = 0;
    this.width = 64;
    this.height = 92;

    this.facingRight = true;
    this.isGrounded = true;
    this.state = 'IDLE'; // IDLE, WALK, JUMP, ATTACK_LIGHT, ATTACK_HEAVY, DODGE
    this.stateTime = 0;

    // Upgradable base stats
    this.baseMaxHp = 100;
    this.hp = 100;
    this.maxHp = 100;
    this.prana = 0; // Ultimate charge (0 - 100)

    this.hasShield = false;
    this.shieldDuration = 0;
    this.invincibleTime = 0;

    // Combo attack step (1, 2, 3)
    this.attackChain = 0;
    this.attackHitbox = null;
    this.attackHasHit = false;

    this.applyUpgrades();
  }

  applyUpgrades() {
    const upgrades = window.GameSave?.data?.upgrades || {
      attack: 1, defense: 1, health: 1, speed: 1, power: 1, ultimate: 1
    };

    this.maxHp = this.baseMaxHp + (upgrades.health - 1) * 30;
    this.hp = Math.min(this.hp, this.maxHp);
  }

  reset(x = 200, y = 480) {
    this.applyUpgrades();
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.hp = this.maxHp;
    this.prana = 25; // Starter prana
    this.state = 'IDLE';
    this.stateTime = 0;
    this.facingRight = true;
    this.hasShield = false;
    this.shieldDuration = 0;
    this.invincibleTime = 0;
    this.attackHitbox = null;
    this.attackHasHit = false;
  }

  getAttackMultiplier() {
    const atkUpgrade = window.GameSave?.data?.upgrades?.attack || 1;
    const baseMult = 1 + (atkUpgrade - 1) * 0.15;
    const comboMult = window.CombatEngine?.getComboMultiplier() || 1;
    return baseMult * comboMult;
  }

  getDefenseMultiplier() {
    const defUpgrade = window.GameSave?.data?.upgrades?.defense || 1;
    // Reduces damage taken
    return Math.max(0.35, 1 - (defUpgrade - 1) * 0.1);
  }

  getSpeed() {
    const spdUpgrade = window.GameSave?.data?.upgrades?.speed || 1;
    return 280 + (spdUpgrade - 1) * 35;
  }

  chargePrana(amount) {
    const ultUpgrade = window.GameSave?.data?.upgrades?.ultimate || 1;
    const bonus = 1 + (ultUpgrade - 1) * 0.2;
    this.prana = Math.min(100, this.prana + amount * bonus);
  }

  heal(amount) {
    this.hp = Math.min(this.maxHp, this.hp + amount);
    window.GameParticles?.spawnDamageNumber(this.x, this.y, amount, 'heal');
  }

  takeDamage(amount, sourceX = null) {
    if (this.invincibleTime > 0) return 0;
    if (this.hasShield) {
      window.GameParticles?.spawnDamageNumber(this.x, this.y, 0, 'shield');
      window.SoundEngine?.playTempleBell(2.0);
      return 0;
    }

    const actualDamage = Math.max(1, amount * this.getDefenseMultiplier());
    this.hp = Math.max(0, this.hp - actualDamage);
    this.invincibleTime = 0.6; // i-frames

    // Knockback
    if (sourceX !== null) {
      const dir = this.x > sourceX ? 1 : -1;
      this.vx = dir * 160;
      this.vy = -120;
    }

    window.GameParticles?.spawnDamageNumber(this.x, this.y, actualDamage, 'normal');
    window.GameParticles?.spawnHitSparks(this.x, this.y, 8, '#ef4444');
    window.GameParticles?.triggerShake(8, 0.2);

    if (window.CombatEngine) {
      window.CombatEngine.resetCombo();
    }

    return actualDamage;
  }

  update(dt, input, enemies, boss) {
    this.stateTime += dt;
    if (this.invincibleTime > 0) this.invincibleTime -= dt;

    // Movement speeds
    const moveSpeed = this.getSpeed();

    // Check actions if not locked in attack or dodge
    const isAttacking = this.state.startsWith('ATTACK');
    const isDodging = this.state === 'DODGE';

    if (!isDodging) {
      // Horizontal movement
      if (Math.abs(input.axisX) > 0.15 && !isAttacking) {
        this.vx = input.axisX * moveSpeed;
        this.facingRight = input.axisX > 0;
        if (this.isGrounded) this.state = 'WALK';
      } else if (!isAttacking) {
        this.vx *= 0.8;
        if (this.isGrounded) this.state = 'IDLE';
      }

      // Jump
      if (input.consumeAction('jump') && this.isGrounded && !isAttacking) {
        this.vy = -540;
        this.isGrounded = false;
        this.state = 'JUMP';
        window.GameParticles?.spawnPetals(this.x, this.y + 40, 6);
      }

      // Dodge Roll
      if (input.consumeAction('dodge') && !isDodging) {
        this.state = 'DODGE';
        this.stateTime = 0;
        this.invincibleTime = 0.45;
        this.vx = (this.facingRight ? 1 : -1) * 440;
        window.SoundEngine?.playDodge();
        window.GameParticles?.spawnPetals(this.x, this.y, 10);
      }

      // Light Attack
      if (input.consumeAction('attack') && !isAttacking) {
        this.startAttack(false);
      }

      // Heavy Attack
      if (input.consumeAction('heavy') && !isAttacking) {
        this.startAttack(true);
      }

      // Divine Powers (1 - 6)
      if (input.consumeAction('power1')) window.PowersEngine?.cast('vakratunda_sweep', this, enemies, boss);
      if (input.consumeAction('power2')) window.PowersEngine?.cast('siddhi_shield', this, enemies, boss);
      if (input.consumeAction('power3')) window.PowersEngine?.cast('ekadanta_strike', this, enemies, boss);
      if (input.consumeAction('power4')) window.PowersEngine?.cast('modaka_burst', this, enemies, boss);
      if (input.consumeAction('power5')) window.PowersEngine?.cast('mushika_dash', this, enemies, boss);
      if (input.consumeAction('ultimate')) window.PowersEngine?.cast('vighna_breaker', this, enemies, boss);
    }

    // Handle Active Dodge duration
    if (this.state === 'DODGE') {
      if (this.stateTime > 0.4) {
        this.state = 'IDLE';
      }
    }

    // Handle Active Attack timing & hit collision
    if (isAttacking) {
      this.updateAttack(dt, enemies, boss);
    }

    // Update Physics
    window.GamePhysics?.updateEntity(this, dt, [], { minX: 60, maxX: 2340 });

    // Update HUD bars
    this.updateHUD();
  }

  startAttack(isHeavy = false) {
    if (isHeavy) {
      this.state = 'ATTACK_HEAVY';
      this.stateTime = 0;
      this.attackHasHit = false;
      this.vx = (this.facingRight ? 1 : -1) * 80;
      window.SoundEngine?.playAttackHeavy();
    } else {
      this.attackChain = (this.attackChain % 3) + 1;
      this.state = `ATTACK_LIGHT_${this.attackChain}`;
      this.stateTime = 0;
      this.attackHasHit = false;
      this.vx = (this.facingRight ? 1 : -1) * 120;
      window.SoundEngine?.playAttackLight();
    }
  }

  updateAttack(dt, enemies, boss) {
    const isHeavy = this.state === 'ATTACK_HEAVY';
    const attackDuration = isHeavy ? 0.42 : 0.28;

    // Check hit window
    if (!this.attackHasHit && this.stateTime >= 0.08 && this.stateTime <= attackDuration * 0.8) {
      const dir = this.facingRight ? 1 : -1;
      const hitRange = isHeavy ? 110 : 80;
      const hitBox = {
        x: this.facingRight ? this.x : this.x - hitRange,
        y: this.y - 45,
        width: hitRange,
        height: 90
      };

      const baseDmg = isHeavy ? 55 : (22 + this.attackChain * 4);
      const totalDmg = baseDmg * this.getAttackMultiplier();

      let didHit = false;

      // Check enemies
      for (let enemy of enemies) {
        if (enemy.isDead) continue;
        const enemyBox = {
          x: enemy.x - enemy.width / 2,
          y: enemy.y - enemy.height / 2,
          width: enemy.width,
          height: enemy.height
        };

        if (window.GamePhysics?.checkOverlap(hitBox, enemyBox)) {
          enemy.takeDamage(totalDmg, isHeavy ? 'heavy' : 'normal', this.x);
          didHit = true;
        }
      }

      // Check boss
      if (boss && !boss.isDead) {
        const bossBox = {
          x: boss.x - boss.width / 2,
          y: boss.y - boss.height / 2,
          width: boss.width,
          height: boss.height
        };
        if (window.GamePhysics?.checkOverlap(hitBox, bossBox)) {
          boss.takeDamage(totalDmg, isHeavy ? 'heavy' : 'normal', this.x);
          didHit = true;
        }
      }

      if (didHit) {
        this.attackHasHit = true;
        window.CombatEngine?.registerHit(totalDmg, isHeavy);
        window.GameParticles?.spawnHitSparks(this.x + dir * 55, this.y, isHeavy ? 18 : 10, isHeavy ? '#f97316' : '#fbbf24');
        window.GameParticles?.triggerShake(isHeavy ? 10 : 4, isHeavy ? 0.2 : 0.1);
      }
    }

    if (this.stateTime >= attackDuration) {
      this.state = 'IDLE';
    }
  }

  updateHUD() {
    const hpFill = document.getElementById('player-health-fill');
    const hpText = document.getElementById('player-hp-text');
    const shieldFill = document.getElementById('player-shield-fill');
    const pranaFill = document.getElementById('player-prana-fill');

    if (hpFill && hpText) {
      const pct = Math.max(0, Math.min(100, (this.hp / this.maxHp) * 100));
      hpFill.style.width = `${pct}%`;
      hpText.textContent = `${Math.ceil(this.hp)} / ${this.maxHp}`;
    }

    if (shieldFill) {
      shieldFill.style.width = this.hasShield ? '100%' : '0%';
    }

    if (pranaFill) {
      pranaFill.style.width = `${this.prana}%`;
    }
  }

  draw(ctx, camera) {
    const screenX = this.x - camera.x;
    const screenY = this.y - camera.y;

    ctx.save();
    ctx.translate(screenX, screenY);

    // Flashing when invincible
    if (this.invincibleTime > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
      ctx.globalAlpha = 0.45;
    }

    if (!this.facingRight) {
      ctx.scale(-1, 1);
    }

    // ==========================================
    // RESPECTFUL DIVINE GANESHA REPRESENTATION
    // ==========================================

    // 1. Prabhavali (Radiant Divine Halo)
    const haloGlow = ctx.createRadialGradient(0, -28, 10, 0, -28, 55);
    haloGlow.addColorStop(0, 'rgba(251, 191, 36, 0.6)');
    haloGlow.addColorStop(0.7, 'rgba(245, 158, 11, 0.25)');
    haloGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = haloGlow;
    ctx.beginPath();
    ctx.arc(0, -28, 55, 0, Math.PI * 2);
    ctx.fill();

    // Radiant Golden Crown Rays
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2;
    for (let r = 0; r < 8; r++) {
      const angle = (r / 8) * Math.PI - Math.PI;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * 32, -28 + Math.sin(angle) * 32);
      ctx.lineTo(Math.cos(angle) * 44, -28 + Math.sin(angle) * 44);
      ctx.stroke();
    }

    // 2. Divine Siddhi Shield (if active)
    if (this.hasShield) {
      ctx.strokeStyle = '#38bdf8';
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 18;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 56, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // 3. Royal Body & Saffron Pitambara Silk
    // Lower Dhoti (Saffron Gold with red border)
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(-22, 10);
    ctx.lineTo(22, 10);
    ctx.lineTo(18, 42);
    ctx.lineTo(-18, 42);
    ctx.closePath();
    ctx.fill();

    // Gold borders on dhoti
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Sacred Legs & Lotus Feet
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.ellipse(-12, 42, 7, 5, 0, 0, Math.PI * 2);
    ctx.ellipse(12, 42, 7, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Golden Torso & Sacred Yajnopavita (Sacred Thread)
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.ellipse(0, 4, 20, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sacred Thread across chest
    ctx.strokeStyle = '#fffbeb';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-16, -6);
    ctx.lineTo(14, 18);
    ctx.stroke();

    // 4. Sacred Ears (Shurpakarna)
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    // Left ear
    ctx.ellipse(-26, -24, 14, 18, -0.3, 0, Math.PI * 2);
    // Right ear
    ctx.ellipse(26, -24, 14, 18, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Kundalas (Gold Ear Ornaments)
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(-26, -12, 4, 0, Math.PI * 2);
    ctx.arc(26, -12, 4, 0, Math.PI * 2);
    ctx.fill();

    // 5. Divine Head
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, -24, 19, 0, Math.PI * 2);
    ctx.fill();

    // Sacred Tilak & Trishula Chandan Mark on Forehead
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -32);
    ctx.lineTo(0, -22);
    ctx.moveTo(-5, -28);
    ctx.lineTo(5, -28);
    ctx.stroke();
    // Center yellow dot
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(0, -25, 2, 0, Math.PI * 2);
    ctx.fill();

    // Wise, Compassionate Eyes
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(-7, -22, 2.5, 0, Math.PI * 2);
    ctx.arc(7, -22, 2.5, 0, Math.PI * 2);
    ctx.fill();
    // Eye glimmer
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-6, -23, 0.8, 0, Math.PI * 2);
    ctx.arc(8, -23, 0.8, 0, Math.PI * 2);
    ctx.fill();

    // 6. Sacred Single Tusk (Ekadanta) - Right side whole, left unbroken
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(6, -14);
    ctx.lineTo(12, -8);
    ctx.lineTo(7, -10);
    ctx.closePath();
    ctx.fill();

    // 7. Vakratunda (The Sacred Curved Trunk)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.quadraticCurveTo(-4, -6, -14, -6);
    ctx.quadraticCurveTo(-18, -12, -12, -14);
    ctx.stroke();

    // Golden Modaka held at tip of trunk
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(-11, -16, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 8. Mukut (Golden Divine Crown)
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(-16, -34);
    ctx.lineTo(16, -34);
    ctx.lineTo(10, -52);
    ctx.lineTo(0, -58); // Crown Peak
    ctx.lineTo(-10, -52);
    ctx.closePath();
    ctx.fill();

    // Crown Ruby Gem & Carvings
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(0, -44, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // 9. Right Arm & Sacred Parashu Axe
    const isAttacking = this.state.startsWith('ATTACK');
    let axeAngle = 0.2;
    if (this.state === 'ATTACK_LIGHT_1') axeAngle = 1.2;
    if (this.state === 'ATTACK_LIGHT_2') axeAngle = -0.6;
    if (this.state === 'ATTACK_LIGHT_3') axeAngle = 1.8;
    if (this.state === 'ATTACK_HEAVY') axeAngle = 2.4;

    ctx.save();
    ctx.translate(16, 2);
    ctx.rotate(axeAngle);

    // Axe Shaft (Golden wood)
    ctx.fillStyle = '#92400e';
    ctx.fillRect(-2, -36, 5, 52);

    // Parashu Blade (Divine crescent of golden steel)
    ctx.fillStyle = '#fef08a';
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(10, -26, 16, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(0, -26);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Attack slash energy trail
    if (isAttacking) {
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(12, -26, 28, -Math.PI / 3, Math.PI / 3);
      ctx.stroke();
    }

    ctx.restore();

    ctx.restore();
  }
}

window.Player = new PlayerController();
