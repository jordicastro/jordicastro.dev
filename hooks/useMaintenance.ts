import { create } from "zustand";

interface MaintenanceStore {
    isLoading: boolean;
    isMaintenanceEnabled: boolean;
    fetchMaintenanceStatus: () => Promise<void>;
    checkPassword: (password: string) => Promise<boolean>;
}

export const useMaintenance = create<MaintenanceStore>((set) => ({
    isLoading: true,
    isMaintenanceEnabled: false,

    fetchMaintenanceStatus: async () => {
        set({ isLoading: true });

        try {
            const res = await fetch('/api/getMaintenanceStatus');
            const data = await res.json();

            set({
                isMaintenanceEnabled: data.maintenanceEnabled,
                isLoading: false
            })
        } catch {
            set({ isLoading: false });
            console.error('Error fetching maintenance status');
        }
    },

    checkPassword: async (password: string) => {
        try {
            const res = await fetch('/api/checkMaintenancePassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password })
            });
            const data = await res.json();

            return data.isCorrect;

        } catch {
            console.error('Error checking maintenance password');
        }
        return false;
    }

}));