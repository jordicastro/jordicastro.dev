import { create } from "zustand";

type AuthStore = {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    isLoading: boolean;
    setIsLoading: (value: boolean) => void;
};

export const useAuth = create<AuthStore>((set) => ({
    isAuthenticated: false,
    isLoading: true,
    setIsAuthenticated: (value) => set({ isAuthenticated: value }),
    setIsLoading: (value) => set({ isLoading: value }),
}));