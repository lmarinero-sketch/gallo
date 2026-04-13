-- schema.sql
-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de Clientes
CREATE TABLE IF NOT EXISTS public.ng_clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    email TEXT,
    branch TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Facturas
CREATE TABLE IF NOT EXISTS public.ng_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.ng_clients(id) ON DELETE CASCADE,
    invoice_number TEXT,
    amount NUMERIC,
    purchase_date DATE,
    items JSONB,
    seller_id UUID REFERENCES auth.users(id),
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Seguimientos (Follow ups)
CREATE TABLE IF NOT EXISTS public.ng_follow_ups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES public.ng_invoices(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.ng_clients(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES auth.users(id),
    reason TEXT NOT NULL,
    scheduled_date DATE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Tabla de mensajes de WhatsApp
CREATE TABLE IF NOT EXISTS public.ng_whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_phone TEXT NOT NULL,
    body TEXT NOT NULL,
    direction TEXT CHECK (direction IN ('incoming', 'outgoing')),
    message_type TEXT DEFAULT 'text',
    attachment_urls JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles / Roles (Ligado a auth.users)
CREATE TABLE IF NOT EXISTS public.ng_user_roles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('superadmin', 'admin', 'vendedor')),
    full_name TEXT
);

-- Tabla de Plantillas Rápidas
CREATE TABLE IF NOT EXISTS public.ng_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shortcut TEXT NOT NULL,
    body TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configurar RLS (Row Level Security) básico
ALTER TABLE public.ng_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ng_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ng_follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ng_templates ENABLE ROW LEVEL SECURITY;

-- Políticas para Clientes
DROP POLICY IF EXISTS "Ver clientes" ON public.ng_clients;
DROP POLICY IF EXISTS "Insertar clientes" ON public.ng_clients;
DROP POLICY IF EXISTS "Actualizar clientes" ON public.ng_clients;
CREATE POLICY "Ver clientes" ON public.ng_clients FOR SELECT USING (true);
CREATE POLICY "Insertar clientes" ON public.ng_clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Actualizar clientes" ON public.ng_clients FOR UPDATE USING (true);

-- Limpiar Políticas Existentes para evitar ERROR: 42710
DROP POLICY IF EXISTS "Ver facturas" ON public.ng_invoices;
DROP POLICY IF EXISTS "Insertar facturas" ON public.ng_invoices;
DROP POLICY IF EXISTS "Ver seguimientos" ON public.ng_follow_ups;
DROP POLICY IF EXISTS "Insertar seguimientos" ON public.ng_follow_ups;

-- Políticas para Invoices
CREATE POLICY "Ver facturas" ON public.ng_invoices FOR SELECT USING (true);
CREATE POLICY "Insertar facturas" ON public.ng_invoices FOR INSERT WITH CHECK (auth.uid() IS NOT NULL OR true);

-- Políticas para Seguimientos
CREATE POLICY "Ver seguimientos" ON public.ng_follow_ups FOR SELECT USING (true);
CREATE POLICY "Insertar seguimientos" ON public.ng_follow_ups FOR INSERT WITH CHECK (auth.uid() IS NOT NULL OR true);

-- Tabla de log de errores (Reportar Problema)
CREATE TABLE IF NOT EXISTS public.ng_error_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    message TEXT,
    type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE public.ng_error_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Insertar error logs" ON public.ng_error_logs;
DROP POLICY IF EXISTS "Ver error logs" ON public.ng_error_logs;
CREATE POLICY "Insertar error logs" ON public.ng_error_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Ver error logs" ON public.ng_error_logs FOR SELECT USING (true);

-- Agregar columna de observaciones a seguimientos
ALTER TABLE public.ng_follow_ups ADD COLUMN IF NOT EXISTS observations TEXT;

-- Política de actualización para seguimientos
DROP POLICY IF EXISTS "Actualizar seguimientos" ON public.ng_follow_ups;
CREATE POLICY "Actualizar seguimientos" ON public.ng_follow_ups FOR UPDATE USING (true);

