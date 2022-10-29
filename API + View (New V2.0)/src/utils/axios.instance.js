
import axios from 'axios';
let instance = axios.create({
  baseURL: "/api",
})

// request header
instance.interceptors.request.use(
  (config) => {
    const token=getToken();
    // config.headers.Authorization = localStorage.getItem(ACCESS_TOKEN_KEY);
    config.headers = {"Access-Control-Allow-Origin": "*"} 
    config.headers = {"requesterID": "B2BFront"} 
    config.headers = {"requestDateTime": Date.now()} 
    if(token)config.headers = {"Authorization": `Bearer ${token}`} //Date.now().toString(36)
    return config;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

  
// response parse
instance.interceptors.response.use(
  (response) => {
    const apiResponse = {
      data: response.data,
      status: response.status,
      statusText: HTTP_STATUS_OK,
      headers: response.headers,
      config: response.config,
      message: response.data?.message,
      success: true
    };
    return apiResponse;
  },

  (error) => {
    if (error &&
      error?.response &&
      error?.response?.status === 401 &&
      (error?.response?.data?.message === 'Unauthenticated.' || error?.response?.data?.message === 'Invalid Token!')) {
      signOut();
    }
    const apiError = {
      data: null,
      status: error.status,
      headers: error.headers,
      config: error.config,
      message: error.data?.message,
      success: false
    };
    return apiError;
});

export default instance;