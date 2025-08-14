import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      register_first_name,
      register_last_name,
      register_birth_date,
      register_email,
      register_password,
      register_confirm_password
    } = await request.json();

    // Patterns
    const namePattern = /^[A-Za-z\s'-]+$/;
    const birthDatePattern = /^\d{4}-\d{2}-\d{2}$/;
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validation
    if (!register_first_name || !namePattern.test(register_first_name)) {
      return NextResponse.json({ error: "Invalid first name" }, { status: 400 });
    }

    if (!register_last_name || !namePattern.test(register_last_name)) {
      return NextResponse.json({ error: "Invalid last name" }, { status: 400 });
    }

    if (!register_birth_date || !birthDatePattern.test(register_birth_date)) {
      return NextResponse.json({ error: "Invalid birth date format" }, { status: 400 });
    }

    const today = new Date();
    const birthDate = new Date(register_birth_date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      return NextResponse.json({ error: "You must be at least 18 years old to register" }, { status: 400 });
    }

    if (!register_email || !emailPattern.test(register_email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (!register_password || !passwordPattern.test(register_password)) {
      return NextResponse.json(
        { error: "Password must meet security requirements" },
        { status: 400 }
      );
    }

    if (register_password !== register_confirm_password) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    // Connecting to database
    const supabase = createClient();

    // Registering the user
    const { error: signUpError } = await supabase.auth.signUp({
      email: register_email,
      password: register_password,
      options: {
        data: {
          first_name: register_first_name,
          last_name: register_last_name,
          birth_date: register_birth_date
        }
      }
    });

    if (signUpError) {
      return NextResponse.json({ error: `Register failed: ${signUpError.message}` }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Successfully registered, you may login now" },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}