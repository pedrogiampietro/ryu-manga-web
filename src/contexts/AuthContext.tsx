import { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from "../constants/auth";

import {
  getStorageModel,
  removeStorage,
  setStorageModel,
} from "../lib/storage";
import { useToast } from "../components/ui/use-toast";
import { apiClient } from "../services/apiClient";

interface AuthProviderProps {
  children: ReactNode;
}

type User = {
  email: string;
  password: string;
};

type UserAuth = {
  userId: string;
  name: string;
  email: string;
  birthDate: any;
  theme?: any;
  font?: any;
};

interface AuthContextData {
  loading: boolean;
  isAuthenticated: boolean;
  signIn: any;
  signOut: () => void;
  user: UserAuth | any;
  setUser: any;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthContextProvider({ children }: AuthProviderProps) {
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserAuth | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    const token = getStorageModel(auth.TOKEN);
    const checkUser = getStorageModel(auth.USER);

    if (token) {
      setIsAuthenticated(true);
      setUser(JSON.parse(checkUser));
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  async function signIn(login: User) {
    setLoading(true);

    try {
      const response = await apiClient().post("/v1/auth/login", login);

      const objToString = JSON.stringify({
        userId: response.data.user.userId,
        email: response.data.user.email,
        name: response.data.user.name,
        username: response.data.user.username,
        birthDate: response.data.user.birthDate,
        urls: response.data.user.urls,
        bio: response.data.user.bio,
        theme: response.data.user.theme,
      });

      setStorageModel(auth.TOKEN, response.data.token);
      setStorageModel(auth.USER, objToString);
      setIsAuthenticated(true);

      apiClient().defaults.headers[
        "Authorization"
      ] = `Bearer ${response.data?.token}`;

      setUser(JSON.parse(objToString));

      return response;
    } catch (err: any) {
      console.error(err);
      return err.response;
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    setIsAuthenticated(false);
    removeStorage(auth.TOKEN);
    removeStorage(auth.REFRESH_TOKEN);
    removeStorage(auth.USER);

    toast({
      title: "Success",
      description: "Ahhh, você já está indo? Isso será um até logo! 😁",
    });

    window.location.href = "/";
  }
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        signIn,
        signOut,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
