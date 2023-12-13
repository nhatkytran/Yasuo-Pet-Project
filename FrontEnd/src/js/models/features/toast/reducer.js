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
    title: 'Ruined-King',
    content: 'Save the world? Who am I?',
  },
  gallery: {
    type: 'gallery',
    title: 'Moments',
    content: 'Do things that make you happy.',
  },
  oopsie: {
    type: 'oopsie',
    title: 'Oopsie!!!',
    content: "Sorry! I haven't added any function yet.",
  },
};

const toastReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default toastReducer;
