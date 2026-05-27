import { useUserStore } from "@/store/userStore";
import { useUser } from "@clerk/expo";
import { useEffect, useRef } from "react";
import { useSupabase } from "./useSupabase";

export const useUserSync = () => {
    const { user } = useUser();
    const setIsAdmin = useUserStore((state) => state.setIsAdmin);
    const authSupabase = useSupabase();

    // Prevent duplicate calls (React strict-mode double-mount, rapid re-renders)
    const isSyncing = useRef(false);

    useEffect(() => {
        if (!user || isSyncing.current) return;

        const syncUser = async () => {
            isSyncing.current = true;

            try {
                console.log("[useUserSync] Syncing user:", user.id);

                // Atomic upsert — INSERT on first login, UPDATE on subsequent logins.
                // Only the columns in the payload are touched; is_admin is left alone on UPDATE.
                const { data, error } = await authSupabase
                    .from("users")
                    .upsert(
                        {
                            clerk_id: user.id,
                            email: user.emailAddresses[0]?.emailAddress,
                            first_name: user.firstName,
                            last_name: user.lastName,
                            avatar_url: user.imageUrl,
                        },
                        { onConflict: "clerk_id", ignoreDuplicates: false }
                    )
                    .select("is_admin")
                    .single();

                if (error) {
                    console.error(
                        "[useUserSync] UPSERT FAILED:",
                        error.message,
                        error.details,
                        error.hint
                    );
                    isSyncing.current = false;
                    return;
                }

                console.log("[useUserSync] User synced successfully:", data);
                setIsAdmin(data?.is_admin ?? false);
            } catch (err) {
                console.error("[useUserSync] Unexpected error:", err);
                isSyncing.current = false;
            }
        };

        syncUser();

        // Reset on unmount so a fresh mount can sync again
        return () => {
            isSyncing.current = false;
        };
    }, [user?.id]); // only re-run when the user ID actually changes
};