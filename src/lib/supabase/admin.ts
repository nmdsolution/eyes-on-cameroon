import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Client that carries the user's session (for session checks)
export async function createAdminClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}

// Service-role client — bypasses RLS, use only for admin checks
function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function getAdminSession() {
  // 1. Get the user session from cookies
  const supabase = await createAdminClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return null;

  // 2. Check is_admin via service role to bypass RLS
  const service = createServiceClient();
  const { data: member } = await service
    .from("members")
    .select("is_admin")
    .eq("id", session.user.id)
    .single();

  if (!member?.is_admin) return null;

  return session;
}
