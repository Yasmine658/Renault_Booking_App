import { User } from "@/context/AuthContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const apiUrl = import.meta.env.VITE_API_URL;

const getUserIdFromToken = (token: string) => {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.id; 
  } catch {
    return null;
  }
};


const authService = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, credentials);
      const token = response.data.accessToken;
      if (token) {
        localStorage.setItem("token", token);
      } else {
        throw new Error("Login failed");
      }
    } catch (err) {
      throw err; 
    }
    
  },
  

  signup: async (userData: any) => {
    const response = await axios.post(`${apiUrl}/auth/signup`, userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
  
    const userId = getUserIdFromToken(token);
    if (!userId) return null;
  
    try {
      const response = await axios.get(`${apiUrl}/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; 
    } catch {
      return null;
    }
  },
  

  logout: () => {
    localStorage.removeItem("token");
  },

  updateProfile: async (userId: string, data: Partial<User>) => {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${apiUrl}/user/${userId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
  
};

export default authService;