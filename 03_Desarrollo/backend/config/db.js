import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'documind_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
});

/**
 * Ejecuta una query SQL con parámetros de forma segura
 * @param {string} sql - Sentencia SQL parametrizada
 * @param {Array} params - Parámetros para sustituir
 * @returns {Promise<Array>} Resultado de la query
 */
export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

/**
 * Cierra el pool de conexiones (usado en tests)
 */
export async function end() {
  await pool.end();
}

export default { query, end };
