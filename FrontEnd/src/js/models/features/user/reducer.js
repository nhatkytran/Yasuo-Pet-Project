const initialState = { ok: false };

const GET_DATA = 'user/getData';
const SET_DATA_OK = 'user/setDataOk';
const SET_DATA_NOT_OK = 'user/setDataNotOk';
const SET_USERT_PHOTO = 'user/setUserPhoto';

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DATA:
      return { ...state, ...action.payload };
    case SET_DATA_OK:
      return { ...state, ok: true };
    case SET_DATA_NOT_OK:
      return { ok: false };
    case SET_USERT_PHOTO:
      return { ...state, photo: action.payload };
    default:
      return state;
  }
};

const getData = data => ({ type: GET_DATA, payload: data });
const setDataOk = () => ({ type: SET_DATA_OK });
const setDataNotOk = () => ({ type: SET_DATA_NOT_OK });
const setUserPhoto = photo => ({ type: SET_USERT_PHOTO, payload: photo });

export const ACTIONS = { getData, setDataOk, setDataNotOk, setUserPhoto };
export default userReducer;
