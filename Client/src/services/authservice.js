import axios from "axios";
import { BASE_URL } from "../constants";

export const login = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    return await response.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const authUser = async () => {
  const res = await fetch(`${BASE_URL}/auth`, {
    method: "GET",
    credentials: "include",
  });

  const user = await res.json();

  return user;
};

export const signup = async (email, password, name) => {
  try {
    const response = await axios.post(`${BASE_URL}/signup`, {
      email,
      password,
      name,
    });

    return response.data.data.user;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const logout = async () => {
  try {
    const res = await fetch(`${BASE_URL}/logout`, {
      credentials: "include",
    });
    return await res.json();
  } catch (err) {
    console.log("💣", err);
  }
};
