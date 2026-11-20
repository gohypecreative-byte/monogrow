import fs from "fs";
import path from "path";
import { executeNeonQuery, parseNeonConnectionString, NEON_SCHEMA_SQL } from "./neonClient";

export interface ProductVariation {
  id: string;
  weight: string;
  unit: string;
  price: number;
  currency: string;
  sku: string;
  packageType: string;
  inStock: boolean;
  minOrderQty: number;
  sortOrder: number;
}

export interface AdminProduct {
  id: string;
  categoryKey: "rice" | "coffee" | "sugar" | "dry-fruits";
  category: string;
  name: string;
  kicker: string;
  quoteName: string;
  tagline: string;
  description: string;
  originBadge: string;
  packImg: string;
  bowlImg: string;
  bowlAlt: string;
  packAlt: string;
  specs: { label: string; value: string }[];
  keyHighlights: string[];
  variations: ProductVariation[];
  isActive: boolean;
  isFeatured: boolean;
  updatedAt: string;
}

export interface SiteContent {
  hero: {
    kicker: string;
    headingLine1: string;
    headingItalic: string;
    headingLine2: string;
    subheading: string;
  };
  about: {
    heading: string;
    cards: Array<{
      id: string;
      wordmark: string;
      stepTag: string;
      headline: string;
      copy: string;
      specs: string[];
      location: string;
      subCaption: string;
      image: string;
    }>;
  };
  philosophy: {
    title: string;
    pillars: Array<{
      name: string;
      title: string;
      copy: string;
    }>;
  };
  announcement: {
    text: string;
    link: string;
    enabled: boolean;
  };
}

export interface MediaAsset {
  id: string;
  fileName: string;
  path: string;
  category: string;
  altText: string;
  fileSize?: number;
}

interface StoreData {
  version: string;
  updatedAt: string;
  neon: {
    status: string;
    lastSyncedAt: string | null;
    tablesInitialized: boolean;
  };
  siteContent: SiteContent;
  products: AdminProduct[];
  media: MediaAsset[];
}

const STORE_PATH = path.join(process.cwd(), "data", "admin-store.json");

function readStore(): StoreData {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = fs.readFileSync(STORE_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading admin store:", err);
  }
  return {
    version: "1.0",
    updatedAt: new Date().toISOString(),
    neon: { status: "standby", lastSyncedAt: null, tablesInitialized: false },
    siteContent: {} as any,
    products: [],
    media: [],
  };
}

function writeStore(data: StoreData): void {
  try {
    data.updatedAt = new Date().toISOString();
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing admin store:", err);
  }
}

// -------------------------------------------------------------
// Products & Variations API
// -------------------------------------------------------------
export async function getAdminProducts(): Promise<AdminProduct[]> {
  const store = readStore();
  return store.products || [];
}

export async function getAdminProductById(id: string): Promise<AdminProduct | null> {
  const products = await getAdminProducts();
  return products.find((p) => p.id === id) || null;
}

export async function saveAdminProduct(productData: Partial<AdminProduct> & { id: string }): Promise<AdminProduct> {
  const store = readStore();
  const existingIdx = store.products.findIndex((p) => p.id === productData.id);

  let updatedProduct: AdminProduct;
  if (existingIdx >= 0) {
    updatedProduct = {
      ...store.products[existingIdx],
      ...productData,
      updatedAt: new Date().toISOString(),
    };
    store.products[existingIdx] = updatedProduct;
  } else {
    updatedProduct = {
      id: productData.id,
      categoryKey: productData.categoryKey || "rice",
      category: productData.category || "Grains & Rice",
      name: productData.name || "New Product",
      kicker: productData.kicker || "",
      quoteName: productData.quoteName || productData.name || "New Product",
      tagline: productData.tagline || "",
      description: productData.description || "",
      originBadge: productData.originBadge || "",
      packImg: productData.packImg || "/assets/monagrow-rice-bag-cutout.png",
      bowlImg: productData.bowlImg || "/assets/hero-center-rice.png",
      bowlAlt: productData.bowlAlt || "",
      packAlt: productData.packAlt || "",
      specs: productData.specs || [],
      keyHighlights: productData.keyHighlights || [],
      variations: productData.variations || [],
      isActive: productData.isActive ?? true,
      isFeatured: productData.isFeatured ?? false,
      updatedAt: new Date().toISOString(),
    };
    store.products.push(updatedProduct);
  }

  writeStore(store);

  // If Neon DB is connected, optionally mirror to Neon in background
  if (parseNeonConnectionString()) {
    try {
      await mirrorProductToNeon(updatedProduct);
    } catch (err) {
      console.warn("Neon mirror background sync:", err);
    }
  }

  return updatedProduct;
}

