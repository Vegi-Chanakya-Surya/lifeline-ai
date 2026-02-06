const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = {
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,
};
