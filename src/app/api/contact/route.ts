import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Champs obligatoires manquants." }, { status: 400 });
    }

    const supabase = await createAdminClient();
    const { error } = await supabase
      .from("contact_messages")
      .insert({ name: name.trim(), email: email.trim(), subject: subject?.trim() || null, message: message.trim() });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
