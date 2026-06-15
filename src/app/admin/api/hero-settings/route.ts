import { createAdminClient, getAdminSession } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { media_type, video_url, image_url } = await req.json();

    if (media_type !== "video" && media_type !== "image") {
      return NextResponse.json({ error: "Invalid media_type" }, { status: 400 });
    }

    const supabase = await createAdminClient();

    const payload = {
      media_type,
      video_url: video_url ?? null,
      image_url: image_url ?? null,
      updated_at: new Date().toISOString(),
    };

    const { data: existing } = await supabase
      .from("hero_settings")
      .select("id")
      .single();

    if (existing) {
      const { error } = await supabase
        .from("hero_settings")
        .update(payload)
        .eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("hero_settings")
        .insert(payload);
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Hero settings error:", err);
    return NextResponse.json({ error: "Failed to save hero settings" }, { status: 500 });
  }
}
