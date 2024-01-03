const initialState = {
  ok: false,
  images: [{ link: '' }],
};

const GET_DATA = 'games/getData';
const SET_DATA_OK = 'games/setDataOk';

const gamesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DATA:
      return { ...state, ...action.payload };
    case SET_DATA_OK:
      return { ...state, ok: true };
    default:
      return state;
  }
};

const getData = data => ({ type: GET_DATA, payload: data });
const setDataOk = () => ({ type: SET_DATA_OK });

export const ACTIONS = { getData, setDataOk };
export default gamesReducer;
