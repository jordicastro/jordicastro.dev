import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/supabaseServer';
import {
    MAINTENANCE_COOKIE_NAME,
    verifyMaintenanceAccessToken,
} from '@/lib/cookies';

let cachedMaintenanceStatus = false;
let cachedExpiresAt = 0;
// 5 minute cache to speed up and avoid hitting the database every refresh
const CACHE_TTL_MS = 5 * 60 * 1000;

// a cached db call to get the maintenance status
async function getMaintenanceStatus(): Promise<boolean> {
    const now = Date.now();

    // return cached value if its still valid
    if (now < cachedExpiresAt) {
        return cachedMaintenanceStatus;
    }
    try {
        const { data, error } = await supabaseAdmin
            .from('settings')
            .select('maintenance_enabled')
            .eq('id', 1)
            .single();
            
        if (error) {
            console.error('Error fetching maintenance status from Supabase:', error);
            return false;
        }
        if (!data) {
            console.warn('No rows found in settings table. Falling back to maintenance disabled.');
            return false;
        }

        const maintenanceEnabled = data.maintenance_enabled || false;

        cachedMaintenanceStatus = maintenanceEnabled;
        cachedExpiresAt = now + CACHE_TTL_MS;

        return maintenanceEnabled;
    } catch (error) {
        console.error('Error fetching maintenance status:', error);
        return false;
    }
}


export async function proxy(req: NextRequest) {
    const isMaintenanceEnabled = await getMaintenanceStatus();
    const pathname = req.nextUrl.pathname;
    
    // maintenance is NOT enabled and user is not trying to access the maintenance page: allow the request without checking for a valid cookie
    if(!isMaintenanceEnabled && !pathname.startsWith('/maintenance')) {
        return NextResponse.next();
    }

    const cookieToken = req.cookies.get(MAINTENANCE_COOKIE_NAME)?.value;
    // if the cookie 'maintenance_access' exists, rebuild the token using the env secret and compare it to the existing cookie. if they match and the cookie has not expired, the user can access the (main) routes
    const hasValidCookie = cookieToken ? await verifyMaintenanceAccessToken(cookieToken) : false;

    // console.log('isMaintenanceEnabled:', isMaintenanceEnabled, 'hasValidCookie:', hasValidCookie);

    // if maintenance is enabled and user doesnt have a valid cookie, redirect to maintenance page
    if (isMaintenanceEnabled && !hasValidCookie && !pathname.startsWith('/maintenance')) {
        return NextResponse.redirect(new URL('/maintenance', req.url));
    } 
    // if maintenance is not enabled or valid-cookie holder is trying to access the maintenance page, redirect to home page
    else if (!isMaintenanceEnabled && pathname.startsWith('/maintenance') || isMaintenanceEnabled && hasValidCookie && pathname.startsWith('/maintenance')) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // otherwise, allow the request to proceed
    return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
         * - all files in /public or with an extension
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)',
  ],
}


