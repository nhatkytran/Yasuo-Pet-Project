import axiosInstance from './axios';

const getGalleryData = async endpoint => {
  const { data } = await axiosInstance.get(endpoint);

  return data;
};

const galleryAxios = { getGalleryData };

export default galleryAxios;
