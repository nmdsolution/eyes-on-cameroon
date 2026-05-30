import { createAdminClient, getAdminSession } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { video_url } = await req.json();

    const supabase = await createAdminClient();

    // Check if settings exist
    const { data: existing } = await supabase
      .from("hero_settings")
      .select("id")
      .single();

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from("hero_settings")
        .update({ video_url, updated_at: new Date().toISOString() })
        .eq("id", existing.id);

      if (error) throw error;
    } else {
      // Create new
      const { error } = await supabase
        .from("hero_settings")
        .insert({ video_url });

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Hero settings error:", err);
    return NextResponse.json({ error: "Failed to save hero settings" }, { status: 500 });
  }
}
