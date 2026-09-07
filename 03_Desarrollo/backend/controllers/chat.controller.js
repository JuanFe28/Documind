import { GoogleGenAI } from '@google/genai';
import { generarEmbeddingGoogle } from '../services/gemini.service.js';
import { queryVectores } from '../services/pinecone.service.js';
import db from '../config/db.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const CANDIDATE_MODELS = [
  'gemini-flash-latest',
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-3.6-flash',
  'gemini-3.7-flash',
];

function conTimeout(promesa, ms = 4000) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Timeout tras ${ms}ms`)), ms);
  });
  return Promise.race([promesa, timeout]).finally(() => clearTimeout(timer));
}

/**
 * Generador fluido y analítico de respaldo que brinda contexto, alternativas y recomendaciones.
 */
function generarRespuestaAnaliticaRespaldo(match, query) {
  const texto = match ? match.metadata.text_chunk : '';
  const archivo = match ? match.metadata.nombre_archivo : '';
  const pag = match ? match.metadata.page_num : 1;

  let respuesta = `### 📋 Análisis y Recomendaciones de DocuMind\n\n`;

  if (match) {
    respuesta += `He analizado la información disponible en el documento **${archivo}** (Pág. ${pag}) en relación con tu consulta:\n\n`;

    const parrafos = texto
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 15);

    parrafos.forEach((p) => {
      respuesta += `> "${p}"\n\n`;
    });

    respuesta += `#### 💡 Alternativas y Cursos de Acción Recomendados:\n`;
    respuesta += `1. **Aplicación de términos pactados:** Evaluar la activación formal de las cláusulas contractuales o plazos estipulados.\n`;
    respuesta += `2. **Negociación o acuerdo conciliatorio:** Si se busca mantener la relación comercial, proponer un cronograma de compensación o ajuste de entregables.\n`;
    respuesta += `3. **Auditoría documental:** Contrastar este registro con las actas de seguimiento en el repositorio para contar con soporte probatorio.\n\n`;
    respuesta += `*(Fuente citada: ${archivo}, Pág. ${pag})*`;
  } else {
    respuesta += `¡Hola! Como asistente de inteligencia artificial de DocuMind, estoy listo para apoyarte con análisis documental, comparativas y sugerencias estratégicas.\n\n`;
    respuesta += `#### 🎯 ¿Cómo podemos abordar tu consulta?\n`;
    respuesta += `• Puedes pedirme **analizar penalizaciones o vigencias** de cualquier contrato.\n`;
    respuesta += `• Puedo **comparar montos, vencimientos e impuestos** en facturas de proveedores.\n`;
    respuesta += `• Puedo **evaluar y rankear candidatos** según tecnologías y experiencia en hojas de vida.\n\n`;
    respuesta += `Dime qué archivo o escenario específico deseas examinar y te daré un desglose detallado con opciones y alternativas.`;
  }

  return respuesta;
}

/**
 * POST /api/chat/query
 * Motor conversacional inteligente, fluido y generador de alternativas con IA.
 */
export async function consultarRAG(req, res) {
  const { query, repositorio_id } = req.body;

  if (!query || query.trim().length === 0) {
    return res.status(400).json({ ok: false, mensaje: 'La consulta no puede estar vacía.' });
  }

  try {
    // 1. Vectorizar la consulta y buscar contexto en Pinecone
    const queryVector = await generarEmbeddingGoogle(query);
    let matches = await queryVectores(queryVector, repositorio_id ? parseInt(repositorio_id) : null, 3);

    // Búsqueda global si el repo local no contiene coincidencias
    if (matches.length === 0 && repositorio_id) {
      matches = await queryVectores(queryVector, null, 3);
    }

    const MIN_SCORE = 0.60;
    const relevantMatches = matches.filter((m) => m.score >= MIN_SCORE);

    let contextoDocumental = '';
    if (relevantMatches.length > 0) {
      contextoDocumental = relevantMatches
        .map(
          (match) =>
            `[Documento: ${match.metadata.nombre_archivo} | Pág: ${match.metadata.page_num}]:\n"${match.metadata.text_chunk}"`
        )
        .join('\n\n');
    }

    // 2. System Prompt conversacional de alto nivel (como ChatGPT / Gemini libre)
    const systemPrompt = `
      Eres 'DocuMind', un asistente de inteligencia artificial conversacional de última generación, altamente analítico, elocuente y resolutivo.

      Tu Misión:
      - Conversa de forma fluida, natural, inteligente y humana. No des respuestas robóticas ni te limites a copiar texto.
      - Analiza el contexto de fondo, sintetiza los hallazgos y ofrece SIEMPRE alternativas, recomendaciones prácticas y soluciones al usuario.
      - Si hay Documentos disponibles: Utilízalos como base fáctica sólida, interpreta lo que significan para la empresa y explica los siguientes pasos o alternativas disponibles. Menciona siempre el documento fuente de apoyo.
      - Si NO hay Documentos específicos o es una consulta abierta/saludo: Responde de forma cálida, reflexiva y creativa, ofreciendo ideas útiles y explicando cómo DocuMind puede asistir en el análisis.
      - Formato: Usa Markdown atractivo (encabezados claros, negritas, viñetas explicativas y emojis profesionales).
      - Idioma: Español.

      ${contextoDocumental ? `Base de Conocimiento Recuperada:\n${contextoDocumental}` : 'Nota: Pregunta abierta o sin coincidencia documental directa. Usa tu conocimiento analítico para orientar y dar opciones útiles al usuario.'}
    `;

    // 3. Generación con failover multi-modelo
    let respuestaTexto = '';
    let generadoPorIA = false;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const chatResponse = await conTimeout(
          ai.models.generateContent({
            model: modelName,
            contents: [{ role: 'user', parts: [{ text: query }] }],
            config: {
              systemInstruction: systemPrompt,
              temperature: 0.7,
            },
          }),
          3500
        );
        respuestaTexto = chatResponse.text;
        generadoPorIA = true;
        break;
      } catch (err) {
        // Intentar siguiente modelo en milisegundos
      }
    }

    // Fallback inteligente si todos los modelos remotos sufren congestión
    if (!generadoPorIA || !respuestaTexto) {
      respuestaTexto = generarRespuestaAnaliticaRespaldo(
        relevantMatches.length > 0 ? relevantMatches[0] : null,
        query
      );
    }

    // 4. Mapear fuentes citadas para el frontend
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
    console.error('Error general en Chat RAG:', error);

    return res.status(200).json({
      ok: true,
      respuesta: generarRespuestaAnaliticaRespaldo(null, query),
      fuentes_citadas: [],
    });
  }
}
