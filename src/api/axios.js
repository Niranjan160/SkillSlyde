// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://springboot-skillslyde.onrender.com/api",
});

export default api;
