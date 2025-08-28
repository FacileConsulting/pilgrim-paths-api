const axios = require('axios');

const callAxiosInstance = (baseURL, token) => {
  const axiosInstance = axios.create({

    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'json',
  });

  // Request interceptor to add the Authorization header
  axiosInstance.interceptors.request.use(
    async (config) => {
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return axiosInstance;
}

module.exports = {
  callAxiosInstance
};