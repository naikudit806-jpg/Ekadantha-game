/**
 * EKADANTHA: Rise of the Remover
 * Physics, Movement & Hitbox Collision Engine
 */

class PhysicsEngine {
  constructor() {
    this.gravity = 1100;
    this.groundY = 560;
  }

  // Update entity movement, apply friction, gravity, platform collisions
  updateEntity(entity, dt, platforms = [], bounds = { minX: 50, maxX: 2400 }) {
    // Apply gravity if not on ground
    if (!entity.isGrounded) {
      entity.vy += this.gravity * dt;
    }

    // Integrate velocity
    entity.x += entity.vx * dt;
    entity.y += entity.vy * dt;

    // Arena horizontal bounds
    if (entity.x < bounds.minX + entity.width / 2) {
      entity.x = bounds.minX + entity.width / 2;
      entity.vx = 0;
    } else if (entity.x > bounds.maxX - entity.width / 2) {
      entity.x = bounds.maxX - entity.width / 2;
      entity.vx = 0;
    }

    // Ground check (Main floor)
    let grounded = false;
    const footY = entity.y + entity.height / 2;

    if (footY >= this.groundY) {
      entity.y = this.groundY - entity.height / 2;
      entity.vy = 0;
      grounded = true;
    }

    // Check elevated floating platforms
    for (let i = 0; i < platforms.length; i++) {
      const plat = platforms[i];
      // Only land when falling downward
      if (
        entity.vy >= 0 &&
        entity.x >= plat.x &&
        entity.x <= plat.x + plat.width &&
        footY >= plat.y &&
        footY <= plat.y + 18
      ) {
        entity.y = plat.y - entity.height / 2;
        entity.vy = 0;
        grounded = true;
        break;
      }
    }

    entity.isGrounded = grounded;

    // Apply ground friction
    if (entity.isGrounded && Math.abs(entity.vx) > 0) {
      const friction = entity.friction || 0.82;
      entity.vx *= friction;
      if (Math.abs(entity.vx) < 5) entity.vx = 0;
    }
  }

  // AABB Overlap check
  checkOverlap(boxA, boxB) {
    return (
      boxA.x < boxB.x + boxB.width &&
      boxA.x + boxA.width > boxB.x &&
      boxA.y < boxB.y + boxB.height &&
      boxA.y + boxA.height > boxB.y
    );
  }

  // Distance between two points
  distance(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
  }

  // Circle vs Circle collision
  checkCircleOverlap(c1, c2) {
    const d = this.distance(c1.x, c1.y, c2.x, c2.y);
    return d < (c1.radius + c2.radius);
  }
}

window.GamePhysics = new PhysicsEngine();
