// src/utilss/apiFetch.ts
export const apiFetch = (path, options = {}) => {
  return fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    credentials: "include",
    ...options,
  });
};
