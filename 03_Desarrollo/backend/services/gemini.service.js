import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../config/.env') });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Invoca a Gemini 1.5 Flash para categorizar un documento y extraer metadatos
 * estructurados en JSON con Structured Output (evita alucinaciones operativas).
 * @param {string} textoPlano - Texto extraído del documento
 * @returns {Promise<Object>} JSON con categoria_detectada, score_confianza, resumen_ia, metadatos
 */
export async function analizarDocumentoConGemini(textoPlano) {
  // Limitar texto a 8000 chars para evitar exceder context window en el análisis
  const textoTruncado = textoPlano.slice(0, 8000);

  const prompt = `
    Analiza con extremo rigor el siguiente texto extraído de un archivo cargado.
    Debes clasificarlo obligatoriamente en una de estas categorías de negocio: 'Contrato', 'Factura' o 'Hoja de Vida'.
    Si el contenido no se asocia a ninguna de las tres categorías anteriores, clasifícalo como 'Otros'.

    Extrae además los metadatos correspondientes según el tipo:
    - Si es Contrato: firmantes (array), vigencia, penalizaciones.
    - Si es Factura: emisor_nit, valor_total (numérico), impuestos, fecha_vencimiento.
    - Si es Hoja de Vida: tecnologias_clave (array de strings), experiencia_años (numérico), ultimo_titulo.

    Contenido del documento:
    """
    ${textoTruncado}
    """
  `;

  // Esquema estricto (Structured Output) para evitar alucinaciones operativas
  const responseSchema = {
    type: 'OBJECT',
    properties: {
      categoria_detectada: {
        type: 'STRING',
        enum: ['Contrato', 'Factura', 'Hoja de Vida', 'Otros'],
      },
      score_confianza: {
        type: 'NUMBER',
        description: 'Grado de certeza técnica de clasificación entre 0.0 y 100.0',
      },
      resumen_ia: {
        type: 'STRING',
        description: 'Síntesis ejecutiva de los aspectos clave del documento sin superar las 150 palabras.',
      },
      metadatos: {
        type: 'OBJECT',
        properties: {
          firmantes: { type: 'ARRAY', items: { type: 'STRING' } },
          vigencia: { type: 'STRING' },
          penalizaciones: { type: 'STRING' },
          emisor_nit: { type: 'STRING' },
          valor_total: { type: 'NUMBER' },
          impuestos: { type: 'NUMBER' },
          fecha_vencimiento: { type: 'STRING' },
          tecnologias_clave: { type: 'ARRAY', items: { type: 'STRING' } },
          experiencia_años: { type: 'NUMBER' },
          ultimo_titulo: { type: 'STRING' },
        },
      },
    },
    required: ['categoria_detectada', 'score_confianza', 'resumen_ia', 'metadatos'],
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: responseSchema,
      temperature: 0.1, // Evita variabilidad y alucinaciones en análisis de datos estructurados
    },
  });

  return JSON.parse(response.text);
}

/**
 * Vectoriza un fragmento (chunk) de texto usando text-embedding-004 (768 dimensiones)
 * @param {string} textoChunk - Fragmento de texto a vectorizar
 * @returns {Promise<number[]>} Array de 768 floats (embedding)
 */
export async function generarEmbeddingGoogle(textoChunk) {
  const response = await ai.models.embedContent({
    model: 'gemini-embedding-2',
    contents: textoChunk,
    config: {
      outputDimensionality: 768,
    },
  });
  return response.embeddings[0].values;
}

/**
 * Divide un texto en chunks con overlap para mejor recuperación semántica
 * @param {string} texto - Texto completo del documento
 * @param {number} chunkSize - Tamaño de cada chunk en caracteres (default 1000)
 * @param {number} overlap - Solapamiento entre chunks (default 200)
 * @returns {string[]} Array de fragmentos de texto
 */
export function dividirEnChunks(texto, chunkSize = 1000, overlap = 200) {
  const chunks = [];
  let inicio = 0;

  while (inicio < texto.length) {
    const fin = Math.min(inicio + chunkSize, texto.length);
    chunks.push(texto.slice(inicio, fin));
    inicio += chunkSize - overlap;
    if (inicio >= texto.length) break;
  }

  return chunks;
}
