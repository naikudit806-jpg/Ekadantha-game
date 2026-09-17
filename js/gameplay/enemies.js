/**
 * EKADANTHA: Rise of the Remover
 * Enemy System: 6 Original Vighna Archetypes, Projectiles & Coin Drops
 */

class VighnaEnemy {
  constructor(type, x, y) {
    this.type = type; // scout, brute, archer, guardian, shadow, elite
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.facingRight = false;
    this.isGrounded = true;

    this.isDead = false;
    this.state = 'IDLE'; // IDLE, CHASE, ATTACK, HURT
    this.stateTimer = 0;
    this.attackCooldown = 0;

    // Archetype Configurations
    this.setupArchetype();
  }

  setupArchetype() {
    switch (this.type) {
      case 'scout':
        this.width = 44;
        this.height = 60;
        this.maxHp = 45;
        this.hp = 45;
        this.speed = 170;
        this.damage = 10;
        this.attackRange = 55;
        this.coinReward = 15;
        this.color = '#7c3aed';
        break;

      case 'brute':
        this.width = 72;
        this.height = 96;
        this.maxHp = 140;
        this.hp = 140;
        this.speed = 75;
        this.damage = 25;
        this.attackRange = 85;
        this.coinReward = 40;
        this.color = '#475569';
        break;

      case 'archer':
        this.width = 46;
        this.height = 68;
        this.maxHp = 55;
        this.hp = 55;
        this.speed = 110;
        this.damage = 12;
        this.attackRange = 400;
        this.coinReward = 30;
        this.color = '#0284c7';
        break;

      case 'guardian':
        this.width = 58;
        this.height = 84;
        this.maxHp = 110;
        this.hp = 110;
        this.speed = 90;
        this.damage = 16;
        this.attackRange = 65;
        this.coinReward = 45;
        this.color = '#b91c1c';
        this.hasFrontShield = true;
        break;

      case 'shadow':
        this.width = 48;
        this.height = 70;
        this.maxHp = 75;
        this.hp = 75;
        this.speed = 210;
        this.damage = 18;
        this.attackRange = 60;
        this.coinReward = 60;
        this.color = '#1e1b4b';
        break;

      case 'elite':
      default:
        this.width = 64;
        this.height = 88;
        this.maxHp = 180;
        this.hp = 180;
        this.speed = 125;
        this.damage = 22;
        this.attackRange = 75;
        this.coinReward = 80;
        this.color = '#831843';
        break;
    }
  }

  takeDamage(amount, damageType = 'normal', attackerX = null) {
    if (this.isDead) return;

    // Guardian frontal shield block
    if (this.hasFrontShield && damageType === 'normal' && attackerX !== null) {
      const attackingFromFront = (this.facingRight && attackerX > this.x) || (!this.facingRight && attackerX < this.x);
      if (attackingFromFront) {
        window.GameParticles?.spawnDamageNumber(this.x, this.y - 20, 0, 'shield');
        window.SoundEngine?.playTempleBell(2.2);
        return;
      }
    }

    this.hp -= amount;
    window.GameParticles?.spawnDamageNumber(this.x, this.y - 15, amount, damageType);
    window.SoundEngine?.playHitImpact();

    // Knockback
    if (attackerX !== null) {
      const dir = this.x > attackerX ? 1 : -1;
      this.vx = dir * 140;
      this.vy = -80;
    }

    if (this.hp <= 0) {
      this.die();
    }
  }

