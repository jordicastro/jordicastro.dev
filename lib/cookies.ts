// cookie.ts is used for generating and verifying signed tokens for maintenance_access and anon_user
// the cookies are httpOnly and verified using a .env cookie secret, so they cannot be tampered with by the client

const encoder = new TextEncoder();

export const MAINTENANCE_COOKIE_NAME = 'maintenance_access';
export const MAINTENANCE_COOKIE_MAX_AGE_SECONDS = 24 * 60 * 60;

export const ANON_USER_COOKIE_NAME = 'anon_user';
export const ANON_USER_COOKIE_MAX_AGE_SECONDS = 365 * 24 * 60 * 60;

const TOKEN_VERSION = 'v1';

function getCookieSecret(secretEnvKey: 'MAINTENANCE_COOKIE_SECRET' | 'ANON_USER_COOKIE_SECRET'): string | null {
    const secret = process.env[secretEnvKey];
    return secret && secret.length > 0 ? secret : null;
}

function bytesToBase64Url(bytes: Uint8Array): string {
    let binary = '';

    for (let i = 0; i < bytes.length; i += 1) {
        binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToBytes(value: string): Uint8Array {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
}

async function importHmacKey(secret: string, usages: KeyUsage[]): Promise<CryptoKey> {
    return crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        usages
    );
}

export async function issueMaintenanceAccessToken(): Promise<string | null> {
    const secret = getCookieSecret('MAINTENANCE_COOKIE_SECRET');

    if (!secret) {
        return null;
    }

    const exp = Math.floor(Date.now() / 1000) + MAINTENANCE_COOKIE_MAX_AGE_SECONDS;
    const nonce = bytesToBase64Url(crypto.getRandomValues(new Uint8Array(16)));
    const payload = `${TOKEN_VERSION}.${exp}.${nonce}`;

    const key = await importHmacKey(secret, ['sign']);
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    const signature = bytesToBase64Url(new Uint8Array(signatureBuffer));

    return `${payload}.${signature}`;
}

export async function verifyMaintenanceAccessToken(token: string): Promise<boolean> {
    const secret = getCookieSecret('MAINTENANCE_COOKIE_SECRET');

    if (!secret) {
        return false;
    }

    const [version, expRaw, nonce, signature] = token.split('.');

    if (!version || !expRaw || !nonce || !signature) {
        return false;
    }

    if (version !== TOKEN_VERSION) {
        return false;
    }

    const exp = Number(expRaw);
    if (!Number.isFinite(exp) || exp <= Math.floor(Date.now() / 1000)) {
        return false;
    }

    const payload = `${version}.${expRaw}.${nonce}`;
    const key = await importHmacKey(secret, ['verify']);

    try {
        const signatureBytes = base64UrlToBytes(signature);
        const signatureBuffer = new ArrayBuffer(signatureBytes.byteLength);
        new Uint8Array(signatureBuffer).set(signatureBytes);

        return crypto.subtle.verify(
            'HMAC',
            key,
            signatureBuffer,
            encoder.encode(payload)
        );
    } catch {
        return false;
    }
}

export async function issueAnonUserToken(anonId: string): Promise<string | null> {
    const secret = getCookieSecret('ANON_USER_COOKIE_SECRET');

    if (!secret) {
        return null;
    }

    const exp = Math.floor(Date.now() / 1000) + ANON_USER_COOKIE_MAX_AGE_SECONDS;
    const payload = `${TOKEN_VERSION}.${exp}.${anonId}`;

    const key = await importHmacKey(secret, ['sign']);
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
    const signature = bytesToBase64Url(new Uint8Array(signatureBuffer));

    return `${payload}.${signature}`;
}

export async function verifyAnonUserToken(token: string): Promise<string | null> {
    const secret = getCookieSecret('ANON_USER_COOKIE_SECRET');

    if (!secret) {
        return null;
    }

    const [version, expRaw, anonId, signature] = token.split('.');

    if (!version || !expRaw || !anonId || !signature) {
        return null;
    }

    if (version !== TOKEN_VERSION) {
        return null;
    }

    const exp = Number(expRaw);
    if (!Number.isFinite(exp) || exp <= Math.floor(Date.now() / 1000)) {
        return null;
    }

    const payload = `${version}.${expRaw}.${anonId}`;
    const key = await importHmacKey(secret, ['verify']);

    try {
        const signatureBytes = base64UrlToBytes(signature);
        const signatureBuffer = new ArrayBuffer(signatureBytes.byteLength);
        new Uint8Array(signatureBuffer).set(signatureBytes);

        const isValid = await crypto.subtle.verify(
            'HMAC',
            key,
            signatureBuffer,
            encoder.encode(payload)
        );

        return isValid ? anonId : null;
    } catch {
        return null;
    }
}