/**
 * EKADANTHA: Rise of the Remover
 * Divine Powers System (6 Unlockable Abilities & Upgrades)
 */

const POWERS_DATA = {
  vakratunda_sweep: {
    id: 'vakratunda_sweep',
    name: 'Vakratunda Sweep',
    slot: 1,
    key: '1',
    icon: '🌪️',
    description: 'A 360-degree rotating divine arc of golden energy that sweeps away all surrounding Vighnas.',
    unlockCost: 0, // Starter ability
    baseDamage: 70,
    baseCooldown: 5.5,
    radius: 165,
    cooldown: 0
  },
  siddhi_shield: {
    id: 'siddhi_shield',
    name: 'Siddhi Shield',
    slot: 2,
    key: '2',
    icon: '🛡️',
    description: 'Manifests a radiant sacred barrier nullifying all incoming damage for 5 seconds.',
    unlockCost: 200,
    baseDuration: 5.0,
    baseCooldown: 12.0,
    cooldown: 0,
    activeTime: 0
  },
  ekadanta_strike: {
    id: 'ekadanta_strike',
    name: 'Ekadanta Strike',
    slot: 3,
    key: '3',
    icon: '⚡',
    description: 'A focused, high-speed piercing holy thrust that breaks through enemy defensive ranks.',
    unlockCost: 350,
    baseDamage: 140,
    baseCooldown: 7.5,
    range: 260,
    cooldown: 0
  },
  modaka_burst: {
    id: 'modaka_burst',
    name: 'Modaka Burst',
    slot: 4,
    key: '4',
    icon: '🥟',
    description: 'Releases a sacred modak offering that restores 35% health and detonates in holy light.',
    unlockCost: 500,
    baseHeal: 0.35,
    baseDamage: 85,
    radius: 190,
    baseCooldown: 14.0,
    cooldown: 0
  },
  mushika_dash: {
    id: 'mushika_dash',
    name: 'Mushika Dash',
    slot: 5,
    key: '5',
    icon: '🐀',
    description: 'Invokes the swiftness of Mushika to phase-dash through enemies with full invulnerability.',
    unlockCost: 700,
    baseDistance: 320,
    baseCooldown: 4.5,
    cooldown: 0
  },
  vighna_breaker: {
    id: 'vighna_breaker',
    name: 'Vighna Breaker',
    slot: 6,
    key: '6',
    icon: '🔱',
    description: 'Supreme Ultimate: Unleashes cosmic golden thunderbolts across the entire battlefield.',
    unlockCost: 1000,
    baseDamage: 320,
    baseCooldown: 22.0,
    cooldown: 0
  }
};

class PowersManager {
  constructor() {
    this.powers = JSON.parse(JSON.stringify(POWERS_DATA));
    this.activeEffects = [];
  }

  isUnlocked(powerId) {
    return window.GameSave?.data?.unlockedPowers?.includes(powerId);
  }

  getLevel(powerId) {
    return window.GameSave?.data?.powerLevels?.[powerId] || 1;
  }

  getCooldownReduction() {
    const powerUpgradeLvl = window.GameSave?.data?.upgrades?.power || 1;
    return Math.max(0.4, 1 - (powerUpgradeLvl - 1) * 0.1);
  }

  update(dt) {
    const cdFactor = this.getCooldownReduction();

    for (let id in this.powers) {
      const p = this.powers[id];
      if (p.cooldown > 0) {
        p.cooldown -= dt;
        if (p.cooldown < 0) p.cooldown = 0;
      }
      if (p.activeTime > 0) {
        p.activeTime -= dt;
        if (p.activeTime <= 0) {
          p.activeTime = 0;
          if (id === 'siddhi_shield') {
            if (window.Player) window.Player.hasShield = false;
          }
        }
      }
    }

    // Update active lingering visual effects
    for (let i = this.activeEffects.length - 1; i >= 0; i--) {
      const eff = this.activeEffects[i];
      eff.life -= dt;
      if (eff.life <= 0) {
        this.activeEffects.splice(i, 1);
      }
    }
  }

  canCast(powerId) {
    if (!this.isUnlocked(powerId)) return false;
    const p = this.powers[powerId];
    return p && p.cooldown <= 0;
  }

