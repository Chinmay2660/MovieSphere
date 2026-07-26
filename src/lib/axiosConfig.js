import axios from "axios";
import {
  fetchWithCachePolicy,
  getCachedResponse,
  getCacheTtlMs,
  getStaleResponse,
} from "./apiCache";
import { getRequestLanguage, getRequestRegion } from "./locale";

const axiosInstance = axios.create({
  baseURL: "/api",
  adapter: async (config) => {
    const method = (config.method || "get").toLowerCase();
    const defaultAdapter = axios.getAdapter(axios.defaults.adapter, config);

    if (method !== "get") {
      return defaultAdapter(config);
    }

    const cached = getCachedResponse(config);
    if (cached) {
      return { ...cached, config, request: {} };
    }

    const ttlMs = getCacheTtlMs(config.url);

    const response = await fetchWithCachePolicy(
      config,
      () => defaultAdapter(config),
      { ttlMs }
    );
    return { ...response, config, request: {} };
  },
});

axiosInstance.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    region: getRequestRegion(),
    language: getRequestLanguage(),
  };
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const config = error.config;
    if (config?.method?.toLowerCase() === "get") {
      const stale = getStaleResponse(config);
      if (stale) {
        return Promise.resolve({
          ...stale,
          config,
          request: {},
          fromStaleCache: true,
        });
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
