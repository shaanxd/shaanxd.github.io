import { AudioPlay } from "kaplay";
import context from "../context";
import StateService from "../state";

const SoundService = (function () {
  let music: AudioPlay;

  return {
    init() {
      music = context.play("bgm", {
        volume: 0.1,
        loop: true,
      });
    },
    onMusicToggle() {
      const musicEnabled = !StateService.get().musicEnabled;

      StateService.set({ musicEnabled });

      if (musicEnabled) {
        if (music) {
          return music.play();
        }
        return this.init();
      }
      if (music) {
        music.paused = true;
      }
    },
  };
})();

export default SoundService;
