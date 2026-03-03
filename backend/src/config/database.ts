import { Pool, QueryResult } from 'pg';

const poolConfig = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'product_management',
    };

const pool = new Pool(poolConfig);

// Test connection on startup
pool.on('connect', () => {
    console.log('📦 Connected to PostgreSQL');
});

pool.on('error', (err) => {
    console.error('❌ Unexpected PostgreSQL error:', err);
    process.exit(-1);
});

export const query = (text: string, params?: unknown[]): Promise<QueryResult> => {
    return pool.query(text, params);
};

export const initDB = async (): Promise<void> => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      stock INT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

    await pool.query(createTableQuery);
};

export default pool;
