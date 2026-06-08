import { create } from "zustand";

interface AnonUserStore {
    isLoading: boolean;
    anonId: string | null;
    getAnonId: () => Promise<void>;
}

export const useAnonUser = create<AnonUserStore>((set) => ({
    anonId: null,
    isLoading: true,

    getAnonId: async () => {
        set({ isLoading: true });

        try {
            // resolve anonUser checks for an existing signed cookie, and if not present, creates a new anon user in the anon_users table and sets a signed cookie for future requests
            const res = await fetch('/api/resolveAnonUser')
            const data = await res.json();

            set({ anonId: data.anonId, isLoading: false });
            // update the local storage with the anonId for client side use
            if (data.anonId) {
                localStorage.setItem('anonId', data.anonId);
            }
        } catch {
            set({ isLoading: false });
            console.error('Error resolving anon user');
        }
    }
}));