import { Pool, PoolClient, QueryResultRow, QueryResult } from "pg";

// ✅ Use globalThis for proper singleton across Next.js builds
const globalForPool = globalThis as unknown as { pool?: Pool };

// ----------------------------
// CONFIG
// ----------------------------
const connectionConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  ssl:
    process.env.DB_HOST && process.env.DB_HOST.includes("localhost")
      ? false
      : { rejectUnauthorized: false },

  // ✅ IMPORTANT: lower pool size to avoid Supabase limits
  max: 2,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Fallback to DATABASE_URL if DB_HOST is not provided
const finalConfig = process.env.DB_HOST
  ? connectionConfig
  : {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 2,
    };

// ----------------------------
// LOG CONFIG (safe)
// ----------------------------
if (!process.env.DB_HOST && !process.env.DATABASE_URL) {
  console.error(
    "❌ Database configuration missing. Set DB_HOST or DATABASE_URL"
  );
} else {
  console.log(
    process.env.DB_HOST
      ? `ℹ️ DB Host=${process.env.DB_HOST}, DB=${process.env.DB_NAME}`
      : "ℹ️ Using DATABASE_URL"
  );
}

// ----------------------------
// SINGLETON POOL
// ----------------------------
export const pool: Pool =
  globalForPool.pool ?? new Pool(finalConfig);

if (!globalForPool.pool) {
  globalForPool.pool = pool;
}

// ----------------------------
// ERROR HANDLER
// ----------------------------
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});


// ----------------------------
// QUERY HELPER
// ----------------------------
export const query = <T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> => pool.query<T>(text, params);

// ----------------------------
// GET CLIENT
// ----------------------------
export const getClient = async () => {
  const client = await pool.connect();
  return {
    client,
    release: () => client.release(),
    query: <T extends QueryResultRow = QueryResultRow>(
      text: string,
      params?: unknown[]
    ) => client.query<T>(text, params),
  };
};

// ----------------------------
// TRANSACTION HELPER
// ----------------------------
export const transaction = async <T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};