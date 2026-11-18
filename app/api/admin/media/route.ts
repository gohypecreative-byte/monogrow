import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAdminSession } from "@/lib/adminAuth";
import { getMediaAssets, registerMediaAsset, MediaAsset } from "@/lib/db";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get registered assets
  const registered = await getMediaAssets();

  // Also scan public/assets for available images
  const assetsDir = path.join(process.cwd(), "public", "assets");
  let fileList: string[] = [];
  try {
    if (fs.existsSync(assetsDir)) {
      fileList = fs.readdirSync(assetsDir).filter((f) => /\.(jpg|jpeg|png|webp|svg)$/i.test(f));
    }
  } catch (err) {
    console.error("Scan assets error:", err);
  }

  return NextResponse.json({
    registered,
    availableFiles: fileList.map((f) => `/assets/${f}`),
  });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    if (!data.path || !data.fileName) {
      return NextResponse.json({ error: "fileName and path are required." }, { status: 400 });
    }

    const asset: MediaAsset = {
      id: data.id || `media-${Date.now()}`,
      fileName: data.fileName,
      path: data.path,
      category: data.category || "General",
      altText: data.altText || data.fileName,
      fileSize: data.fileSize,
    };

    const saved = await registerMediaAsset(asset);
    return NextResponse.json({ success: true, asset: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to register media" }, { status: 500 });
  }
}
