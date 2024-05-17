import paratrooperSprites from "../../sprites/paratrooper.js";
import { Dynamite } from "./Dynamite.js";
import { SpriteHandler } from "../../components/index.js";

export class Paratrooper extends SpriteHandler {
  constructor(x, glideSpeed, wind) {
    super(paratrooperSprites);

    this.setAction("GLIDE");

    this.rawX = x;
    this.rawY = -10;
    this.dir = this.rawX < window.game.display.width / 2 ? 1 : -1;
    this.wind = wind;

    this.animationFps = 5;
    this.glideSpeed = glideSpeed;
    this.isBombPlanted = false;

    this.gravity = 400;
    this.gravitySpeed = this.glideSpeed;

    this.alive = true;
  }

  updateGlide(deltaTime) {
    this.rawY += deltaTime * this.glideSpeed;
    this.rawX += deltaTime * this.wind;

    if (this.rawX > window.game.display.width) {
      this.rawX = -paratrooperSprites.GLIDE[0].length + 1;
    }

    if (this.isGrounded()) {
      this.setAction(window.game.Player.alive ? "PLANT_BOMB" : "STAND");
      this.rawY = this.groundedY;
    }

    this.updateAnimation(deltaTime, this.animationFps);
  }

  updateFall(deltaTime) {
    this.gravitySpeed += this.gravity * deltaTime;
    this.rawY += this.gravitySpeed * deltaTime;

    if (this.isGrounded()) {
      if (this.gravitySpeed > 300) {
        this.dir = 1;
        this.setAction("SPLASH_DIE");
        window.game.sounds.play("paratrooper-splash.webm", {
          volume: 0.1,
        });
        window.game.addScore(10);
        window.game.addGameStep("P");
      } else if (!window.game.Player.alive) {
        this.setAction("STAND");
      } else {
        this.setAction("PLANT_BOMB");
      }

      this.rawY = this.groundedY;
    }
  }

  updatePlantBomb(deltaTime) {
    if (Math.trunc(this.time) === 4 && !this.isBombPlanted) {
      window.game.dynamites.push(
        new Dynamite(this.dir === 1 ? this.x - 11 : this.x + 4, 3000)
      );
      this.isBombPlanted = true;
    }

    const isLastSprite = this.updateAnimation(deltaTime, this.animationFps * 3);

    if (isLastSprite) {
      this.setAction("RUN");
    }
  }

  updateRun(deltaTime) {
    this.rawX -= deltaTime * 30 * this.dir;

    if (
      this.x + this.sprite[0].length < 0 ||
      this.x > window.game.display.width
    ) {
      window.game.paratroopersToDestroy.push(this);
      window.game.addGameStep("PE");
      window.game.hitPlayer(5);
    }

    this.updateAnimation(deltaTime, this.animationFps * 3.5);
  }

  updateStand(deltaTime) {
    this.updateAnimation(deltaTime);
  }

  updateDie(deltaTime) {
    const isLastSprite = this.updateAnimation(deltaTime, this.animationFps * 3);

    if (isLastSprite) {
      window.game.paratroopersToDestroy.push(this);
    }
  }

  checkCollisions() {
    // Did paratrooper fall on player
    const player = window.game.Player;

    if (
      !(
        this.y + this.sprite.length < player.y ||
        this.y > window.game.Player.y + player.sprite.length ||
        this.x + 7 < player.x ||
        this.x > player.x + 9
      ) &&
      this.action === "FALL"
    ) {
      window.game.hitPlayer(100);
    }
  }

  update(deltaTime) {
    switch (this.action) {
      case "GLIDE":
        this.updateGlide(deltaTime);
        break;
      case "FALL":
        this.updateFall(deltaTime);
        break;
      case "PLANT_BOMB":
        this.updatePlantBomb(deltaTime);
        break;
      case "RUN":
        this.updateRun(deltaTime);
        break;
      case "STAND":
        this.updateStand(deltaTime);
        break;
      case "SHOT_DIE":
      case "SPLASH_DIE":
        this.updateDie(deltaTime);
        break;
    }

    this.checkCollisions();
  }

  bulletHit() {
    switch (this.action) {
      case "FALL":
      case "SHOT_DIE":
      case "SPLASH_DIE":
        return;

      case "GLIDE":
        window.game.sounds.play("bullet-hit.webm");
        this.setAction("FALL");
        break;

      default:
        window.game.sounds.play("bullet-hit.webm");
        this.setAction("SHOT_DIE");
        this.dir *= -1;
        window.game.addScore(10);
        window.game.addGameStep("P");
        break;
    }
  }

  get groundedY() {
    return window.game.display.height - paratrooperSprites.STAND[0].length;
  }

  isGrounded() {
    return this.rawY >= this.groundedY;
  }

  get x() {
    return Math.trunc(this.rawX);
  }
  get y() {
    return Math.trunc(this.rawY);
  }
}
