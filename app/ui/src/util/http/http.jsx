import { QueryClient } from '@tanstack/react-query';
import { API_URL } from '../../constants/constants';
export const queryClient = new QueryClient();

export const handleFetch = async (url, options, errorMessage, returnJson = true) => {
  const response = await fetch(url, options);

  if (!response.ok) {
    // if (response.status === 404) {
    //   return response;
    // }
    const error = new Error(response.statusText || errorMessage);
    error.code = response.status;
    try {
      error.info = await response.json();
    }
    catch (e) {
      console.log(e);
      error.info = { message: `${errorMessage} ${response.statusText && " - " + response.statusText}` };
    }
    throw error;
  }

  return returnJson ? await response.json() : await response.blob();
}

export const fetchNightTime = async ({ signal, flight }) => {
  const url = `${API_URL}/night`;
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(flight),
    signal: signal,
  };
  return await handleFetch(url, options, 'Cannot fetch night time');
}

export const fetchDistance = async ({ signal, departure, arrival }) => {
  if (!departure || !arrival) {
    return 0;
  }

  const url = `${API_URL}/distance/${departure}/${arrival}`;
  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    signal: signal,
  };
  return await handleFetch(url, options, 'Cannot fetch distance');
}

export const fetchAirport = async ({ signal, id }) => {
  const url = `${API_URL}/airport/${id}`;
  const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    signal: signal,
  };
  return await handleFetch(url, options, 'Cannot fetch airport');
}
