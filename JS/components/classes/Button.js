export class Button {
  constructor(x, y, width, height, key, sprite) {
    this.key = key;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.sprite = sprite;
    this.pxSize = Math.trunc(width / sprite.length);
  }

  containsPoint(x, y) {
    return !(
      x < this.x ||
      x > this.x + this.width ||
      y < this.y ||
      y > this.y + this.height
    );
  }
}
