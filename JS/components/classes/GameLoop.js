export class GameLoop {
  constructor(fps) {
    this.timeStep = (1000 / fps) | 0;
    this.time = 0;
    this.paused = true;
  }

  pause() {
    this.paused = true;
    this.realTime = null;
    if (this.request) {
      cancelAnimationFrame(this.request);
      this.request = null;
    }
  }

  unpause() {
    this.realTime = performance.now() | 0;
    this.paused = false;
    this.makeRequest();
  }

  togglePause() {
    this.paused ? this.unpause() : this.pause();
  }

  makeRequest() {
    this.request = requestAnimationFrame(() => this.onRequest());
  }

  onRequest() {
    if (!this.paused) {
      const timeNow = performance.now() | 0;
      let steps = ((timeNow - this.realTime) / this.timeStep) | 0;
      if (steps) {
        this.runSteps(steps);
        this.draw();
        this.makeRequest();
      } else {
        setTimeout(
          () => this.onRequest(),
          this.timeStep - (timeNow - this.realTime)
        );
      }
    }
  }

  runSteps(steps) {
    for (let i = 0; i < steps && !this.paused; ++i) {
      this.realTime += this.timeStep;
      this.update(this.timeStep / 1000);
      this.time += this.timeStep;
    }
  }

  update(deltatime) {
    // Override!
  }

  draw() {
    // Override!
  }
}
