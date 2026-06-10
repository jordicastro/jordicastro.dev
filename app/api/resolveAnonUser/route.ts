import "server-only";
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/supabaseServer';
import {
	ANON_USER_COOKIE_MAX_AGE_SECONDS,
	ANON_USER_COOKIE_NAME,
	issueAnonUserToken,
	verifyAnonUserToken,
} from '@/lib/cookies';
import type { NextRequest } from 'next/server';

async function anonUserExists(anonId: string): Promise<boolean> {
	const result = await supabaseAdmin
		.from('anon_users')
		.select('anon_id')
		.eq('anon_id', anonId)
		.maybeSingle();

	if (result.error) {
		console.error('Error validating anon user cookie against anon_users:', result.error);
		return false;
	}

	return Boolean(result.data);
}

async function createAnonUserRecord(): Promise<string> {
	const nextAnonId = crypto.randomUUID();
	const result = await supabaseAdmin
		.from('anon_users')
		.insert({ anon_id: nextAnonId, created_at: new Date().toISOString() })
		.select('anon_id')
		.maybeSingle();

	if (result.error) {
		throw new Error(`Unable to create anon user row: ${result.error.message}`);
	}

	if (!result.data?.anon_id) {
		throw new Error('Unable to create anon user row: no anon_id returned from insert');
	}

	return result.data.anon_id;
}

async function buildNewAnonUserResponse(): Promise<NextResponse> {
	const anonId = await createAnonUserRecord();
	const signedToken = await issueAnonUserToken(anonId);

	if (!signedToken) {
		console.error('ANON_USER_COOKIE_SECRET is missing; cannot issue anon user cookie.');
		return NextResponse.json(
			{ error: 'Server cookie secret is not configured' },
			{ status: 500 }
		);
	}

	const response = NextResponse.json({ anonId });
	response.cookies.set({
		name: ANON_USER_COOKIE_NAME,
		value: signedToken,
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/',
		maxAge: ANON_USER_COOKIE_MAX_AGE_SECONDS,
	});

	return response;
}

// looks for an existing anon user cookie and verifies it. if invalid or not present, creates a new anon user, sets the cookie and inserts into the anon_users table
export async function GET(request: NextRequest) {
	try {
		const signedCookie = request.cookies.get(ANON_USER_COOKIE_NAME)?.value;

		if (signedCookie) {
			const anonId = await verifyAnonUserToken(signedCookie);

			if (anonId && await anonUserExists(anonId)) {
				return NextResponse.json({ anonId });
			}
		}

		return await buildNewAnonUserResponse();
	} catch (error) {
		console.error('Error resolving anon user:', error);
		const message = error instanceof Error ? error.message : 'Unknown error';
		return NextResponse.json({ error: message }, { status: 500 });
	}
}

// GET handles both fetching and creating anon users, but PUT also available if needed
export async function PUT() {
	try {
		return await buildNewAnonUserResponse();
	} catch (error) {
		console.error('Error creating anon user:', error);
		const message = error instanceof Error ? error.message : 'Unknown error';
		return NextResponse.json({ error: message }, { status: 500 });
	}
}