import {
  hoverMarkupBackground,
  hoverMarkupQuote,
  hoverMarkupSEO,
} from './state/allGamesState.js';
import { storyLanguages } from './state/languagesStoryState.js';

const state = {
  storyLanguages,
  allGamesHover: {
    hoverMarkupBackground,
    hoverMarkupQuote,
    hoverMarkupSEO,
  },
};

export { state };