  die() {
    this.isDead = true;
    window.GameParticles?.spawnHitSparks(this.x, this.y, 20, '#c084fc');
    window.SoundEngine?.playTempleBell(0.8);

    // Spawn Modak Coins with combo multiplier bonus
    const comboMult = window.CombatEngine?.getCoinMultiplier() || 1;
    const coinsToSpawn = Math.round(this.coinReward * comboMult);
    window.EnemyManager?.spawnCoins(this.x, this.y, coinsToSpawn);

    if (window.GameSave?.data?.stats) {
      window.GameSave.data.stats.totalEnemiesBanished++;
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

    // AI State Machine
    if (this.type === 'archer') {
      // Archer maintains distance
      if (dist < 180) {
        // Flee away from player
        this.vx = (this.facingRight ? -1 : 1) * this.speed;
      } else if (dist > 360) {
        // Approach
        this.vx = (this.facingRight ? 1 : -1) * this.speed;
      } else {
        this.vx = 0;
        // In shooting range
        if (this.attackCooldown <= 0) {
          this.shootProjectile(player, projectiles);
          this.attackCooldown = 2.2;
        }
      }
    } else if (this.type === 'shadow') {
      // Shadow teleport chance
      if (dist > 250 && Math.random() < 0.015 && this.attackCooldown <= 0) {
        // Teleport behind player
        this.x = player.x + (player.facingRight ? -70 : 70);
        this.y = player.y;
        window.GameParticles?.spawnHitSparks(this.x, this.y, 14, '#a855f7');
        this.attackCooldown = 1.8;
      } else if (dist > this.attackRange) {
        this.vx = (this.facingRight ? 1 : -1) * this.speed;
      } else {
        this.vx = 0;
        if (this.attackCooldown <= 0) {
          this.meleeAttack(player);
          this.attackCooldown = 1.4;
        }
      }
    } else {
      // Standard Melee types (Scout, Brute, Guardian, Elite)
      if (dist > this.attackRange) {
        this.vx = (this.facingRight ? 1 : -1) * this.speed;
      } else {
        this.vx = 0;
        if (this.attackCooldown <= 0) {
          this.meleeAttack(player);
          this.attackCooldown = this.type === 'brute' ? 2.5 : 1.5;
        }
      }
    }

    // Apply physics
    window.GamePhysics?.updateEntity(this, dt, [], { minX: 60, maxX: 2340 });
  }

  meleeAttack(player) {
    player.takeDamage(this.damage, this.x);
    window.GameParticles?.spawnHitSparks(player.x, player.y, 6, '#ef4444');
    if (this.type === 'brute') {
      window.GameParticles?.triggerShake(8, 0.2);
    }
  }

  shootProjectile(player, projectiles) {
    const angle = Math.atan2(player.y - this.y, player.x - this.x);
    projectiles.push({
      x: this.x,
      y: this.y - 10,
      vx: Math.cos(angle) * 320,
      vy: Math.sin(angle) * 320,
      damage: this.damage,
      radius: 7,
      color: '#38bdf8',
      life: 3.5
    });
    window.SoundEngine?.playAttackLight();
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

    // Vighna Supernatural Aura
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 12;

    // Body
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.roundRect(-this.width / 2, -this.height / 2, this.width, this.height, 8);
    ctx.fill();

    // Glowing Eyes of the Vighna (Dark red/violet)
    ctx.fillStyle = '#f43f5e';
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(6, -this.height / 4, 3.5, 0, Math.PI * 2);
    ctx.arc(16, -this.height / 4, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Archetype specific visual features
    if (this.type === 'guardian') {
      // Obsidian front shield
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.fillRect(this.width / 2 - 4, -this.height / 2 + 4, 12, this.height - 8);
      ctx.strokeRect(this.width / 2 - 4, -this.height / 2 + 4, 12, this.height - 8);
    } else if (this.type === 'brute') {
      // Stone hammer
      ctx.fillStyle = '#334155';
      ctx.fillRect(14, -this.height / 2 - 12, 18, 22);
    } else if (this.type === 'archer') {
      // Mystic bow
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(16, 0, 18, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
    }

    // Health Bar overhead
    ctx.shadowBlur = 0;
    const barWidth = 44;
    const barHeight = 5;
    const hpPct = Math.max(0, this.hp / this.maxHp);

    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(-barWidth / 2, -this.height / 2 - 14, barWidth, barHeight);

    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-barWidth / 2, -this.height / 2 - 14, barWidth * hpPct, barHeight);

    ctx.restore();
  }
}

// Global Enemies & Projectiles & Coins Manager
class EnemyManager {
  constructor() {
    this.enemies = [];
    this.projectiles = [];
    this.coins = [];
  }

  clear() {
    this.enemies = [];
    this.projectiles = [];
    this.coins = [];
  }

  spawnEnemy(type, x, y) {
    const e = new VighnaEnemy(type, x, y);
    this.enemies.push(e);
    return e;
  }

  spawnCoins(x, y, amount) {
    const coinsToDrop = Math.min(amount, 12); // visually drop up to 12 coins
    const valuePerCoin = Math.ceil(amount / coinsToDrop);

    for (let i = 0; i < coinsToDrop; i++) {
      this.coins.push({
        x: x,
        y: y,
        vx: (Math.random() * 240 - 120),
        vy: -140 - Math.random() * 120,
        value: valuePerCoin,
        isGrounded: false,
        life: 18.0
      });
    }
  }

  update(dt, player, boss) {
    // Update enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      e.update(dt, player, this.projectiles);
      if (e.isDead) {
        this.enemies.splice(i, 1);
      }
    }

    // Update projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;

      // Collision with player
      const dist = Math.hypot(p.x - player.x, p.y - player.y);
      if (dist < p.radius + 30) {
        player.takeDamage(p.damage, p.x);
        window.GameParticles?.spawnHitSparks(p.x, p.y, 8, p.color);
        this.projectiles.splice(i, 1);
        continue;
      }

      if (p.life <= 0) {
        this.projectiles.splice(i, 1);
      }
    }

    // Update floating Modak coins & magnetic attraction
    for (let i = this.coins.length - 1; i >= 0; i--) {
      const c = this.coins[i];
      c.life -= dt;

      // Gravity if falling
      if (!c.isGrounded) {
        c.vy += 650 * dt;
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        if (c.y >= 545) {
          c.y = 545;
          c.vy = 0;
          c.vx = 0;
          c.isGrounded = true;
        }
      }

      // Magnetic pull towards Ganesha
      const dx = player.x - c.x;
      const dy = player.y - c.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 220) {
        // Accelerate toward Ganesha
        c.x += (dx / dist) * 420 * dt;
        c.y += (dy / dist) * 420 * dt;
      }

      // Pickup radius
      if (dist < 45) {
        window.GameSave?.addCoins(c.value);
        window.SoundEngine?.playCoinPickup();
        window.GameParticles?.spawnDamageNumber(c.x, c.y, `+${c.value} 🟡`, 'divine');
        this.coins.splice(i, 1);
        continue;
      }

      if (c.life <= 0) {
        this.coins.splice(i, 1);
      }
    }
  }

  draw(ctx, camera) {
    // Draw enemies
    for (let e of this.enemies) {
      e.draw(ctx, camera);
    }

    // Draw projectiles
    for (let p of this.projectiles) {
      const sx = p.x - camera.x;
      const sy = p.y - camera.y;
      ctx.save();
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(sx, sy, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Draw floating Modak coins
    for (let c of this.coins) {
      const sx = c.x - camera.x;
      const sy = c.y - camera.y;
      ctx.save();
      ctx.translate(sx, sy);
      // Glowing gold Modak
      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(0, -7, 2, 0, Math.PI * 2); // Modak pointed tip
      ctx.fill();
      ctx.restore();
    }
  }
}

window.EnemyManager = new EnemyManager();
