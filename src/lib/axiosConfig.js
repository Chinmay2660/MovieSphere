import axios from "axios";
import { getCachedResponse, setCachedResponse } from "./apiCache";

const axiosInstance = axios.create({
  baseURL: "/api",
  adapter: async (config) => {
    const method = (config.method || "get").toLowerCase();
    if (method === "get") {
      const cached = getCachedResponse(config);
      if (cached) return { ...cached, config, request: {} };
    }
    const defaultAdapter = axios.getAdapter(axios.defaults.adapter, config);
    const response = await defaultAdapter(config);
    if (method === "get" && response.status >= 200 && response.status < 300) {
      setCachedResponse(config, response);
    }
    return response;
  },
});

export default axiosInstance;