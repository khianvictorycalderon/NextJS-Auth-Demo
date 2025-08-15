import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { login_email, login_password } = await request.json();

  const supabase = await createClient();

  // Sign in the user
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email: login_email,
      password: login_password,
    });

  if (signInError) {
    return NextResponse.json({ error: signInError.message }, { status: 400 });
  }

  if (!signInData.session) {
    return NextResponse.json({ error: "No session returned" }, { status: 500 });
  }

  const res = NextResponse.json({
    user: signInData.user,
  });

  res.cookies.set({
    name: "sb-access-token",
    value: signInData.session.access_token,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });

  res.cookies.set({
    name: "sb-refresh-token",
    value: signInData.session.refresh_token,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });

  return res;
}
