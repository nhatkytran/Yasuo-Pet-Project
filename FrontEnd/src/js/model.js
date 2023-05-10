import { catchAsync } from './helpers';
import { subwebAxios } from './http';

const state = {
  videoTrailerLinks: {},
};

export const fetchTrailerVideo = catchAsync(async () => {
  const response = await subwebAxios.getTrailerVideo('/api/v1/subweb/video');
  const { linkMp4, linkWebm } = response.video;

  state.videoTrailerLinks = { linkMp4, linkWebm };
});

export const fetchTrailerVideoAbort = () => subwebAxios.getTrailerVideoAbort();

export default state;
