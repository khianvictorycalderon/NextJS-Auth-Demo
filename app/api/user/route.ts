import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: user, error } = await supabase
    .from("users") // Replace with your users table name
    .select("id, first_name, last_name, birth_date, email")
    .eq("id", session.user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updates: any = {};
  if (body.first_name) updates.first_name = body.first_name;
  if (body.last_name) updates.last_name = body.last_name;
  if (body.birth_date) updates.birth_date = body.birth_date;

  // Handle password change separately
  if (body.new_password) {
    const { error: passError } = await supabase.auth.updateUser({
      password: body.new_password
    });
    if (passError) {
      return NextResponse.json({ error: passError.message }, { status: 400 });
    }
  }

  const { error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", session.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Account updated successfully" });
}

export async function DELETE() {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Delete user from Supabase Auth
  const { error: authError } = await supabase.auth.admin.deleteUser(session.user.id);
  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  // Optional: delete from your users table as well
  await supabase.from("users").delete().eq("id", session.user.id);

  return NextResponse.json({ message: "Account deleted successfully" });
}
