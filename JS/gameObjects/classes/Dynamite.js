import dynamiteSprites from "../../sprites/dynamite.js";
import { SpriteHandler } from "../../components/index.js";

export class Dynamite extends SpriteHandler {
  constructor(x, explodeTime = 0, damage = 50) {
    super(dynamiteSprites);

    this.setAction("LIGHTED");

    this.explodeTime = window.game.time + explodeTime;
    this.animationFps = 15;
    this.x = x;
    this.y = window.game.display.height - this.spriteSheet[0].length;
    this.damage = damage;

    this.exploded = false;
  }

  updateLighted(deltaTime) {
    if (this.explodeTime <= window.game.time) {
      this.setAction("EXPLODE");
      window.game.sounds.play("explosion.webm", {
        volume: 0.5,
      });
    }

    this.updateAnimation(deltaTime, this.animationFps);
  }

  updateExplode(deltaTime) {
    if (!this.exploded) {
      if (window.game.isCollision(this, window.game.Player)) {
        window.game.hitPlayer(this.damage);
      }

      for (const paratrooper of window.game.paratroopers) {
        if (window.game.isCollision(this, paratrooper)) {
          paratrooper.bulletHit();
        }
      }

      for (const scooterunit of window.game.scooterunits) {
        if (window.game.isCollision(this, scooterunit)) {
          scooterunit.bulletHit();
        }
      }

      this.exploded = true;
    }

    const isLastSprite = this.updateAnimation(deltaTime, this.animationFps);

    if (isLastSprite) {
      window.game.dynamitesToDestroy.push(this);
    }
  }

  update(deltaTime) {
    switch (this.action) {
      case "LIGHTED":
        this.updateLighted(deltaTime);
        break;
      case "EXPLODE":
        this.updateExplode(deltaTime);
        break;
    }
  }
}
