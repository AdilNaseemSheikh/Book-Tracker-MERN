import axios from "axios";
import { BASE_URL } from "../constants";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    // config.headers.Authorization = token ? `Bearer ${token}` : "";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const addBook = async (title, author, pages) => {
  try {
    const response = await api.post("/books/", { title, author, pages });
    return response.data;
  } catch (err) {
    console.log(err);
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const getBooks = async () => {
  try {
    const response = await api.get("/books/");
    return response.data;
  } catch (err) {
    console.log(err)
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const updateBook = async (id, body) => {
  try {
    const response = await api.patch(`/books/${id}`, body);
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const deleteBook = async (id) => {
  try {
    await api.delete(`/books/${id}`);
  } catch (err) {
    throw new Error(err.response?.data || err.message);
  }
};
