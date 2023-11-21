const initialState = {
  ok: false,
  linkMp4: '',
  linkWebm: '',
};

const GET_DATA = 'subweb/getData';
const SET_DATA_OK = 'subweb/setDataOk';

const subwebReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DATA:
      return {
        ...state,
        linkMp4: action.payload.linkMp4,
        linkWebm: action.payload.linkWebm,
      };
    default:
      return state;
  }
};

const getData = data => ({
  type: GET_DATA,
  payload: { linkMp4: data.linkMp4, linkWebm: data.linkWebm },
});

const setDataOk = () => ({ type: SET_DATA_OK });

export const ACTIONS = { getData, setDataOk };
export default subwebReducer;
