const initialState = {
  ok: false,
  skins: [
    {
      name: '',
      releaseYear: 0,
      inCollection: '',
      price: 0,
      tags: [''],
      details: [''],
      image: '',
      youtubeLink: '',
    },
  ],
};

const GET_DATA = 'skins/getData';
const SET_DATA_OK = 'skins/setDataOk';

const skinsReducer = (state = initialState, action) => {
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
export default skinsReducer;
