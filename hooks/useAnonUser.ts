import { create } from "zustand";

interface AnonUserStore {
    isLoading: boolean;
    anonId: string | null;
    getAnonId: () => Promise<void>;
}

// fix: strict mode fast rerenders can cause multiple calls to getAnonId, resulting in multiple rows added to the anon_users table for a missing or invalid cookie
let resolveAnonUserInFlight: Promise<void> | null = null;

export const useAnonUser = create<AnonUserStore>((set, get) => ({
    anonId: null,
    isLoading: true,

    getAnonId: async () => {
        if (get().anonId) return;

        if (resolveAnonUserInFlight) {
            await resolveAnonUserInFlight;
            return;
        }

        set({ isLoading: true });

        resolveAnonUserInFlight = (async () => {
            try {
                // resolve anonUser checks for an existing signed cookie, and if not present, creates a new anon user in the anon_users table and sets a signed cookie for future requests
                const res = await fetch('/api/resolveAnonUser');

                if (!res.ok) {
                    throw new Error(`Error resolving anon user: ${res.status}`);
                }

                const data = await res.json() as { anonId?: string };
                const nextAnonId = data.anonId ?? null;

                set({ anonId: nextAnonId, isLoading: false });

                // update the local storage with the anonId for client side use
                if (nextAnonId) {
                    localStorage.setItem('anonId', nextAnonId);
                }
            } catch (error) {
                set({ isLoading: false });
                console.error('Error resolving anon user:', error);
            } finally {
                resolveAnonUserInFlight = null;
            }
        })();

        await resolveAnonUserInFlight;
    }
}));