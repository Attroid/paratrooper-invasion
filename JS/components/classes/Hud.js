import heartSprites from "../../sprites/heart.js";

export class Hud {
  constructor() {
    this.display = window.game.display;
    this.ctx = this.display.ctx;
    this.heartCount = 0;
    this.bossHpBarWidth = 500;
  }

  drawHeart(sprite) {
    const x = 12 * this.heartCount + 5;
    const y = 3;

    for (let i = 0; i < sprite.length; i++) {
      for (let j = 0; j < sprite[i].length; j++) {
        if (sprite[i][j] === "X") {
          this.display.ctx.fillRect((x + j) * 2, (y + i) * 2, 2, 2);
        }
      }
    }

    this.heartCount++;
  }

  draw(rawHp, score) {
    this.heartCount = 0;

    this.ctx.fillStyle = "#FFF";
    this.ctx.fillRect(0, 0, this.display.width * this.display.pixelSize, 30);
    this.ctx.fillStyle = "#000";

    const hp = rawHp < 0 ? 0 : rawHp;
    const fullHearts = Math.trunc(hp / 10);
    const halfHearts = Math.trunc((hp - fullHearts * 10) / 5);
    const emptyHearts = 10 - fullHearts - halfHearts;

    if (fullHearts > 10) window.game.hp = 0;

    for (let i = 0; i < fullHearts; i++) {
      this.drawHeart(heartSprites.full_heart);
    }

    for (let i = 0; i < halfHearts; i++) {
      this.drawHeart(heartSprites.half_heart);
    }

    for (let i = 0; i < emptyHearts; i++) {
      this.drawHeart(heartSprites.empty_heart);
    }

    if (window.game.warPlane) {
      this.ctx.fillStyle = "#000";
      this.ctx.fillRect(
        window.game.display.width - this.bossHpBarWidth / 2 - 2,
        50 - 2,
        this.bossHpBarWidth + 4,
        24
      );
      this.ctx.fillStyle = "#FFF";
      this.ctx.fillRect(
        window.game.display.width - this.bossHpBarWidth / 2,
        50,
        this.bossHpBarWidth,
        20
      );
      this.ctx.fillStyle = "#000";
      this.ctx.fillRect(
        window.game.display.width - this.bossHpBarWidth / 2 + 2,
        50 + 2,
        (this.bossHpBarWidth - 4) /
          (window.game.warPlane.maxHp / window.game.warPlane.hp),
        16
      );
    }

    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 30, this.display.width * this.display.pixelSize, 2);
    this.ctx.fillRect(260, 0, 2, 30);

    this.ctx.font = "26px Arial";

    if (window.game.spawner.levels.length < window.game.level) {
      this.ctx.fillText(`FREEPLAY`, 270, 25);
    } else {
      this.ctx.fillText(`LEVEL: ${window.game.level}`, 270, 25);
    }

    this.ctx.fillRect(420, 0, 2, 30);
    this.ctx.fillText(`POINTS: ${score}`, 430, 25);

    if ((this.duration || 0) >= window.game.time) {
      this.ctx.font = "80px Arial";
      this.ctx.fillText(this.txt, this.txtX, 200);
    }
  }

  showText(txt, time, txtX = 250) {
    this.txt = txt;
    this.txtX = txtX;
    this.duration = time + window.game.time;
  }

  gameover() {
    this.ctx.font = "80px Arial";
    this.ctx.fillText("Game over", 200, 200);

    this.ctx.font = "60px Arial";
    this.ctx.fillText(`Your points: ${window.game.score}`, 200, 300);
  }
}
