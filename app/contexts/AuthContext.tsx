import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: any | null;
  login: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  console.log('user ', user)

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("user");
      if (jsonValue != null) {
        setUser(JSON.parse(jsonValue));
      } else {
        router.replace("/login");
      }
    } catch (error) {
      console.log("Error reading user from storage:", error);
      router.replace("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: any) => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.log("Error saving user to storage:", error);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true); // Start loading state
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
      setUser(null);
      router.replace("/login"); // Redirect to login after logout
    } catch (error) {
      console.log("Error removing user from storage:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {isLoading ? null : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
