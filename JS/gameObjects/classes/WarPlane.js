import { warplaneSprites, bombSprites } from "../../sprites/warplane.js";
import { SpriteHandler } from "../../components/index.js";
import { Dynamite } from "./Dynamite.js";

export class WarPlane extends SpriteHandler {
  constructor() {
    super(warplaneSprites);
    this.animationFps = 20;
    this.setAction("FLY");
    this.bombs = [];
    this.dir = 1;
    this.rawX = 10;
    this.rawY = 100;
    this.bombDropDelay = 1000;
    this.fallAttackDelay = 10000;
    this.nextFallTime = Infinity;
    this.nextShootTime = 0;
    this.speed = 100;
    this.maxHp = 30;
    this.hp = this.maxHp;
    this.gravity = 250;
    this.gravitySpeed = 0;
    this.alive = true;
  }

  updateFly(deltaTime) {
    this.rawX += deltaTime * this.speed * this.dir;
    if (
      this.rawX + this.sprite[0].length >= window.game.display.width ||
      this.rawX <= 0
    ) {
      this.dir *= -1;
    }

    if (this.nextShootTime <= window.game.time) {
      const wind = window.game.spawner.windGen.next().value;
      this.bombs.push(
        new Bomb(this.x + 15, this.y + 15, this.dir === 1 ? wind : -wind)
      );
      this.nextShootTime = window.game.time + this.bombDropDelay;
    }

    if (this.nextFallTime <= window.game.time) {
      if (
        Math.abs(
          this.rawX - window.game.Player.x + (this.dir === -1 ? 40 : 0)
        ) < 20
      ) {
        this.setAction("FALL");
        this.nextFallTime = window.game.time + this.fallAttackDelay;
      }
    }
  }

  handleBombs(deltaTime) {
    let bombsToDestroy = [],
      bombExploded;
    for (const bomb of this.bombs) {
      bombExploded = bomb.update(deltaTime);
      if (bombExploded) bombsToDestroy.push(bomb);
    }

    window.game.destroyObjs(this.bombs, bombsToDestroy);
  }

  updateFall(deltaTime) {
    this.gravitySpeed += this.gravity * deltaTime;
    this.rawY += this.gravitySpeed * deltaTime;

    if (window.game.isCollision(this, window.game.Player) && !this.grounded) {
      window.game.hitPlayer(100);
    }

    if (this.grounded) {
      this.rawY = window.game.display.height - this.sprite.length;
      if (this.alive) {
        this.setAction("FLY_UP");
        this.gravitySpeed = 0;
      } else {
        window.game.addScore(500);
        window.game.addGameStep("W");
        this.setAction("BURY");
        window.game.dynamites.push(
          new Dynamite(this.rawX),
          new Dynamite(this.rawX + this.sprite.length)
        );
      }
    }
  }

  updateFlyUp(deltaTime) {
    this.rawY -= this.speed * deltaTime;
    if (this.rawY <= 100) {
      this.rawY = 100;
      this.setAction("FLY");
    }
  }

  updateBury(deltaTime) {
    this.rawY += deltaTime * 10;
    if (this.rawY >= window.game.display.height) {
      window.game.warPlane = null;
    }
  }

  update(deltaTime) {
    switch (this.action) {
      case "FLY":
        this.updateFly(deltaTime);
        break;
      case "FALL":
        this.updateFall(deltaTime);
        break;
      case "FLY_UP":
        this.updateFlyUp(deltaTime);
        break;
      case "BURY":
        this.updateBury(deltaTime);
        break;
    }

    this.handleBombs(deltaTime);
    this.updateAnimation(deltaTime, this.animationFps);
  }

  bulletHit() {
    if (!this.hp) return;

    this.hp--;
    switch (this.hp) {
      case 25:
        this.speed += 30;
        break;

      case 20:
        this.bombDropDelay = 800;
        break;

      case 15:
        this.nextFallTime = 0;
        break;

      case 10:
        this.gravity = 400;
        break;

      case 5:
        this.speed += 30;
        this.bombDropDelay = 500;
        break;

      case 0:
        this.alive = false;
        this.setAction("FALL");
        break;
    }
  }

  get grounded() {
    return this.rawY + this.sprite.length >= window.game.display.height;
  }
  get x() {
    return Math.trunc(this.rawX);
  }
  get y() {
    return Math.trunc(this.rawY);
  }
}

class Bomb extends SpriteHandler {
  constructor(x, y, wind) {
    super(bombSprites);
    this.setAction("FALL");
    this.gravity = 200;
    this.gravitySpeed = 0;
    this.rawX = x;
    this.rawY = y;
    this.wind = wind;
  }

  update(deltaTime) {
    this.gravitySpeed += this.gravity * deltaTime;
    this.rawY += this.gravitySpeed * deltaTime;
    this.rawX += this.wind * deltaTime * 8;

    // returns boolean that tells if bomb has exploded
    if (this.grounded) {
      window.game.dynamites.push(new Dynamite(this.x - 12));
      return true;
    }

    return false;
  }

  get y() {
    return Math.trunc(this.rawY);
  }
  get x() {
    return Math.trunc(this.rawX);
  }
  get grounded() {
    return this.rawY + this.sprite.length >= window.game.display.height;
  }
}
