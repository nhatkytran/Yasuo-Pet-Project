const initialState = {
  ok: false,
  images: {
    main: {
      link: '',
      alt: '',
    },
    sub: {
      link: '',
      alt: '',
      linkHelper: '',
    },
  },
};

const GET_DATA = 'ruined/getData';
const SET_DATA_OK = 'ruined/setDataOk';

const ruinedReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DATA:
      return { ...state, ...action.payload };
    case SET_DATA_OK:
      return { ...state, ok: true };
    default:
      return state;
  }
};

const getData = data => ({
  type: GET_DATA,
  payload: data,
});

const setDataOk = () => ({ type: SET_DATA_OK });

export const ACTIONS = { getData, setDataOk };
export default ruinedReducer;
