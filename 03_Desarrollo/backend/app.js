import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Cargar variables de entorno
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, 'config/.env') });

// Rutas
import authRoutes from './routes/auth.routes.js';
import documentsRoutes from './routes/documents.routes.js';
import chatRoutes from './routes/chat.routes.js';
import repositoriesRoutes from './routes/repositories.routes.js';
import logsRoutes from './routes/logs.routes.js';

const app = express();

// ─── Middlewares globales ────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Asegurar que el directorio de uploads existe
const uploadsDir = join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ─── Rutas de la API ─────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/repositories', repositoriesRoutes);
app.use('/api/logs', logsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    ok: true,
    service: 'DocuMind API v1.0',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
});

// ─── Manejo global de errores ─────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(err.status || 500).json({
    ok: false,
    mensaje: err.message || 'Error interno del servidor.',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ ok: false, mensaje: `Ruta no encontrada: ${req.method} ${req.path}` });
});

export default app;
