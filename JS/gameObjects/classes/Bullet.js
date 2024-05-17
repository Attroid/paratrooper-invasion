export class Bullet {
  constructor(x, y, dx, dy, speed) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.speed = speed;
  }

  checkCollisions() {
    // check outside screen
    if (this.x < 0 || this.x > window.game.display.width || this.y < 0) {
      window.game.bulletsToDestroy.push(this);
    }

    // check collisions with paratroopers
    for (const paratrooper of window.game.paratroopers) {
      if (paratrooper.alive) {
        if (window.game.isCollision(this, paratrooper)) {
          if (
            paratrooper.action === "RUN" ||
            paratrooper.action === "PLANT_BOMB"
          ) {
            window.game.bulletsToDestroy.push(this);
          }
          paratrooper.bulletHit();
        }
      }
    }

    // check collisions with scooterunits
    for (const scooterunit of window.game.scooterunits) {
      if (window.game.isCollision(this, scooterunit)) {
        if (scooterunit.alive) window.game.bulletsToDestroy.push(this);
        scooterunit.bulletHit();
      }
    }

    // check collisions with nuclearbombs
    for (const nuclearbomb of window.game.nuclearbombs) {
      if (window.game.isCollision(this, nuclearbomb)) {
        window.game.bulletsToDestroy.push(this);
        nuclearbomb.bulletHit();
      }
    }

    // check collisions with armycar
    if (
      window.game.isCollision(this, window.game.Car) &&
      window.game.Car.action !== "BROKE" &&
      window.game.Car.action !== "BURY"
    ) {
      window.game.bulletsToDestroy.push(this);
      window.game.Car.bulletHit();
    }

    // check collisions with warplane
    if (window.game.warPlane) {
      if (window.game.isCollision(this, window.game.warPlane)) {
        window.game.bulletsToDestroy.push(this);
        window.game.warPlane.bulletHit();
      }
    }
  }

  update(deltatime) {
    this.x += this.dx * deltatime * this.speed;
    this.y += this.dy * deltatime * this.speed;

    this.checkCollisions();
  }

  get sprite() {
    return ["X"];
  }
}
