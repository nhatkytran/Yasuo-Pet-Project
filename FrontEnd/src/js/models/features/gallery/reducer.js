const initialState = {
  ok: false,
  gallery: [
    {
      image: '',
      link: '',
      title: '',
    },
  ],
};

const GET_DATA = 'gallery/getData';
const SET_DATA_OK = 'gallery/setDataOk';

const galleryReducer = (state = initialState, action) => {
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
export default galleryReducer;
