// src/utilss/axios.js
import axios from "axios";

const apiAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export default apiAxios;
