/**
 * EKADANTHA: Rise of the Remover
 * Save / Progression System (LocalStorage)
 */

const STORAGE_KEY = 'EKADANTA_SAVE_DATA_V1';

const DEFAULT_SAVE_DATA = {
  version: 1,
  coins: 100, // starting blessing
  currentChapter: 1,
  currentLevel: 1,
  unlockedLevels: ['1-1'],
  completedLevels: [],
  unlockedPowers: ['vakratunda_sweep'], // First power unlocked by default or early
  powerLevels: {
    vakratunda_sweep: 1,
    siddhi_shield: 0,
    ekadanta_strike: 0,
    modaka_burst: 0,
    mushika_dash: 0,
    vighna_breaker: 0
  },
  upgrades: {
    attack: 1,
    defense: 1,
    health: 1,
    speed: 1,
    power: 1,
    ultimate: 1
  },
  settings: {
    volume: 0.8,
    music: true,
    sfx: true,
    quality: 'high',
    shake: 0.75
  },
  stats: {
    totalEnemiesBanished: 0,
    totalCoinsEarned: 100,
    highestCombo: 0,
    chaptersCompleted: 0,
    gameWon: false
  }
};

class SaveSystem {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
      const parsed = JSON.parse(raw);
      // Merge with default to ensure backward compatibility
      return Object.assign({}, DEFAULT_SAVE_DATA, parsed);
    } catch (e) {
      console.warn('[SaveSystem] Failed to load save, using defaults', e);
      return JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('[SaveSystem] Failed to persist data', e);
    }
  }

  reset() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA));
    this.save();
    return this.data;
  }

  addCoins(amount) {
    this.data.coins = Math.max(0, this.data.coins + amount);
    if (amount > 0) {
      this.data.stats.totalCoinsEarned += amount;
    }
    this.save();
    return this.data.coins;
  }

  spendCoins(amount) {
    if (this.data.coins >= amount) {
      this.data.coins -= amount;
      this.save();
      return true;
    }
    return false;
  }

  unlockLevel(levelId) {
    if (!this.data.unlockedLevels.includes(levelId)) {
      this.data.unlockedLevels.push(levelId);
    }
    this.save();
  }

  markLevelCompleted(levelId) {
    if (!this.data.completedLevels.includes(levelId)) {
      this.data.completedLevels.push(levelId);
    }
    this.save();
  }

  unlockPower(powerId) {
    if (!this.data.unlockedPowers.includes(powerId)) {
      this.data.unlockedPowers.push(powerId);
      if (!this.data.powerLevels[powerId] || this.data.powerLevels[powerId] < 1) {
        this.data.powerLevels[powerId] = 1;
      }
    }
    this.save();
  }

  upgradeStat(statKey, cost) {
    if (this.spendCoins(cost)) {
      this.data.upgrades[statKey] = (this.data.upgrades[statKey] || 1) + 1;
      this.save();
      return true;
    }
    return false;
  }

  upgradePower(powerId, cost) {
    if (this.spendCoins(cost)) {
      this.data.powerLevels[powerId] = (this.data.powerLevels[powerId] || 0) + 1;
      this.save();
      return true;
    }
    return false;
  }

  updateSettings(newSettings) {
    this.data.settings = Object.assign({}, this.data.settings, newSettings);
    this.save();
  }
}

window.GameSave = new SaveSystem();
