import { NextRequest, NextResponse } from "next/server";
import { ADMIN_CREDENTIALS, createSessionToken, SESSION_COOKIE_NAME } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail !== ADMIN_CREDENTIALS.email.toLowerCase() || password !== ADMIN_CREDENTIALS.password) {
      return NextResponse.json({ error: "Invalid email or password. Please verify your credentials." }, { status: 401 });
    }

    const token = createSessionToken(cleanEmail);

    const response = NextResponse.json({
      success: true,
      user: {
        email: cleanEmail,
        name: ADMIN_CREDENTIALS.name,
        role: ADMIN_CREDENTIALS.role,
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "An unexpected error occurred during login." }, { status: 500 });
  }
}
