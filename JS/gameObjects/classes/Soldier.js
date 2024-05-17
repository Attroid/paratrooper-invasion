import soldierSprites from "../../sprites/soldier.js";
import { Bullet } from "./Bullet.js";
import { SpriteHandler } from "../../components/index.js";

export class Soldier extends SpriteHandler {
  constructor(x) {
    super(soldierSprites);
    this.animationFps = 20;
    this.setAction("STAND");
    this.rawX = x;
    this.rawY = window.game.display.height - this.sprite.length;
    this.walkSpeed = 80;
    this.dir = 1;
    this.bullets = [];
    this.nextShootTime = 0;
    if (document.querySelector("#old-touchpad-box").checked) {
      this.nextShootTime = window.game.time + 4000;
    }

    this.shootDelay = 500;
    this.bulletDX = 1;
    this.bulletDY = 0;
    this.bulletSpeed = 300;
    this.alive = true;
  }

  calculateBulletShootingPosition() {
    let pos = {};

    if (this.bulletDX === 0 && this.bulletDY === -1) {
      pos.x = this.rawX + this.sprite[0].length / 2 + this.dir * 4.5;
      pos.y = this.rawY + 10;
    } else if (this.bulletDY === 0) {
      pos.y = this.rawY + 9;
      pos.x = this.rawX + 10;
    } else if (this.bulletDX === -1 && this.bulletDY === -1) {
      pos.y = this.rawY + 9;
      pos.x = this.rawX + 5;
    } else {
      pos.y = this.rawY + 9;
      pos.x = this.rawX + 14;
    }

    return pos;
  }

  shoot() {
    window.game.sounds.play("soldier-shoot.webm", {
      volume: 0.25,
    });
    let startPos = this.calculateBulletShootingPosition();

    this.bullets.push(
      new Bullet(
        startPos.x,
        startPos.y,
        this.bulletDX,
        this.bulletDY,
        this.bulletSpeed
      )
    );

    this.nextShootTime = window.game.time + this.shootDelay;
  }

  handleInput(input) {
    this.bulletDY = 0;

    this.bulletDX = input.getAxis("X");
    this.bulletDY = input.getAxis("Y");

    if (this.bulletDX) this.dir = input.getAxis("X");
    if (!this.bulletDY) this.bulletDX = this.dir;

    if (input.getButton("Up") && input.getButton("Left")) {
      this.setAction("WALK_DIAGONAL_AIM", { restartTime: false });
    } else if (input.getButton("Up") && input.getButton("Right")) {
      this.setAction("WALK_DIAGONAL_AIM", { restartTime: false });
    } else if (input.getButton("Left")) {
      this.setAction("WALK", { restartTime: false });
    } else if (input.getButton("Right")) {
      this.setAction("WALK", { restartTime: false });
    } else if (input.getButton("Up")) {
      this.setAction("STAND_AIM_UP");
    } else {
      this.setAction("STAND");
    }

    if (
      (input.getButton("Fire") || window.game.display.oldControls.checked) &&
      this.nextShootTime <= window.game.time
    )
      this.shoot();
  }

  updateWalk(deltaTime) {
    if (this.action === "STAND" || this.action === "STAND_AIM_UP") return;

    this.rawX += this.walkSpeed * this.dir * deltaTime;

    if (this.rawX < 0) {
      this.rawX = 0;
    } else if (this.rawX + this.sprite[0].length > window.game.display.width) {
      this.rawX = window.game.display.width - this.sprite[0].length;
    }
  }

  update(deltaTime) {
    for (const bullet of this.bullets) {
      bullet.update(deltaTime);
    }

    if (this.alive) {
      this.handleInput(window.game.input);
      this.updateWalk(deltaTime);
      this.updateAnimation(deltaTime, this.animationFps);
    } else {
      if (this.action !== "DEAD") {
        this.setAction("DEAD", { loop: false });
      }

      this.updateAnimation(deltaTime, this.animationFps);
    }
  }

  get x() {
    return Math.trunc(this.rawX);
  }
  get y() {
    return Math.trunc(this.rawY);
  }
}
