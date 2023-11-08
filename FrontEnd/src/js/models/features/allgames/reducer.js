const initialState = {
  ok: false,
  colors: {
    bg: [''],
  },
  descriptions: [''],
  image_alts: [''],
  images: {
    main: [{ type: '', link: '' }],
    side: {
      larges: [{ type: '', link: '' }],
      smalls: [
        { type: '', link: '' },
        { type: '', content: '' },
      ],
    },
  },
  platforms: [['']],
};

const GET_DATA = 'allgames/getData';
const SET_DATA_OK = 'allgames/setDataOk';

const allgamesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DATA:
      return { ...state, ...action.payload };
    case SET_DATA_OK:
      return { ...state, ok: true };
    default:
      return state;
  }
};

const getData = data => {
  return {
    type: GET_DATA,
    payload: data,
  };
};

const setDataOk = () => {
  return { type: SET_DATA_OK };
};

export const ACTIONS = { getData, setDataOk };
export default allgamesReducer;
