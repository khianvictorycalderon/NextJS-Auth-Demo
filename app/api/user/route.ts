import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: user, error } = await supabase
    .from("users")
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

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();     
  const admin = createAdminClient();        

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error: userError } = await supabase.auth.getUser(session.access_token);
  if (userError || !data.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = data.user.id;
  const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 400 });
  }

  const { error: tableError } = await supabase.from("users").delete().eq("id", userId);
  if (tableError) {
    return NextResponse.json({ error: tableError.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Account deleted successfully" });
}