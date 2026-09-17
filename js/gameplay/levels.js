/**
 * EKADANTHA: Rise of the Remover
 * Level Progression & Campaign Manager (15 Levels Across 5 Chapters)
 */

const LEVELS_DATA = {
  // Chapter 1: The Awakening
  '1-1': {
    id: '1-1',
    chapter: 1,
    levelNum: 1,
    title: 'Temple Sanctum',
    objectiveDesc: 'Purify the inner sanctum by banishing all Vighna Scouts',
    enemyWaves: [
      { type: 'scout', x: 700, y: 480 },
      { type: 'scout', x: 950, y: 480 },
      { type: 'scout', x: 1200, y: 480 },
      { type: 'scout', x: 1450, y: 480 },
      { type: 'scout', x: 1700, y: 480 }
    ],
    isBossLevel: false,
    baseCoinReward: 120
  },
  '1-2': {
    id: '1-2',
    chapter: 1,
    levelNum: 2,
    title: 'Courtyard of Modaks',
    objectiveDesc: 'Vanquish the Vighna Scouts and Brutes guarding the temple courtyard',
    enemyWaves: [
      { type: 'scout', x: 600, y: 480 },
      { type: 'scout', x: 850, y: 480 },
      { type: 'brute', x: 1100, y: 480 },
      { type: 'scout', x: 1350, y: 480 },
      { type: 'scout', x: 1550, y: 480 },
      { type: 'brute', x: 1800, y: 480 },
      { type: 'scout', x: 2050, y: 480 }
    ],
    isBossLevel: false,
    baseCoinReward: 180
  },
  '1-3': {
    id: '1-3',
    chapter: 1,
    levelNum: 3,
    title: 'Temple Gates (Boss)',
    objectiveDesc: 'Confront and overcome Dharani Vighna, Stone Guardian of Doubt',
    enemyWaves: [
      { type: 'scout', x: 750, y: 480 },
      { type: 'scout', x: 1000, y: 480 }
    ],
    isBossLevel: true,
    bossChapter: 1,
    baseCoinReward: 350,
    unlockPowerName: 'VAKRATUNDA SWEEP'
  },

  // Chapter 2: Forest of Durva
  '2-1': {
    id: '2-1',
    chapter: 2,
    levelNum: 1,
    title: 'Sacred Glade',
    objectiveDesc: 'Overcome ranged Vighna Archers and agile Scouts in the sacred grove',
    enemyWaves: [
      { type: 'scout', x: 650, y: 480 },
      { type: 'archer', x: 950, y: 480 },
      { type: 'scout', x: 1250, y: 480 },
      { type: 'archer', x: 1550, y: 480 },
      { type: 'brute', x: 1850, y: 480 },
      { type: 'archer', x: 2150, y: 480 }
    ],
    isBossLevel: false,
    baseCoinReward: 220
  },
  '2-2': {
    id: '2-2',
    chapter: 2,
    levelNum: 2,
    title: 'Stream of Purification',
    objectiveDesc: 'Cleanse the sacred stream by defeating waves of thorny Vighnas',
    enemyWaves: [
      { type: 'archer', x: 700, y: 480 },
      { type: 'brute', x: 950, y: 480 },
      { type: 'scout', x: 1200, y: 480 },
      { type: 'archer', x: 1450, y: 480 },
      { type: 'guardian', x: 1700, y: 480 },
      { type: 'brute', x: 1950, y: 480 },
      { type: 'archer', x: 2200, y: 480 }
    ],
    isBossLevel: false,
    baseCoinReward: 280
  },
  '2-3': {
    id: '2-3',
    chapter: 2,
    levelNum: 3,
    title: 'Heart of the Grove (Boss)',
    objectiveDesc: 'Vanquish Aranya Vighna to restore the sacred durva grass',
    enemyWaves: [
      { type: 'archer', x: 800, y: 480 },
      { type: 'scout', x: 1100, y: 480 }
    ],
    isBossLevel: true,
    bossChapter: 2,
    baseCoinReward: 480,
    unlockPowerName: 'SIDDHI SHIELD'
  },

  // Chapter 3: City of Pandals
  '3-1': {
    id: '3-1',
    chapter: 3,
    levelNum: 1,
    title: 'Procession Avenue',
    objectiveDesc: 'Break through the shielded Vighna Guardians blocking festival streets',
    enemyWaves: [
      { type: 'guardian', x: 700, y: 480 },
      { type: 'archer', x: 950, y: 480 },
      { type: 'guardian', x: 1250, y: 480 },
      { type: 'brute', x: 1550, y: 480 },
      { type: 'guardian', x: 1850, y: 480 },
      { type: 'shadow', x: 2150, y: 480 }
    ],
    isBossLevel: false,
    baseCoinReward: 320
  },
  '3-2': {
    id: '3-2',
    chapter: 3,
    levelNum: 2,
    title: 'Lantern Plaza',
    objectiveDesc: 'Protect the sacred festival lamps from teleporting Shadow Vighnas',
    enemyWaves: [
      { type: 'shadow', x: 750, y: 480 },
      { type: 'guardian', x: 1050, y: 480 },
      { type: 'shadow', x: 1350, y: 480 },
      { type: 'elite', x: 1650, y: 480 },
      { type: 'shadow', x: 1950, y: 480 },
      { type: 'guardian', x: 2200, y: 480 }
    ],
    isBossLevel: false,
    baseCoinReward: 400
  },
  '3-3': {
    id: '3-3',
    chapter: 3,
    levelNum: 3,
    title: 'Pandal of Lights (Boss)',
    objectiveDesc: 'Defeat Kolhal Vighna, Commander of Discord, and silence the chaos',
    enemyWaves: [
      { type: 'shadow', x: 800, y: 480 },
      { type: 'guardian', x: 1100, y: 480 }
    ],
    isBossLevel: true,
    bossChapter: 3,
    baseCoinReward: 650,
    unlockPowerName: 'EKADANTA STRIKE'
  },

  // Chapter 4: The Shadow Fortress
  '4-1': {
    id: '4-1',
    chapter: 4,
    levelNum: 1,
    title: 'Outer Ramparts',
    objectiveDesc: 'Storm the fortress walls defended by Elite Vighnas and dark archers',
    enemyWaves: [
      { type: 'elite', x: 750, y: 480 },
      { type: 'archer', x: 1050, y: 480 },
      { type: 'guardian', x: 1350, y: 480 },
      { type: 'elite', x: 1650, y: 480 },
      { type: 'shadow', x: 1950, y: 480 },
      { type: 'elite', x: 2250, y: 480 }
    ],
    isBossLevel: false,
    baseCoinReward: 450
  },
  '4-2': {
    id: '4-2',
    chapter: 4,
    levelNum: 2,
    title: 'Chamber of Illusions',
    objectiveDesc: 'Vanquish the combined supernatural battalion within the citadel',
    enemyWaves: [
      { type: 'shadow', x: 700, y: 480 },
      { type: 'elite', x: 950, y: 480 },
      { type: 'guardian', x: 1200, y: 480 },
      { type: 'shadow', x: 1450, y: 480 },
      { type: 'elite', x: 1700, y: 480 },
      { type: 'brute', x: 1950, y: 480 },
      { type: 'elite', x: 2200, y: 480 }
    ],
    isBossLevel: false,
    baseCoinReward: 520
  },
  '4-3': {
    id: '4-3',
    chapter: 4,
    levelNum: 3,
    title: 'Throne of Obstacles (Boss)',
    objectiveDesc: 'Shatter Chhaya Vighna, the Obsidian Citadel Titan',
    enemyWaves: [
      { type: 'elite', x: 800, y: 480 },
      { type: 'shadow', x: 1100, y: 480 }
    ],
    isBossLevel: true,
    bossChapter: 4,
    baseCoinReward: 850,
    unlockPowerName: 'MUSHIKA DASH & MODAKA BURST'
  },

  // Chapter 5: The Final Visarjan
  '5-1': {
    id: '5-1',
    chapter: 5,
    levelNum: 1,
    title: 'Sunset Ghats',
    objectiveDesc: 'Clear the riverside steps for the auspicious Ganesh Visarjan procession',
    enemyWaves: [
      { type: 'elite', x: 700, y: 480 },
      { type: 'guardian', x: 950, y: 480 },
      { type: 'shadow', x: 1200, y: 480 },
      { type: 'archer', x: 1450, y: 480 },
      { type: 'elite', x: 1700, y: 480 },
      { type: 'guardian', x: 1950, y: 480 },
      { type: 'shadow', x: 2200, y: 480 }
    ],
    isBossLevel: false,
    baseCoinReward: 600
  },
  '5-2': {
    id: '5-2',
    chapter: 5,
    levelNum: 2,
    title: 'Bridge of Devotion',
    objectiveDesc: 'Withstand the final desperate gauntlet of obstacles across the bridge',
    enemyWaves: [
      { type: 'elite', x: 650, y: 480 },
      { type: 'shadow', x: 900, y: 480 },
      { type: 'guardian', x: 1150, y: 480 },
      { type: 'archer', x: 1400, y: 480 },
      { type: 'brute', x: 1650, y: 480 },
      { type: 'elite', x: 1900, y: 480 },
      { type: 'shadow', x: 2150, y: 480 }
    ],
    isBossLevel: false,
    baseCoinReward: 750
  },
  '5-3': {
    id: '5-3',
    chapter: 5,
    levelNum: 3,
    title: 'Cosmic Confluence (Final Boss)',
    objectiveDesc: 'Vanquish MAHA VIGHNA, the Primordial Obstacle, and bring eternal light',
    enemyWaves: [
      { type: 'elite', x: 800, y: 480 }
    ],
    isBossLevel: true,
    bossChapter: 5,
    baseCoinReward: 1500,
    unlockPowerName: 'VIGHNA BREAKER (ULTIMATE)'
  }
};

