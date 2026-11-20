import { NextRequest, NextResponse } from "next/server";
import { getAdminProducts } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const id = searchParams.get("id");

    const allProducts = await getAdminProducts();
    const activeProducts = allProducts.filter((p) => p.isActive !== false);

    if (id) {
      const product = activeProducts.find((p) => p.id === id);
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json({ product });
    }

    if (category) {
      const filtered = activeProducts.filter((p) => p.categoryKey === category);
      return NextResponse.json({ products: filtered });
    }

    return NextResponse.json({ products: activeProducts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to load products" }, { status: 500 });
  }
}
