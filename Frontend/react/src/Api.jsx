import axios from "axios";

const Api = axios.create({
  baseURL: "http://127.0.0.1:8000/",
});

let inMemoryToken = null;

export const setTokenInMemory = (token) => {
  inMemoryToken = token;
};

Api.interceptors.request.use(
  (config) => {
    if (inMemoryToken) {
      config.headers.Authorization = `Bearer ${inMemoryToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem("refresh");

      if (refresh) {
        try {
          // Standard axios used here to prevent infinite interceptor loops
          const res = await axios.post("http://127.0.0.1:8000/refresh/", { refresh });
          const newAccess = res.data.access;

          setTokenInMemory(newAccess);
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          
          return Api(originalRequest); 
        } catch (refreshError) {
          localStorage.removeItem("refresh");
          setTokenInMemory(null);
          window.location.href = "/Login";
        }
      } else {
        window.location.href = "/Login";
      }
    }
    return Promise.reject(error);
  }
);

export default Api;