class LevelManager {
  constructor() {
    this.currentLevelId = '1-1';
    this.activeLevel = LEVELS_DATA['1-1'];
    this.totalEnemiesInLevel = 0;
    this.enemiesDefeated = 0;
    this.boss = null;
    this.isLevelCompleted = false;
  }

  loadLevel(levelId) {
    const levelData = LEVELS_DATA[levelId];
    if (!levelData) {
      console.error(`[LevelManager] Level ${levelId} not found`);
      return false;
    }

    this.currentLevelId = levelId;
    this.activeLevel = levelData;
    this.isLevelCompleted = false;
    this.enemiesDefeated = 0;

    // Reset Player
    window.Player?.reset(200, 480);

    // Clear enemies & coins
    window.EnemyManager?.clear();
    window.GameParticles?.clear();

    // Spawn Waves
    for (let spawn of levelData.enemyWaves) {
      window.EnemyManager?.spawnEnemy(spawn.type, spawn.x, spawn.y);
    }

    // Spawn Boss if applicable
    if (levelData.isBossLevel) {
      this.boss = new window.ChapterBoss(levelData.bossChapter, 1700, 480);
      this.totalEnemiesInLevel = levelData.enemyWaves.length + 1;
    } else {
      this.boss = null;
      this.totalEnemiesInLevel = levelData.enemyWaves.length;
    }

    // Update HUD
    this.updateHUD();

    // Play appropriate music track
    if (window.SoundEngine) {
      if (levelData.isBossLevel) {
        window.SoundEngine.playTrack('boss');
      } else {
        window.SoundEngine.playTrack('combat');
      }
    }

    // Trigger Chapter intro dialogue on first level of each chapter or boss
    const chInfo = window.STORY_CHAPTERS?.[levelData.chapter];
    if (chInfo) {
      if (levelData.levelNum === 1 && chInfo.introDialogue) {
        window.GameDialogue?.show(chInfo.introDialogue);
      } else if (levelData.isBossLevel && chInfo.bossIntro) {
        window.GameDialogue?.show(chInfo.bossIntro);
      }
    }

    return true;
  }

