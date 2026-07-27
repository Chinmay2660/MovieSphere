import axiosInstance from './axiosConfig';
import { setImageURL } from '../reduxStore/Reducer/movieSlice';

let inflight = null;

export function resetConfigurationFetch() {
  inflight = null;
}

export async function ensureConfiguration(dispatch, imageURL) {
  if (imageURL) return;
  if (inflight) return inflight;

  inflight = axiosInstance
    .get('/configuration')
    .then((response) => {
      dispatch(setImageURL(response.data.images.secure_base_url + 'original'));
    })
    .catch(() => {})
    .finally(() => {
      inflight = null;
    });

  return inflight;
}
