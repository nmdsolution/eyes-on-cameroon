import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, getAdminSession } from "@/lib/supabase/admin";

async function requireAuth() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET() {
  const authError = await requireAuth();
  if (authError) return authError;

  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("pub_banners")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const body = await req.json();
  const supabase = await createAdminClient();
  const { data, error } = await supabase.from("pub_banners").insert(body).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const body = await req.json();
  const { id, ...updates } = body;
  const supabase = await createAdminClient();
  const { data, error } = await supabase.from("pub_banners").update(updates).eq("id", id).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { id } = await req.json();
  const supabase = await createAdminClient();
  const { error } = await supabase.from("pub_banners").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
