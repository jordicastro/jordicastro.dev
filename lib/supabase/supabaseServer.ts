import "server-only";
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY as string;

export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);