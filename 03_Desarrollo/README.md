# DocuMind V1.0 - Sistema RAG Empresarial

DocuMind es una plataforma integral de gestión documental y asistente virtual inteligente basada en arquitectura **RAG (Retrieval-Augmented Generation)**. Permite a las organizaciones ingestar documentos técnicos y manuales normativos, vectorizarlos mediante Pinecone y realizar consultas en lenguaje natural con respuestas fundamentadas y trazables utilizando modelos de Google Gemini.

---

## 🚀 Estructura del Módulo de Desarrollo (`03_Desarrollo`)

```
03_Desarrollo/
├── backend/                  # Servidor API Node.js / Express
│   ├── config/               # Conexión MySQL y DDL (schema.sql)
│   ├── controllers/          # Controladores (Auth, RAG, Ingesta, Logs, Repos)
│   ├── middleware/           # Validación JWT y control de roles
│   ├── routes/               # Endpoints RESTful
│   ├── services/             # Integración Gemini AI y Pinecone Vector DB
│   └── __tests__/            # Suite de pruebas automatizadas Jest + Supertest
├── frontend/                 # Aplicación Cliente React + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/       # Componentes reutilizables (Sidebar, ProtectedRoute)
│   │   ├── context/          # AuthContext (Sesión y permisos)
│   │   ├── pages/            # Vistas (Login, Ingesta, Chat RAG, Dashboard TI)
│   │   └── services/         # Cliente Axios y configuración API
└── .gitignore
```

---

## 🛠️ Requisitos Previos

- **Node.js**: v18+ o v20+
- **MySQL Server / MariaDB**: v8.0+ / XAMPP / Laragon
- **Cuenta Pinecone**: Para base de datos vectorial
- **Google AI Studio Key**: API Key de Google Gemini

---

## ⚙️ Configuración e Instalación

### 1. Base de Datos
Ejecutar el script SQL ubicado en:
`03_Desarrollo/backend/config/schema.sql` en su servidor MySQL (crea la BD `documind_db`, tablas y usuarios de prueba iniciales).

### 2. Backend
```bash
cd 03_Desarrollo/backend
npm install
cp .env.example .env
# Configurar variables en el archivo .env
npm run dev
```

### 3. Frontend
```bash
cd 03_Desarrollo/frontend
npm install
cp .env.example .env
npm run dev
```

---

## 🧪 Pruebas Automatizadas
Para ejecutar la suite completa de pruebas unitarias y de integración del Backend:
```bash
cd 03_Desarrollo/backend
npm test
```
