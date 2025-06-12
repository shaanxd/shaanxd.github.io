import { AudioPlay } from "kaplay";
import context from "../context";
import StateService from "../state";

const SoundService = (function () {
  let music: AudioPlay;

  return {
    init() {
      const isMusicEnabled = StateService.get().musicEnabled;

      music = context.play("bgm", {
        volume: 0.005,
        loop: true,
        paused: !isMusicEnabled,
      });
    },
    toggleMusic() {
      const isMusicEnabled = StateService.get().musicEnabled;

      if (isMusicEnabled) {
        return music?.play();
      }
      music.paused = true;
    },
  };
})();

export default SoundService;
