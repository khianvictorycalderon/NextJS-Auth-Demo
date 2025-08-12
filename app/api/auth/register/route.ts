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

        console.log({
            register_first_name,
            register_last_name,
            register_birth_date,
            register_email,
            register_password,
            register_confirm_password
        });

        return NextResponse.json(
            { message: "Successfully received! "},
            { status: 200 }
        )

    } catch (error) {
        return NextResponse.json(
            { error: "Invalid request body" },
            { status: 400 }
        )
    }
}