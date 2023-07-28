import axiosInstance from './axios';

const getRuinedData = async endpoint => {
  const { data } = await axiosInstance.get(endpoint);

  return data;
};

const ruinedAxios = { getRuinedData };

export default ruinedAxios;
