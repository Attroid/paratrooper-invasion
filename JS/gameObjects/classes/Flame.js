import flameSprites from "../../sprites/flame.js";
import { SpriteHandler } from "../../components/index.js";

export class Flame extends SpriteHandler {
  constructor(x, y = window.game.display.height - 13) {
    super(flameSprites);

    this.setAction("FLAME");
    this.x = x;
    this.y = y;
    this.animationFps = 14;
  }

  update(deltaTime) {
    this.updateAnimation(deltaTime, this.animationFps);
  }
}
