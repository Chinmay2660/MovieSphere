import axios from 'axios';

const axiosInstance = axios.create({
    // baseURL: "http://localhost:8000/api",
    baseURL: "https://api-moviesphere2660.vercel.app/api",
  });  

export default axiosInstance;