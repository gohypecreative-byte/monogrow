import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/adminAuth";
import { getNeonStatus, testNeonConnection, initializeNeonTables, syncLocalToNeon } from "@/lib/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = getNeonStatus();
  return NextResponse.json({ status });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { action, connectionString } = await req.json();

    if (action === "test") {
      const result = await testNeonConnection(connectionString);
      return NextResponse.json(result);
    }

    if (action === "migrate") {
      const result = await initializeNeonTables(connectionString);
      return NextResponse.json(result);
    }

    if (action === "sync") {
      const result = await syncLocalToNeon(connectionString);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Neon DB action failed" }, { status: 500 });
  }
}
