const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
export const API_HOST = process.env.REACT_APP_API_URL || `http://${host}:8000`;
export const API_BASE_URL = `${API_HOST}/api`;

/**
 * Sends an HTTP request to the backend API.
 * @param {string} path - The relative path of the endpoint.
 * @param {object} options - Fetch options.
 * @returns {Promise<any>} Response JSON data.
 */
async function apiRequest(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  const response = await fetch(url, defaultOptions);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API request failed with status ${response.status}`);
  }

  if (response.status === 204 || response.status === 200) {
    const contentLength = response.headers.get('content-length');
    if (contentLength === '0') {
      return null;
    }
  }

  try {
    return await response.json();
  } catch (_) {
    return null;
  }
}

export const apiService = {
  get: (path) => apiRequest(path, { method: 'GET' }),
  post: (path, body) => apiRequest(path, {
    method: 'POST',
    body: JSON.stringify(body),
  }),
};

export default apiService;
