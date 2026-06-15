import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

export async function getAdminSession() {
  const supabase = await createAdminClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return null;

  // Only users with is_admin = true in the members table can access admin
  const { data: member } = await supabase
    .from("members")
    .select("is_admin")
    .eq("id", session.user.id)
    .single();

  if (!member?.is_admin) return null;

  return session;
}
