/**
 * EKADANTHA: Rise of the Remover
 * Combat System: Combos, Hitboxes, Damage Mitigation & Feedback
 */

class CombatSystem {
  constructor() {
    this.comboCount = 0;
    this.comboTimer = 0;
    this.comboMaxTime = 2.8;
    this.hitStopTimer = 0;
  }

  update(dt) {
    // Combo decay
    if (this.comboCount > 0) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.resetCombo();
      }
    }

    // Hit-stop / frame freeze on critical impacts
    if (this.hitStopTimer > 0) {
      this.hitStopTimer -= dt;
    }
  }

  registerHit(amount, isCrit = false) {
    this.comboCount++;
    this.comboTimer = this.comboMaxTime;

    // Check highest combo in save
    if (window.GameSave?.data?.stats) {
      if (this.comboCount > window.GameSave.data.stats.highestCombo) {
        window.GameSave.data.stats.highestCombo = this.comboCount;
      }
    }

    // Hit freeze frame for punchy impact
    if (isCrit) {
      this.hitStopTimer = 0.05;
    }

    // Charge ultimate prana meter
    if (window.Player) {
      window.Player.chargePrana(3.5 + Math.min(this.comboCount * 0.5, 8));
    }

    this.updateComboHUD();
  }

  resetCombo() {
    this.comboCount = 0;
    this.comboTimer = 0;
    this.updateComboHUD();
  }

  getComboMultiplier() {
    // 1x up to 1.8x damage based on combo
    return 1 + Math.min(0.8, this.comboCount * 0.04);
  }

  getCoinMultiplier() {
    // 1x up to 2.5x bonus coins on high combos
    return 1 + Math.min(1.5, this.comboCount * 0.06);
  }

  updateComboHUD() {
    const comboHud = document.getElementById('combo-hud');
    const comboNum = document.getElementById('combo-num');
    const timerFill = document.getElementById('combo-timer-fill');

    if (!comboHud || !comboNum) return;

    if (this.comboCount >= 2) {
      comboHud.classList.remove('hidden');
      comboNum.textContent = `${this.comboCount}x`;
      if (timerFill) {
        const pct = Math.max(0, Math.min(100, (this.comboTimer / this.comboMaxTime) * 100));
        timerFill.style.width = `${pct}%`;
      }
    } else {
      comboHud.classList.add('hidden');
    }
  }
}

window.CombatEngine = new CombatSystem();
