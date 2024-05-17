import scooterunitSprites from "../../sprites/scooterunit.js";
import { MachineGun } from "./MachineGun.js";
import { SpriteHandler } from "../../components/index.js";

export class Scooterunit extends SpriteHandler {
  constructor(dir, speed) {
    super(scooterunitSprites);

    this.setAction("DRIVE");

    this.animationFps = 10;
    this.rawX =
      (dir === 1 ? 0 : window.game.display.width + 44) - this.sprite[0].length;
    this.rawY = window.game.display.height - this.sprite.length;
    this.speed = speed;
    this.dir = dir;
    this.alive = true;
    this.deadSinkDelay = 100;

    this.machineGun = null;

    this.dontVanish = false;
  }

  updateDrive(deltaTime) {
    this.speed *= 1.01;
    this.rawX += this.speed * this.dir * deltaTime;

    this.updateAnimation(deltaTime, this.animationFps);
  }

  updateScooterBroke(deltaTime) {
    const reachedLastSprite = this.updateAnimation(
      deltaTime,
      this.animationFps * 1.5
    );

    if (reachedLastSprite) {
      this.setAction("STAND");
      this.machineGun = new MachineGun(this.x, this.dir);
    }
  }

  updateStand(deltaTime) {
    this.updateAnimation(deltaTime, this.animationFps);
  }

  updateShotDie(deltaTime) {
    const reachedLastSprite = this.updateAnimation(
      deltaTime,
      this.animationFps * 2
    );

    if (reachedLastSprite && !this.dontVanish) {
      this.setAction("DEAD");
      this.startSinkTime = window.game.time + this.deadSinkDelay;
    }
  }

  updateDead(deltaTime) {
    if (this.startSinkTime >= window.game.time) return;

    this.rawY += deltaTime * 10;

    if (this.rawY > window.game.display.height) {
      window.game.scooterunitsToDestroy.push(this);
    }
  }

  checkCollisions() {
    if (
      window.game.isCollision(this, window.game.Player) &&
      this.action === "DRIVE"
    ) {
      window.game.hitPlayer(100);
    }
  }

  update(deltaTime) {
    if (this.machineGun) {
      this.machineGun.update(deltaTime);
    }

    switch (this.action) {
      case "DRIVE":
        this.updateDrive(deltaTime);
        break;
      case "SCOOTER_BROKE":
        this.updateScooterBroke(deltaTime);
        break;
      case "STAND":
        this.updateStand(deltaTime);
        break;
      case "SHOT_DIE":
        this.updateShotDie(deltaTime);
        break;
      case "DEAD":
        this.updateDead(deltaTime);
        break;
      default:
        break;
    }

    this.checkCollisions();
  }

  bulletHit() {
    switch (this.action) {
      case "DRIVE":
        window.game.sounds.play("bullet-hit.webm");
        this.setAction("SCOOTER_BROKE");
        break;

      default:
        if (!this.alive || this.action === "SCOOTER_BROKE") return;

        this.machineGun.explode();
        this.setAction("SHOT_DIE", { loop: false });
        this.alive = false;
        window.game.addScore(25);
        window.game.addGameStep("S");
        break;
    }
  }

  instantDie() {
    if (this.machineGun) this.machineGun.explode();
    this.setAction("SHOT_DIE", { loop: false });
    this.alive = false;
    this.dontVanish = true;
  }

  get x() {
    return Math.trunc(this.rawX);
  }

  get y() {
    return Math.trunc(this.rawY);
  }
}
