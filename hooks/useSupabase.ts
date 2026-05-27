import { useAuth } from "@clerk/expo";
import { useMemo, useRef } from "react";
import { createClerkSupabaseClient } from "../lib/supabase";

export function useSupabase() {
    const { getToken } = useAuth();

    // Keep a ref so the Supabase client's accessToken() callback
    // always calls the *latest* getToken without recreating the client.
    const getTokenRef = useRef(getToken);
    getTokenRef.current = getToken;

    const client = useMemo(
        () =>
            createClerkSupabaseClient(() =>
                getTokenRef.current({ template: "supabase" })
            ),
        [] // stable — client created once, accessToken reads ref on every request
    );

    return client;
}