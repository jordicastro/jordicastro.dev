import { GetReactionsResponse, ReactionData } from "@/types/types";
import { create } from "zustand";

interface ReactionsStore {
    isLoading: boolean;
    reactionData: ReactionData | null;
    selectedEmoji: string | null;
    totalReactions: number;
    setSelectedEmoji: (emoji: string | null) => void;
    setTotalReactions: (updateFn: (prev: number) => number) => void;

    fetchReactions: (storyId: string) => Promise<void>;
    updateUserReaction: (storyId: string, emoji: string | null) => Promise<void>;
    
}

// source of truth for reactions state, including fetch and update functions that leverage api routes
export const useReactions = create<ReactionsStore>((set, get) => ({
    isLoading: true,
    reactionData: null,
    selectedEmoji: null,
    totalReactions: 0,

    setSelectedEmoji: (emoji) => set({ selectedEmoji: emoji }),
    setTotalReactions: (reactionsFn) => set((state) => ({ totalReactions: reactionsFn(state.totalReactions) })),

    // fetch all reactions given a storyId, including the user's reaction | null and the total reaction count
    fetchReactions: async (storyId: string) => {
        set({ isLoading: true });

        try {
            // fetch reactions from /api/getReactions/[storyId]
            const res = await fetch('/api/getReactions/' + storyId);
            if (!res.ok) {
                throw new Error(`Failed to fetch reactions: ${res.status}`);
            }
            const data: GetReactionsResponse = await res.json();

            set({ reactionData: data.reactions, totalReactions: data.totalReactions, selectedEmoji: data.userReaction, isLoading: false });


        } catch (error) {
            console.error('Error fetching reactions:', error);
            set({ isLoading: false, reactionData: null, totalReactions: 0, selectedEmoji: null });
        }
    },

    updateUserReaction: async (storyId: string, emoji: string | null) => {
        try {
            const res = await fetch('/api/updateReaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ storyId, reaction: emoji }),
            })

            if (!res.ok) {
                const payload = await res.json().catch(() => null) as { error?: string } | null;
                throw new Error(payload?.error ?? 'Error updating user reaction');
            }

            // refetch reactions to prevent stale state
            await get().fetchReactions(storyId);
        } catch (error) {
            console.error('Error updating user reaction:', error);
        }
    }

}));