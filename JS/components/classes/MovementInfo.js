import controlSprites from "../../sprites/controlkeys.js";
import { SpriteHandler } from "./SpriteHandler.js";

class InfoSprite extends SpriteHandler {
  constructor(sprites, action, x, y) {
    super(sprites);
    this.setAction(action);
    this.animationFps = 2;
    this.x = x;
    this.y = y;
  }

  update(deltaTime) {
    this.updateAnimation(deltaTime, this.animationFps);
  }
}

export class MovementInfo {
  constructor() {
    this.infoSprites = [
      new InfoSprite({ WASD: controlSprites.WASD }, "WASD", 12, 15),
      new InfoSprite({ MOVE_TXT: controlSprites.MOVE_TXT }, "MOVE_TXT", 17, 40),
      new InfoSprite({ SPACE: controlSprites.SPACE }, "SPACE", 50, 26),
      new InfoSprite(
        { SHOOT_TXT: controlSprites.SHOOT_TXT },
        "SHOOT_TXT",
        52,
        40
      ),
    ];
  }

  update(deltaTime) {
    for (const infoSprite of this.infoSprites) {
      infoSprite.update(deltaTime);
    }
  }

  stop() {
    this.infoSprites = [];
  }
}
