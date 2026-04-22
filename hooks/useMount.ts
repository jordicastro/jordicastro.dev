import { create } from "zustand";

type MountStore = {
    hasMounted: boolean;
    setHasMounted: (value: boolean) => void;
};

export const useMount = create<MountStore>((set) => ({
    hasMounted: false,
    setHasMounted: (value) => set({ hasMounted: value }),
}));