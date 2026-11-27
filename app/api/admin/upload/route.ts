import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAdminSession } from "@/lib/adminAuth";
import { registerMediaAsset } from "@/lib/db";

// Serverless hosting platforms (e.g., Vercel, AWS Lambda) have a 4.5 MB request body limit.
// We set a safe 4.2 MB threshold to prevent HTTP 413 proxy gateway drops.
const MAX_FILE_SIZE = 4.2 * 1024 * 1024; // 4,404,019 bytes

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

    // 1. File Size Validation (Max 4.2 MB)
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return NextResponse.json(
        { error: `Image file is ${sizeMB} MB, which exceeds the server upload limit of 4 MB. Please use a compressed image.` },
        { status: 413 }
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

    // 3. Generate clean sanitized filename with timestamp
    const baseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const safeExt = ext || (file.type === "image/webp" ? ".webp" : ".png");
    const safeFileName = `${baseName || "upload"}-${Date.now()}${safeExt}`;

    // 4. Convert ArrayBuffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let publicUrl = "";

    // 5. Attempt writing to public/uploads (local dev, VPS, containerized servers)
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, safeFileName);
      fs.writeFileSync(filePath, buffer);
      publicUrl = `/uploads/${safeFileName}`;
    } catch (fsErr: any) {
      // On serverless hosts (Vercel read-only filesystem), fallback seamlessly to Base64 Data URI
      console.warn("Filesystem write not available (serverless environment), falling back to Data URI:", fsErr?.message);
      const mime = file.type || "image/webp";
      publicUrl = `data:${mime};base64,${buffer.toString("base64")}`;
    }

    // 6. Register in Media library catalog
    try {
      await registerMediaAsset({
        id: `media-${Date.now()}`,
        fileName: safeFileName,
        path: publicUrl.startsWith("data:") ? safeFileName : publicUrl,
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
