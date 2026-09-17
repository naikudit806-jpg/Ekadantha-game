/**
 * EKADANTHA: Rise of the Remover
 * Upgrade Shop & Power Enhancement Manager
 */

const UPGRADES_CONFIG = {
  attack: {
    key: 'attack',
    name: 'Divine Strike (Attack)',
    icon: '⚔️',
    description: 'Increases light and heavy parashu attack damage by +15% per tier.',
    baseCost: 100,
    costMultiplier: 1.55,
    maxLevel: 10,
    getStat: (lvl) => `+${(lvl - 1) * 15}% Damage`
  },
  defense: {
    key: 'defense',
    name: 'Siddhi Armor (Defense)',
    icon: '🛡️',
    description: 'Fortifies Ekadanta against obstacles, reducing incoming damage by -10% per tier.',
    baseCost: 120,
    costMultiplier: 1.55,
    maxLevel: 10,
    getStat: (lvl) => `-${(lvl - 1) * 10}% Damage Taken`
  },
  health: {
    key: 'health',
    name: 'Amrita Vitality (Health)',
    icon: '🪷',
    description: 'Expands maximum divine health capacity by +30 HP per tier.',
    baseCost: 150,
    costMultiplier: 1.6,
    maxLevel: 10,
    getStat: (lvl) => `${100 + (lvl - 1) * 30} Max HP`
  },
  speed: {
    key: 'speed',
    name: 'Vayu Agility (Speed)',
    icon: '💨',
    description: 'Enhances movement velocity and dodge recovery time.',
    baseCost: 100,
    costMultiplier: 1.5,
    maxLevel: 10,
    getStat: (lvl) => `+${(lvl - 1) * 12}% Velocity`
  },
  power: {
    key: 'power',
    name: 'Mantra Cooldown (Powers)',
    icon: '✨',
    description: 'Accelerates divine power recharge times by -10% per tier.',
    baseCost: 200,
    costMultiplier: 1.65,
    maxLevel: 10,
    getStat: (lvl) => `-${(lvl - 1) * 10}% Cooldowns`
  },
  ultimate: {
    key: 'ultimate',
    name: 'Prana Resonance (Ultimate)',
    icon: '🔱',
    description: 'Speeds up divine Prana generation from combat combos by +20% per tier.',
    baseCost: 250,
    costMultiplier: 1.7,
    maxLevel: 10,
    getStat: (lvl) => `+${(lvl - 1) * 20}% Prana Charge`
  }
};

class ShopManager {
  constructor() {
    this.shopGrid = document.getElementById('shop-grid');
    this.powersContainer = document.getElementById('powers-container');
    this.shopCoinEl = document.getElementById('shop-coin-count');
  }

  getCost(config, currentLevel) {
    return Math.round(config.baseCost * Math.pow(config.costMultiplier, currentLevel - 1));
  }

  renderShop() {
    if (!this.shopGrid) return;
    this.shopGrid.innerHTML = '';

    const currentCoins = window.GameSave?.data?.coins || 0;
    if (this.shopCoinEl) this.shopCoinEl.textContent = currentCoins;

    const upgrades = window.GameSave?.data?.upgrades || {};

    for (let key in UPGRADES_CONFIG) {
      const cfg = UPGRADES_CONFIG[key];
      const lvl = upgrades[key] || 1;
      const isMax = lvl >= cfg.maxLevel;
      const cost = this.getCost(cfg, lvl);
      const canAfford = currentCoins >= cost && !isMax;

      const card = document.createElement('div');
      card.className = 'shop-card';
      card.innerHTML = `
        <div class="shop-card-header">
          <div class="shop-badge-icon">${cfg.icon}</div>
          <div class="shop-info">
            <h4>${cfg.name}</h4>
            <div class="shop-tier">Level ${lvl} / ${cfg.maxLevel}</div>
          </div>
        </div>
        <p class="shop-desc">${cfg.description}</p>
        <div class="shop-stats-row">
          <span>Current: <strong>${cfg.getStat(lvl)}</strong></span>
          ${!isMax ? `<span>Next: <strong>${cfg.getStat(lvl + 1)}</strong></span>` : '<span><strong>MAX TIER</strong></span>'}
        </div>
        <button class="btn ${canAfford ? 'btn-gold' : 'btn-glass'} ${isMax ? 'disabled' : ''}" 
          style="width:100%; margin-top:6px;" ${!canAfford || isMax ? 'disabled' : ''}>
          ${isMax ? 'MASTERED' : `UPGRADE (${cost} 🟡)`}
        </button>
      `;

      const btn = card.querySelector('button');
      if (btn && canAfford && !isMax) {
        btn.addEventListener('click', () => {
          this.purchaseUpgrade(key, cost);
        });
      }

      this.shopGrid.appendChild(card);
    }
  }

