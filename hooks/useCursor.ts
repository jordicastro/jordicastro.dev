import { create } from "zustand";
import { persist } from "zustand/middleware";
 
type CursorStore = {
    cursor: boolean;
    setCursor: (value: boolean) => void;
};

// use persist to save the cursor state in local storage, so it can be restored on page reload
export const useCursor = create<CursorStore>()(
    persist(
        (set) => ({
            cursor: false,
            setCursor: (value) => {
                set({ cursor: value });
            },
        }),
        { // name of the local storage key
            name: "cursor",
        }
    )
);