export async function deleteAdminProduct(id: string): Promise<boolean> {
  const store = readStore();
  const initialLength = store.products.length;
  store.products = store.products.filter((p) => p.id !== id);
  if (store.products.length !== initialLength) {
    writeStore(store);
    if (parseNeonConnectionString()) {
      try {
        await executeNeonQuery("DELETE FROM monagrow_products WHERE id = $1", [id]);
      } catch (err) {
        console.warn("Neon delete error:", err);
      }
    }
    return true;
  }
  return false;
}

// -------------------------------------------------------------
// Variations Specific Helpers
// -------------------------------------------------------------
export async function saveProductVariation(
  productId: string,
  variation: Partial<ProductVariation> & { weight: string }
): Promise<ProductVariation> {
  const product = await getAdminProductById(productId);
  if (!product) throw new Error("Product not found");

  const varId = variation.id || `var-${productId}-${Date.now()}`;
  const existingVarIdx = product.variations.findIndex((v) => v.id === varId);

  const updatedVariation: ProductVariation = {
    id: varId,
    weight: variation.weight,
    unit: variation.unit || (variation.weight.includes("g") && !variation.weight.includes("kg") ? "g" : "kg"),
    price: Number(variation.price) || 0,
    currency: variation.currency || "USD",
    sku: variation.sku || `MNG-${product.categoryKey.slice(0, 3).toUpperCase()}-${varId}`,
    packageType: variation.packageType || "Standard Package",
    inStock: variation.inStock ?? true,
    minOrderQty: variation.minOrderQty ?? 1,
    sortOrder: variation.sortOrder ?? product.variations.length,
  };

  if (existingVarIdx >= 0) {
    product.variations[existingVarIdx] = updatedVariation;
  } else {
    product.variations.push(updatedVariation);
  }

  await saveAdminProduct(product);
  return updatedVariation;
}

export async function deleteProductVariation(productId: string, variationId: string): Promise<boolean> {
  const product = await getAdminProductById(productId);
  if (!product) return false;

  const initialLength = product.variations.length;
  product.variations = product.variations.filter((v) => v.id !== variationId);
  if (product.variations.length !== initialLength) {
    await saveAdminProduct(product);
    return true;
  }
  return false;
}

// -------------------------------------------------------------
// Website Content API
// -------------------------------------------------------------
export async function getSiteContent(): Promise<SiteContent> {
  const store = readStore();
  return store.siteContent;
}

export async function saveSiteContent(sectionKey: keyof SiteContent, data: any): Promise<SiteContent> {
  const store = readStore();
  store.siteContent[sectionKey] = data;
  writeStore(store);

  if (parseNeonConnectionString()) {
    try {
      await executeNeonQuery(
        `INSERT INTO monagrow_site_content (section_key, data, updated_at)
         VALUES ($1, $2, CURRENT_TIMESTAMP)
         ON CONFLICT (section_key) DO UPDATE SET data = $2, updated_at = CURRENT_TIMESTAMP`,
        [sectionKey, JSON.stringify(data)]
      );
    } catch (err) {
      console.warn("Neon content sync error:", err);
    }
  }

  return store.siteContent;
}

// -------------------------------------------------------------
// Media API
// -------------------------------------------------------------
export async function getMediaAssets(): Promise<MediaAsset[]> {
  const store = readStore();
  return store.media || [];
}

export async function registerMediaAsset(asset: MediaAsset): Promise<MediaAsset> {
  const store = readStore();
  const existingIdx = store.media.findIndex((m) => m.id === asset.id || m.path === asset.path);
  if (existingIdx >= 0) {
    store.media[existingIdx] = asset;
  } else {
    store.media.push(asset);
  }
  writeStore(store);
  return asset;
}