  cast(powerId, player, enemies, boss) {
    if (!this.canCast(powerId)) return false;
    const p = this.powers[powerId];
    const lvl = this.getLevel(powerId);
    const cdFactor = this.getCooldownReduction();

    // Trigger audio
    if (window.SoundEngine) {
      window.SoundEngine.playPowerCast(powerId);
    }

    // Put on cooldown
    p.cooldown = p.baseCooldown * cdFactor;

    switch (powerId) {
      case 'vakratunda_sweep': {
        const dmg = (p.baseDamage + (lvl - 1) * 25) * player.getAttackMultiplier();
        // Hit all enemies in radius
        let hitCount = 0;
        for (let enemy of enemies) {
          if (enemy.isDead) continue;
          const dist = Math.hypot(enemy.x - player.x, enemy.y - player.y);
          if (dist <= p.radius) {
            enemy.takeDamage(dmg, 'divine');
            hitCount++;
          }
        }
        if (boss && !boss.isDead) {
          const dist = Math.hypot(boss.x - player.x, boss.y - player.y);
          if (dist <= p.radius + 50) {
            boss.takeDamage(dmg, 'divine');
            hitCount++;
          }
        }
        // Visual
        this.activeEffects.push({
          type: 'vakratunda_sweep',
          x: player.x,
          y: player.y,
          radius: p.radius,
          life: 0.4,
          maxLife: 0.4
        });
        window.GameParticles?.spawnShockwave(player.x, player.y, p.radius, '#fbbf24', 0.4);
        window.GameParticles?.triggerShake(12, 0.3);
        break;
      }

      case 'siddhi_shield': {
        p.activeTime = p.baseDuration + (lvl - 1) * 1.0;
        player.hasShield = true;
        player.shieldDuration = p.activeTime;
        window.GameParticles?.spawnShockwave(player.x, player.y, 80, '#38bdf8', 0.5);
        break;
      }

      case 'ekadanta_strike': {
        const dmg = (p.baseDamage + (lvl - 1) * 45) * player.getAttackMultiplier();
        const dir = player.facingRight ? 1 : -1;
        const targetX = player.x + dir * p.range;

        // Dash player forward
        player.x += dir * 180;
        player.vx = dir * 300;

        // Damage line
        for (let enemy of enemies) {
          if (enemy.isDead) continue;
          const minX = Math.min(player.x - dir * 180, targetX);
          const maxX = Math.max(player.x - dir * 180, targetX);
          if (enemy.x >= minX - 40 && enemy.x <= maxX + 40 && Math.abs(enemy.y - player.y) < 70) {
            enemy.takeDamage(dmg, 'heavy');
          }
        }
        if (boss && !boss.isDead) {
          if (Math.abs(boss.x - player.x) < p.range && Math.abs(boss.y - player.y) < 90) {
            boss.takeDamage(dmg, 'heavy');
          }
        }

        this.activeEffects.push({
          type: 'ekadanta_strike',
          x1: player.x - dir * 180,
          y1: player.y,
          x2: targetX,
          y2: player.y,
          life: 0.3,
          maxLife: 0.3
        });
        window.GameParticles?.spawnHitSparks(player.x, player.y, 16, '#f59e0b');
        window.GameParticles?.triggerShake(10, 0.25);
        break;
      }

      case 'modaka_burst': {
        // Heal
        const healAmt = player.maxHp * p.baseHeal;
        player.heal(healAmt);

        // AoE Damage
        const dmg = (p.baseDamage + (lvl - 1) * 30) * player.getAttackMultiplier();
        for (let enemy of enemies) {
          if (enemy.isDead) continue;
          if (Math.hypot(enemy.x - player.x, enemy.y - player.y) <= p.radius) {
            enemy.takeDamage(dmg, 'divine');
          }
        }
        if (boss && !boss.isDead) {
          if (Math.hypot(boss.x - player.x, boss.y - player.y) <= p.radius + 60) {
            boss.takeDamage(dmg, 'divine');
          }
        }

        this.activeEffects.push({
          type: 'modaka_burst',
          x: player.x,
          y: player.y,
          radius: p.radius,
          life: 0.6,
          maxLife: 0.6
        });
        window.GameParticles?.spawnPetals(player.x, player.y, 20);
        window.GameParticles?.spawnShockwave(player.x, player.y, p.radius, '#22c55e', 0.5);
        break;
      }

      case 'mushika_dash': {
        const dir = player.facingRight ? 1 : -1;
        player.x += dir * p.baseDistance;
        player.invincibleTime = 0.8;
        window.GameParticles?.spawnHitSparks(player.x, player.y, 14, '#c084fc');
        window.GameParticles?.triggerShake(6, 0.15);
        break;
      }

      case 'vighna_breaker': {
        // Ultimate fullscreen devastation
        const dmg = (p.baseDamage + (lvl - 1) * 80) * player.getAttackMultiplier();
        for (let enemy of enemies) {
          if (!enemy.isDead) {
            enemy.takeDamage(dmg, 'divine');
          }
        }
        if (boss && !boss.isDead) {
          boss.takeDamage(dmg, 'divine');
        }

        this.activeEffects.push({
          type: 'vighna_breaker',
          life: 1.0,
          maxLife: 1.0
        });
        window.GameParticles?.triggerShake(24, 0.8);
        window.GameParticles?.spawnHitSparks(player.x, player.y, 35, '#fbbf24');
        break;
      }
    }

    return true;
  }

  drawEffects(ctx, camera) {
    ctx.save();
    for (let eff of this.activeEffects) {
      const alpha = eff.life / eff.maxLife;
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

      if (eff.type === 'vakratunda_sweep') {
        const sx = eff.x - camera.x;
        const sy = eff.y - camera.y;
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 8;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(sx, sy, eff.radius * (1 - alpha * 0.2), 0, Math.PI * 2);
        ctx.stroke();
      } else if (eff.type === 'ekadanta_strike') {
        const x1 = eff.x1 - camera.x;
        const y1 = eff.y1 - camera.y;
        const x2 = eff.x2 - camera.x;
        const y2 = eff.y2 - camera.y;
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 14;
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      } else if (eff.type === 'modaka_burst') {
        const sx = eff.x - camera.x;
        const sy = eff.y - camera.y;
        ctx.fillStyle = 'rgba(74, 222, 128, 0.25)';
        ctx.beginPath();
        ctx.arc(sx, sy, eff.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (eff.type === 'vighna_breaker') {
        // Celestial cosmic golden lightning rays from the top
        ctx.fillStyle = 'rgba(251, 191, 36, 0.22)';
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        // Thunderbolts
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 6;
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 30;
        for (let k = 0; k < 6; k++) {
          const boltX = (k * 220 + 80) % window.innerWidth;
          ctx.beginPath();
          ctx.moveTo(boltX, 0);
          ctx.lineTo(boltX - 25, 200);
          ctx.lineTo(boltX + 20, 380);
          ctx.lineTo(boltX, window.innerHeight);
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  }
}

window.PowersEngine = new PowersManager();
