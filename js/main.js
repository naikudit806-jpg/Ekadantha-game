/**
 * EKADANTHA: Rise of the Remover
 * Master Game Controller & 60 FPS Lifecycle Loop
 */

class GameMaster {
  constructor() {
    this.state = 'BOOT'; // BOOT, CINEMATIC, MENU, PLAYING, PAUSED
    this.lastTime = performance.now();

    this.init();
  }

  init() {
    console.log('[EKADANTHA] Game Initializing — May Lord Ganesha remove all obstacles!');

    // Start in Opening Cinematic mode
    this.state = 'CINEMATIC';
    window.CinematicEngine?.start();

    // Start master loop
    requestAnimationFrame((t) => this.loop(t));
  }

  startLevel(levelId) {
    this.state = 'PLAYING';
    window.LevelEngine?.loadLevel(levelId);
  }

  restartLevel() {
    if (window.LevelEngine?.currentLevelId) {
      this.startLevel(window.LevelEngine.currentLevelId);
    }
  }

  togglePause() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
      window.UIManager?.openModal('pause-screen');
      window.SoundEngine?.stopMusic();
    } else if (this.state === 'PAUSED') {
      this.resume();
    }
  }

  resume() {
    if (this.state === 'PAUSED') {
      window.UIManager?.closeModal('pause-screen');
      this.state = 'PLAYING';
      if (window.LevelEngine?.activeLevel?.isBossLevel) {
        window.SoundEngine?.playTrack('boss');
      } else {
        window.SoundEngine?.playTrack('combat');
      }
    }
  }

  exitToMenu() {
    this.state = 'MENU';
    window.UIManager?.showScreen('menu-screen');
    window.SoundEngine?.playTrack('menu');
  }

  loop(currentTime) {
    const dt = Math.min(0.1, (currentTime - this.lastTime) / 1000);
    this.lastTime = currentTime;

    // 1. Process Input
    window.GameInput?.update();

    // ESC or P key toggle pause
    if (window.GameInput?.consumeAction('pause')) {
      this.togglePause();
    }

    // 2. State specific updates
    if (this.state === 'CINEMATIC') {
      window.CinematicEngine?.update(dt);
      window.CinematicEngine?.render();
    } else if (this.state === 'PLAYING') {
      this.updatePlaying(dt);
      this.renderPlaying();
    }

    requestAnimationFrame((t) => this.loop(t));
  }

  updatePlaying(dt) {
    // If dialogue is active, pause combat movement
    if (window.GameDialogue?.isActive) {
      return;
    }

    const input = window.GameInput;
    const player = window.Player;
    const enemyMgr = window.EnemyManager;
    const levelMgr = window.LevelEngine;
    const boss = levelMgr?.boss;
    const powers = window.PowersEngine;
    const particles = window.GameParticles;
    const combat = window.CombatEngine;

    // Update Powers cooldowns
    powers?.update(dt);

    // Update Combat timers & combos
    combat?.update(dt);

    // Update Player controller
    player?.update(dt, input, enemyMgr?.enemies || [], boss);

    // Update Enemies & Projectiles & Coins
    enemyMgr?.update(dt, player, boss);

    // Update Boss if present
    if (boss && !boss.isDead) {
      boss.update(dt, player, enemyMgr?.projectiles || []);
    }

    // Update Particles & Screen Shake
    particles?.update(dt);

    // Update Level objectives & win conditions
    levelMgr?.update(dt);

    // Update HUD Power Cooldown Overlays
    window.UIManager?.updateHUDPowersCooldown();

    // Check Defeat State
    if (player && player.hp <= 0) {
      this.state = 'DEFEAT';
      window.UIManager?.showDefeatScreen();
    }
  }

  renderPlaying() {
    const renderer = window.GameRenderer;
    const player = window.Player;
    const enemyMgr = window.EnemyManager;
    const levelMgr = window.LevelEngine;
    const boss = levelMgr?.boss;
    const particles = window.GameParticles;
    const powers = window.PowersEngine;

    if (!renderer || !player) return;

    // Update Camera tracking on player with screen shake offset
    renderer.updateCamera(player.x, player.y, 0.016);
    const camera = {
      x: renderer.camera.x + (particles?.screenShake.offsetX || 0),
      y: renderer.camera.y + (particles?.screenShake.offsetY || 0)
    };

    // Clear Screen
    renderer.clear();

    // Draw Multi-layered Parallax Festival Background
    const currentChapter = levelMgr?.activeLevel?.chapter || 1;
    renderer.drawBackground(currentChapter);

    // Draw Enemies & Modak Coins & Projectiles
    enemyMgr?.draw(renderer.ctx, camera);

    // Draw Boss
    if (boss && !boss.isDead) {
      boss.draw(renderer.ctx, camera);
    }

    // Draw Player (Lord Ganesha)
    player.draw(renderer.ctx, camera);

    // Draw Active Divine Power Effects (Vakratunda sweep rings, Ekadanta strike beam, Vighna breaker thunderbolts)
    powers?.drawEffects(renderer.ctx, camera);

    // Draw Particles & Floating Damage Numbers
    particles?.draw(renderer.ctx, camera);

    // Draw Floating Marigold & Lotus Petals in atmosphere
    renderer.drawAtmosphere();
  }
}

// Launch upon document load
window.addEventListener('DOMContentLoaded', () => {
  window.Game = new GameMaster();
});