// -------------------------------------------------------------
// Neon DB Integration Helpers
// -------------------------------------------------------------
export function getNeonStatus() {
  const config = parseNeonConnectionString();
  const store = readStore();
  return {
    isConfigured: Boolean(config),
    host: config?.host || null,
    database: config?.database || null,
    user: config?.user || null,
    tablesInitialized: store.neon.tablesInitialized,
    lastSyncedAt: store.neon.lastSyncedAt,
    localProductsCount: store.products.length,
    localMediaCount: store.media.length,
  };
}

export async function testNeonConnection(customConnStr?: string) {
  try {
    const res = await executeNeonQuery("SELECT 1 AS connected, NOW() AS server_time", [], customConnStr);
    return {
      success: true,
      serverTime: res.rows[0]?.server_time,
      message: "Successfully connected to Neon Database!",
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to connect to Neon DB",
    };
  }
}

export async function initializeNeonTables(customConnStr?: string) {
  // Execute table definitions individually to ensure reliable execution across Neon HTTP proxy
  const statements = NEON_SCHEMA_SQL.split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  for (const stmt of statements) {
    await executeNeonQuery(stmt, [], customConnStr);
  }

  const store = readStore();
  store.neon.tablesInitialized = true;
  writeStore(store);
  return { success: true, count: statements.length };
}

export async function syncLocalToNeon(customConnStr?: string) {
  const store = readStore();
  // Ensure tables exist
  await initializeNeonTables(customConnStr);

  // Sync products and variations
  for (const product of store.products) {
    await mirrorProductToNeon(product, customConnStr);
  }

  // Sync site content
  for (const [key, val] of Object.entries(store.siteContent)) {
    await executeNeonQuery(
      `INSERT INTO monagrow_site_content (section_key, data, updated_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (section_key) DO UPDATE SET data = $2, updated_at = CURRENT_TIMESTAMP`,
      [key, JSON.stringify(val)],
      customConnStr
    );
  }

  store.neon.lastSyncedAt = new Date().toISOString();
  writeStore(store);

  return {
    success: true,
    syncedProducts: store.products.length,
    syncedContentSections: Object.keys(store.siteContent).length,
    lastSyncedAt: store.neon.lastSyncedAt,
  };
}

async function mirrorProductToNeon(product: AdminProduct, customConnStr?: string) {
  // Upsert product
  await executeNeonQuery(
    `INSERT INTO monagrow_products (
      id, category_key, category, name, kicker, quote_name, tagline, description,
      origin_badge, pack_img, bowl_img, bowl_alt, pack_alt, specs, key_highlights,
      is_active, is_featured, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, CURRENT_TIMESTAMP)
    ON CONFLICT (id) DO UPDATE SET
      category_key = $2, category = $3, name = $4, kicker = $5, quote_name = $6, tagline = $7,
      description = $8, origin_badge = $9, pack_img = $10, bowl_img = $11, bowl_alt = $12,
      pack_alt = $13, specs = $14, key_highlights = $15, is_active = $16, is_featured = $17,
      updated_at = CURRENT_TIMESTAMP`,
    [
      product.id,
      product.categoryKey,
      product.category,
      product.name,
      product.kicker,
      product.quoteName,
      product.tagline,
      product.description,
      product.originBadge,
      product.packImg,
      product.bowlImg,
      product.bowlAlt,
      product.packAlt,
      JSON.stringify(product.specs || []),
      JSON.stringify(product.keyHighlights || []),
      product.isActive,
      product.isFeatured,
    ],
    customConnStr
  );

  // Clear & insert variations
  await executeNeonQuery("DELETE FROM monagrow_weight_variations WHERE product_id = $1", [product.id], customConnStr);

  for (const v of product.variations || []) {
    await executeNeonQuery(
      `INSERT INTO monagrow_weight_variations (
        id, product_id, weight, unit, price, currency, sku, package_type, in_stock, min_order_qty, sort_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        v.id,
        product.id,
        v.weight,
        v.unit,
        v.price,
        v.currency,
        v.sku,
        v.packageType,
        v.inStock,
        v.minOrderQty,
        v.sortOrder,
      ],
      customConnStr
    );
  }
}
