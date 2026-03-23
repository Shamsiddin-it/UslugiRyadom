const ACCESS_TOKEN_KEY = 'uslugi-ryadom-token';

export const storage = {
  getToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  setToken(token: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  clearToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
};
