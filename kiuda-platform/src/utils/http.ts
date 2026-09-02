import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: 토큰 자동 첨부
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // AuthContext에서 쓰는 키로 맞추기
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터
http.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default http;