import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  token: string | undefined;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  token: undefined,
  login: (token) => {
    localStorage.setItem("auth_token", token);
    set({ isAuthenticated: true, token });
  },
  logout: () => {
    localStorage.removeItem("auth_token");
    set({ isAuthenticated: false, token: undefined });
  },
}));
