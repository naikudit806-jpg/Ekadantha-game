/**
 * EKADANTHA: Rise of the Remover
 * Unified Input Manager (Keyboard & Mobile Touch Virtual Joystick)
 */

class InputManager {
  constructor() {
    this.keys = {};
    this.justPressedKeys = {};
    this.axisX = 0;
    this.axisY = 0;
    
    // Action trigger flags (reset each frame)
    this.actions = {
      attack: false,
      heavy: false,
      dodge: false,
      jump: false,
      power1: false,
      power2: false,
      power3: false,
      power4: false,
      power5: false,
      ultimate: false,
      pause: false,
      interact: false
    };

    // Virtual Joystick state
    this.joystick = {
      active: false,
      touchId: null,
      baseX: 0,
      baseY: 0,
      currentX: 0,
      currentY: 0,
      maxRadius: 48
    };

    this.initKeyboard();
    this.initTouch();
  }

  initKeyboard() {
    window.addEventListener('keydown', (e) => {
      const code = e.code;
      if (!this.keys[code]) {
        this.justPressedKeys[code] = true;
      }
      this.keys[code] = true;

      // Handle pause directly
      if (code === 'Escape' || code === 'KeyP') {
        this.actions.pause = true;
      }
      // Dialogue interaction
      if (code === 'Space' || code === 'Enter') {
        this.actions.interact = true;
      }

      // Prevent scrolling with arrows/space
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(code)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      this.justPressedKeys[e.code] = false;
    });
  }

  initTouch() {
    const joystickZone = document.getElementById('joystick-zone');
    const joystickBase = document.getElementById('joystick-base');
    const joystickThumb = document.getElementById('joystick-thumb');

    if (!joystickZone) return;

    // Joystick Touch Events
    const handleJoystickStart = (e) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      const rect = joystickBase.getBoundingClientRect();
      this.joystick.active = true;
      this.joystick.touchId = touch.identifier;
      this.joystick.baseX = rect.left + rect.width / 2;
      this.joystick.baseY = rect.top + rect.height / 2;
      this.handleJoystickMove(touch.clientX, touch.clientY);
    };

    const handleJoystickMoveEvent = (e) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === this.joystick.touchId) {
          this.handleJoystickMove(touch.clientX, touch.clientY);
          break;
        }
      }
    };

    const handleJoystickEndEvent = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === this.joystick.touchId) {
          this.joystick.active = false;
          this.joystick.touchId = null;
          this.axisX = 0;
          this.axisY = 0;
          if (joystickThumb) {
            joystickThumb.style.transform = `translate(0px, 0px)`;
          }
          break;
        }
      }
    };

    joystickZone.addEventListener('touchstart', handleJoystickStart, { passive: false });
    window.addEventListener('touchmove', handleJoystickMoveEvent, { passive: false });
    window.addEventListener('touchend', handleJoystickEndEvent, { passive: false });
    window.addEventListener('touchcancel', handleJoystickEndEvent, { passive: false });

    // Touch Action Buttons Binding
    this.bindTouchButton('btn-touch-attack', 'attack');
    this.bindTouchButton('btn-touch-heavy', 'heavy');
    this.bindTouchButton('btn-touch-dodge', 'dodge');
    this.bindTouchButton('btn-touch-jump', 'jump');
    this.bindTouchButton('btn-touch-power', 'power1'); // Triggers first ready power
    this.bindTouchButton('btn-touch-ultimate', 'ultimate');
  }

  handleJoystickMove(clientX, clientY) {
    const dx = clientX - this.joystick.baseX;
    const dy = clientY - this.joystick.baseY;
    const dist = Math.hypot(dx, dy);
    const maxR = this.joystick.maxRadius;

    let clampedX = dx;
    let clampedY = dy;
    if (dist > maxR) {
      clampedX = (dx / dist) * maxR;
      clampedY = (dy / dist) * maxR;
    }

    const joystickThumb = document.getElementById('joystick-thumb');
    if (joystickThumb) {
      joystickThumb.style.transform = `translate(${clampedX}px, ${clampedY}px)`;
    }

    this.axisX = clampedX / maxR;
    this.axisY = clampedY / maxR;
  }

  bindTouchButton(elemId, actionKey) {
    const el = document.getElementById(elemId);
    if (!el) return;

    const trigger = (e) => {
      e.preventDefault();
      this.actions[actionKey] = true;
      if (window.SoundEngine) window.SoundEngine.ensureContext();
    };

    el.addEventListener('touchstart', trigger, { passive: false });
    el.addEventListener('mousedown', trigger);
  }

  update() {
    // Merge Keyboard into axes if not active via joystick
    if (!this.joystick.active) {
      let kx = 0;
      let ky = 0;
      if (this.keys['KeyA'] || this.keys['ArrowLeft']) kx -= 1;
      if (this.keys['KeyD'] || this.keys['ArrowRight']) kx += 1;
      if (this.keys['KeyW'] || this.keys['ArrowUp']) ky -= 1;
      if (this.keys['KeyS'] || this.keys['ArrowDown']) ky += 1;

      this.axisX = kx;
      this.axisY = ky;
    }

    // Process keyboard actions
    if (this.justPressedKeys['KeyJ']) this.actions.attack = true;
    if (this.justPressedKeys['KeyK']) this.actions.heavy = true;
    if (this.justPressedKeys['KeyL']) this.actions.dodge = true;
    if (this.justPressedKeys['Space'] || this.justPressedKeys['KeyW'] || this.justPressedKeys['ArrowUp']) {
      this.actions.jump = true;
    }

    // Power hotkeys (1 - 6)
    if (this.justPressedKeys['Digit1']) this.actions.power1 = true;
    if (this.justPressedKeys['Digit2']) this.actions.power2 = true;
    if (this.justPressedKeys['Digit3']) this.actions.power3 = true;
    if (this.justPressedKeys['Digit4']) this.actions.power4 = true;
    if (this.justPressedKeys['Digit5']) this.actions.power5 = true;
    if (this.justPressedKeys['Digit6']) this.actions.ultimate = true;

    // Reset single-frame keys
    this.justPressedKeys = {};
  }

  consumeAction(actionKey) {
    if (this.actions[actionKey]) {
      this.actions[actionKey] = false;
      return true;
    }
    return false;
  }

  resetAll() {
    this.axisX = 0;
    this.axisY = 0;
    for (let k in this.actions) {
      this.actions[k] = false;
    }
  }
}

window.GameInput = new InputManager();
