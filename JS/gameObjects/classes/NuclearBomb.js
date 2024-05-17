import nuclearbombSprites from "../../sprites/nuclearbomb.js";
import { SpriteHandler } from "../../components/index.js";
import { Flame } from "./Flame.js";

export class NuclearBomb extends SpriteHandler {
  constructor(x, glideSpeed, wind) {
    super(nuclearbombSprites);

    this.setAction("GLIDE");

    this.rawX = x;
    this.rawY = -10;
    this.animationFps = 7;
    this.wind = wind;

    this.glideSpeed = glideSpeed;

    this.gravity = 400;
    this.gravitySpeed = this.glideSpeed;

    this.flashGen = this.flashGenerator();
    this.exploded = false;
  }

  updateGlide(deltaTime) {
    this.rawY += deltaTime * this.glideSpeed;
    this.rawX += deltaTime * this.wind;

    if (this.grounded) {
      this.setAction("BURY");

      this.rawY = this.groundedY;
    }

    this.updateAnimation(deltaTime, this.animationFps);
  }

  updateFall(deltaTime) {
    this.gravitySpeed += this.gravity * deltaTime;
    this.rawY += this.gravitySpeed * deltaTime;

    if (this.grounded) {
      this.startExplosion();
      this.rawY = this.groundedY;
    }

    this.updateAnimation(deltaTime);
  }

  updateBury(deltaTime) {
    const lastSprite = this.updateAnimation(
      deltaTime,
      this.animationFps * 1.2 * 3
    );

    if (lastSprite) {
      window.game.nuclearbombsToDestroy.push(this);
    }
  }

  startFire() {
    for (let i = 0; i < window.game.display.width; i += 8) {
      window.game.flames.push(new Flame(i));
    }
  }

  *flashGenerator() {
    for (let i = 1; i > 0; i -= 0.1) yield i;
    for (let i = 1; i < 100; i++) yield 0;
    this.startFire();
    for (let i = 0; i <= 1; i += 0.005) yield i;
  }

  updateExplode(deltaTime) {
    this.updateAnimation(deltaTime, this.animationFps * 2);

    let tmp = this.flashGen.next();

    if (tmp.done) {
      window.game.nuclearbombsToDestroy.push(this);
    }

    window.game.display.ctx.globalAlpha = tmp.value;
  }

  update(deltaTime) {
    switch (this.action) {
      case "GLIDE":
        this.updateGlide(deltaTime);
        break;
      case "FALL":
        this.updateFall(deltaTime);
        break;
      case "BURY":
        this.updateBury(deltaTime);
        break;
      case "EXPLODE":
        this.updateExplode(deltaTime);
        break;
    }
  }

  bulletHit() {
    if (this.action !== "EXPLODE") {
      if (this.grounded) {
        this.startExplosion();
      } else {
        this.setAction("FALL");
      }
    }
  }

  startExplosion() {
    if (this.exploded) return;
    this.exploded = true;

    window.game.sounds.playAndMuteOtherAudio("nuclear-bomb.webm", {
      volume: 0.6,
    });

    this.setAction("EXPLODE", {
      loop: false,
    });

    window.game.hitPlayer(100);
    window.game.Player.alive = false;

    for (const paratrooper of window.game.paratroopers) {
      paratrooper.gravitySpeed = 500;
      paratrooper.bulletHit();
    }

    for (const scooterunit of window.game.scooterunits) {
      scooterunit.instantDie();
    }

    for (const nuclearbomb of window.game.nuclearbombs) {
      if (nuclearbomb !== this) {
        const index = window.game.nuclearbombs.indexOf(nuclearbomb);
        window.game.nuclearbombs.splice(index, 1);
      }
    }
  }

  get x() {
    return Math.trunc(this.rawX);
  }
  get y() {
    return Math.trunc(this.rawY);
  }

  get grounded() {
    return this.rawY >= window.game.display.height - 28;
  }
  get groundedY() {
    return window.game.display.height - 28;
  }
}
