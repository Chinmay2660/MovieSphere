import axios from 'axios';

const axiosInstance = axios.create({
    // baseURL: "http://localhost:8000/api",
    baseURL: "https://api-moviesphere.vercel.app/api",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`, 
    },
  });  

export default axiosInstance;