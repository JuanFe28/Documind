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

    // 4. Generar respuesta con Gemini 3.5 Flash con reintentos
    let respuestaTexto = '';
    let exitoGemini = false;

    for (let intento = 1; intento <= 3; intento++) {
      try {
        const chatResponse = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: [{ role: 'user', parts: [{ text: `Pregunta: ${query}` }] }],
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.1,
          },
        });
        respuestaTexto = chatResponse.text;
        exitoGemini = true;
        break;
      } catch (errGen) {
        if (intento < 3 && (errGen?.status === 503 || errGen?.status === 429 || (errGen?.message && (errGen.message.includes('503') || errGen.message.includes('demand'))))) {
          console.warn(`[Chat RAG] Reintento ${intento}/3 tras error 503/429...`);
          await new Promise((r) => setTimeout(r, 1500 * intento));
        } else {
          console.warn('[Chat RAG] Fallback a respuesta de contexto documental directo.');
          break;
        }
      }
    }

    if (!exitoGemini || !respuestaTexto) {
      // Fallback amigable basado directamente en los fragmentos encontrados
      const primerMatch = matches[0];
      respuestaTexto = `Con base en el documento **${primerMatch.metadata.nombre_archivo}** (Pág. ${primerMatch.metadata.page_num}):\n\n"${primerMatch.metadata.text_chunk}"`;
    }

    // 5. Construir lista de fuentes citadas para el frontend
    const fuentesCitadas = matches.map((match) => ({
      documento_id: match.metadata.documento_id,
      nombre_archivo: match.metadata.nombre_archivo,
      pagina: match.metadata.page_num,
      score: match.score,
    }));

    return res.status(200).json({
      ok: true,
      respuesta: respuestaTexto,
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
