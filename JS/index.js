"use strict";

import {
  GameLoop,
  Display,
  Input,
  Hud,
  Sounds,
  Spawner,
  MovementInfo,
} from "./components/index.js";

import { Soldier, ArmyCar } from "./gameObjects/index.js";

import levels from "./levels.js";

class ParatrooperInvasionGame extends GameLoop {
  constructor(display, input, sounds) {
    super(60);

    window.game = this;
    this.display = display;
    this.input = input;
    this.sounds = sounds;
    this.spawner = new Spawner(levels);

    this.sounds.preload("minigun-shots.webm");
    this.sounds.preload("explosion.webm");
    this.sounds.preload("paratrooper-splash.webm");
    this.sounds.preload("soldier-shoot.webm");
    this.sounds.preload("bullet-hit.webm");
    this.sounds.preload("nuclear-bomb.webm");

    this.paratroopers = [];
    this.scooterunits = [];
    this.dynamites = [];
    this.nuclearbombs = [];
    this.flames = [];
    this.warPlane = null;

    this.maxEnemies = 30;
    this.Car = new ArmyCar();
    this.movementInfo = new MovementInfo();
    this.introCarStopped = false;
    this.playingIntro = true;
    this.spawnCounter = 0;
    this.spawnTime = 1;
    this.hud = new Hud();
    this.hp = 100;

    this.score = 0;
    this.paratrooperGlideSpeed = 15;
    this.nukeGlideSpeed = 20;

    this.scooterunitsToDestroy = [];
    this.paratroopersToDestroy = [];
    this.dynamitesToDestroy = [];
    this.bulletsToDestroy = [];
    this.nuclearbombsToDestroy = [];

    this.level = 1;
    this.gameSteps = [];
  }

  destroyObjs(objs, objsToDestroy) {
    for (let i = 0; i < objsToDestroy.length; i++) {
      const index = objs.indexOf(objsToDestroy[i]);

      if (index !== -1) {
        objs.splice(index, 1);
      }
    }
  }

  isCollision(a, b) {
    if (!a.sprite || !b.sprite) return false;
    return !(
      a.y + a.sprite.length < b.y ||
      a.y > b.y + b.sprite.length ||
      a.x + a.sprite[a.sprite.length - 1].length < b.x ||
      a.x > b.x + b.sprite[b.sprite.length - 1].length
    );
  }

  addScore(amount) {
    if (this.hp > 0) {
      this.score += amount;
    }
  }

  addGameStep(symbol) {
    if (this.hp > 0) {
      this.gameSteps.push([symbol, this.time]);
    }
  }

  hitPlayer(dmg) {
    this.hp = Math.max(0, this.hp - dmg);
  }

  pause() {
    super.pause();
    this.draw();
  }

  unpause() {
    super.unpause();
  }

  start() {
    this.unpause();
  }

  stop() {
    this.stopped = true;
    this.pause();
  }

  updateIntro(deltaTime) {
    this.movementInfo.update(deltaTime);

    this.Car.update(deltaTime);

    if (
      this.Car.x + this.Car.spriteSheet[0].length >= this.display.width / 2 &&
      !this.introCarStopped
    ) {
      this.movementInfo.stop();
      this.Car.stand(2000);
      this.introCarStopped = true;
      this.Player = new Soldier(this.display.width / 2 - 20);
      this.spawner.setLevel(this.level);
    }

    if (this.Car.x - this.Car.spriteSheet[0].length >= this.display.width) {
      this.playingIntro = false;
    }
  }

  updateGame(deltaTime) {
    this.Player.update(deltaTime);

    if (this.warPlane) this.warPlane.update(deltaTime);

    for (const scooterunit of this.scooterunits) {
      scooterunit.update(deltaTime);
    }

    for (const paratrooper of this.paratroopers) {
      paratrooper.update(deltaTime);
    }

    for (const dynamite of this.dynamites) {
      dynamite.update(deltaTime);
    }

    for (const nuclearbomb of this.nuclearbombs) {
      nuclearbomb.update(deltaTime);
    }

    for (const flame of this.flames) {
      flame.update(deltaTime);
    }

    if (this.hp <= 0 && this.Player.alive) {
      this.Player.alive = false;

      for (const paratrooper of this.paratroopers) {
        paratrooper.playerAlive = false;
      }
    }

    this.destroyObjs(this.Player.bullets, this.bulletsToDestroy);
    this.destroyObjs(this.dynamites, this.dynamitesToDestroy);
    this.destroyObjs(this.paratroopers, this.paratroopersToDestroy);
    this.destroyObjs(this.scooterunits, this.scooterunitsToDestroy);
    this.destroyObjs(this.nuclearbombs, this.nuclearbombsToDestroy);
  }

