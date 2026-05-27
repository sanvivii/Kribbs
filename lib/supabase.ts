// Polyfill WebSocket for Node.js 20 (lacks native WebSocket support)
// Only applies during Metro server-side evaluation; browsers have WebSocket natively
if (typeof globalThis.WebSocket === "undefined") {
    globalThis.WebSocket = class WebSocket {
        close() {}
        send() {}
    } as any;
}

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;

// Plain anon client — used for public reads (properties list, etc.)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authenticated client — pass this a getToken function from Clerk's useAuth()
// This attaches the Clerk JWT to every Supabase request so RLS can identify the user
export function createClerkSupabaseClient(
    getToken: () => Promise<string | null>
    ) {
    return createClient(supabaseUrl, supabaseAnonKey, {
        async accessToken() {
            return getToken();
        },
    });
}