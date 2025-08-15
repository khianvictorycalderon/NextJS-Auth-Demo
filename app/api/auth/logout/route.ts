import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();

  // Call Supabase to sign out the user
  await supabase.auth.signOut();

  // Create response and clear cookies
  const res = NextResponse.json({ message: "Logged out" });

  res.cookies.set({
    name: "sb-access-token",
    value: "",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
  });

  res.cookies.set({
    name: "sb-refresh-token",
    value: "",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
  });

  return res;
}
