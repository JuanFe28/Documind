import { GoogleGenAI } from '@google/genai';
import { generarEmbeddingGoogle } from '../services/gemini.service.js';
import { queryVectores } from '../services/pinecone.service.js';
import db from '../config/db.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * POST /api/chat/query
 * Motor RAG: vectoriza la query → busca en Pinecone → genera respuesta con Gemini + fuentes citadas.
 */
export async function consultarRAG(req, res) {
  const { query, repositorio_id } = req.body;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({ ok: false, mensaje: 'La consulta no puede estar vacía.' });
  }

  try {
    // 1. Vectorizar la consulta del usuario
    const queryVector = await generarEmbeddingGoogle(query);

    // 2. Buscar en Pinecone con filtro opcional por repositorio
    const matches = await queryVectores(queryVector, repositorio_id ? parseInt(repositorio_id) : null, 3);

    // Sin resultados relevantes → respuesta honesta sin alucinación
    if (matches.length === 0) {
      return res.status(200).json({
        ok: true,
        respuesta: 'No he encontrado fragmentos relevantes en tus documentos para resolver tu consulta.',
        fuentes_citadas: [],
      });
    }

    // 3. Ensamblar contexto documental para el prompt
    const contexto = matches
      .map(
        (match) =>
          `[Fuente: ${match.metadata.nombre_archivo}, Pág: ${match.metadata.page_num}]: "${match.metadata.text_chunk}"`
      )
      .join('\n\n');

    const systemPrompt = `
      Eres 'DocuMind', el motor conversacional inteligente de la organización.
      Tu única tarea es responder a la pregunta del analista utilizando ÚNICAMENTE la base de conocimiento adjunta en la sección Contexto.

      Reglas Críticas:
      - Si el Contexto no contiene la respuesta directa, responde: 'No he encontrado información relevante en los documentos cargados para responder a tu pregunta'. Queda terminantemente prohibido alucinar datos.
      - Al final de tu respuesta o párrafo, cita de forma amigable la fuente consultada especificando el archivo y la página (ej. 'Factura Servicios (Página 1)').
      - Responde siempre en español.
      - Sé preciso, conciso y profesional.

      Contexto Documental:
      ${contexto}
    `;

    // 4. Generar respuesta con Gemini 1.5 Flash
    const chatResponse = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [{ role: 'user', parts: [{ text: `Pregunta: ${query}` }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.1,
      },
    });

    // 5. Construir lista de fuentes citadas para el frontend
    const fuentesCitadas = matches.map((match) => ({
      documento_id: match.metadata.documento_id,
      nombre_archivo: match.metadata.nombre_archivo,
      pagina: match.metadata.page_num,
      score: match.score,
    }));

    return res.status(200).json({
      ok: true,
      respuesta: chatResponse.text,
      fuentes_citadas: fuentesCitadas,
    });
  } catch (error) {
    console.error('Fallo crítico en Chat RAG:', error);

    // Registrar error crítico en logs
    try {
      await db.query(
        "INSERT INTO logs_errores (documento_id, severidad, mensaje_error, stack_trace) VALUES (NULL, 'ERROR', ?, ?)",
        [`Chat RAG Error: ${error.message}`, error.stack]
      );
    } catch (_) {}

    return res.status(500).json({
      ok: false,
      mensaje: 'Error del servidor en el motor conversacional RAG.',
    });
  }
}