  update(dt) {
    if (this.isLevelCompleted) return;

    // Calculate current remaining enemies
    const remainingEnemies = window.EnemyManager?.enemies?.length || 0;
    const bossAlive = this.boss && !this.boss.isDead;

    const remainingTotal = remainingEnemies + (bossAlive ? 1 : 0);
    this.enemiesDefeated = this.totalEnemiesInLevel - remainingTotal;

    this.updateHUD();

    // Check Victory
    if (remainingTotal === 0 && this.totalEnemiesInLevel > 0) {
      this.completeLevel();
    }
  }

  completeLevel() {
    this.isLevelCompleted = true;
    window.SoundEngine?.playTrack('victory');
    window.SoundEngine?.playShankha();

    // Reward coins
    const baseCoins = this.activeLevel.baseCoinReward;
    const maxCombo = window.CombatEngine?.comboCount || 1;
    const bonus = Math.round(baseCoins * 0.15 * Math.min(5, maxCombo));
    const totalCoins = baseCoins + bonus;

    window.GameSave?.addCoins(totalCoins);
    window.GameSave?.markLevelCompleted(this.currentLevelId);

    // Unlock next level
    const nextId = this.getNextLevelId(this.currentLevelId);
    if (nextId) {
      window.GameSave?.unlockLevel(nextId);
    }

    // Check if Final Boss was defeated
    if (this.currentLevelId === '5-3') {
      // Grand Ending sequence
      setTimeout(() => {
        window.UIManager?.showEndingScreen();
      }, 1000);
      return;
    }

    // Show Level Victory Modal
    setTimeout(() => {
      window.UIManager?.showVictoryScreen(this.activeLevel, this.enemiesDefeated, maxCombo, totalCoins);
    }, 800);
  }

  getNextLevelId(currentId) {
    const [ch, lv] = currentId.split('-').map(Number);
    if (lv < 3) {
      return `${ch}-${lv + 1}`;
    } else if (ch < 5) {
      return `${ch + 1}-1`;
    }
    return null; // Completed game
  }

  updateHUD() {
    const levelTag = document.getElementById('hud-level-tag');
    const objText = document.getElementById('hud-objective-text');
    const objCount = document.getElementById('hud-objective-count');
    const coinCount = document.getElementById('hud-coin-count');

    if (levelTag && this.activeLevel) {
      levelTag.textContent = `CH ${this.activeLevel.chapter}-${this.activeLevel.levelNum}: ${this.activeLevel.title.toUpperCase()}`;
    }

    if (objText && this.activeLevel) {
      objText.textContent = this.activeLevel.objectiveDesc;
    }

    if (objCount) {
      objCount.textContent = `(${this.enemiesDefeated} / ${this.totalEnemiesInLevel})`;
    }

    if (coinCount && window.GameSave?.data) {
      coinCount.textContent = window.GameSave.data.coins;
    }
  }
}

window.LevelEngine = new LevelManager();
window.LEVELS_DATA = LEVELS_DATA;
