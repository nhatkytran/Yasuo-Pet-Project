const initialState = {
  linkMp4: '',
  linkWebm: '',
};

const GET_VIDEO = 'subweb/getVideo';

const subwebReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_VIDEO:
      return {
        ...state,
        linkMp4: action.payload.linkMp4,
        linkWebm: action.payload.linkWebm,
      };
    default:
      return state;
  }
};

const getVideo = ({ linkMp4, linkWebm }) => {
  return {
    type: GET_VIDEO,
    payload: { linkMp4, linkWebm },
  };
};

export const ACTIONS = { getVideo };
export default subwebReducer;
