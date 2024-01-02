const initialState = { ok: false };

const GET_DATA = 'user/getData';

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DATA:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const getData = data => ({ type: GET_DATA, payload: data });

export const ACTIONS = { getData };
export default userReducer;
