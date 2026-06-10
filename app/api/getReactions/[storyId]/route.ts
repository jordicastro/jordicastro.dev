import "server-only";
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/supabaseServer';
import { ReactionEmoji } from '@/types/types';
import { ANON_USER_COOKIE_NAME, verifyAnonUserToken } from '@/lib/cookies';
import type { NextRequest } from 'next/server';
import { getAnonId } from "../../updateReaction/route";

export async function GET(req: NextRequest, { params }: { params: { storyId: string } }) {
    const { storyId } = await params;

    try {
        const { data, error } = await supabaseAdmin
            .from('story_reactions')
            .select('reaction, anon_id')
            .eq('story_id', storyId)
            .not('reaction', 'is', 'null');

        if (error) {
            console.error('Error fetching reactions from Supabase:', error);
            return NextResponse.json(
                { error: error.message, reactions: [] },
                { status: 500 }
            );
        }

        if (!data) {
            console.warn('No reactions found for storyId:', storyId);
            return NextResponse.json({ reactions: [] });
        }

        const totalReactions = data.length;
        const reactionCounts: Record<ReactionEmoji, number> = {
            '❤️': 0,
            '👍': 0,
            '🔥': 0,
        };

        // count the number of each reaction emoji
        data.forEach((row) => {
            const reaction = row.reaction as ReactionEmoji;
            if (reactionCounts[reaction] !== undefined) {
                reactionCounts[reaction]++;
            }
        });

        // build the reactionData object
        const reactions = Object.entries(reactionCounts).map(([emoji, count]) => ({
            emoji,
            count,
        }));

        // get the anon_id cookie to find user reaction if it exists
        const anonId = await getAnonId(req);

        const userReaction = data.find((row) => row.anon_id === anonId)?.reaction || null;

        return NextResponse.json({ reactions, totalReactions, userReaction });
    } catch (error) {
        console.error('Error fetching reactions:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: message, reactions: [], totalReactions: 0, userReaction: null },
            { status: 500 }
        );
    }
}