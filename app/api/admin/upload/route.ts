import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAdminSession } from "@/lib/adminAuth";
import { registerMediaAsset } from "@/lib/db";

// Maximum 20 MB Limit in Bytes
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20,971,520 bytes

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "Commodity Imagery";

    if (!file) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    // 1. File Size Validation (Max 20 MB)
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return NextResponse.json(
        { error: `Image file is ${sizeMB} MB, which exceeds the maximum limit of 20 MB.` },
        { status: 400 }
      );
    }

    // 2. MIME Type / Format Validation
    const validExtensions = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".avif"];
    const ext = path.extname(file.name).toLowerCase();
    const isImageMime = file.type.startsWith("image/");
    const isValidExt = validExtensions.includes(ext);

    if (!isImageMime && !isValidExt) {
      return NextResponse.json(
        { error: "Invalid file format. Please upload an image file (PNG, JPG, WEBP, SVG, GIF, AVIF)." },
        { status: 400 }
      );
    }

    // 3. Ensure public/uploads directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 4. Generate clean sanitized filename with timestamp
    const baseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const safeExt = ext || ".png";
    const safeFileName = `${baseName || "upload"}-${Date.now()}${safeExt}`;
    const filePath = path.join(uploadDir, safeFileName);

    // 5. Convert ArrayBuffer and write to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeFileName}`;

    // 6. Register in Media library catalog
    try {
      await registerMediaAsset({
        id: `media-${Date.now()}`,
        fileName: safeFileName,
        path: publicUrl,
        category,
        altText: file.name.replace(/\.[^/.]+$/, ""),
        fileSize: file.size,
      });
    } catch (regErr) {
      console.warn("Media registration warning:", regErr);
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: safeFileName,
      size: file.size,
      formattedSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
    });
  } catch (err: any) {
    console.error("Upload handler error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to upload image. Please try again." },
      { status: 500 }
    );
  }
}
