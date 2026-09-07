import React, { useState, useRef, useEffect } from 'react';
import { Send, FileText, Bot, User, Loader2, MessageSquare, Trash2, AlertCircle } from 'lucide-react';
import { chatAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function TypingIndicator() {
  return (
    <div className="flex items-start justify-start gap-3 animate-fade-in">
      <div className="bg-indigo-50 p-2 rounded-full border border-indigo-100">
        <Bot className="text-indigo-600 w-5 h-5" />
      </div>
      <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm">
        <p className="text-xs font-bold text-indigo-700 mb-2">🤖 DocuMind Gemini Engine</p>
        <div className="flex items-center gap-1.5">
          <div className="typing-dot" style={{ animationDelay: '0ms' }} />
          <div className="typing-dot" style={{ animationDelay: '150ms' }} />
          <div className="typing-dot" style={{ animationDelay: '300ms' }} />
          <span className="text-xs text-slate-400 ml-1">Consultando documentos...</span>
        </div>
      </div>
    </div>
  );
}

function MensajeUsuario({ texto, nombre }) {
  return (
    <div className="flex items-start justify-end gap-3 animate-slide-right">
      <div className="bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-none shadow-sm max-w-xl">
        <p className="font-semibold mb-1 text-indigo-200 text-xs">{nombre} (Analista)</p>
        <p className="text-sm leading-relaxed">{texto}</p>
      </div>
      <div className="bg-indigo-100 p-2 rounded-full flex-shrink-0">
        <User className="text-indigo-600 w-5 h-5" />
      </div>
    </div>
  );
}

function MensajeIA({ respuesta, fuentes }) {
  return (
    <div className="flex items-start justify-start gap-3 animate-slide-left">
      <div className="bg-indigo-50/50 p-2 rounded-full border border-indigo-100 flex-shrink-0">
        <Bot className="text-indigo-600 w-5 h-5" />
      </div>
      <div className="bg-white border border-slate-100 p-5 rounded-2xl rounded-tl-none shadow-sm max-w-2xl">
        <p className="font-bold text-indigo-700 mb-3 text-xs">🤖 DocuMind Gemini Engine</p>
        <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
          {respuesta}
        </div>

        {/* Caja de citación obligatoria */}
        {fuentes && fuentes.length > 0 && (
          <div className="mt-4 p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl">
            <div className="flex items-center gap-1.5 mb-2">
              <FileText className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
              <span className="text-xs font-semibold text-indigo-700">Fuentes Citadas</span>
            </div>
            <div className="space-y-1">
              {fuentes.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-indigo-600">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0" />
                  <span className="underline italic truncate">
                    {f.nombre_archivo} (Página {f.pagina})
                  </span>
                  {f.score && (
                    <span className="text-indigo-300 font-mono text-[10px]">
                      {(f.score * 100).toFixed(0)}% relevancia
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const MENSAJE_BIENVENIDA = {
  tipo: 'ia',
  respuesta: `¡Hola! Soy **DocuMind**, tu asistente conversacional de documentos empresariales. 🤖\n\nPuedo responder preguntas basadas en los documentos indexados en tus repositorios. Prueba preguntarme:\n\n• ¿Qué penalizaciones tiene el contrato de servicios?\n• ¿Cuál es el valor total de la factura de octubre?\n• ¿Qué tecnologías domina el candidato X?\n\n*Nota: Solo respondo con información de tus documentos cargados, nunca alucino datos.*`,
  fuentes: [],
};

export default function ChatRAG({ selectedRepo }) {
  const { user } = useAuth();
  const [mensajes, setMensajes] = useState([MENSAJE_BIENVENIDA]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, loading]);

  const handleSend = async () => {
    const query = inputText.trim();
    if (!query || loading) return;

    setInputText('');
    setError('');

    // Agregar mensaje del usuario
    setMensajes((prev) => [...prev, { tipo: 'usuario', texto: query }]);
    setLoading(true);

    try {
      const res = await chatAPI.query(query, selectedRepo?.id);
      const { respuesta, fuentes_citadas } = res.data;

      setMensajes((prev) => [...prev, { tipo: 'ia', respuesta, fuentes: fuentes_citadas }]);
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'Error en el motor RAG. Intenta nuevamente.';
      setError(msg);
      setMensajes((prev) => [...prev, {
        tipo: 'ia',
        respuesta: `⚠️ Error: ${msg}`,
        fuentes: [],
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const limpiarChat = () => {
    setMensajes([MENSAJE_BIENVENIDA]);
    setError('');
  };

  const preguntasRapidas = [
    '¿Cuáles son las penalizaciones del contrato?',
    '¿Qué facturas están pendientes de pago?',
    '¿Qué habilidades técnicas tiene el candidato?',
  ];

  return (
    <div id="pantalla-chat" className="flex flex-col h-screen bg-slate-50">
      {/* Header del chat */}
      <div className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span>💬</span> Chat Conversacional RAG Inteligente
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Realice consultas en lenguaje natural · Base de conocimiento: {selectedRepo ? `📁 ${selectedRepo.nombre}` : '🌐 Todos los repositorios'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedRepo && (
            <span className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1 rounded-full font-medium">
              📁 {selectedRepo.nombre}
            </span>
          )}
          <button
            id="btn-limpiar-chat"
            onClick={limpiarChat}
            className="flex items-center gap-1.5 text-slate-400 hover:text-rose-500 text-xs font-medium transition-colors px-3 py-2 rounded-lg hover:bg-rose-50"
            title="Limpiar conversación"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Limpiar
          </button>
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        {mensajes.map((msg, i) =>
          msg.tipo === 'usuario' ? (
            <MensajeUsuario key={i} texto={msg.texto} nombre={user?.nombre || 'Usuario'} />
          ) : (
            <MensajeIA key={i} respuesta={msg.respuesta} fuentes={msg.fuentes} />
          )
        )}
        {loading && <TypingIndicator />}
        <div ref={chatEndRef} />
      </div>

      {/* Sugerencias rápidas (solo cuando hay pocas mensajes) */}
      {mensajes.length <= 1 && !loading && (
        <div className="px-8 pb-4 flex-shrink-0">
          <div className="flex gap-2 flex-wrap">
            {preguntasRapidas.map((p, i) => (
              <button
                key={i}
                id={`sugerencia-${i}`}
                onClick={() => { setInputText(p); }}
                className="text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-3 py-2 rounded-full transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input de envío */}
      <div className="bg-white border-t border-slate-100 px-8 py-4 flex-shrink-0">
        {error && (
          <div className="mb-3 flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-100 px-3 py-2 rounded-lg">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </div>
        )}
        <div className="flex gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <div className="flex items-center pl-2 text-slate-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <textarea
            id="input-chat-query"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Escriba su consulta en lenguaje natural sobre sus repositorios (ej: ¿Cuáles facturas vencen este mes?)${!selectedRepo ? ' — Filtrando en todos los repositorios' : ` — Filtrando en "${selectedRepo.nombre}"`}`}
            disabled={loading}
            rows={1}
            className="flex-1 bg-transparent px-2 text-sm text-slate-700 outline-none resize-none placeholder-slate-400 py-2 max-h-32"
            style={{ fieldSizing: 'content' }}
          />
          <button
            id="btn-enviar-chat"
            onClick={handleSend}
            disabled={loading || !inputText.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-5 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-emerald-200"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="text-sm">Enviar</span>
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-300 mt-2">
          Enter para enviar · Shift+Enter para nueva línea · Los resultados se basan estrictamente en tus documentos indexados
        </p>
      </div>
    </div>
  );
}
