import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 DocuMind Backend corriendo en http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}\n`);
});
