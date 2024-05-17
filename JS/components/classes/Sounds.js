export class Sounds {
  constructor(soundsLocation) {
    this.soundsLocation = soundsLocation + "/" || "";
    this.preloaded = new Map();
    this.playingAudio = [];
    this.muted = false;
    this.muteSoundsCheckBox = document.getElementById("sounds-check-box");
  }

  preload(src) {
    if (!this.preloaded.has(src)) {
      let audio = new Audio(this.soundsLocation + src);
      audio.muted = true;
      audio.play();
      this.preloaded.set(src, audio);
    }

    return this.preloaded.get(src);
  }

  clearAudio() {
    for (const audio of this.playingAudio) {
      audio.muted = true;
    }

    this.playingAudio = [];
  }

  mute() {
    this.muted = true;
  }
  unmute() {
    this.muted = false;
  }

  playAndMuteOtherAudio(src, options) {
    this.mute();
    this.clearAudio();
    options.unmuteWhenEnded = true;
    this.play(src, options);
  }

  async play(src, options = {}) {
    if (options.volume === 0 || (this.muted && !options.unmuteWhenEnded)) {
      return;
    }

    let audio = this.preload(src).cloneNode();

    audio.muted = false;
    audio.volume = options.volume || 1;

    if (this.muteSoundsCheckBox.checked) {
      audio.volume = 0;
    }

    audio.currentTime = options.start || 0;
    this.playingAudio.push(audio);

    await audio.play();

    audio.addEventListener("ended", () => {
      if (options.unmuteWhenEnded) {
        this.unmute();
      }

      const index = this.playingAudio.indexOf(audio);
      this.playingAudio.splice(index, 1);
    });
  }
}
