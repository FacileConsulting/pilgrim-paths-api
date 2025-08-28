const { callAxiosInstance } = require('./axios');

const amadeusTokenURL = '/v1/security/oauth2/token';
const amadeusFlightsURL = '/v2/shopping/flight-offers?';
const amadeusAirportURL = '/v1/reference-data/locations?';
const amadeusHotelURL = '/v1/reference-data/locations/hotel?';
const amadeusHotelDetailsURL = '/v3/shopping/hotel-offers?';
const amadeusHotelRatingURL = '/v2/e-reputation/hotel-sentiments?';

const axiosInstance = callAxiosInstance('https://test.api.amadeus.com', global.amadeus_access_token);

const refreshAmadeusToken = async (failedRequest) => {
  try {
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${process.env.AMADEUS_TEST_URL}${amadeusTokenURL}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.AMADEUS_TEST_API_KEY,
        client_secret: process.env.AMADEUS_TEST_API_SECRET
      })
    };
    const response = await axiosInstance.request(config);
    const { status, data } = response;
    if (status === 200 && data?.token_type === 'Bearer' && data?.state === 'approved' && data?.access_token) {
      // Save the new token in storage
      global.amadeus_access_token = data?.access_token;
    }
    return `${data?.token_type} ${data?.access_token}` || '';
  } catch (error) {
    return Promise.reject(error);
  }
};

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;    
    // console.log('@@@@@@@@@@@##################', error.response.status, !originalRequest._retry)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newBearerToken = await refreshAmadeusToken();
        console.log('newBearerTokennewBearerTokennewBearerToken@@@@@@@@@@@##################', newBearerToken)
        originalRequest.headers['Authorization'] = newBearerToken;
        console.log('!@!!!!!!!!!', global.amadeus_access_token, newBearerToken);
        return axiosInstance(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

module.exports = {
  amadeusFlightsURL,
  amadeusAirportURL,
  amadeusHotelURL,
  amadeusHotelDetailsURL,
  amadeusHotelRatingURL,
  axiosInstance,
  refreshAmadeusToken
};