import machineGunSprites from "../../sprites/machinegun.js";
import { SpriteHandler } from "../../components/index.js";
import { Dynamite } from "./Dynamite.js";
import { Bullet } from "./Bullet.js";

export class MachineGun extends SpriteHandler {
  constructor(x, dir) {
    super(machineGunSprites);
    this.setAction("STAND");

    this.x = x + 15 * dir;
    this.rawY = window.game.display.height;
    this.dir = dir;
    this.animationFps = 100;

    this.groundedY = window.game.display.height - this.sprite.length;

    this.bullets = [];
    this.bulletsToDestroy = [];

    this.shootCounter = 0;
    this.sprayLength = 5;
    this.shootDelay = 1000;
    this.nextShootTime = 0;
  }

  updateIntro(deltaTime) {
    this.rawY -= deltaTime * 10;

    if (this.rawY <= this.groundedY) {
      this.rawY = this.groundedY;
      this.grounded = true;
      this.nextShootTime = window.game.time + this.shootDelay / 2;
    }
  }

  updateShoot(deltaTime) {
    const isLastSprite = this.updateAnimation(deltaTime, this.animationFps);

    if (isLastSprite) {
      if (++this.shootCounter === this.sprayLength) {
        this.setAction("STAND");
        this.nextShootTime = window.game.time + this.shootDelay;
        this.shootCounter = 0;
      }
      this.shoot();
    }
  }

  update(deltaTime) {
    if (!this.grounded) this.updateIntro(deltaTime);
    else {
      switch (this.action) {
        case "SHOOT":
          this.updateShoot(deltaTime);
          break;
        case "STAND":
          if (this.nextShootTime <= window.game.time && window.game.hp > 0) {
            this.setAction("SHOOT");
            window.game.sounds.play("minigun-shots.webm", {
              volume: 0.5,
            });
          }

          this.updateAnimation(deltaTime);
          break;
      }

      for (const bullet of this.bullets) {
        bullet.update(deltaTime);

        if (window.game.isCollision(bullet, window.game.Player)) {
          if (window.game.hp <= 0) continue;
          window.game.hitPlayer(5);
          this.bulletsToDestroy.push(bullet);
        }
      }

      window.game.destroyObjs(this.bullets, this.bulletsToDestroy);
    }
  }

  explode() {
    window.game.dynamites.push(new Dynamite(this.x, 0 - 5 * this.dir));
    this.setAction("BROKE");
  }

  shoot() {
    let startX = this.x + (this.dir === 1 ? 5 : 0);
    this.bullets.push(new Bullet(startX, this.groundedY + 2, this.dir, 0, 200));
  }

  get y() {
    return Math.trunc(this.rawY);
  }
}
