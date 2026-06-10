import "server-only";
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/supabaseServer';
import { ReactionEmoji } from '@/types/types';
import { ANON_USER_COOKIE_NAME, verifyAnonUserToken } from "@/lib/cookies";

export async function POST(req: NextRequest) {
    try {
        // check if the anon_id already has a reaction for the story_id to update, otherwise insert a new reaction
        const { storyId, reaction } = await req.json() as { storyId: string; reaction: ReactionEmoji | null };
        const anonId = await getAnonId(req)

        if (!anonId) {
            return NextResponse.json({ error: 'Missing or invalid anon user cookie' }, { status: 401 });
        }

        const hasExistingReaction = await checkExistingReaction(storyId, anonId);

        if (hasExistingReaction) {
            // update the existing reaction (including setting reaction to null for remove)
            const { error } = await supabaseAdmin
                .from('story_reactions')
                .update({ reaction, updated_at: new Date().toISOString() })
                .eq('story_id', storyId)
                .eq('anon_id', anonId);
 
            if (error) {
                console.error('Error updating reaction:', error);
                return NextResponse.json(
                    { error: error.message },
                    { status: 500 }
                );
            }

            return NextResponse.json({ message: 'Reaction updated successfully' });
        } else {
            if (reaction === null) {
                return NextResponse.json({ message: 'No reaction to remove' });
            }

            // insert a new reaction with the story_id, anon_id, and reaction emoji
            const { error } = await supabaseAdmin
                .from('story_reactions')
                .insert({ story_id: storyId, anon_id: anonId, reaction, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });

            if (error) {
                console.error('Error inserting reaction:', error);
                return NextResponse.json(
                    { error: error.message },
                    { status: 500 }
                );
            }

            return NextResponse.json({ message: 'Reaction inserted successfully' });
        }

    } catch (error) {
        console.error('Error processing reaction:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

async function checkExistingReaction(storyId: string, anonId: string): Promise<boolean> {
    const { data, error } = await supabaseAdmin
        .from('story_reactions')
        .select('id')
        .eq('story_id', storyId)
        .eq('anon_id', anonId)

    if (error) {
        console.error('Error checking existing reaction:', error);
        throw new Error('Error checking existing reaction');
    }
    
    return data && data.length > 0;

}

export async function getAnonId(req: NextRequest): Promise<string | null> {
    const signedAnonCookie = req.cookies.get(ANON_USER_COOKIE_NAME)?.value;

    return signedAnonCookie ? await verifyAnonUserToken(signedAnonCookie) : null;
}