import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/adminAuth";
import { getSiteContent, saveSiteContent, SiteContent } from "@/lib/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const content = await getSiteContent();
  return NextResponse.json({ content });
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { section, data } = await req.json();
    if (!section || !data) {
      return NextResponse.json({ error: "Section and data are required." }, { status: 400 });
    }

    const updated = await saveSiteContent(section as keyof SiteContent, data);
    return NextResponse.json({ success: true, content: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update content" }, { status: 500 });
  }
}
