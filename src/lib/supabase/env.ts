// NEXT_PUBLIC_ variables must be referenced literally so Next.js can inline them.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** When false, the whole site runs on src/config/siteConfig.ts. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
