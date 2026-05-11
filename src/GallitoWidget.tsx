import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, ChevronRight, Bot } from 'lucide-react';
import { supabase } from './lib/supabase';
import { useLocation, useNavigate } from 'react-router-dom';

interface GallitoMessage {
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
  timestamp: Date;
}

export default function GallitoWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<GallitoMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
      setHasNewMessage(false);
    }
  }, [isOpen]);

  // Welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: '¡Hola! Soy Gallito 🐓, tu asistente del CRM. Puedo ayudarte con consultas de productos, clientes, estado del bot y más. ¿En qué te ayudo?',
        suggestions: ['¿Cuántos productos hay?', '¿El bot está activo?', '¿Últimos clientes?'],
        timestamp: new Date()
      }]);
    }
  }, [isOpen]);

  // Parse actions from response
  const handleActions = (responseText: string) => {
    const navMatch = responseText.match(/\[ACTION:navigate:(\w+)\]/);
    if (navMatch) {
      const moduleMap: Record<string, string> = {
        whatsapp: '/mensajeria',
        mensajeria: '/mensajeria',
        configuracion: '/configuracion',
        facturas: '/subir',
        clientes: '/clientes',
        seguimientos: '/seguimientos',
        dashboard: '/',
      };
      const path = moduleMap[navMatch[1]] || '/';
      setTimeout(() => navigate(path), 800);
    }
  };

  const sendMessage = async (text?: string) => {
    const msgText = text || input.trim();
    if (!msgText || loading) return;

    const userMsg: GallitoMessage = { role: 'user', content: msgText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Get current module context
      const moduleMap: Record<string, string> = {
        '/': 'Dashboard',
        '/mensajeria': 'WhatsApp / Mensajería',
        '/configuracion': 'Configuración',
        '/subir': 'Subir Factura',
        '/clientes': 'Clientes',
        '/seguimientos': 'Seguimientos',
      };

      const conversationHistory = messages.slice(-8).map(m => ({
        role: m.role,
        content: m.content
      }));

      const { data, error } = await supabase.functions.invoke('gallito', {
        body: {
          message: msgText,
          conversationHistory,
          moduleContext: moduleMap[location.pathname] || 'Desconocido'
        }
      });

      if (error) throw error;

      const response = data?.response || 'No pude procesar tu consulta.';
      const suggestions = data?.suggestions || [];

      // Clean action tags from visible response
      const cleanResponse = response
        .replace(/\[ACTION:navigate:\w+\]/g, '')
        .replace(/\[ACTION:confirm:[^\]]+\]/g, '')
        .trim();

      const assistantMsg: GallitoMessage = {
        role: 'assistant',
        content: cleanResponse,
        suggestions: suggestions.length > 0 ? suggestions : undefined,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);
      handleActions(response);

    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${err.message || 'No se pudo conectar con Gallito'}`,
        timestamp: new Date()
      }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[9999] group"
        style={{
          width: 56, height: 56,
          borderRadius: '50%',
          background: isOpen ? '#334155' : 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(37,99,235,0.4)',
          transition: 'all 0.3s ease',
        }}
      >
        {isOpen ? (
          <X size={22} color="white" />
        ) : (
          <>
            <Bot size={24} color="white" />
            {hasNewMessage && (
              <span style={{
                position: 'absolute', top: -2, right: -2,
                width: 14, height: 14, borderRadius: '50%',
                background: '#ef4444', border: '2px solid white'
              }} />
            )}
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-20 right-6 z-[9998] animate-in slide-in-from-bottom-4 fade-in"
          style={{
            width: 380, maxHeight: 540,
            borderRadius: 20,
            background: '#fff',
            boxShadow: '0 8px 40px rgba(0,0,0,0.15), 0 2px 10px rgba(0,0,0,0.08)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>
              🐓
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 800, fontSize: 14 }}>Gallito</div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11 }}>Asistente IA del CRM</div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <Sparkles size={16} color="rgba(255,255,255,0.6)" />
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '16px 16px 8px',
            maxHeight: 360, minHeight: 200,
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: 12,
              }}>
                <div style={{
                  maxWidth: '82%',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? '#2563eb' : '#f1f5f9',
                  color: msg.role === 'user' ? 'white' : '#334155',
                  fontSize: 13,
                  lineHeight: 1.5,
                  fontWeight: 500,
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.content}
                  
                  {/* Suggestions */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {msg.suggestions.map((s, j) => (
                        <button
                          key={j}
                          onClick={() => sendMessage(s)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 10,
                            border: msg.role === 'user' ? '1px solid rgba(255,255,255,0.3)' : '1px solid #cbd5e1',
                            background: msg.role === 'user' ? 'rgba(255,255,255,0.1)' : 'white',
                            color: msg.role === 'user' ? 'white' : '#2563eb',
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            textAlign: 'left',
                            display: 'flex', alignItems: 'center', gap: 6,
                            transition: 'all 0.2s',
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.background = msg.role === 'user' ? 'rgba(255,255,255,0.2)' : '#eff6ff')}
                          onMouseOut={(e) => (e.currentTarget.style.background = msg.role === 'user' ? 'rgba(255,255,255,0.1)' : 'white')}
                        >
                          <ChevronRight size={12} />
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
                <div style={{
                  padding: '12px 18px', borderRadius: '16px 16px 16px 4px',
                  background: '#f1f5f9', display: 'flex', gap: 4,
                }}>
                  <span className="animate-bounce" style={{ width: 6, height: 6, borderRadius: '50%', background: '#94a3b8', animationDelay: '0ms' }} />
                  <span className="animate-bounce" style={{ width: 6, height: 6, borderRadius: '50%', background: '#94a3b8', animationDelay: '150ms' }} />
                  <span className="animate-bounce" style={{ width: 6, height: 6, borderRadius: '50%', background: '#94a3b8', animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex', gap: 8,
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Preguntale a Gallito..."
              disabled={loading}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                fontSize: 13,
                fontWeight: 500,
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#2563eb'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                width: 40, height: 40,
                borderRadius: 12,
                background: input.trim() ? '#2563eb' : '#e2e8f0',
                border: 'none',
                cursor: input.trim() ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              <Send size={16} color={input.trim() ? 'white' : '#94a3b8'} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
