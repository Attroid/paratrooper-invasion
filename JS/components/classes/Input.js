export class Input {
  constructor(canvas) {
    this.keys = new Set();

    canvas.addEventListener("keyup", (e) => this.handleKeyUp(e));
    canvas.addEventListener("keydown", (e) => this.handleKeyDown(e));
    canvas.addEventListener(
      "touchend",
      (e) => this.handleTouch(e.targetTouches),
      { passive: false }
    );
    canvas.addEventListener(
      "touchmove",
      (e) => this.handleTouch(e.targetTouches),
      { passive: false }
    );
    canvas.addEventListener(
      "touchstart",
      (e) => this.handleTouch(e.targetTouches),
      { passive: false }
    );
  }

  handleTouch(touches) {
    event.preventDefault();
    const boundingRect = window.game.display.canvas.getBoundingClientRect();

    if (window.game.display.oldControls.checked) {
      for (const button of window.game.display.buttons) {
        this.keys.delete(button.key);
        for (const touch of touches) {
          if (
            button.containsPoint(
              (touch.clientX - boundingRect.left) * this.bufferRatio,
              (touch.clientY - boundingRect.top) * this.bufferRatio
            )
          ) {
            this.keys.add(button.key);
            break;
          }
        }
      }
    } else {
      this.keys.delete(window.game.display.shootButton.key);
      for (const touch of touches) {
        if (
          window.game.display.shootButton.containsPoint(
            (touch.clientX - boundingRect.left) * this.bufferRatio,
            (touch.clientY - boundingRect.top) * this.bufferRatio
          )
        ) {
          this.keys.add(window.game.display.shootButton.key);
          break;
        }
      }

      let touched = false;
      for (const touch of touches) {
        if (
          window.game.display.joystick.containsPoint(
            (touch.clientX - boundingRect.left) * this.bufferRatio,
            (touch.clientY - boundingRect.top) * this.bufferRatio
          )
        ) {
          window.game.display.joystick.setTouch(
            (touch.clientX - boundingRect.left) * this.bufferRatio,
            (touch.clientY - boundingRect.top) * this.bufferRatio
          );
          touched = true;
          break;
        }
      }

      if (!touched) {
        window.game.display.joystick.setCenterTouch();
      }

      let joystickX = window.game.display.joystick.getX();
      let joystickY = window.game.display.joystick.getY();

      this.keys.delete("TouchW");
      this.keys.delete("TouchA");
      this.keys.delete("TouchD");

      if (joystickY > 0.3) this.keys.add("TouchW");
      if (joystickX > 0.3) this.keys.add("TouchA");
      if (joystickX < -0.3) this.keys.add("TouchD");
    }
  }

  getButton(key) {
    switch (key) {
      case "Fire":
        return (
          this.keys.has("Space") ||
          this.keys.has("TouchSpace") ||
          this.keys.has("KeyB")
        );

      case "Up":
        return this.keys.has("KeyW") || this.keys.has("TouchW");

      case "Left":
        return (
          (this.keys.has("KeyA") || this.keys.has("TouchA")) &&
          !(this.keys.has("KeyD") || this.keys.has("TouchD"))
        );

      case "Right":
        return (
          (this.keys.has("KeyD") || this.keys.has("TouchD")) &&
          !(this.keys.has("KeyA") || this.keys.has("TouchA"))
        );
    }
  }

  getAxis(axis) {
    let value = 0;

    switch (axis) {
      case "X":
        if (this.getButton("Left")) {
          value = -1;
        } else if (this.getButton("Right")) {
          value = 1;
        }

        break;

      case "Y":
        if (this.getButton("Up")) {
          value = -1;
        }

        break;
    }

    return value;
  }

  handleKeyDown(event) {
    event.preventDefault();

    switch (event.code) {
      case "ArrowLeft":
        this.keys.add("KeyA");
        break;
      case "ArrowUp":
        this.keys.add("KeyW");
        break;
      case "ArrowRight":
        this.keys.add("KeyD");
        break;
      case "ArrowDown":
        this.keys.add("KeyS");
        break;
      default:
        this.keys.add(event.code);
        break;
    }
  }

  handleKeyUp(event) {
    event.preventDefault();

    switch (event.code) {
      case "ArrowLeft":
        this.keys.delete("KeyA");
        break;
      case "ArrowUp":
        this.keys.delete("KeyW");
        break;
      case "ArrowRight":
        this.keys.delete("KeyD");
        break;
      case "ArrowDown":
        this.keys.delete("KeyS");
        break;
      default:
        this.keys.delete(event.code);
        break;
    }
  }

  get bufferRatio() {
    return document.documentElement.clientWidth < 500
      ? window.game.display.canvas.width /
          (document.documentElement.clientWidth - 16)
      : 1;
  }
}
