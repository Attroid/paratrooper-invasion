export class Joystick {
  constructor(x, y, size, joystickRadius) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.radius = size / 2;
    this.joystickRadius = joystickRadius;
    this.maxDistance = this.radius - joystickRadius;
    this.middleX = x + this.radius;
    this.middleY = y + this.radius;

    this.touchX = x + this.radius;
    this.touchY = y + this.radius;
  }

  setTouch(x, y) {
    this.touchX = x;
    this.touchY = y;

    let horizontalDistance = this.middleX - this.touchX;
    let verticalDistance = this.middleY - this.touchY;

    let distance = Math.floor(
      Math.sqrt(horizontalDistance ** 2 + verticalDistance ** 2)
    );

    if (distance > this.maxDistance) {
      let normalizedHorizontalDistance = horizontalDistance / distance;
      let normalizedVerticalDistance = verticalDistance / distance;

      this.touchX =
        this.middleX - normalizedHorizontalDistance * this.maxDistance;
      this.touchY =
        this.middleY - normalizedVerticalDistance * this.maxDistance;
    }
  }

  setCenterTouch() {
    this.touchX = this.x + this.radius;
    this.touchY = this.y + this.radius;
  }

  containsPoint(x, y) {
    return !(
      x < this.x - 50 ||
      x > this.x + this.size + 50 ||
      y < this.y - 50 ||
      y > this.y + this.size + 50
    );
  }

  getX() {
    return (this.middleX - this.touchX) / this.maxDistance;
  }

  getY() {
    return (this.middleY - this.touchY) / this.maxDistance;
  }
}
