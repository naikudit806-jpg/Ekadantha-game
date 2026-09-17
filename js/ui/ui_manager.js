/**
 * EKADANTHA: Rise of the Remover
 * UI Navigation, Modal Manager, HUD & Screen State Transitions
 */

class UIManager {
  constructor() {
    this.currentScreen = 'cinematic-screen';
    this.selectedChapterTab = 1;
    this.endingCanvas = document.getElementById('ending-fireworks-canvas');
    this.endingCtx = this.endingCanvas ? this.endingCanvas.getContext('2d') : null;
    this.fireworks = [];

    this.bindButtons();
    this.initSettings();
    this.checkMobileControls();
  }

  showScreen(screenId) {
    const screens = document.querySelectorAll('.screen:not(.modal)');
    screens.forEach(s => {
      s.classList.add('hidden');
      s.classList.remove('active');
    });

    const target = document.getElementById(screenId);
    if (target) {
      target.classList.remove('hidden');
      target.classList.add('active');
      this.currentScreen = screenId;
    }

    // Toggle HUD visibility
    const hud = document.getElementById('hud-container');
    const mobile = document.getElementById('mobile-controls');

    if (screenId === 'game-screen') {
      if (hud) hud.classList.remove('hidden');
      if (mobile && this.isTouchDevice()) mobile.classList.remove('hidden');
    } else {
      if (hud) hud.classList.add('hidden');
      if (mobile) mobile.classList.add('hidden');
    }

    this.updateMenuCoins();
  }

  openModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) {
      m.classList.remove('hidden');
      if (modalId === 'chapter-screen') this.renderChapterSelect();
      if (modalId === 'shop-screen') window.ShopEngine?.renderShop();
      if (modalId === 'powers-screen') window.ShopEngine?.renderPowers();
      window.SoundEngine?.playButtonClick();
    }
  }

  closeModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) {
      m.classList.add('hidden');
      window.SoundEngine?.playButtonClick();
    }
  }

  bindButtons() {
    // Menu Actions
    document.getElementById('btn-play')?.addEventListener('click', () => {
      window.SoundEngine?.ensureContext();
      this.startCampaign(false);
    });

    document.getElementById('btn-continue')?.addEventListener('click', () => {
      window.SoundEngine?.ensureContext();
      this.startCampaign(true);
    });

    document.getElementById('btn-chapters')?.addEventListener('click', () => this.openModal('chapter-screen'));
    document.getElementById('btn-powers')?.addEventListener('click', () => this.openModal('powers-screen'));
    document.getElementById('btn-shop')?.addEventListener('click', () => this.openModal('shop-screen'));
    document.getElementById('btn-settings')?.addEventListener('click', () => this.openModal('settings-screen'));
    document.getElementById('btn-lore')?.addEventListener('click', () => this.openModal('lore-screen'));

    document.getElementById('btn-replay-cinematic')?.addEventListener('click', () => {
      this.showScreen('cinematic-screen');
      window.CinematicEngine?.start();
    });

    // Close buttons on all modals
    document.querySelectorAll('.btn-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetModal = e.target.getAttribute('data-close');
        if (targetModal) this.closeModal(targetModal);
      });
    });

    // HUD Pause
    document.getElementById('btn-hud-pause')?.addEventListener('click', () => {
      window.Game?.togglePause();
    });

    // Pause Modal Buttons
    document.getElementById('btn-resume')?.addEventListener('click', () => {
      window.Game?.resume();
    });
    document.getElementById('btn-restart-level')?.addEventListener('click', () => {
      this.closeModal('pause-screen');
      window.Game?.restartLevel();
    });
    document.getElementById('btn-pause-settings')?.addEventListener('click', () => {
      this.openModal('settings-screen');
    });
    document.getElementById('btn-pause-quit')?.addEventListener('click', () => {
      this.closeModal('pause-screen');
      window.Game?.exitToMenu();
    });

    // Victory Modal Buttons
    document.getElementById('btn-vic-next')?.addEventListener('click', () => {
      this.closeModal('victory-screen');
      const nextId = window.LevelEngine?.getNextLevelId(window.LevelEngine.currentLevelId);
      if (nextId) {
        window.LevelEngine.loadLevel(nextId);
        window.Game.state = 'PLAYING';
      } else {
        this.showEndingScreen();
      }
    });
    document.getElementById('btn-vic-shop')?.addEventListener('click', () => {
      this.closeModal('victory-screen');
      this.openModal('shop-screen');
    });
    document.getElementById('btn-vic-menu')?.addEventListener('click', () => {
      this.closeModal('victory-screen');
      window.Game?.exitToMenu();
    });

    // Defeat Modal Buttons
    document.getElementById('btn-defeat-retry')?.addEventListener('click', () => {
      this.closeModal('defeat-screen');
      window.Game?.restartLevel();
    });
    document.getElementById('btn-defeat-shop')?.addEventListener('click', () => {
      this.closeModal('defeat-screen');
      this.openModal('shop-screen');
    });
    document.getElementById('btn-defeat-menu')?.addEventListener('click', () => {
      this.closeModal('defeat-screen');
      window.Game?.exitToMenu();
    });

    // Ending Modal Buttons
    document.getElementById('btn-ending-continue')?.addEventListener('click', () => {
      this.closeModal('ending-screen');
      this.openModal('chapter-screen');
    });
    document.getElementById('btn-ending-menu')?.addEventListener('click', () => {
      this.closeModal('ending-screen');
      window.Game?.exitToMenu();
    });
  }

  startCampaign(continueSave = false) {
    let targetLevelId = '1-1';
    if (continueSave && window.GameSave?.data?.unlockedLevels?.length > 0) {
      const unlocked = window.GameSave.data.unlockedLevels;
      targetLevelId = unlocked[unlocked.length - 1];
    }

    this.showScreen('game-screen');
    this.renderHUDPowers();
    window.Game?.startLevel(targetLevelId);
  }

  updateMenuCoins() {
    const coins = window.GameSave?.data?.coins || 0;
    const menuCoins = document.getElementById('menu-coin-count');
    const hudCoins = document.getElementById('hud-coin-count');
    const progText = document.getElementById('menu-chapter-progress');

    if (menuCoins) menuCoins.textContent = coins;
    if (hudCoins) hudCoins.textContent = coins;

    if (progText && window.GameSave?.data?.unlockedLevels?.length > 0) {
      const last = window.GameSave.data.unlockedLevels[window.GameSave.data.unlockedLevels.length - 1];
      progText.textContent = `Ch. ${last}`;
    }
  }

  renderChapterSelect() {
    const tabsContainer = document.getElementById('chapter-tabs');
    const levelGrid = document.getElementById('level-grid');
    const chapterTitle = document.getElementById('current-chapter-title');
    const chapterDesc = document.getElementById('current-chapter-desc');

    if (!tabsContainer || !levelGrid) return;

    tabsContainer.innerHTML = '';
    levelGrid.innerHTML = '';

    const chapters = window.STORY_CHAPTERS || {};
    const unlockedLevels = window.GameSave?.data?.unlockedLevels || ['1-1'];
    const completedLevels = window.GameSave?.data?.completedLevels || [];

    // Render 5 Chapter Tabs
    for (let c = 1; c <= 5; c++) {
      const ch = chapters[c];
      const isUnlocked = c === 1 || unlockedLevels.some(id => id.startsWith(`${c}-`));

      const tab = document.createElement('button');
      tab.className = `chapter-tab-btn ${this.selectedChapterTab === c ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}`;
      tab.textContent = `Chapter ${c}`;
      if (isUnlocked) {
        tab.addEventListener('click', () => {
          this.selectedChapterTab = c;
          this.renderChapterSelect();
        });
      }
      tabsContainer.appendChild(tab);
    }

    const currentChData = chapters[this.selectedChapterTab];
    if (currentChData) {
      chapterTitle.textContent = currentChData.title;
      chapterDesc.textContent = currentChData.location;
    }

    // Render 3 Levels for selected Chapter
    for (let l = 1; l <= 3; l++) {
      const levelId = `${this.selectedChapterTab}-${l}`;
      const lvlData = window.LEVELS_DATA[levelId];
      if (!lvlData) continue;

      const isUnlocked = unlockedLevels.includes(levelId);
      const isCompleted = completedLevels.includes(levelId);

      const card = document.createElement('div');
      card.className = `level-card ${!isUnlocked ? 'locked' : ''}`;
      card.innerHTML = `
        <div class="level-card-num">LEVEL ${levelId}</div>
        <div class="level-card-name">${lvlData.title}</div>
        <div class="level-card-stars">${isCompleted ? '⭐⭐⭐' : (isUnlocked ? '⭐' : '🔒')}</div>
      `;

      if (isUnlocked) {
        card.addEventListener('click', () => {
          this.closeModal('chapter-screen');
          this.showScreen('game-screen');
          this.renderHUDPowers();
          window.Game?.startLevel(levelId);
        });
      }

      levelGrid.appendChild(card);
    }
  }

  renderHUDPowers() {
    const dock = document.getElementById('powers-dock');
    if (!dock) return;
    dock.innerHTML = '';

    const powersData = window.POWERS_DATA || {};
    const unlocked = window.GameSave?.data?.unlockedPowers || [];

    for (let id in powersData) {
      const p = powersData[id];
      const isUnlocked = unlocked.includes(id);

      const slot = document.createElement('div');
      slot.className = `power-slot ${!isUnlocked ? 'locked' : ''}`;
      slot.id = `power-slot-${id}`;
      slot.innerHTML = `
        <span class="power-slot-key">${p.key}</span>
        <span class="power-slot-icon">${p.icon}</span>
        <div class="cooldown-overlay" id="cd-overlay-${id}"></div>
        <span class="cooldown-seconds" id="cd-text-${id}"></span>
      `;

      if (isUnlocked) {
        slot.addEventListener('click', () => {
          window.PowersEngine?.cast(id, window.Player, window.EnemyManager?.enemies || [], window.LevelEngine?.boss);
        });
      }

      dock.appendChild(slot);
    }
  }

  updateHUDPowersCooldown() {
    const powersData = window.PowersEngine?.powers || {};
    for (let id in powersData) {
      const p = powersData[id];
      const overlay = document.getElementById(`cd-overlay-${id}`);
      const cdText = document.getElementById(`cd-text-${id}`);

      if (overlay) {
        if (p.cooldown > 0) {
          const pct = Math.min(100, (p.cooldown / p.baseCooldown) * 100);
          overlay.style.height = `${pct}%`;
          if (cdText) cdText.textContent = p.cooldown.toFixed(1);
        } else {
          overlay.style.height = '0%';
          if (cdText) cdText.textContent = '';
        }
      }
    }
  }

  showVictoryScreen(levelData, enemiesCount, maxCombo, coinsEarned) {
    const modal = document.getElementById('victory-screen');
    if (!modal) return;

    document.getElementById('victory-level-title').textContent = levelData.title;
    document.getElementById('vic-enemies-count').textContent = enemiesCount;
    document.getElementById('vic-max-combo').textContent = `${maxCombo}x`;
    document.getElementById('vic-coins-earned').textContent = `+${coinsEarned} 🟡`;

    const unlockBanner = document.getElementById('victory-unlock-banner');
    const unlockText = document.getElementById('victory-unlock-text');
    if (levelData.unlockPowerName && unlockBanner && unlockText) {
      unlockBanner.classList.remove('hidden');
      unlockText.textContent = `NEW POWER UNLOCKED: ${levelData.unlockPowerName}!`;
    } else if (unlockBanner) {
      unlockBanner.classList.add('hidden');
    }

    this.openModal('victory-screen');
  }

  showDefeatScreen() {
    this.openModal('defeat-screen');
    window.SoundEngine?.playTempleBell(0.6);
  }

  showEndingScreen() {
    this.openModal('ending-screen');
    window.SoundEngine?.playTrack('victory');
    window.SoundEngine?.playShankha();

    // Start celebratory fireworks on canvas
    this.startCelebrationFireworks();
  }

  startCelebrationFireworks() {
    if (!this.endingCanvas || !this.endingCtx) return;
    this.endingCanvas.width = 600;
    this.endingCanvas.height = 150;
    this.fireworks = [];

    const spawnFirework = () => {
      const x = Math.random() * 600;
      const y = 20 + Math.random() * 80;
      const colors = ['#fbbf24', '#f97316', '#ef4444', '#38bdf8', '#c084fc'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        const speed = 40 + Math.random() * 80;
        this.fireworks.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: color,
          alpha: 1.0,
          life: 0.8
        });
      }
    };

    const loop = () => {
      if (document.getElementById('ending-screen').classList.contains('hidden')) return;

      if (Math.random() < 0.1) spawnFirework();

      this.endingCtx.clearRect(0, 0, 600, 150);
      for (let i = this.fireworks.length - 1; i >= 0; i--) {
        const fw = this.fireworks[i];
        fw.x += fw.vx * 0.016;
        fw.y += fw.vy * 0.016;
        fw.life -= 0.016;
        fw.alpha = Math.max(0, fw.life / 0.8);

        this.endingCtx.save();
        this.endingCtx.fillStyle = fw.color;
        this.endingCtx.globalAlpha = fw.alpha;
        this.endingCtx.beginPath();
        this.endingCtx.arc(fw.x, fw.y, 2.5, 0, Math.PI * 2);
        this.endingCtx.fill();
        this.endingCtx.restore();

        if (fw.life <= 0) this.fireworks.splice(i, 1);
      }

      requestAnimationFrame(loop);
    };

    loop();
  }

  initSettings() {
    const volSlider = document.getElementById('slider-volume');
    const musicCheck = document.getElementById('check-music');
    const sfxCheck = document.getElementById('check-sfx');
    const shakeSlider = document.getElementById('slider-shake');
    const resetBtn = document.getElementById('btn-reset-data');

    const s = window.GameSave?.data?.settings || {};

    if (volSlider) {
      volSlider.value = (s.volume || 0.8) * 100;
      volSlider.addEventListener('input', (e) => {
        const v = parseFloat(e.target.value) / 100;
        window.SoundEngine?.setMasterVolume(v);
        window.GameSave?.updateSettings({ volume: v });
      });
    }

    if (musicCheck) {
      musicCheck.checked = s.music !== undefined ? s.music : true;
      musicCheck.addEventListener('change', (e) => {
        window.SoundEngine?.setMusicEnabled(e.target.checked);
        window.GameSave?.updateSettings({ music: e.target.checked });
      });
    }

    if (sfxCheck) {
      sfxCheck.checked = s.sfx !== undefined ? s.sfx : true;
      sfxCheck.addEventListener('change', (e) => {
        window.SoundEngine?.setSfxEnabled(e.target.checked);
        window.GameSave?.updateSettings({ sfx: e.target.checked });
      });
    }

    if (shakeSlider) {
      shakeSlider.value = (s.shake !== undefined ? s.shake : 0.75) * 100;
      shakeSlider.addEventListener('input', (e) => {
        const v = parseFloat(e.target.value) / 100;
        window.GameSave?.updateSettings({ shake: v });
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all game progress? This cannot be undone.')) {
          window.GameSave?.reset();
          alert('Progress has been reset to beginning.');
          location.reload();
        }
      });
    }
  }

  isTouchDevice() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.innerWidth <= 768;
  }

  checkMobileControls() {
    const mobile = document.getElementById('mobile-controls');
    if (this.isTouchDevice() && mobile) {
      // Prepared for game state
    }
  }
}

window.UIManager = new UIManager();
