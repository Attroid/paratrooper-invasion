import armycarSprites from "../../sprites/armycar.js";
import { SpriteHandler } from "../../components/index.js";
import { Dynamite } from "./Dynamite.js";
import { Flame } from "./Flame.js";

export class ArmyCar extends SpriteHandler {
  constructor() {
    super(armycarSprites);

    this.setAction("DRIVE");

    this.animationFps = 25;
    this.rawX = 0;
    this.rawY = window.game.display.height - this.sprite.length;
    this.speed = 60;
  }

  updateDrive(deltaTime) {
    this.rawX += deltaTime * this.speed;

    this.updateAnimation(deltaTime, this.animationFps);
  }

  updateBroke(deltaTime) {
    this.updateAnimation(deltaTime, this.animationFps);
  }

  updateBury(deltaTime) {
    this.rawY += deltaTime * 5;

    if (this.rawY > 300) {
      window.game.playingIntro = false;
    }
  }

  update(deltaTime) {
    switch (this.action) {
      case "DRIVE":
        this.updateDrive(deltaTime);
        break;

      case "STAND":
        if (this.endOfStand <= window.game.time) {
          this.setAction("DRIVE");
        }

        this.updateAnimation(deltaTime, 15);
        break;

      case "BROKE":
        this.updateBroke(deltaTime);
        break;
      case "BURY":
        this.updateBury(deltaTime);
        break;
    }
  }

  bulletHit() {
    if (this.action === "BROKE" || this.action === "BURY") return;

    this.setAction("BROKE", {
      loop: false,
    });

    const dynamites = [
      new Dynamite(this.x - 10, 0, 0),
      new Dynamite(this.x + 10, 0, 0),
    ];

    const flames = [
      new Flame(this.x, window.game.display.height - 22),
      new Flame(this.x + 6, window.game.display.height - 22),
      new Flame(this.x + 14, window.game.display.height - 16),
      new Flame(this.x + 18, window.game.display.height - 16),
    ];

    window.game.dynamites.push(...dynamites);
    window.game.flames.push(...flames);

    setTimeout(() => {
      for (const flame of flames) {
        const index = window.game.flames.indexOf(flame);
        window.game.flames.splice(index, 1);
      }

      this.setAction("BURY");
    }, 5000);
  }

  get x() {
    return Math.trunc(this.rawX) - this.spriteSheet[0].length;
  }
  get y() {
    return Math.trunc(this.rawY);
  }

  stand(milliseconds) {
    this.setAction("STAND");
    this.endOfStand = window.game.time + milliseconds;
  }
}
