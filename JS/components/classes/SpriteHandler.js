export class SpriteHandler {
  constructor(spriteSource) {
    this.spriteSource = spriteSource;
    this.time = 0;
    this.animationLoop = true;
  }

  setAction(action, options) {
    let tmp = this.time;
    this.action = action;
    this.time = 0;

    for (const prop in options) {
      switch (prop) {
        case "loop":
          this.animationLoop = options[prop];
          break;
        case "restartTime":
          if (options[prop] === false) this.time = tmp;
          break;
      }
    }

    if (!this.spriteSource[action]) return;
    this.spriteSheet = this.spriteSource[action];
    this.sprite = this.spriteSheet[Math.trunc(this.time)];
  }

  updateAnimation(deltaTime, multiplier = 1) {
    this.time += deltaTime * multiplier;

    let lastSprite = false;
    if (Math.trunc(this.time) >= this.spriteSheet.length) {
      this.time = this.animationLoop ? 0 : this.spriteSheet.length - 1;
      lastSprite = true;
    }

    this.sprite = this.spriteSheet[Math.trunc(this.time)];
    return lastSprite;
  }
}
