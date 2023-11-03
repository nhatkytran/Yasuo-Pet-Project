import axiosInstance from '../services/axios';

const sendErrorToAdmin = async (error, filename) => {
  try {
    await axiosInstance.post('/api/v1/errorToAdmin', {
      when: new Date(),
      where: filename,
      error: {
        message: error.message,
        stackJSONFormat: JSON.stringify(error.stack),
      },
    });
  } catch (error) {
    console.error('Something went wrong sending error message to admin!');
    console.log(
      'If you see this message. Please contact us via < nhockkutean2@gmail.com > to help make Yasuo | The King of All Kings better. Thank you for you help!'
    );
  }
};

export default sendErrorToAdmin;
