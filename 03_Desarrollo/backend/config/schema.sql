-- ============================================================
-- DocuMind V1.0 — Script de Inicialización de Base de Datos
-- Ejecutar en HeidiSQL contra el servidor MySQL local
-- ============================================================

CREATE DATABASE IF NOT EXISTS documind_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE documind_db;

-- 1. Tabla: usuarios (Cuentas y accesos del personal)
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('ADMIN', 'LEGAL', 'FINANCIERO', 'RECLUTADOR') NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Tabla: repositorios (Carpetas lógicas para aislar documentos por área)
CREATE TABLE IF NOT EXISTS repositorios (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NULL,
    departamento VARCHAR(50) NOT NULL,
    usuario_id BIGINT UNSIGNED NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 3. Tabla: documentos (Registro de archivos ingestados físicamente)
CREATE TABLE IF NOT EXISTS documentos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre_archivo VARCHAR(255) NOT NULL,
    url_descarga TEXT NOT NULL,
    tipo_formato VARCHAR(10) NOT NULL,
    tamaño_bytes BIGINT NOT NULL,
    categoria_detectada VARCHAR(50) NULL,
    score_confianza DECIMAL(5,2) NULL,
    resumen_ia TEXT NULL,
    estado_procesamiento ENUM('PENDIENTE', 'PROCESANDO', 'COMPLETADO', 'ERROR') NOT NULL DEFAULT 'PENDIENTE',
    repositorio_id BIGINT UNSIGNED NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (repositorio_id) REFERENCES repositorios(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 4. Tabla: metadatos_extraidos (Metadatos estructurados en formato JSON por tipo de archivo)
CREATE TABLE IF NOT EXISTS metadatos_extraidos (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    documento_id BIGINT UNSIGNED NOT NULL UNIQUE,
    metadata_json JSON NOT NULL,
    fecha_extraccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (documento_id) REFERENCES documentos(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- 5. Tabla: logs_errores (Registro técnico de excepciones del backend o de IA para TI)
CREATE TABLE IF NOT EXISTS logs_errores (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    documento_id BIGINT UNSIGNED NULL,
    severidad ENUM('INFO', 'WARNING', 'ERROR', 'CRITICAL') NOT NULL,
    mensaje_error TEXT NOT NULL,
    stack_trace TEXT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (documento_id) REFERENCES documentos(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- Datos iniciales de prueba (seed)
-- Contraseña: 'password_seguro_uts' (hash bcrypt rounds=12)
-- ============================================================

INSERT IGNORE INTO usuarios (nombre, email, password_hash, rol) VALUES
('Wilson Castaño', 'wilson.admin@documind.com', '$2a$12$WVNZ/3zxb218zTS1Ub3gm.wX3jQ900VwTks1mVuR1sHoj4ehvs8fm', 'ADMIN'),
('Diana Rodríguez', 'diana.legal@documind.com', '$2a$12$WVNZ/3zxb218zTS1Ub3gm.wX3jQ900VwTks1mVuR1sHoj4ehvs8fm', 'LEGAL'),
('Carlos Sánchez', 'carlos.financiero@documind.com', '$2a$12$WVNZ/3zxb218zTS1Ub3gm.wX3jQ900VwTks1mVuR1sHoj4ehvs8fm', 'FINANCIERO'),
('María Torres', 'maria.reclutador@documind.com', '$2a$12$WVNZ/3zxb218zTS1Ub3gm.wX3jQ900VwTks1mVuR1sHoj4ehvs8fm', 'RECLUTADOR');

INSERT IGNORE INTO repositorios (nombre, descripcion, departamento, usuario_id) VALUES
('Contratos Legales 2026', 'Repositorio de contratos de prestación de servicios', 'Legal', 1),
('Facturas y Contabilidad', 'Facturas de proveedores y registros contables', 'Financiero', 1),
('Hojas de Vida - Reclutamiento', 'CVs de candidatos para vacantes abiertas', 'Recursos Humanos', 1);

-- Nota: El hash corresponde a 'password_seguro_uts' para todos los usuarios de prueba.
-- En producción, asigna contraseñas únicas con bcrypt.
