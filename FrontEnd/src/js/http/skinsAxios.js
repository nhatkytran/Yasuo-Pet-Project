import axiosInstance from './axios';

const getSkinsData = async endpoint => {
  const { data } = await axiosInstance.get(endpoint);

  return data;
};

const skinsAxios = { getSkinsData };

export default skinsAxios;
