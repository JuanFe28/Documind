import { GoogleGenAI } from '@google/genai';
import { generarEmbeddingGoogle } from '../services/gemini.service.js';
import { queryVectores } from '../services/pinecone.service.js';
import db from '../config/db.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function conTimeout(promesa, ms = 4500) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Tiempo de espera agotado (${ms}ms)`)), ms);
  });
  return Promise.race([promesa, timeout]).finally(() => clearTimeout(timer));
}

/**
 * Detecta saludos e intenciones generales de ayuda sin necesidad de vectorizar.
 */
function esConsultaConversacionalGeneral(query) {
  const q = query.toLowerCase().trim();
  const saludos = ['hola', 'buenos dias', 'buenas tardes', 'buenas noches', 'saludos', 'hey', 'hello', 'hi'];
  if (saludos.some((s) => q === s || q.startsWith(s + ' ') || q.startsWith(s + ','))) {
    return 'saludo';
  }
  const ayuda = [
    'que puedes hacer',
    'qué puedes hacer',
    'que haces',
    'qué haces',
    'como funciona',
    'cómo funciona',
    'quien eres',
    'quién eres',
    'ayuda',
    'instrucciones',
    'para que sirves',
    'para qué sirves',
  ];
  if (ayuda.some((a) => q.includes(a))) {
    return 'ayuda';
  }
  return null;
}

/**
 * POST /api/chat/query
 * Motor RAG: vectoriza la query → busca en Pinecone → genera respuesta con Gemini + fuentes citadas.
 */
export async function consultarRAG(req, res) {
  const { query, repositorio_id } = req.body;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({ ok: false, mensaje: 'La consulta no puede estar vacía.' });
  }

  // 1. Respuesta inmediata para saludos y capacidades generales
  const intencion = esConsultaConversacionalGeneral(query);
  if (intencion === 'saludo' || intencion === 'ayuda') {
    return res.status(200).json({
      ok: true,
      respuesta: `¡Hola! Soy **DocuMind**, tu asistente de inteligencia documental empresarial. 🤖\n\nPuedo responder preguntas fundamentadas en los documentos cargados en tus repositorios:\n\n• ⚖️ **Legal:** Consulta de vigencias, penalizaciones por mora, causales de rescisión y firmantes de contratos.\n• 💵 **Finanzas:** Extracción de valores netos, impuestos (IVA/Retenciones), emisor NIT y fechas de vencimiento de facturas.\n• 👥 **Talento Humano:** Búsqueda de candidatos por tecnologías clave, años de experiencia laboral y títulos profesionales.\n\n¿Qué documento o consulta deseas revisar?`,
      fuentes_citadas: [],
    });
  }

  try {
    // 2. Vectorizar la consulta del usuario
    const queryVector = await generarEmbeddingGoogle(query);

    // 3. Buscar en Pinecone con filtro opcional por repositorio
    let matches = await queryVectores(queryVector, repositorio_id ? parseInt(repositorio_id) : null, 3);

    // Si no hay resultados en el repo específico, intentar búsqueda global
    if (matches.length === 0 && repositorio_id) {
      matches = await queryVectores(queryVector, null, 3);
    }

    // Filtrar por umbral mínimo de similitud semántica (0.65) para evitar emparejamientos espurios
    const MIN_SCORE = 0.65;
    const relevantMatches = matches.filter((m) => m.score >= MIN_SCORE);

    // Sin resultados relevantes → respuesta honesta sin alucinación
    if (relevantMatches.length === 0) {
      return res.status(200).json({
        ok: true,
        respuesta:
          'No he encontrado información relevante sobre esa pregunta en los documentos cargados en el repositorio. Como asistente documental empresarial, puedo responderte sobre las cláusulas de contratos, montos y vencimientos de facturas, o perfiles de hojas de vida indexados.',
        fuentes_citadas: [],
      });
    }

    // 4. Ensamblar contexto documental para el prompt
    const contexto = relevantMatches
      .map(
        (match) =>
          `[Fuente: ${match.metadata.nombre_archivo}, Pág: ${match.metadata.page_num}]: "${match.metadata.text_chunk}"`
      )
      .join('\n\n');

    const systemPrompt = `
      Eres 'DocuMind', el motor conversacional inteligente de la organización.
      Tu única tarea es responder a la pregunta del analista utilizando ÚNICAMENTE la base de conocimiento adjunta en la sección Contexto.

      Reglas Críticas:
      - Si el Contexto no contiene la respuesta directa, responde: 'No he encontrado información suficiente en los documentos cargados para responder a tu pregunta'. Queda terminantemente prohibido alucinar datos.
      - Al final de tu respuesta o párrafo, cita de forma amigable la fuente consultada especificando el archivo y la página (ej. 'contrato_servicios.pdf, Pág: 1').
      - Responde siempre en español con formato Markdown limpio (viñetas, negritas).
      - Sé preciso, conciso y profesional.

      Contexto Documental:
      ${contexto}
    `;

    // 5. Generar respuesta con Gemini 3.5 Flash con timeout estricto y fallback
    let respuestaTexto = '';
    try {
      const chatResponse = await conTimeout(
        ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: [{ role: 'user', parts: [{ text: `Pregunta: ${query}` }] }],
          config: {
            systemInstruction: systemPrompt,
            temperature: 0.1,
          },
        }),
        4500
      );
      respuestaTexto = chatResponse.text;
    } catch (errGen) {
      console.warn('[Chat RAG] Fallback a respuesta de contexto documental directo debido a:', errGen.message);
      const primerMatch = relevantMatches[0];
      respuestaTexto = `Con base en el documento **${primerMatch.metadata.nombre_archivo}** (Pág. ${primerMatch.metadata.page_num}):\n\n"${primerMatch.metadata.text_chunk}"\n\n*(Fuente: ${primerMatch.metadata.nombre_archivo}, Pág: ${primerMatch.metadata.page_num})*`;
    }

    // 6. Construir lista de fuentes citadas para el frontend
    const fuentesCitadas = relevantMatches.map((match) => ({
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

    try {
      await db.query(
        "INSERT INTO logs_errores (documento_id, severidad, mensaje_error, stack_trace) VALUES (NULL, 'ERROR', ?, ?)",
        [`Chat RAG Error: ${error.message}`, error.stack]
      );
    } catch (_) {}

    return res.status(200).json({
      ok: true,
      respuesta:
        'No he encontrado información relevante en los documentos para procesar esta consulta. Por favor verifica que el archivo esté cargado en el repositorio seleccionado.',
      fuentes_citadas: [],
    });
  }
}
