import touchpadSprites from "../../sprites/touchpad.js";
import { Button } from "./Button.js";
import { Joystick } from "./Joystick.js";

export class Display {
  constructor(width, height, pixelSize, bgColor = "#FFF") {
    this.touchpadHeight = 300;
    this.groundHeight = 10;

    const canvasElement = document.querySelector("#game");
    canvasElement.width = width * pixelSize;
    canvasElement.height = height * pixelSize + this.groundHeight;
    canvasElement.style.backgroundColor = bgColor;

    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext("2d");
    this.width = width;
    this.height = height;
    this.pixelSize = pixelSize;

    this.checkBox = document.querySelector("#touchpad-box");
    this.oldControls = document.querySelector("#old-touchpad-box");
    this.touchpadOn = false;

    this.buttons = [
      new Button(
        40,
        this.canvas.height + 40,
        200,
        200,
        "TouchA",
        touchpadSprites.arrow_left
      ),
      new Button(
        560,
        this.canvas.height + 40,
        200,
        200,
        "TouchW",
        touchpadSprites.arrow_up
      ),
      new Button(
        250,
        this.canvas.height + 40,
        200,
        200,
        "TouchD",
        touchpadSprites.arrow_right
      ),
    ];

    this.shootButton = new Button(
      500,
      this.canvas.height + 20,
      250,
      250,
      "TouchSpace",
      touchpadSprites.bullet
    );
    this.joystick = new Joystick(50, this.canvas.height + 20, 250, 50);

    this.colorCodes = {
      X: "#000",
      O: "#FFF",
    };
  }

  prepare() {
    this.canvas.classList.add("started-game");
    this.ctx.globalAlpha = 1;
    this.canvas.focus();
    this.canvas.scrollIntoView();
  }

  beginFrame() {
    if (
      (this.checkBox.checked && !this.touchpadOn) ||
      (!this.checkBox.checked && this.touchpadOn)
    ) {
      this.toggleTouchpad(this.checkBox.checked);
    }

    this.ctx.beginPath();
    this.clear();
  }

  toggleTouchpad(bool) {
    let canvasHeight = this.height * this.pixelSize + this.groundHeight;

    if (bool) {
      canvasHeight += this.touchpadHeight;
    }

    this.canvas.height = canvasHeight;
    this.touchpadOn = bool;
  }

  clear(x = 0, y = 0, width = this.canvas.width, height = this.canvas.height) {
    this.ctx.clearRect(x, y, width, height);
  }

  closeFrame() {
    this.drawTouchpad();
    this.ctx.closePath();
  }

  drawTouchpad() {
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(
      0,
      this.height * this.pixelSize,
      this.width * this.pixelSize,
      this.touchpadHeight + this.groundHeight
    );
    if (this.oldControls.checked) {
      for (const button of this.buttons) {
        this.ctx.fillStyle = "#FFF";
        this.ctx.fillRect(button.x, button.y, button.width, button.height);
        this.ctx.fillStyle = "#000";

        for (let i = 0; i < button.sprite.length; i++) {
          for (let j = 0; j < button.sprite[i].length; j++) {
            if (button.sprite[i][j] === "X") {
              this.ctx.fillRect(
                button.x + j * button.pxSize,
                button.y + i * button.pxSize,
                button.pxSize,
                button.pxSize
              );
            }
          }
        }
      }
    } else {
      this.ctx.fillStyle = "#FFF";
      this.ctx.fillRect(
        this.shootButton.x,
        this.shootButton.y,
        this.shootButton.width,
        this.shootButton.height
      );
      this.ctx.fillStyle = "#000";

      for (let i = 0; i < this.shootButton.sprite.length; i++) {
        for (let j = 0; j < this.shootButton.sprite[i].length; j++) {
          if (this.shootButton.sprite[i][j] === "X") {
            this.ctx.fillRect(
              this.shootButton.x + j * this.shootButton.pxSize,
              this.shootButton.y + i * this.shootButton.pxSize,
              this.shootButton.pxSize,
              this.shootButton.pxSize
            );
          }
        }
      }

      this.ctx.fillStyle = "#FFF";
      this.ctx.arc(
        this.joystick.x + this.joystick.radius,
        this.joystick.y + this.joystick.radius,
        this.joystick.radius,
        0,
        2 * Math.PI
      );
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.fillStyle = "#000";
      this.ctx.arc(
        this.joystick.touchX,
        this.joystick.touchY,
        this.joystick.joystickRadius,
        0,
        2 * Math.PI
      );
      this.ctx.fill();
      this.ctx.stroke();
    }
  }

  drawSprite(obj, dir = 1, pixelSize = this.pixelSize) {
    if (!obj.sprite) return;
    const [x, y, sprite] = [obj.x, obj.y, obj.sprite];

    if (dir === 1) {
      for (let i = 0; i < sprite.length; i++) {
        for (let j = 0; j < sprite[i].length; j++) {
          if (sprite[i][j].trim()) {
            this.ctx.fillStyle = this.colorCodes[sprite[i][j]];
            this.ctx.fillRect(
              (x + j) * pixelSize,
              (y + i) * pixelSize,
              pixelSize,
              pixelSize
            );
          }
        }
      }
    } else {
      for (let i = 0; i < sprite.length; i++) {
        for (let j = 0; j < sprite[i].length; j++) {
          if (sprite[i][j].trim()) {
            this.ctx.fillStyle = this.colorCodes[sprite[i][j]];
            this.ctx.fillRect(
              (x + sprite[i].length - j) * pixelSize,
              (y + i) * pixelSize,
              pixelSize,
              pixelSize
            );
          }
        }
      }
    }
  }
}
