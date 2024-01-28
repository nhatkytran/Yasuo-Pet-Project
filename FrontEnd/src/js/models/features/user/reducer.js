const initialState = { ok: false };

const GET_DATA = 'user/getData';
const SET_DATA_OK = 'user/setDataOk';
const SET_DATA_NOT_OK = 'user/setDataNotOk';

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DATA:
      return { ...state, ...action.payload };
    case SET_DATA_OK:
      return { ...state, ok: true };
    case SET_DATA_NOT_OK:
      return { ok: false };
    default:
      return state;
  }
};

const getData = data => ({ type: GET_DATA, payload: data });
const setDataOk = () => ({ type: SET_DATA_OK });
const setDataNotOk = () => ({ type: SET_DATA_NOT_OK });

export const ACTIONS = { getData, setDataOk, setDataNotOk };
export default userReducer;