  update(deltaTime) {
    if (this.Player) {
      this.updateGame(deltaTime);

      if (this.spawner.lvlGen && this.Player.alive) {
        this.spawner.updateLevel();
      } else if (
        !this.currentTrooperCount &&
        this.level <= levels.length &&
        this.Player.alive
      ) {
        this.spawner.setLevel(++this.level);
      }
    }

    if (this.playingIntro) {
      this.updateIntro(deltaTime);
    }
  }

  draw() {
    this.display.beginFrame();

    if (this.Player) {
      if (this.flames.length) {
        for (const flame of this.flames) {
          this.display.drawSprite(flame);
        }

        this.display.clear(
          this.Player.x * 2 + 15,
          (this.display.height - 20) * 2,
          this.Player.sprite[0].length * 2 - 26,
          40
        );
      }

      this.display.drawSprite(this.Player, this.Player.dir);

      if (this.warPlane) {
        this.display.drawSprite(this.warPlane, this.warPlane.dir);

        for (const bomb of this.warPlane.bombs) {
          this.display.drawSprite(bomb);
        }
      }

      for (const bullet of this.Player.bullets) {
        this.display.drawSprite(bullet);
      }

      for (const paratrooper of this.paratroopers) {
        this.display.drawSprite(paratrooper, paratrooper.dir);
      }

      for (const scooterunit of this.scooterunits) {
        this.display.drawSprite(scooterunit, scooterunit.dir);

        if (scooterunit.machineGun) {
          this.display.drawSprite(
            scooterunit.machineGun,
            scooterunit.machineGun.dir
          );

          for (const bullet of scooterunit.machineGun.bullets) {
            this.display.drawSprite(bullet);
          }
        }
      }

      for (const dynamite of this.dynamites) {
        this.display.drawSprite(dynamite);
      }

      for (const nuclearbomb of this.nuclearbombs) {
        this.display.drawSprite(nuclearbomb);
      }
    }

    if (this.playingIntro) {
      this.display.drawSprite(this.Car);

      if (!this.display.checkBox.checked) {
        for (const infoSprite of this.movementInfo.infoSprites) {
          this.display.drawSprite(infoSprite, 1, 8);
        }
      }
    }

    if (this.Player) {
      if (!this.Player.alive) {
        this.hud.gameover();
      }
    }

    this.hud.draw(this.hp, this.score);

    this.display.closeFrame();
  }

  get currentTrooperCount() {
    return (
      this.paratroopers.length +
      this.scooterunits.length +
      (this.warPlane ? 1 : 0)
    );
  }
}

window.addEventListener("load", () => {
  const display = new Display(400, 300, 2);
  const input = new Input(display.canvas);
  const sounds = new Sounds(
    "https://geronimo.okol.org/~attkoiv/paratrooper-invasion/2.1.0/SOUNDS"
  );
  let game;

  document.querySelector("#start").addEventListener("click", () => {
    if (game) {
      display.ctx.globalAlpha = 1;
      sounds.clearAudio();
      sounds.unmute();
      game.stop();
    }

    game = new ParatrooperInvasionGame(display, input, sounds);
    display.prepare();
    game.start();
  });

  let expanded = false;

  document.getElementById("selectBox").addEventListener("click", () => {
    const checkboxes = document.getElementById("checkboxes");
    if (!expanded) {
      checkboxes.style.display = "block";
      expanded = true;
    } else {
      checkboxes.style.display = "none";
      expanded = false;
    }
  });
});

document.querySelector("#toHide").style.display = "none";
document.querySelector("#touchpad-box").addEventListener("change", function () {
  if (!this.checked) {
    document.querySelector("#toHide").style.display = "none";
  } else {
    document.querySelector("#toHide").style.display = "";
  }
});
