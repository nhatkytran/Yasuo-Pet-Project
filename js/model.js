import {
  hoverMarkupBackground,
  hoverMarkupQuote,
  hoverMarkupSEO,
} from './state/allGamesState.js';
import { storyLanguages } from './state/languagesStoryState.js';
import { skillsDetail } from './state/abilitiesState.js';
import { nameSkins } from './state/skinsState.js';
import { toasts } from './state/Toast/mainToastState.js';

const state = {
  storyLanguages,
  allGamesHover: {
    hoverMarkupBackground,
    hoverMarkupQuote,
    hoverMarkupSEO,
  },
  skillsDetail,
  nameSkins,
  toasts,
};

export { state };
