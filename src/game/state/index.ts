import { Locales } from "../enums";
import { getFromStorage, putToStorage } from "../utils/storage";

type State = {
  introduced: boolean;
  locale: Locales;
  sfxEnabled: boolean;
  musicEnabled: boolean;
};

const StateService = (function () {
  let state: State;

  return {
    init() {
      const fromStorage = getFromStorage("METADATA");

      if (fromStorage) {
        state = JSON.parse(fromStorage);
      } else {
        state = {
          introduced: false,
          locale: Locales.En,
          sfxEnabled: false,
          musicEnabled: false,
        };
        putToStorage("METADATA", JSON.stringify(state));
      }
      /** Kinda disable music always to not be loud. */
      state.musicEnabled = false;
    },
    set(updatedState: Partial<State>) {
      state = {
        ...state,
        ...updatedState,
      };
      putToStorage("METADATA", JSON.stringify(state));
    },
    get() {
      if (!state) {
        this.init();
      }
      return state;
    },
  };
})();

export default StateService;
