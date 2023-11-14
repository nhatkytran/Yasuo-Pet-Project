const initialState = {
  ok: false,
  videos: [{ mp4: '', webm: '' }],
  descriptions: [{ small: '', medium: '', big: '' }],
};

const GET_DATA = 'abilities/getData';
const SET_DATA_OK = 'abilities/setDataOk';

const abilitiesReducer = (state = initialState, action) => {
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
export default abilitiesReducer;
