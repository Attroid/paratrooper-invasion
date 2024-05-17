import {
  Paratrooper,
  Scooterunit,
  NuclearBomb,
  WarPlane,
} from "../../gameObjects/index.js";

export class Spawner {
  constructor(levels) {
    this.levels = levels;
    this.lvlGen = null;
    this.nextUnit = null;
    this.windGen = this.windGenerator();
    this.wind = 0;

    this.scooterUnitDir = Math.random() < 0.5 ? 1 : -1;

    this.lastX = 0;
  }

  getRandX() {
    let x;
    for (;;) {
      x = Math.floor(Math.random() * 377);
      if (Math.abs(this.lastX - x) > 25) break;
    }

    return x;
  }

  *windGenerator() {
    const maxChange = 1;
    let growTimes;

    for (;;) {
      let wind = 0;

      if (Math.random() < 0.2) {
        growTimes = Math.floor(Math.random() * 2) + 3;

        for (let i = 0; i < growTimes; ++i) {
          wind += Math.floor(Math.random() * maxChange) + 1;
          yield wind * 2;
        }

        while (wind) {
          yield --wind * 2;
        }
      }

      yield 0;
    }
  }

  *levelGenerator(lvl) {
    const prepare_unit = (unit) => {
      let tmp = {};
      if (unit.delay) this.wind = this.windGen.next().value;

      switch (unit.name) {
        case "paratrooper":
          tmp.unit = new Paratrooper(
            this.getRandX(),
            window.game.paratrooperGlideSpeed,
            this.wind
          );
          tmp.fall = unit.fall || false;
          tmp.delay = (unit.delay || 0) + window.game.time;
          break;

        case "scooterunit":
          (tmp.unit = new Scooterunit(this.scooterUnitDir, 20)),
            (tmp.delay = (unit.delay || 0) + window.game.time);

          if (Math.random() > 0.25) this.scooterUnitDir *= -1;
          break;

        case "nuclearbomb":
          tmp.unit = new NuclearBomb(
            this.getRandX(),
            window.game.nukeGlideSpeed,
            this.wind
          );
          tmp.delay = (unit.delay || 0) + window.game.time;
          break;

        case "warplane":
          tmp.unit = new WarPlane();
          tmp.delay = (unit.delay || 0) + window.game.time;
          break;
      }

      return tmp;
    };

    if (this.levels.length >= lvl) {
      for (const unit of this.levels[lvl - 1]) {
        yield prepare_unit(unit);
      }
    } else {
      const attacks = [
        // Easy
        [
          [
            { name: "paratrooper", delay: 2000 },
            { name: "paratrooper", delay: 800 },
            { name: "paratrooper", delay: 800 },
          ],
          [
            { name: "paratrooper", delay: 2000 },
            { name: "scooterunit", delay: 800 },
            { name: "paratrooper", delay: 800 },
          ],
        ],
        // Medium
        [
          [
            { name: "scooterunit", delay: 1000 },
            { name: "paratrooper", delay: 500 },
            { name: "paratrooper", delay: 500 },
            { name: "paratrooper", delay: 500 },
            { name: "paratrooper", delay: 500 },
          ],
          [
            { name: "paratrooper", delay: 1000 },
            { name: "paratrooper", delay: 500 },
            { name: "paratrooper", delay: 500 },
            { name: "nuclearbomb", delay: 3000 },
          ],
        ],
        // Hard
        [
          [
            { name: "scooterunit" },
            { name: "scooterunit" },
            { name: "paratrooper", delay: 1000 },
            { name: "paratrooper" },
            { name: "scooterunit" },
            { name: "scooterunit" },
          ],
          [
            { name: "scooterunit", delay: 1000 },
            { name: "scooterunit" },
            { name: "paratrooper", delay: 500 },
            { name: "paratrooper" },
            { name: "paratrooper", delay: 500 },
            { name: "paratrooper" },
            { name: "paratrooper", delay: 500 },
            { name: "paratrooper" },
            { name: "paratrooper", delay: 500 },
            { name: "paratrooper" },
          ],
        ],
      ];

      const changes = [
        { easy: 90, medium: 100 },
        { easy: 80, medium: 100 },
        { easy: 70, medium: 95 },
        { easy: 60, medium: 85 },
        { easy: 50, medium: 85 },
        { easy: 40, medium: 75 },
        { easy: 30, medium: 60 },
        { easy: 20, medium: 50 },
      ];

      let changes_lv = 0;
      for (let attack_counter = 0; true; attack_counter++) {
        if (
          attack_counter % 3 === 0 &&
          attack_counter !== 0 &&
          changes_lv + 1 !== changes.length
        ) {
          changes_lv++;
        }

        const rand = Math.floor(Math.random() * 100);
        let i =
          rand < changes[changes_lv].easy
            ? 0
            : rand < changes[changes_lv].medium
            ? 1
            : 2;

        for (const unit of attacks[i][
          Math.floor(Math.random() * attacks[i].length)
        ]) {
          yield prepare_unit(unit);
        }
      }
    }
  }

  setLevel(lvl) {
    if (lvl <= this.levels.length) {
      window.game.hud.showText(`LEVEL ${lvl}`, 1000);
    } else if (lvl === this.levels.length + 1) {
      window.game.hud.showText(`FREE PLAY`, 1000, 200);
    }
    this.lvlGen = this.levelGenerator(lvl);
  }

  updateLevel() {
    if (!this.next) {
      let tmp = this.lvlGen.next();

      if (tmp.done) {
        this.lvlGen = null;
        return;
      }

      this.next = tmp.value;
    } else if (this.next.delay <= window.game.time) {
      switch (true) {
        case this.next.unit instanceof Paratrooper:
          window.game.paratroopers.push(this.next.unit);
          if (this.next.fall) this.next.unit.bulletHit();
          break;

        case this.next.unit instanceof Scooterunit:
          window.game.scooterunits.push(this.next.unit);
          break;

        case this.next.unit instanceof NuclearBomb:
          window.game.nuclearbombs.push(this.next.unit);
          break;

        case this.next.unit instanceof WarPlane:
          window.game.warPlane = this.next.unit;
          break;
      }

      this.next = null;
    }
  }
}
