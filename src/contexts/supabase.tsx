import type { Database } from "@/types/db-types";
import {
  createPagesBrowserClient,
  createPagesServerClient,
} from "@supabase/auth-helpers-nextjs";
import {
  SessionContextProvider,
  useSupabaseClient,
  useUser as useSupabaseUser,
} from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState, type ReactNode } from "react";

export const SupabaseProvider = ({ children }: { children: ReactNode }) => {
  const [supabase] = useState(() => createPagesBrowserClient());
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        if (!router.asPath.startsWith("/dashboard")) {
          router.push("/dashboard");
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <>{children}</>
    </SessionContextProvider>
  );
};

export const useSupabase = useSupabaseClient<Database>;

export const useUser = useSupabaseUser;

export const createServerClient = createPagesServerClient<Database>;
