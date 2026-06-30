-- ═══════════════════════════════════════════════════════════════
-- MIGRACIÓN: Agregar columna is_internal para Notas Privadas
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE public.ng_whatsapp_messages 
ADD COLUMN IF NOT EXISTS is_internal BOOLEAN DEFAULT false;
