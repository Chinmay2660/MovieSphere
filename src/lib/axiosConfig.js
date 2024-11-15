import axios from 'axios';

const runLocally = () => window.location.hostname && /^localhost$/.test(window.location.hostname);

const HOST_URL = "https://api-moviesphere2660.vercel.app/api/";

const axiosInstance = axios.create({
    baseURL: runLocally() ? HOST_URL : ''
  });  

export default axiosInstance;