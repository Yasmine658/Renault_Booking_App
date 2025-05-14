import { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { toast } from "sonner";

export interface User {
  _id: string;
  CIN: string;
  username: string;
  email: string;
  phoneNumber: string;
  cars: string[]; 
  rdvs: string[];
}

interface Credentials {
  email: string;
  password: string;
}

interface SignUpData {
  CIN: string;
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: Credentials) => Promise<void>;
  signup: (userData: SignUpData) => Promise<void>;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
  addCar: (carId: string) => void;
  addRDV: (rdvId: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await authService.getCurrentUser(); 
        setUser(userData);
      } catch {
        setUser(null); 
      }
      setLoading(false);
    };

    checkUser();
  }, []);
  const login = async (credentials: Credentials) => {
    try {
      await authService.login(credentials);
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) throw new Error("Failed to fetch current user");
      setUser(currentUser);
      navigate("/profile");
    } catch (error: any) {
      console.error("Login failed:", error.message);
      throw error;
    }
  };
  

  const signup = async (userData: SignUpData) => {
    try {
      await authService.signup(userData); 
      navigate("/login"); 
    } catch (error: any) {
      console.error("Sign up failed:", error.message);
    }
  };

  const logout = () => {
    authService.logout(); 
    setUser(null); 
    navigate("/login"); 
  };

  const updateUser = async (updatedData: Partial<User>) => {
    if (!user) return;
  
    try {
      const updatedUser = await authService.updateProfile(user._id, updatedData);
      setUser(updatedUser);
      toast.success("Profil mis à jour avec succès ✅");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil ❌");
      console.error("Update failed:", error);
    }
  };

  const addCar = (carId: string) => {
    if (user) {
      setUser({ ...user, cars: [...user.cars, carId] });
    }
  };

  const addRDV = (rdvId: string) => {
    if (user) {
      setUser({ ...user, rdvs: [...user.rdvs, rdvId] });
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        loading,
        updateUser,
        addCar,
        addRDV,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
