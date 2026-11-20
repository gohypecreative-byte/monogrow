// Neon Serverless PostgreSQL HTTP Driver (Zero external dependencies)

export interface NeonConfig {
  connectionString: string;
  host: string;
  user: string;
  database: string;
  endpoint: string;
}

export function parseNeonConnectionString(connStr?: string): NeonConfig | null {
  const str = connStr || process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  if (!str) return null;

  try {
    const parsed = new URL(str);
    const host = parsed.hostname;
    const user = parsed.username;
    const database = parsed.pathname.replace(/^\//, "");
    if (!host) return null;

    // Neon's serverless HTTP proxy endpoint is https://[endpoint].neon.tech/sql
    // When a pooler hostname like ep-xyz-pooler.region.neon.tech is provided,
    // strip '-pooler' so the HTTP SQL proxy resolves directly to the serverless proxy.
    const httpHost = host.replace("-pooler", "");

    return {
      connectionString: str,
      host,
      user,
      database,
      endpoint: `https://${httpHost}/sql`,
    };
  } catch {
    return null;
  }
}

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
  command?: string;
}

/**
 * Execute a SQL query directly against Neon DB via its native HTTPS SQL proxy.
 * Works seamlessly in Edge, Serverless, and Node environments with 0 native binaries.
 */
export async function executeNeonQuery<T = any>(
  query: string,
  params: any[] = [],
  overrideConnStr?: string
): Promise<QueryResult<T>> {
  const config = parseNeonConnectionString(overrideConnStr);
  if (!config) {
    throw new Error("Neon Database connection string not found. Please set DATABASE_URL or NEON_DATABASE_URL.");
  }

  const response = await fetch(config.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "neon-connection-string": config.connectionString,
    },
    body: JSON.stringify({
      query,
      params,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Neon DB Query Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rows = (data.rows || []) as T[];
  return {
    rows,
    rowCount: data.rowCount ?? rows.length,
    command: data.command,
  };
}

/**
 * SQL Schema Definitions for Neon DB
 */
export const NEON_SCHEMA_SQL = `
-- 1. Products Table
CREATE TABLE IF NOT EXISTS monagrow_products (
  id VARCHAR(100) PRIMARY KEY,
  category_key VARCHAR(50) NOT NULL,
  category VARCHAR(100) NOT NULL,
  name VARCHAR(200) NOT NULL,
  kicker VARCHAR(200),
  quote_name VARCHAR(200),
  tagline TEXT,
  description TEXT,
  origin_badge VARCHAR(200),
  pack_img TEXT,
  bowl_img TEXT,
  bowl_alt TEXT,
  pack_alt TEXT,
  specs JSONB DEFAULT '[]'::jsonb,
  key_highlights JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Product Weight Variations Table
CREATE TABLE IF NOT EXISTS monagrow_weight_variations (
  id VARCHAR(100) PRIMARY KEY,
  product_id VARCHAR(100) REFERENCES monagrow_products(id) ON DELETE CASCADE,
  weight VARCHAR(50) NOT NULL,
  unit VARCHAR(20) DEFAULT 'kg',
  price NUMERIC(10, 2) DEFAULT 0.00,
  currency VARCHAR(10) DEFAULT 'USD',
  sku VARCHAR(100),
  package_type VARCHAR(100),
  in_stock BOOLEAN DEFAULT true,
  min_order_qty INT DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Website Content Table
CREATE TABLE IF NOT EXISTS monagrow_site_content (
  section_key VARCHAR(100) PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Media Assets Table
CREATE TABLE IF NOT EXISTS monagrow_media (
  id VARCHAR(100) PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  path TEXT NOT NULL,
  category VARCHAR(50),
  alt_text TEXT,
  file_size INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_variations_product_id ON monagrow_weight_variations(product_id);
`;
