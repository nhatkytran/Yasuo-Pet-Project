const initialState = {
  welcome: {
    type: 'welcome',
    title: 'Welcome!',
    content: 'My first project. Have fun exploring things.',
  },
  information: {
    type: 'information',
    title: 'Information',
    content: 'Some facts about Yasuo - The wanderer.',
  },
  abilities: {
    type: 'abilities',
    title: 'Abilities',
    content: 'Find the soul - Feel the wind - Chase the dream.',
  },
  skins: {
    type: 'skins',
    title: 'Skins',
    content: "Look doesn't matter? Huh, what a shame!",
  },
  ruined: {
    type: 'ruined',
    title: 'Ruined King',
    content: 'Save the world? Who am I?',
  },
  gallery: {
    type: 'gallery',
    title: 'Moments',
    content: 'Do things that make you happy.',
  },
  fail: {
    type: 'fail',
    title: 'Failed!',
    content: 'Something went wrong! Please try again later.',
  },
  success: {
    type: 'success',
    title: 'Success!',
    content: '',
  },
  warning: {
    type: 'warning',
    title: 'Attention!',
    content: 'Sign in with a Riot Account, not a Garena account.',
  },
};

const toastReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default toastReducer;