  purchaseUpgrade(statKey, cost) {
    if (window.GameSave?.upgradeStat(statKey, cost)) {
      window.SoundEngine?.playTempleBell(1.4);
      window.Player?.applyUpgrades();
      this.renderShop();
      window.UIManager?.updateMenuCoins();
    }
  }

  renderPowers() {
    if (!this.powersContainer) return;
    this.powersContainer.innerHTML = '';

    const powersData = window.POWERS_DATA || {};
    const unlocked = window.GameSave?.data?.unlockedPowers || [];
    const powerLevels = window.GameSave?.data?.powerLevels || {};
    const currentCoins = window.GameSave?.data?.coins || 0;

    for (let id in powersData) {
      const p = powersData[id];
      const isUnlocked = unlocked.includes(id);
      const lvl = powerLevels[id] || (isUnlocked ? 1 : 0);
      const upgradeCost = Math.round(150 * Math.pow(1.6, lvl));
      const canUnlock = !isUnlocked && currentCoins >= p.unlockCost;
      const canUpgrade = isUnlocked && currentCoins >= upgradeCost && lvl < 5;

      const card = document.createElement('div');
      card.className = `power-card ${!isUnlocked ? 'locked' : ''}`;
      card.innerHTML = `
        <div class="power-card-header">
          <div class="power-badge-icon">${p.icon}</div>
          <div class="power-info">
            <h4>${p.name}</h4>
            <div class="power-tier">${isUnlocked ? `Tier ${lvl} / 5` : 'LOCKED'}</div>
          </div>
        </div>
        <p class="power-desc">${p.description}</p>
        <div class="power-stats-row">
          <span>Cooldown: <strong>${p.baseCooldown}s</strong></span>
          <span>Hotkey: <strong>[${p.key}]</strong></span>
        </div>
        <button class="btn ${isUnlocked ? (canUpgrade ? 'btn-gold' : 'btn-glass') : (canUnlock ? 'btn-secondary' : 'btn-glass')}" 
          style="width: 100%; margin-top: 6px;" ${(!isUnlocked && !canUnlock) || (isUnlocked && (!canUpgrade || lvl >= 5)) ? 'disabled' : ''}>
          ${!isUnlocked ? `UNLOCK (${p.unlockCost} 🟡)` : (lvl >= 5 ? 'MAX POWER' : `ENHANCE (${upgradeCost} 🟡)`)}
        </button>
      `;

      const btn = card.querySelector('button');
      if (btn) {
        btn.addEventListener('click', () => {
          if (!isUnlocked && canUnlock) {
            if (window.GameSave?.spendCoins(p.unlockCost)) {
              window.GameSave.unlockPower(id);
              window.SoundEngine?.playTempleBell(1.8);
              this.renderPowers();
              window.UIManager?.renderHUDPowers();
              window.UIManager?.updateMenuCoins();
            }
          } else if (isUnlocked && canUpgrade) {
            if (window.GameSave?.upgradePower(id, upgradeCost)) {
              window.SoundEngine?.playTempleBell(1.5);
              this.renderPowers();
              window.UIManager?.updateMenuCoins();
            }
          }
        });
      }

      this.powersContainer.appendChild(card);
    }
  }
}

window.ShopEngine = new ShopManager();
