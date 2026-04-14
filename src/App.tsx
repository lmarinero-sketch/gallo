import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

import { 
  Home, 
  MessageSquare, 
  FileText, 
  Clock, 
  Settings,
  ChevronDown,
  Search,
  Moon,
  Upload,
  Edit2,
  Check,
  Package,
  ExternalLink,
  Menu,
  User,
  Sparkles,
  AlertTriangle,
  AlertCircle,
  Info,
  PanelLeftClose,
  PanelLeftOpen,
  CheckCircle,
  UploadCloud,
  PenLine,
  Table2,
  Lock,
  Users,
  RefreshCw,
  Phone,
  ShoppingCart,
  Eye
} from 'lucide-react';

export type ModalType = 'error' | 'success' | 'info';

export const AppContext = React.createContext({ 
  isSidebarOpen: true, 
  toggleSidebar: () => {},
  showSystemModal: (title: string, message: string, type?: ModalType) => {}
});

function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = React.useContext(AppContext);
  const location = useLocation();

  const NavItem = ({ to, icon: Icon, text, badge }: { to: string, icon: any, text: string, badge?: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        title={!isSidebarOpen ? text : undefined}
        className={`flex items-center ${isSidebarOpen ? 'justify-between px-4' : 'justify-center px-0'} py-3 text-[14px] font-medium rounded-xl transition-all ${
          isActive 
            ? 'bg-white/15 text-white backdrop-blur-sm' 
            : 'text-blue-100/70 hover:bg-white/10 hover:text-white'
        }`}
      >
        <div className="flex items-center">
          <Icon className={`w-[18px] h-[18px] ${isSidebarOpen ? 'mr-3' : ''} ${isActive ? 'text-white' : 'text-blue-200/60'}`} />
          {isSidebarOpen && text}
        </div>
        {badge && isSidebarOpen && (
          <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className={`h-screen flex flex-col fixed left-0 top-0 overflow-visible transition-[width] duration-300 z-50 ${isSidebarOpen ? 'w-[280px]' : 'w-[80px]'}`}
      style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(1,66,142,0.92) 0%, rgba(1,40,100,0.97) 100%), url(/2021-06-07.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className={`p-4 border-b border-white/10 flex items-center h-[88px] relative ${isSidebarOpen ? 'justify-between px-6' : 'justify-center px-2'}`}>
        <div className="flex items-center overflow-hidden">
            <img src="/images.png" alt="Neumáticos Gallo" className="w-[42px] h-[42px] rounded-xl object-cover shadow-lg shrink-0 border-2 border-white/20" />
            {isSidebarOpen && (
              <div className="ml-3 shrink-0">
                <h2 className="text-[17px] font-extrabold text-white leading-tight">Neumáticos</h2>
                <p className="text-[14px] text-blue-200 leading-tight font-medium tracking-wide">Gallo</p>
              </div>
            )}
        </div>
        
        {/* Toggle Button */}
        <button 
           onClick={toggleSidebar} 
           className="absolute -right-[14px] top-[30px] bg-white border border-slate-200 text-slate-400 hover:text-blue-600 shadow-sm rounded-md p-1 z-50 transition-colors"
        >
           {isSidebarOpen ? <PanelLeftClose className="w-[18px] h-[18px]" /> : <PanelLeftOpen className="w-[18px] h-[18px]" />}
        </button>
      </div>
      
      <nav className={`flex-1 py-6 space-y-1 ${isSidebarOpen ? 'px-3' : 'px-2'}`}>
        <NavItem to="/" icon={Home} text="Inicio" />
        <NavItem to="/mensajeria" icon={MessageSquare} text="Mensajería" />
        <NavItem to="/subir" icon={Upload} text="Subir Factura" />
        <NavItem to="/clientes" icon={Users} text="Clientes" />
        <NavItem to="/seguimientos" icon={Clock} text="Seguimientos" />
        <div className="my-4" />
        <NavItem to="/configuracion" icon={Settings} text="Configuración" />
      </nav>
      
      {isSidebarOpen && (
        <div className="p-4 border-t border-white/10 text-center">
          <a href="https://www.growlabs.lat" target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-200/60 font-medium uppercase tracking-wider hover:text-white transition-colors block">
            SISTEMA CREADO POR GROW LABS
          </a>
        </div>
      )}
    </div>
  );
}

function TopBar({ title, subtitle }: { title: string, subtitle: string }) {
  const { toggleSidebar } = React.useContext(AppContext);
  // Format current date exactly like the UI
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = new Intl.DateTimeFormat('es-AR', dateOptions).format(new Date());

  return (
    <header className="h-[88px] bg-white/80 backdrop-blur-md flex items-center justify-between px-10 sticky top-0 z-10 transition-colors">
      <div className="flex items-center">
        <div>
          <h1 className="text-[22px] text-slate-800"><span className="font-bold">Administración</span> {title}</h1>
          <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="bg-slate-100 px-4 py-2 rounded-full text-[13px] font-medium text-slate-600 capitalize">
          {formattedDate}
        </div>
        <div className="bg-slate-100 pl-4 pr-1 py-1 rounded-full flex items-center justify-between border border-slate-200">
          <span className="text-[13px] font-medium text-slate-700 mr-3">Vendedor Juan</span>
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
            VJ
          </div>
        </div>
        <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
          <Search className="w-4 h-4" />
        </button>
        <button onClick={() => (window as any).toggleTheme()} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
          <Moon className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({ followUps: 0, messages: 0 });
  const { isSidebarOpen } = React.useContext(AppContext);

  useEffect(() => {
    supabase.from('ng_follow_ups').select('*', { count: 'exact', head: true }).then(({count}) => {
      setStats(s => ({...s, followUps: count || 0}));
    });
    supabase.from('ng_whatsapp_messages').select('*', { count: 'exact', head: true }).then(({count}) => {
      setStats(s => ({...s, messages: count || 0}));
    });
  }, []);

  return (
    <div className={`flex-1 min-h-screen bg-[#F8FAFC] flex flex-col transition-[margin] duration-300 ${isSidebarOpen ? 'ml-[280px]' : 'ml-[80px]'}`}>
       <TopBar title="Neumáticos Gallo" subtitle="Sistema de gestión integral" />
       
       <main className="px-10 py-6 w-full">
         
         {/* HERO BANNER - Exact replication */}
         <div className="w-full bg-[#1E3A8A] rounded-[28px] overflow-hidden mb-10 relative shadow-md shadow-blue-500/20">
           {/* Background Image Setup */}
           <div className="absolute inset-0 z-0">
             <img src="/maxresdefault.jpg" alt="Fondo Neumáticos" className="w-full h-full object-cover opacity-40 mix-blend-overlay brightness-75" />
             <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-600/40"></div>
           </div>
           
           <div className="relative z-10 px-12 py-10">
             <div className="flex items-center space-x-3 mb-4">
               <Home className="w-6 h-6 text-white" />
               <h2 className="text-3xl font-bold text-white tracking-tight">Buenas noches 👋</h2>
             </div>
             
             <p className="text-blue-50 text-[15px] font-medium leading-relaxed max-w-3xl mb-8 opacity-90">
               Bienvenido al <strong>Sistema de Administración</strong> de Neumáticos Gallo. Desde acá podés subir facturas, controlar seguimientos con inteligencia artificial y comunicarte automáticamente con los clientes por WhatsApp.
             </p>

             <div className="flex flex-wrap gap-3">
               <div className="bg-white/20 hover:bg-white/30 cursor-pointer backdrop-blur-md px-4 py-2 rounded-xl text-white text-[13px] font-medium border border-white/10 transition-colors flex items-center">
                 <FileText className="w-4 h-4 mr-2" /> Facturas <span className="ml-2 bg-white/20 px-2 py-0.5 rounded textxs">Módulo IA</span>
               </div>
               <div className="bg-white/20 hover:bg-white/30 cursor-pointer backdrop-blur-md px-4 py-2 rounded-xl text-white text-[13px] font-medium border border-white/10 transition-colors flex items-center">
                 <Clock className="w-4 h-4 mr-2" /> Seguimientos <span className="ml-2 bg-white/20 px-2 py-0.5 rounded textxs">{stats.followUps} Activos</span>
               </div>
               <div className="bg-white/20 hover:bg-white/30 cursor-pointer backdrop-blur-md px-4 py-2 rounded-xl text-white text-[13px] font-medium border border-white/10 transition-colors flex items-center">
                 <MessageSquare className="w-4 h-4 mr-2" /> WhatsApp <span className="ml-2 bg-white/20 px-2 py-0.5 rounded textxs">Integrado</span>
               </div>
             </div>
           </div>
         </div>
         
         {/* SECTION TITLE */}
         <div className="flex items-center mb-6">
           <FileText className="w-5 h-5 text-slate-500 mr-3" />
           <div>
             <h3 className="text-[17px] font-bold text-slate-800">Acciones Directas</h3>
             <p className="text-sm text-slate-400">Tocá cada sección para acceder al sistema rápido.</p>
           </div>
         </div>

         {/* ACTION LIST CARDS */}
         <div className="space-y-4">
           
           <Link to="/subir" className="bg-white hover:bg-slate-50 transition-colors cursor-pointer border border-slate-200/60 rounded-2xl p-5 flex items-center justify-between shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] no-underline">
             <div className="flex items-center">
               <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mr-5 shrink-0">
                 <FileText className="w-5 h-5 text-blue-500" />
               </div>
               <div>
                 <h4 className="text-[16px] font-bold text-slate-800">Cargar Nueva Factura</h4>
                 <p className="text-[13px] text-slate-500 mt-0.5">Subí el PDF de la factura, extraé datos por IA y creá un seguimiento.</p>
               </div>
             </div>
             <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center">
               Subir PDF <ChevronDown className="w-4 h-4 ml-1" />
             </div>
            </Link>

           <Link to="/mensajeria" className="bg-white hover:bg-slate-50 transition-colors cursor-pointer border border-slate-200/60 rounded-2xl p-5 flex items-center justify-between shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] no-underline">
             <div className="flex items-center">
               <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mr-5 shrink-0">
                 <MessageSquare className="w-5 h-5 text-green-500" />
               </div>
               <div>
                 <h4 className="text-[16px] font-bold text-slate-800">Historial de Mensajes</h4>
                 <p className="text-[13px] text-slate-500 mt-0.5">Controlá las consultas de los clientes que llegaron vía builderBot.</p>
               </div>
             </div>
             <div className="bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center">
               {stats.messages} mensajes <ChevronDown className="w-4 h-4 ml-1" />
             </div>
            </Link>

           <Link to="/configuracion" className="bg-white hover:bg-slate-50 transition-colors cursor-pointer border border-slate-200/60 rounded-2xl p-5 flex items-center justify-between shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] no-underline">
             <div className="flex items-center">
               <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mr-5 shrink-0">
                 <Settings className="w-5 h-5 text-purple-500" />
               </div>
               <div>
                 <h4 className="text-[16px] font-bold text-slate-800">Configuración</h4>
                 <p className="text-[13px] text-slate-500 mt-0.5">Configurá las credenciales de Supabase y prompts de la IA.</p>
               </div>
             </div>
             <div className="bg-purple-50 text-purple-600 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center">
               1 tema <ChevronDown className="w-4 h-4 ml-1" />
             </div>
            </Link>

         </div>

       </main>
    </div>
  )
}

// Normaliza teléfono argentino al formato 549XXXXXXXXXX (sin 15, sin +)
function normalizePhone(raw: string): string {
  let p = raw.replace(/[^\d]/g, ''); // solo dígitos, esto ya remueve el +
  // Si empieza con 0, quitamos el 0
  if (p.startsWith('0')) p = p.substring(1);
  // Si empieza con 15, quitamos el 15
  if (p.startsWith('15')) p = p.substring(2);
  // Si empieza con 54 pero no 549, insertamos 9
  if (p.startsWith('54') && !p.startsWith('549')) p = '549' + p.substring(2);
  // Si NO empieza con 549, lo agregamos
  if (!p.startsWith('549')) p = '549' + p;
  return p;
}

// Formatea un importe numérico a formato argentino
function formatMoney(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '$0,00';
  return '$' + num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function UploadInvoice() {
  const { isSidebarOpen, showSystemModal } = React.useContext(AppContext);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [reason, setReason] = useState('Rotación de neumáticos');
  const [days, setDays] = useState(180);
  const [observations, setObservations] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(' ') + '\n';
      }

      const { data, error } = await supabase.functions.invoke('parse-invoice', { 
        body: { text } 
      });
      
      if (error) throw error;
      // Normalize phone client side too
      if (data.phone) data.phone = normalizePhone(data.phone);
      setParsedData(data);
    } catch (err: any) {
      console.error(err);
      showSystemModal('Error', 'Error procesando factura (¿La Edge Function está corriendo?) | Error: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const [saving, setSaving] = useState(false);

  const saveFollowUp = async () => {
    if (!parsedData) return;
    setSaving(true);
    try {
      const normalizedPhone = normalizePhone(parsedData.phone || '0000000');
      const { data: client, error: cErr } = await supabase.from('ng_clients').upsert({
        name: parsedData.clientName,
        phone: normalizedPhone
      }, { onConflict: 'phone' }).select().single();

      if (cErr) throw cErr; 

      // Save invoice with structured items
      const itemsToSave = Array.isArray(parsedData.items) ? parsedData.items : [];
      const { error: invErr } = await supabase.from('ng_invoices').insert({
        client_id: client?.id,
        invoice_number: parsedData.invoiceNumber || null,
        amount: parsedData.amount || 0,
        items: itemsToSave,
        purchase_date: parsedData.date || new Date().toISOString().split('T')[0]
      });
      if (invErr) throw invErr;
      
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + days);

      const { error: fErr } = await supabase.from('ng_follow_ups').insert({
        client_id: client?.id, 
        reason: reason,
        scheduled_date: scheduledDate.toISOString().split('T')[0],
        observations: observations || null
      });

      if (fErr) throw fErr;
      showSystemModal('¡Exito!', '¡Factura y Seguimiento Guardados Exitosamente!', 'success');
      setParsedData(null);
      setFile(null);
      setObservations('');
    } catch(e: any) {
      console.error(e);
      showSystemModal('Error Base de Datos', 'Error al guardar el seguimiento. Asegúrate de ejecutar el sql schema. Detalles: ' + e?.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const [uploadTab, setUploadTab] = useState<'pdf' | 'manual' | 'excel'>('pdf');
  const [manualData, setManualData] = useState({ clientName: '', phone: '', amount: '', items: '' });
  const [manualObservations, setManualObservations] = useState('');

  const handleManualSave = async () => {
    setSaving(true);
    try {
      const normalizedPhone = normalizePhone(manualData.phone);
      const { data: client } = await supabase.from('ng_clients').upsert({ phone: normalizedPhone, name: manualData.clientName }, { onConflict: 'phone' }).select().single();
      await supabase.from('ng_invoices').insert({ client_id: client?.id, amount: parseFloat(manualData.amount) || 0, items: manualData.items.split(',').map(i => i.trim()) });
      const scheduledDate = new Date(); scheduledDate.setDate(scheduledDate.getDate() + days);
      await supabase.from('ng_follow_ups').insert({ client_id: client?.id, reason, scheduled_date: scheduledDate.toISOString().split('T')[0], observations: manualObservations || null });
      showSystemModal('¡Éxito!', '¡Venta manual guardada exitosamente!', 'success');
      setManualData({ clientName: '', phone: '', amount: '', items: '' });
      setManualObservations('');
    } catch(e: any) {
      showSystemModal('Error', 'Error al guardar venta manual: ' + e?.message, 'error');
    }
    setSaving(false);
  };

  // Helper: check if items are in new structured format (array of objects)
  const hasStructuredItems = parsedData?.items && Array.isArray(parsedData.items) && parsedData.items.length > 0 && typeof parsedData.items[0] === 'object';

  return (
    <div className={`flex-1 transition-[margin] duration-300 ${isSidebarOpen ? 'ml-[280px]' : 'ml-[80px]'} min-h-screen bg-[#F8FAFC] flex flex-col`}>
      <TopBar title="Neumáticos Gallo" subtitle="Subir Documentos" />
      <main className="px-10 py-6 w-full">
        
        {/* Tab Switcher */}
        <div className="flex items-center mb-8 bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-1.5">
          <button onClick={() => setUploadTab('pdf')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-bold transition-all ${uploadTab === 'pdf' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
            <Sparkles className="w-4 h-4" /> Extraer con IA (PDF)
          </button>
          <button onClick={() => setUploadTab('manual')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-bold transition-all ${uploadTab === 'manual' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
            <PenLine className="w-4 h-4" /> Ingreso Manual
          </button>
          <button onClick={() => setUploadTab('excel')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-bold transition-all relative ${uploadTab === 'excel' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
            <Table2 className="w-4 h-4" /> Carga Masiva (Excel)
            <span className="absolute -top-2 -right-1 bg-amber-400 text-amber-950 text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">PRÓXIMAMENTE</span>
          </button>
        </div>

        {/* TAB: PDF IA */}
        {uploadTab === 'pdf' && (
          <>
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-8 mb-8">
              <div className="flex items-center mb-6">
                <UploadCloud className="w-5 h-5 text-blue-500 mr-3" />
                <h2 className="text-[17px] font-bold text-slate-800">Cargar PDF</h2>
              </div>
              <label className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer block">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                <p className="text-[15px] font-bold text-slate-700 mb-1">
                  {file ? `Archivo: ${file.name}` : 'Subir Factura'}
                </p>
                <p className="text-[13px] text-slate-400">Seleccioná un archivo PDF (Max 5MB)</p>
                <input type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
              </label>
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={handleUpload}
                  disabled={!file || loading}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-[14px] font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Procesando Documento...' : 'Extraer con Inteligencia Artificial'}
                </button>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                RESULTADO DEL ANÁLISIS — ESTILO FACTURA
               ═══════════════════════════════════════════════════════════ */}
            {parsedData && (
              <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6">
                
                {/* SUCCESS BANNER */}
                <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-4 flex items-center">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                  <p className="text-[13px] font-bold text-green-800">Análisis exitoso — Datos extraídos con IA</p>
                  <span className="ml-auto text-[11px] text-green-600 font-medium bg-green-100 px-3 py-1 rounded-full">Factura {parsedData.invoiceType || 'A'}</span>
                </div>

                {/* ──── FACTURA VISUAL CARD ──── */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)] overflow-hidden">
                  
                  {/* HEADER FACTURA */}
                  <div className="bg-gradient-to-r from-[#01428E] to-[#1E3A8A] p-6 flex items-start justify-between">
                    <div className="flex items-center">
                      <img src="/images.png" alt="Gallo" className="w-12 h-12 rounded-xl object-cover border-2 border-white/20 mr-4" />
                      <div>
                        <h3 className="text-white text-[18px] font-extrabold tracking-tight">Gallo neumáticos</h3>
                        <p className="text-blue-200 text-[12px] font-medium">Neumáticos Gallo S.R.L.</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-3 mb-1">
                        <span className="bg-white text-[#01428E] text-[14px] font-black px-3 py-1 rounded-lg">{parsedData.invoiceType || 'A'}</span>
                        <span className="text-white text-[16px] font-bold">Factura</span>
                      </div>
                      {parsedData.invoiceNumber && (
                        <p className="text-blue-200 text-[13px] font-bold tracking-wider">Nº {parsedData.invoiceNumber}</p>
                      )}
                      {parsedData.date && (
                        <p className="text-blue-300 text-[12px] mt-1">Fecha: {new Date(parsedData.date + 'T12:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                      )}
                    </div>
                  </div>

                  {/* DATOS CLIENTE */}
                  <div className="grid grid-cols-2 gap-6 p-6 border-b border-slate-100">
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Señor/es</p>
                        <p className="text-[16px] font-extrabold text-slate-800">{parsedData.clientName || '—'}</p>
                      </div>
                      {parsedData.cuit && (
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">C.U.I.T.</p>
                          <p className="text-[14px] font-mono font-bold text-slate-700">{parsedData.cuit}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Teléfono</p>
                        <div className="flex items-center gap-2">
                          <p className="text-[14px] font-mono font-bold text-slate-700">{parsedData.phone || 'No especificado'}</p>
                          {parsedData.phone && <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">549 OK</span>}
                        </div>
                      </div>
                      {parsedData.paymentCondition && (
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Cond. Venta</p>
                          <p className="text-[14px] font-bold text-slate-700">{parsedData.paymentCondition}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ──── TABLA DE PRODUCTOS ──── */}
                  <div className="p-6">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center">
                      <Package className="w-3.5 h-3.5 mr-2" />
                      Detalle de Productos / Servicios
                    </p>
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-slate-50">
                            <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-[80px]">CÓD.</th>
                            <th className="text-center px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-[60px]">CANT.</th>
                            <th className="text-left px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">DESCRIPCIÓN</th>
                            <th className="text-right px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-[120px]">P. UNIT.</th>
                            <th className="text-right px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-[120px]">IMPORTE</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {hasStructuredItems ? (
                            parsedData.items.map((item: any, idx: number) => (
                              <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                                <td className="px-4 py-3 text-[12px] font-mono text-slate-500">{item.cod || '—'}</td>
                                <td className="px-4 py-3 text-[13px] font-bold text-slate-800 text-center">{item.qty || 1}</td>
                                <td className="px-4 py-3 text-[13px] font-medium text-slate-800">{item.description}</td>
                                <td className="px-4 py-3 text-[13px] font-mono text-slate-600 text-right">{item.unitPrice ? formatMoney(item.unitPrice) : '—'}</td>
                                <td className="px-4 py-3 text-[13px] font-mono font-bold text-slate-800 text-right">{item.total ? formatMoney(item.total) : '—'}</td>
                              </tr>
                            ))
                          ) : Array.isArray(parsedData.items) ? (
                            parsedData.items.map((item: any, idx: number) => (
                              <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                                <td className="px-4 py-3 text-[12px] font-mono text-slate-500">—</td>
                                <td className="px-4 py-3 text-[13px] font-bold text-slate-800 text-center">1</td>
                                <td className="px-4 py-3 text-[13px] font-medium text-slate-800">{typeof item === 'string' ? item : item.description || JSON.stringify(item)}</td>
                                <td className="px-4 py-3 text-[13px] font-mono text-slate-600 text-right">—</td>
                                <td className="px-4 py-3 text-[13px] font-mono font-bold text-slate-800 text-right">—</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="px-4 py-4 text-[13px] text-slate-500 text-center">Sin productos extraídos</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* ──── TOTALES ESTILO FACTURA ──── */}
                  <div className="px-6 pb-6">
                    <div className="flex justify-end">
                      <div className="w-[380px] space-y-2">
                        {parsedData.subtotal && (
                          <div className="flex justify-between text-[13px]">
                            <span className="text-slate-500">Subtotal</span>
                            <span className="font-mono font-medium text-slate-700">{formatMoney(parsedData.subtotal)}</span>
                          </div>
                        )}
                        {parsedData.discount && (
                          <div className="flex justify-between text-[13px]">
                            <span className="text-slate-500">Descuento ({parsedData.discount}%)</span>
                            <span className="font-mono font-medium text-red-500">-{parsedData.discountAmount ? formatMoney(parsedData.discountAmount) : '—'}</span>
                          </div>
                        )}
                        {parsedData.iva && (
                          <div className="flex justify-between text-[13px]">
                            <span className="text-slate-500">IVA 21%</span>
                            <span className="font-mono font-medium text-slate-700">{formatMoney(parsedData.iva)}</span>
                          </div>
                        )}
                        <div className="border-t-2 border-slate-800 pt-3 mt-2 flex justify-between">
                          <span className="text-[15px] font-extrabold text-slate-800">TOTAL</span>
                          <span className="text-[18px] font-extrabold text-slate-900 font-mono">{formatMoney(parsedData.amount || 0)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ──── CONFIGURACIÓN DE SEGUIMIENTO ──── */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center">
                    <Clock className="w-4 h-4 text-amber-500 mr-3" />
                    <p className="text-[13px] font-bold text-slate-700">Configurar Seguimiento</p>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[13px] font-bold text-slate-700 mb-2">Motivo de contacto</label>
                        <select value={reason} onChange={e => setReason(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 focus:outline-none focus:border-blue-500 bg-white shadow-sm">
                          <option>Rotación de neumáticos</option>
                          <option>Alineación y Balanceo</option>
                          <option>Satisfacción de compra</option>
                          <option>Cambio de Aceite</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[13px] font-bold text-slate-700 mb-2">Agendar a X días</label>
                        <div className="flex rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white">
                          <button onClick={() => setDays(30)} className={`flex-1 py-3 text-[14px] font-medium transition-colors ${days === 30 ? 'bg-blue-600 text-white' : 'hover:bg-slate-50 text-slate-600'}`}>30</button>
                          <div className="w-[1px] bg-slate-100"></div>
                          <button onClick={() => setDays(90)} className={`flex-1 py-3 text-[14px] font-medium transition-colors ${days === 90 ? 'bg-blue-600 text-white' : 'hover:bg-slate-50 text-slate-600'}`}>90</button>
                          <div className="w-[1px] bg-slate-100"></div>
                          <button onClick={() => setDays(180)} className={`flex-1 py-3 text-[14px] font-medium transition-colors ${days === 180 ? 'bg-blue-600 text-white' : 'hover:bg-slate-50 text-slate-600'}`}>180</button>
                        </div>
                      </div>
                    </div>

                    {/* OBSERVACIONES */}
                    <div>
                      <label className="block text-[13px] font-bold text-slate-700 mb-2 flex items-center">
                        <Edit2 className="w-3.5 h-3.5 mr-2 text-slate-400" />
                        Observaciones
                        <span className="ml-2 text-[10px] font-medium text-slate-400">(opcional — se verán en el seguimiento)</span>
                      </label>
                      <textarea 
                        value={observations} 
                        onChange={e => setObservations(e.target.value)} 
                        placeholder="Ej: Cliente pidió que lo contactemos por la mañana. Interesado en alineación 3D..." 
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-700 h-24 resize-none focus:outline-none focus:border-blue-500 bg-white shadow-sm" 
                      />
                    </div>
                    
                    <button 
                      onClick={saveFollowUp} 
                      disabled={saving} 
                      className="w-full bg-[#EAB308] hover:bg-yellow-400 text-yellow-950 font-bold px-6 py-4 rounded-xl shadow-sm transition-all text-[15px] disabled:opacity-50"
                    >
                      {saving ? 'Guardando en Base de Datos...' : 'Guardar Factura + Seguimiento Automático'}
                    </button>
                  </div>
                </div>

              </div>
            )}
          </>
        )}

        {/* TAB: MANUAL */}
        {uploadTab === 'manual' && (
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex items-center">
              <PenLine className="w-4 h-4 text-blue-600 mr-3" />
              <p className="text-[13px] font-bold text-blue-800">Ingreso Manual de Venta</p>
            </div>
            <div className="p-8 grid grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nombre del Cliente</label>
                <input type="text" value={manualData.clientName} onChange={e => setManualData({...manualData, clientName: e.target.value})} placeholder="Ej: Juan Pérez" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 focus:outline-none focus:border-blue-500 bg-white" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Teléfono</label>
                <input type="text" value={manualData.phone} onChange={e => setManualData({...manualData, phone: e.target.value})} placeholder="Ej: 5492645438114" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 focus:outline-none focus:border-blue-500 bg-white" />
                <p className="text-[10px] text-blue-500 mt-1 font-medium">Formato: 549 + código de área + número (sin 15). Ej: 549264<b>5438114</b></p>
                {manualData.phone && <p className="text-[10px] text-green-600 mt-0.5 font-bold">Se guardará como: {normalizePhone(manualData.phone)}</p>}
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Importe Total ($)</label>
                <input type="number" value={manualData.amount} onChange={e => setManualData({...manualData, amount: e.target.value})} placeholder="Ej: 150000" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 focus:outline-none focus:border-blue-500 bg-white" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Motivo de contacto</label>
                <select value={reason} onChange={e => setReason(e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 focus:outline-none focus:border-blue-500 bg-white">
                  <option>Rotación de neumáticos</option>
                  <option>Alineación y Balanceo</option>
                  <option>Satisfacción de compra</option>
                  <option>Cambio de Aceite</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Productos (separados por coma)</label>
                <textarea value={manualData.items} onChange={e => setManualData({...manualData, items: e.target.value})} placeholder="Ej: Bridgestone 205/55R16, Alineación, Balanceo" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 h-24 resize-none focus:outline-none focus:border-blue-500 bg-white" />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Observaciones (opcional)</label>
                <textarea value={manualObservations} onChange={e => setManualObservations(e.target.value)} placeholder="Ej: Llamar por la mañana, interesado en alineación..." className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 h-20 resize-none focus:outline-none focus:border-blue-500 bg-white" />
              </div>
              <div className="col-span-2">
                <label className="block text-[13px] font-bold text-slate-700 mb-2">Agendar seguimiento a X días</label>
                <div className="flex rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white">
                  <button onClick={() => setDays(30)} className={`flex-1 py-3 text-[14px] font-medium transition-colors ${days === 30 ? 'bg-blue-600 text-white' : 'hover:bg-slate-50 text-slate-600'}`}>30</button>
                  <div className="w-[1px] bg-slate-100"></div>
                  <button onClick={() => setDays(90)} className={`flex-1 py-3 text-[14px] font-medium transition-colors ${days === 90 ? 'bg-blue-600 text-white' : 'hover:bg-slate-50 text-slate-600'}`}>90</button>
                  <div className="w-[1px] bg-slate-100"></div>
                  <button onClick={() => setDays(180)} className={`flex-1 py-3 text-[14px] font-medium transition-colors ${days === 180 ? 'bg-blue-600 text-white' : 'hover:bg-slate-50 text-slate-600'}`}>180</button>
                </div>
              </div>
            </div>
            <div className="p-8 pt-0">
              <button 
                onClick={handleManualSave} 
                disabled={saving || !manualData.clientName || !manualData.phone}
                className="w-full bg-[#EAB308] hover:bg-yellow-400 text-yellow-950 font-bold px-6 py-4 rounded-xl shadow-sm transition-all text-[15px] disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar Venta Manual + Seguimiento'}
              </button>
            </div>
          </div>
        )}

        {/* TAB: EXCEL */}
        {uploadTab === 'excel' && (
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-amber-400" />
            </div>
            <h3 className="text-[20px] font-bold text-slate-800 mb-2">Carga Masiva por Excel</h3>
            <p className="text-[14px] text-slate-500 mb-1 max-w-md mx-auto">Esta funcionalidad estará disponible próximamente. Vas a poder subir un archivo Excel (.xlsx) con múltiples ventas y el sistema las procesará automáticamente.</p>
            <span className="inline-block mt-4 bg-amber-100 text-amber-700 text-[12px] font-bold px-4 py-2 rounded-full">🚧 En desarrollo — Próximamente</span>
          </div>
        )}

      </main>
    </div>
  );
}

function Messenger() {
  const { isSidebarOpen, showSystemModal } = React.useContext(AppContext);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeContact, setActiveContact] = useState<string | null>(null);
  const [activeContactInfo, setActiveContactInfo] = useState<any>(null);
  const [activeClientsMap, setActiveClientsMap] = useState<Record<string, string>>({});
  const [newMessage, setNewMessage] = useState("");
  
  // Edición
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [editClientName, setEditClientName] = useState("");

  const handleSaveClientName = async () => {
    if(!activeContact || !editClientName.trim()) return;
    try {
      const { data, error } = await supabase.from('ng_clients').upsert({
        phone: activeContact, 
        name: editClientName
      }, { onConflict: 'phone' }).select();

      if(error) {
        console.error("Error saving client name:", error);
        showSystemModal("Error guardando el nombre", "Error guardando el nombre del cliente. Revisa las policies de la base de datos.", "error");
      } else {
        setActiveContactInfo((prev: any) => ({...prev, name: editClientName}));
        setActiveClientsMap((prev: any) => ({...prev, [activeContact]: editClientName}));
        setMessages([...messages]); // trigger re-render
      }
    } catch(e) {
      console.error(e);
    }
    setIsEditingClient(false);
  };

  
  const [templates, setTemplates] = useState<any[]>([
    { shortcut: '/SALUDO', body: '¡Hola {{nombre}}! Soy de Neumáticos Gallo. ¿En qué te podemos ayudar hoy?', category: 'General' },
    { shortcut: '/ROTACION', body: 'Hola {{nombre}}, vimos en nuestro historial que cambiaste {{productos}} el pasado {{fecha}}. ¿Te gustaría agendar una rotación sin cargo?', category: 'Seguimiento' },
    { shortcut: '/PRECIO', body: 'El precio total de tu última consulta fue de ${{importe}}. Avisame si lo validamos.', category: 'Ventas' },
  ]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [filteredTemplates, setFilteredTemplates] = useState<any[]>([]);

  useEffect(() => {
    fetchMessages();
    fetchTemplates();
    
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'ng_whatsapp_messages' },
        (payload) => {
          setMessages(prev => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (activeContact) {
      loadContactInfo(activeContact);
    }
  }, [activeContact]);

  const loadContactInfo = async (phone: string) => {
    try {
      const { data: clientData } = await supabase.from('ng_clients').select('*').eq('phone', phone).single();
      if (clientData) {
        const { data: invoiceData } = await supabase.from('ng_invoices')
          .select('*').eq('client_id', clientData.id)
          .order('created_at', { ascending: false });
        
        setActiveContactInfo({
          ...clientData,
          invoices: invoiceData || [],
          lastInvoice: (invoiceData && invoiceData.length > 0) ? invoiceData[0] : null
        });
      } else {
        setActiveContactInfo({ name: 'Cliente' });
      }
    } catch (e) {
      setActiveContactInfo({ name: 'Cliente' });
    }
  };

  const fetchTemplates = async () => {
    try {
      const { data } = await supabase.from('ng_templates').select('*');
      if (data && data.length > 0) {
        setTemplates(data);
      }
    } catch (e) {
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ng_whatsapp_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);
        
      if (error) throw error;
      setMessages(data || []);
      
      const { data: cData } = await supabase.from('ng_clients').select('*');
      const clientsMap: Record<string, string> = {};
      if (cData) {
        cData.forEach(c => { clientsMap[c.phone] = c.name; });
      }

      if (data && data.length > 0) {
        const conversationsRaw = Array.from(new Set(data.map(m => m.client_phone))).map(phone => {
          const contactMessages = data.filter(m => m.client_phone === phone);
          return {
            phone,
            name: clientsMap[phone as string] || phone,
            lastMessage: contactMessages[0],
            total: contactMessages.length
          };
        });
        
        // Pass to state if we want, but for now we just compute it inline below, wait we should store clientsMap in state!
      }
      setActiveClientsMap(clientsMap);

      if (data && data.length > 0) {
        const firstContact = Array.from(new Set(data.map(m => m.client_phone)))[0];
        setActiveContact(firstContact as string);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewMessage(val);

    const words = val.split(' ');
    const lastWord = words[words.length - 1];

    if (lastWord.startsWith('/')) {
      setShowTemplates(true);
      const search = lastWord.toUpperCase();
      const matches = templates.filter(t => t.shortcut.toUpperCase().startsWith(search));
      setFilteredTemplates(matches.length > 0 ? matches : templates);
    } else {
      setShowTemplates(false);
    }
  };

  const applyTemplate = (templateBody: string) => {
    let replacedBody = templateBody;
    
    replacedBody = replacedBody.replace(/{{nombre}}/g, activeContactInfo?.name || 'Amigo');
    
    if (activeContactInfo?.lastInvoice) {
      const inv = activeContactInfo.lastInvoice;
      const prods = Array.isArray(inv.items) ? inv.items.join(', ') : inv.items || 'los productos seleccionados';
      replacedBody = replacedBody.replace(/{{productos}}/g, prods);
      replacedBody = replacedBody.replace(/{{fecha}}/g, inv.purchase_date || new Date().toLocaleDateString());
      replacedBody = replacedBody.replace(/{{importe}}/g, inv.amount || '0');
    } else {
      replacedBody = replacedBody.replace(/{{productos}}/g, 'nuestros productos');
      replacedBody = replacedBody.replace(/{{fecha}}/g, 'recientemente');
      replacedBody = replacedBody.replace(/{{importe}}/g, '0');
    }

    const words = newMessage.split(' ');
    words.pop();
    const newText = words.length > 0 ? words.join(' ') + ' ' + replacedBody : replacedBody;
    
    setNewMessage(newText);
    setShowTemplates(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeContact) return;
    
    const tempMsg = {
      id: Math.random().toString(),
      client_phone: activeContact,
      body: newMessage,
      direction: 'outgoing',
      message_type: 'text',
      created_at: new Date().toISOString()
    };
    
    setMessages([tempMsg, ...messages]);
    setNewMessage("");
    setShowTemplates(false);

    // Save to local Supabase Database
    await supabase.from('ng_whatsapp_messages').insert([{
      client_phone: activeContact,
      body: tempMsg.body,
      direction: 'outgoing',
      message_type: 'text'
    }]);

    // Send to BuilderBot Cloud
    const builderBotUrl = import.meta.env.VITE_BUILDERBOT_API_URL;
    const builderBotKey = import.meta.env.VITE_BUILDERBOT_API_KEY;
    
    if (builderBotUrl && builderBotKey) {
      try {
        await fetch(`${builderBotUrl}/messages/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${builderBotKey}`
          },
          body: JSON.stringify({
             number: activeContact,
             message: tempMsg.body
          })
        });
      } catch (err) {
        console.error("Error sending message to BuilderBot: ", err);
      }
    }
  };

  const conversations = Array.from(new Set(messages.map(m => m.client_phone))).map(phone => {
    const contactMessages = messages.filter(m => m.client_phone === phone);
    const dbName = activeClientsMap[phone as string];
    const nameToDisplay = dbName ? (dbName.match(/^\d+$/) ? `Cliente ${dbName.substring(dbName.length - 4)}` : dbName) : phone;
    
    return {
      phone,
      name: nameToDisplay,
      lastMessage: contactMessages[0],
      total: contactMessages.length

    };
  });

  const activeMessages = messages.filter(m => m.client_phone === activeContact).reverse();

  const renderMedia = (msg: any) => {
    if (!msg.attachment_urls || msg.attachment_urls.length === 0) return null;
    const url = msg.attachment_urls[0];
    const urlLower = url.toLowerCase();
    
    if (urlLower.match(/\.(jpeg|jpg|gif|png|webp)/) || msg.body.includes("imagen") || msg.message_type === 'image') {
      return <img src={url} alt="Archivo adjunto" className="max-w-[240px] rounded-lg mt-2 cursor-pointer shadow-sm border border-slate-200" />;
    }
    if (urlLower.match(/\.(mp4|ogg|oga|mp3|wav)/) || msg.message_type === 'audio' || msg.message_type === 'voice') {
      return <audio controls src={url} className="w-[240px] mt-2 h-10 outline-none" />;
    }
    if (urlLower.match(/\.(pdf)/) || msg.message_type === 'document') {
      return (
        <a href={url} target="_blank" rel="noreferrer" className="flex items-center mt-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-blue-600 hover:bg-slate-100 transition-colors">
          <FileText className="w-5 h-5 mr-2" />
          <span className="text-xs font-bold truncate max-w-[180px]">Ver Documento PDF</span>
        </a>
      );
    }
    
    return (
      <a href={url} target="_blank" rel="noreferrer" className="mt-2 text-[11px] font-bold text-blue-500 underline flex items-center">
        <Upload className="w-3 h-3 mr-1" /> Archivo Adjunto ({msg.message_type})
      </a>
    );
  };

  return (
    <div className={`flex-1 transition-[margin] duration-300 ${isSidebarOpen ? 'ml-[280px]' : 'ml-[80px]'} h-screen bg-slate-100 flex overflow-hidden`}>
      
      <div className="w-[340px] bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center">
            Mensajería <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{conversations.length}</span>
          </h2>
          <div className="flex space-x-2 text-slate-400">
            <button className="hover:text-slate-600"><Settings className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="p-3 border-b border-slate-100">
          <div className="bg-slate-100 rounded-lg flex items-center px-3 py-2 border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input type="text" placeholder="Buscar conversación..." className="bg-transparent border-none outline-none text-[13px] w-full text-slate-700" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="text-center text-xs text-slate-400 p-4">Cargando...</p>
          ) : conversations.length === 0 ? (
            <p className="text-center text-xs text-slate-400 p-4">Sin mensajes en DB</p>
          ) : (
            conversations.map((c: any) => {
              const isActive = activeContact === c.phone;
              return (
                <div 
                  key={c.phone} 
                  onClick={() => setActiveContact(c.phone)}
                  className={`flex items-start p-3 cursor-pointer border-b border-slate-50 transition-colors ${isActive ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                >
                  <img src="/images.png" alt="Cliente" className="w-10 h-10 rounded-full object-cover shrink-0 shadow-sm mr-3 border border-slate-200" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className={`text-[14px] font-bold truncate ${isActive ? 'text-blue-800' : 'text-slate-800'}`}>{c.name}</h4>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(c.lastMessage.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={`text-[12px] truncate ${isActive ? 'text-blue-600 font-medium' : 'text-slate-500'}`}>
                      {c.lastMessage.message_type === 'media' ? '📷 Imagen/Audio adjunto' : c.lastMessage.body}
                    </p>
                    <div className="mt-1">
                      <span className="inline-block px-1.5 py-0.5 rounded bg-green-100 text-green-700 text-[9px] font-bold uppercase tracking-wider">Business</span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-[#E5EAEF] relative">
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #bfdbfe 0%, transparent 100%)' }}></div>

        {activeContact ? (
          <>
            {/* Chat Topbar */}
            <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10 shrink-0 shadow-sm relative">
              <div className="flex items-center">
                <img src="/images.png" alt="Avatar Cliente" className="w-10 h-10 rounded-full object-cover shadow-sm mr-3 border border-slate-200" />
                <div>
                  
                  {isEditingClient ? (
                    <div className="flex items-center space-x-2">
                       <input 
                         type="text"
                         autoFocus
                         value={editClientName}
                         onChange={(e) => setEditClientName(e.target.value)}
                         className="text-[14px] font-bold text-slate-800 border-b border-blue-400 focus:outline-none bg-slate-50 px-1 py-0.5 rounded-sm"
                         onKeyDown={(e) => { if(e.key === 'Enter') handleSaveClientName(); if(e.key === 'Escape') setIsEditingClient(false); }}
                       />
                       <button onClick={handleSaveClientName} className="text-green-600 bg-green-50 p-1 rounded-md hover:bg-green-100"><Check className="w-4 h-4" /></button>
                       <button onClick={() => setIsEditingClient(false)} className="text-slate-400 bg-slate-50 p-1 rounded-md hover:bg-slate-100">X</button>
                    </div>
                  ) : (
                    <h3 className="text-[15px] font-bold text-slate-800 flex items-center group">
                      {(() => {
                         const rawName = activeContactInfo?.name || '';
                         if (!rawName) return 'Cliente Nuevo';
                         return rawName.match(/^\d+$/) ? `Cliente ${rawName.substring(rawName.length - 4)}` : rawName;
                      })()}
                      <span className="text-slate-400 ml-2 font-normal text-xs bg-slate-100 px-1.5 py-0.5 rounded">{activeContact}</span>
                      <button 
                        onClick={() => {
                          setEditClientName(activeContactInfo?.name || activeContact);
                          setIsEditingClient(true);
                        }}
                        className="ml-2 text-slate-300 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" title="Editar Nombre">
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </h3>
                  )}

                  <div className="flex items-center text-[11px] text-blue-500 font-medium">
                    <MessageSquare className="w-3 h-3 mr-1" /> WhatsApp Integrado {activeContactInfo?.lastInvoice ? '• Factura Vinculada' : ''}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={async () => {
                    const tenMessages = activeMessages.slice(0, 10);
                    if(tenMessages.length === 0) return showSystemModal('Atención', 'No hay mensajes con este cliente', 'info');
                    try {
                       const { data, error } = await supabase.functions.invoke('summarize-chat', {
                          body: { messages: tenMessages.reverse() }
                       });
                       if(error) throw error;
                       showSystemModal('🤖 Resumen IA', data.summary, 'success');
                    } catch(err:any) {
                       console.error(err);
                       showSystemModal('Error IA', 'Error al resumir conversación de IA. Revisa edge function. Detalles: ' + err.message, 'error');
                    }
                  }}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-1.5 rounded-full text-[12px] font-bold shadow-sm transition-colors flex items-center border border-purple-200"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Resumir con IA
                </button>

                <div className="bg-slate-100/80 px-4 py-1.5 rounded-full text-[11px] font-bold text-slate-500 shadow-sm border border-slate-200">
                  {new Intl.DateTimeFormat('es-AR', { weekday:'long', day:'2-digit', month:'long', year:'numeric'}).format(new Date())}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 z-10 flex flex-col">
              {activeMessages.map((msg: any) => (
                <div key={msg.id} className={`flex flex-col mb-4 max-w-[75%] ${msg.direction === 'outgoing' ? 'self-end items-end' : 'self-start items-start'}`}>
                  <div className={`px-4 py-3 rounded-[18px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] relative
                    ${msg.direction === 'outgoing' 
                      ? 'bg-blue-600 text-white rounded-tr-sm' 
                      : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm'
                    }`}
                  >
                    {renderMedia(msg)}
                    {msg.body && msg.body !== 'Multimedia' && (
                      <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{msg.body}</p>
                    )}
                    
                    <div className={`text-[10px] mt-1.5 text-right font-medium flex items-center justify-end ${msg.direction === 'outgoing' ? 'text-blue-200' : 'text-slate-400'}`}>
                      {new Date(msg.created_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                      {msg.direction === 'outgoing' && <span className="ml-1 text-[10px]">✓✓</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative z-20">
              {showTemplates && (
                <div className="absolute bottom-full left-12 w-[400px] mb-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-in slide-in-from-bottom-2 fade-in">
                  <div className="bg-slate-50 p-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Atajos / Plantillas</span>
                    <span className="text-[10px] text-slate-400">{filteredTemplates.length} encontradas</span>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {filteredTemplates.map((t, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => applyTemplate(t.body)}
                        className="p-3 hover:bg-blue-50 border-b border-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[13px] font-bold text-blue-600">{t.shortcut}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">{t.category}</span>
                        </div>
                        <p className="text-[12px] text-slate-500 truncate">{t.body}</p>
                      </div>
                    ))}
                    {filteredTemplates.length === 0 && (
                      <div className="p-4 text-center text-sm text-slate-400 font-medium">No se encontraron atajos para "{newMessage.split(' ').pop()}"</div>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-white p-4 shrink-0 flex items-center shadow-[0_-2px_10px_-4px_rgba(0,0,0,0.05)] border-t border-slate-200">
                <form onSubmit={handleSendMessage} className="flex-1 mx-2">
                  <input 
                    type="text" 
                    value={newMessage}
                    onChange={handleInputChange}
                    placeholder="Escribe '/' para plantillas o simplemente un mensaje..." 
                    className="w-full bg-slate-100 border border-transparent rounded-full px-5 py-3 text-[14px] text-slate-800 focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner"
                  />
                </form>

                <button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="w-12 h-12 bg-green-500 hover:bg-green-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all shadow-md ml-2"
                >
                  <div style={{transform: "rotate(45deg) translate(-2px, 2px)"}}><Upload className="w-5 h-5" /></div>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center z-10 text-slate-400">
            <MessageSquare className="w-16 h-16 mb-4 text-slate-300" />
            <p className="text-lg font-bold text-slate-500">Selecciona un chat</p>
            <p className="text-sm mt-2">Para comenzar a enviar y recibir mensajes empresariales.</p>
          </div>
        )}
      </div>

      {/* RIGHT SIDE PANEL: Facturas Asociadas */}
      {activeContact && activeContactInfo?.invoices && activeContactInfo.invoices.length > 0 && (
        <div className="w-[320px] bg-[#090E17] text-white flex flex-col shrink-0 overflow-y-auto border-l border-slate-800 relative z-20">
          <div className="p-8 flex flex-col items-center border-b border-slate-800/80">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xl uppercase text-slate-300 mb-4 shadow-md border border-slate-700/50">
              {activeContactInfo?.name ? activeContactInfo.name.substring(0,2) : activeContact.substring(0,2)}
            </div>
            <h3 className="font-bold text-center text-[15px] tracking-wide text-white">{activeContactInfo?.name || 'CLIENTE'}</h3>
            <p className="text-slate-400 text-xs mt-1 tracking-wider">{activeContact}</p>
          </div>
          
          <div className="p-6">
            <h4 className="text-[11px] font-bold text-slate-400 tracking-[0.2em] flex items-center mb-5 uppercase">
              <Package className="w-3.5 h-3.5 mr-2" />
              Facturas ({activeContactInfo.invoices.length})
            </h4>
            
            <div className="space-y-4">
              {activeContactInfo.invoices.map((inv: any, idx: number) => (
                <div key={idx} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 transition-colors hover:bg-slate-800/80 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/80 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[13px] font-bold text-cyan-400 tracking-wider">FA-{inv.id.substring(0,6).toUpperCase()}</span>
                    <span className="text-[9px] font-bold bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20 px-2 py-0.5 rounded-[4px] tracking-wider">PENDIENTE</span>
                  </div>
                  
                  <div className="space-y-2 mb-4 text-[12px] text-slate-300">
                    <p className="flex justify-between border-b border-slate-700/50 pb-1">
                      <span className="text-slate-500 font-medium">Motivo:</span>
                      <span className="truncate max-w-[140px] font-medium" title={Array.isArray(inv.items) ? inv.items.join(', ') : inv.items || 'Detalles'}>
                        {Array.isArray(inv.items) ? inv.items[0] : (inv.items || 'Detalles').split(',')[0]}
                      </span>
                    </p>
                    <p className="flex justify-between border-b border-slate-700/50 pb-1">
                      <span className="text-slate-500 font-medium">Total:</span>
                      <span className="font-bold text-white">${inv.amount}</span>
                    </p>
                    <p className="flex justify-between pb-1">
                      <span className="text-slate-500 font-medium">Fecha:</span>
                      <span className="text-slate-300">{inv.purchase_date}</span>
                    </p>
                  </div>
                  
                  <button className="w-full py-2.5 rounded-lg border border-cyan-500/30 text-cyan-400 text-[10px] font-bold tracking-[0.2em] flex items-center justify-center hover:bg-cyan-500 hover:text-white transition-all">
                    <ExternalLink className="w-3 h-3 mr-2" />
                    VER GALERÍA
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function FollowUps() {
  const { isSidebarOpen, showSystemModal } = React.useContext(AppContext);
  const [followUps, setFollowUps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Contact Panel state
  const [selectedFollowUp, setSelectedFollowUp] = useState<any>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [clientInvoices, setClientInvoices] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [showTplPicker, setShowTplPicker] = useState(false);
  const [contactMsg, setContactMsg] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchFollowUps();
    supabase.from('ng_templates').select('*').then(({ data }) => setTemplates(data || []));
  }, []);

  const fetchFollowUps = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('ng_follow_ups')
      .select('*, ng_clients(id, name, phone)')
      .order('scheduled_date', { ascending: true });
    setFollowUps(data || []);
    setLoading(false);
  };

  const openContactPanel = async (f: any) => {
    setSelectedFollowUp(f);
    setPanelOpen(true);
    setContactMsg('');
    // Fetch last invoices for this client
    if (f.client_id) {
      const { data } = await supabase.from('ng_invoices').select('*').eq('client_id', f.client_id).order('created_at', { ascending: false }).limit(3);
      setClientInvoices(data || []);
    }
  };

  const applyTemplate = (tpl: any) => {
    const client = selectedFollowUp?.ng_clients;
    const lastInv = clientInvoices[0];
    let body = tpl.body;
    body = body.replace(/\{\{nombre\}\}/gi, client?.name || 'Cliente');
    body = body.replace(/\{\{productos\}\}/gi, lastInv?.items ? (Array.isArray(lastInv.items) ? lastInv.items.join(', ') : lastInv.items) : 'productos');
    body = body.replace(/\{\{fecha\}\}/gi, new Date().toLocaleDateString('es-AR'));
    body = body.replace(/\{\{importe\}\}/gi, lastInv?.amount ? `$${lastInv.amount}` : '$0');
    setContactMsg(body);
    setShowTplPicker(false);
  };

  const handleSendFollowUpMsg = async () => {
    if (!contactMsg.trim() || !selectedFollowUp?.ng_clients?.phone) return;
    setSending(true);
    const phone = selectedFollowUp.ng_clients.phone;

    // Save to DB
    await supabase.from('ng_whatsapp_messages').insert([{
      client_phone: phone, body: contactMsg, direction: 'outgoing', message_type: 'text'
    }]);

    // Send via BuilderBot
    const builderBotUrl = import.meta.env.VITE_BUILDERBOT_API_URL;
    const builderBotKey = import.meta.env.VITE_BUILDERBOT_API_KEY;
    if (builderBotUrl && builderBotKey) {
      try {
        await fetch(`${builderBotUrl}/messages/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${builderBotKey}` },
          body: JSON.stringify({ number: phone, message: contactMsg })
        });
      } catch (err) { console.error(err); }
    }

    // Mark as completed
    await supabase.from('ng_follow_ups').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', selectedFollowUp.id);
    
    showSystemModal('Mensaje enviado', `Se envió el mensaje a ${selectedFollowUp.ng_clients?.name || phone} y el seguimiento fue marcado como completado.`, 'success');
    setSending(false);
    setPanelOpen(false);
    fetchFollowUps();
  };

  const markComplete = async (id: string) => {
    await supabase.from('ng_follow_ups').update({ status: 'completed', completed_at: new Date().toISOString() }).eq('id', id);
    fetchFollowUps();
  };

  const markCancelled = async (id: string) => {
    await supabase.from('ng_follow_ups').update({ status: 'cancelled' }).eq('id', id);
    fetchFollowUps();
  };

  const filtered = followUps.filter(f => filterStatus === 'all' || f.status === filterStatus);

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      'pending': 'bg-amber-100 text-amber-700',
      'completed': 'bg-green-100 text-green-700',
      'cancelled': 'bg-red-100 text-red-700'
    };
    const labels: Record<string, string> = { 'pending': 'Pendiente', 'completed': 'Completado', 'cancelled': 'Cancelado' };
    return <span className={`${map[status] || 'bg-slate-100 text-slate-600'} text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider`}>{labels[status] || status}</span>;
  };

  const daysUntil = (date: string) => {
    const diff = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return <span className="text-red-500 font-bold text-[12px]">Vencido hace {Math.abs(diff)} días</span>;
    if (diff === 0) return <span className="text-amber-600 font-bold text-[12px]">Hoy</span>;
    return <span className="text-slate-600 text-[12px]">En {diff} días</span>;
  };

  return (
    <div className={`flex-1 transition-[margin] duration-300 ${isSidebarOpen ? 'ml-[280px]' : 'ml-[80px]'} min-h-screen bg-[#F8FAFC] flex flex-col`}>
      <TopBar title="Neumáticos Gallo" subtitle="Seguimientos Programados" />
      <main className="px-10 py-6 w-full">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mr-4">
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-slate-800">Seguimientos</h2>
              <p className="text-[13px] text-slate-400">Contactos agendados automáticamente tras cargar facturas</p>
            </div>
          </div>
          <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
            {[{k:'all',l:'Todos'},{k:'pending',l:'Pendientes'},{k:'completed',l:'Completados'},{k:'cancelled',l:'Cancelados'}].map(f => (
              <button key={f.k} onClick={() => setFilterStatus(f.k)} className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${filterStatus === f.k ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>
                {f.l}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6">
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total</p>
            <p className="text-[28px] font-extrabold text-slate-800">{followUps.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6">
            <p className="text-[12px] font-bold text-amber-500 uppercase tracking-wider mb-1">Pendientes</p>
            <p className="text-[28px] font-extrabold text-amber-600">{followUps.filter(f => f.status === 'pending').length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6">
            <p className="text-[12px] font-bold text-green-500 uppercase tracking-wider mb-1">Completados</p>
            <p className="text-[28px] font-extrabold text-green-600">{followUps.filter(f => f.status === 'completed').length}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cliente</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Teléfono</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Motivo</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Observaciones</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fecha Programada</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tiempo</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                  <th className="text-right px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="text-center py-12 text-slate-400 text-[14px]">Cargando seguimientos...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-slate-400 text-[14px]">No hay seguimientos {filterStatus !== 'all' ? `con estado "${filterStatus}"` : ''}</td></tr>
                ) : filtered.map((f: any) => (
                  <tr key={f.id} onClick={() => openContactPanel(f)} className="border-b border-slate-50 hover:bg-blue-50/40 transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img src="/images.png" alt="" className="w-8 h-8 rounded-full object-cover mr-3 border border-slate-200" />
                        <span className="text-[14px] font-bold text-slate-800">{f.ng_clients?.name || 'Sin nombre'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-slate-600 font-medium">{f.ng_clients?.phone || '—'}</td>
                    <td className="px-6 py-4 text-[13px] text-slate-600 font-medium">{f.reason}</td>
                    <td className="px-6 py-4 text-[12px] text-slate-500 max-w-[180px] truncate" title={f.observations || ''}>{f.observations || <span className="text-slate-300">—</span>}</td>
                    <td className="px-6 py-4 text-[13px] text-slate-700 font-bold">{new Date(f.scheduled_date).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="px-6 py-4">{daysUntil(f.scheduled_date)}</td>
                    <td className="px-6 py-4">{statusBadge(f.status)}</td>
                    <td className="px-6 py-4 text-right">
                      {f.status === 'pending' && (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={(e) => { e.stopPropagation(); openContactPanel(f); }} className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition-colors" title="Contactar">
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); markComplete(f.id); }} className="bg-green-50 hover:bg-green-100 text-green-600 p-2 rounded-lg transition-colors" title="Marcar completado">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); markCancelled(f.id); }} className="bg-red-50 hover:bg-red-100 text-red-500 p-2 rounded-lg transition-colors" title="Cancelar">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* SLIDE-OVER CONTACT PANEL */}
      {panelOpen && selectedFollowUp && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setPanelOpen(false)}></div>
          <div className="relative w-full max-w-[520px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            
            {/* Panel Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center">
                <img src="/images.png" alt="" className="w-12 h-12 rounded-full object-cover border-2 border-white/30 mr-4" />
                <div>
                  <h3 className="text-white font-bold text-[17px]">{selectedFollowUp.ng_clients?.name || 'Sin nombre'}</h3>
                  <p className="text-blue-100 text-[13px] font-medium">{selectedFollowUp.ng_clients?.phone || '—'}</p>
                </div>
              </div>
              <button onClick={() => setPanelOpen(false)} className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* Client Info Cards */}
            <div className="p-5 space-y-4 border-b border-slate-100 overflow-y-auto flex-shrink-0">
              {/* Follow-up info */}
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-2">Seguimiento</p>
                <div className="grid grid-cols-2 gap-3 text-[13px]">
                  <div><span className="text-slate-400">Motivo:</span> <span className="font-bold text-slate-700">{selectedFollowUp.reason}</span></div>
                  <div><span className="text-slate-400">Fecha:</span> <span className="font-bold text-slate-700">{new Date(selectedFollowUp.scheduled_date).toLocaleDateString('es-AR')}</span></div>
                  <div><span className="text-slate-400">Estado:</span> {statusBadge(selectedFollowUp.status)}</div>
                  <div>{daysUntil(selectedFollowUp.scheduled_date)}</div>
                </div>
                {selectedFollowUp.observations && (
                  <div className="mt-3 pt-3 border-t border-amber-200">
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1">Observaciones</p>
                    <p className="text-[13px] text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedFollowUp.observations}</p>
                  </div>
                )}
              </div>

              {/* Last purchase */}
              {clientInvoices.length > 0 && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-2">Última Compra</p>
                  {clientInvoices.slice(0, 1).map((inv: any, i: number) => (
                    <div key={i} className="text-[13px] space-y-1">
                      <div><span className="text-slate-400">Productos:</span> <span className="font-bold text-slate-700">{Array.isArray(inv.items) ? inv.items.join(', ') : inv.items || '—'}</span></div>
                      <div><span className="text-slate-400">Importe:</span> <span className="font-extrabold text-green-700">${inv.amount || 0}</span></div>
                      <div><span className="text-slate-400">Fecha:</span> <span className="font-medium text-slate-600">{new Date(inv.created_at).toLocaleDateString('es-AR')}</span></div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message Composer (WhatsApp style) */}
            <div className="flex-1 flex flex-col p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">Enviar Mensaje WhatsApp</p>
                <div className="relative">
                  <button onClick={() => setShowTplPicker(!showTplPicker)} className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> Plantillas
                  </button>
                  {showTplPicker && (
                    <div className="absolute right-0 top-10 bg-white rounded-xl shadow-2xl border border-slate-200 w-[300px] max-h-[280px] overflow-y-auto z-50">
                      <div className="p-3 border-b border-slate-100">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Seleccioná una plantilla</p>
                      </div>
                      {templates.length === 0 ? (
                        <p className="p-4 text-[13px] text-slate-400 text-center">No hay plantillas creadas</p>
                      ) : templates.map((tpl: any) => (
                        <button
                          key={tpl.id}
                          onClick={() => applyTemplate(tpl)}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-slate-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] font-bold text-blue-600">{tpl.shortcut}</span>
                            <span className="text-[10px] text-slate-400 uppercase">{tpl.category}</span>
                          </div>
                          <p className="text-[12px] text-slate-500 mt-1 line-clamp-2">{tpl.body.substring(0, 80)}...</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <textarea 
                value={contactMsg} 
                onChange={e => setContactMsg(e.target.value)}
                placeholder="Escribí tu mensaje para el cliente..."
                className="flex-1 w-full border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 resize-none focus:outline-none focus:border-blue-400 bg-slate-50 min-h-[160px]"
              />
              <p className="text-[11px] text-slate-400 mt-2 mb-4">{contactMsg.length} caracteres</p>

              <button 
                onClick={handleSendFollowUpMsg} 
                disabled={sending || !contactMsg.trim()}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 text-[15px] disabled:opacity-50"
              >
                <MessageSquare className="w-5 h-5" />
                {sending ? 'Enviando...' : 'Enviar por WhatsApp'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Clients() {
  const { isSidebarOpen, showSystemModal } = React.useContext(AppContext);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [clientInvoices, setClientInvoices] = useState<any[]>([]);
  const [clientFollowUps, setClientFollowUps] = useState<any[]>([]);
  const [clientMsgCount, setClientMsgCount] = useState(0);
  const [editingName, setEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  const [generatingSummaries, setGeneratingSummaries] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('ng_clients')
      .select('*')
      .order('created_at', { ascending: false });
    setClients(data || []);
    setLoading(false);

    // Proactively generate summaries for clients without one
    const withoutSummary = (data || []).filter((c: any) => !c.ai_summary);
    if (withoutSummary.length > 0) {
      generateSummariesBackground();
    }
  };

  const generateSummariesBackground = async () => {
    setGeneratingSummaries(true);
    try {
      await supabase.functions.invoke('generate-client-summary', { body: {} });
      // Refresh clients to get the new summaries
      const { data } = await supabase.from('ng_clients').select('*').order('created_at', { ascending: false });
      setClients(data || []);
    } catch (e) {
      console.error('Error generating summaries:', e);
    }
    setGeneratingSummaries(false);
  };

  const refreshSingleSummary = async (clientId: string) => {
    try {
      await supabase.from('ng_clients').update({ ai_summary: null }).eq('id', clientId);
      await supabase.functions.invoke('generate-client-summary', { body: { clientId } });
      const { data } = await supabase.from('ng_clients').select('*').eq('id', clientId).single();
      if (data) {
        setClients(prev => prev.map(c => c.id === clientId ? data : c));
        if (selectedClient?.id === clientId) setSelectedClient(data);
      }
    } catch(e) {
      console.error(e);
    }
  };

  const openClientPanel = async (client: any) => {
    setSelectedClient(client);
    setPanelOpen(true);
    setEditingName(false);

    // Fetch invoices
    const { data: invs } = await supabase.from('ng_invoices')
      .select('*').eq('client_id', client.id)
      .order('created_at', { ascending: false });
    setClientInvoices(invs || []);

    // Fetch follow-ups
    const { data: fus } = await supabase.from('ng_follow_ups')
      .select('*').eq('client_id', client.id)
      .order('scheduled_date', { ascending: false });
    setClientFollowUps(fus || []);

    // Count messages
    const { count } = await supabase.from('ng_whatsapp_messages')
      .select('*', { count: 'exact', head: true })
      .eq('client_phone', client.phone);
    setClientMsgCount(count || 0);
  };

  const saveClientName = async () => {
    if (!editName.trim() || !selectedClient) return;
    const { error } = await supabase.from('ng_clients').update({ name: editName.trim() }).eq('id', selectedClient.id);
    if (error) {
      showSystemModal('Error guardando el nombre', 'Error guardando el nombre del cliente. Revisa las policies de la base de datos.', 'error');
      return;
    }
    const updated = { ...selectedClient, name: editName.trim() };
    setSelectedClient(updated);
    setClients(prev => prev.map(c => c.id === selectedClient.id ? updated : c));
    setEditingName(false);
    showSystemModal('Nombre actualizado', `El cliente ahora se llama "${editName.trim()}"`, 'success');
  };

  const filtered = clients.filter(c => {
    const q = search.toLowerCase();
    return !q || (c.name || '').toLowerCase().includes(q) || (c.phone || '').includes(q);
  });

  const totalInvoiceAmount = (invs: any[]) => invs.reduce((acc: number, i: any) => acc + (parseFloat(i.amount) || 0), 0);

  return (
    <div className={`flex-1 transition-[margin] duration-300 ${isSidebarOpen ? 'ml-[280px]' : 'ml-[80px]'} min-h-screen bg-[#F8FAFC] flex flex-col`}>
      <TopBar title="Neumáticos Gallo" subtitle="Clientes" />
      <main className="px-10 py-6 w-full">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mr-4">
              <Users className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-slate-800">Clientes</h2>
              <p className="text-[13px] text-slate-400">Base de datos de todos los contactos · Resumen IA automático</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {generatingSummaries && (
              <span className="text-[11px] text-indigo-500 font-medium bg-indigo-50 px-3 py-1.5 rounded-full flex items-center gap-2 animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin" /> Generando resúmenes IA...
              </span>
            )}
            <span className="text-[13px] font-medium text-slate-400">{clients.length} clientes</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Clientes</p>
            <p className="text-[26px] font-extrabold text-slate-800">{clients.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-5">
            <p className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider mb-1">Con Factura</p>
            <p className="text-[26px] font-extrabold text-indigo-600">{clients.filter(c => c.ai_summary && c.ai_summary.toLowerCase().includes('factura')).length || '—'}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-5">
            <p className="text-[11px] font-bold text-green-500 uppercase tracking-wider mb-1">Con Resumen IA</p>
            <p className="text-[26px] font-extrabold text-green-600">{clients.filter(c => c.ai_summary).length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-5">
            <p className="text-[11px] font-bold text-amber-500 uppercase tracking-wider mb-1">Sin Resumen</p>
            <p className="text-[26px] font-extrabold text-amber-600">{clients.filter(c => !c.ai_summary).length}</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center">
            <div className="flex-1 max-w-md relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar por nombre o teléfono..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-[13px] font-medium text-slate-700 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
              />
            </div>
          </div>

          {/* Client List */}
          <div className="divide-y divide-slate-50">
            {loading ? (
              <div className="p-12 text-center text-slate-400 text-[14px]">Cargando clientes...</div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-[14px]">No se encontraron clientes</div>
            ) : filtered.map(client => (
              <div 
                key={client.id} 
                onClick={() => openClientPanel(client)}
                className="flex items-center px-6 py-4 hover:bg-blue-50/40 transition-colors cursor-pointer group"
              >
                <img src="/images.png" alt="" className="w-10 h-10 rounded-full object-cover mr-4 border border-slate-200" />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-slate-800 truncate">{client.name || 'Sin nombre'}</p>
                  <p className="text-[12px] text-slate-400 font-mono">{client.phone}</p>
                </div>
                {client.ai_summary ? (
                  <div className="flex-1 max-w-[400px] mx-4">
                    <p className="text-[12px] text-slate-500 line-clamp-2 leading-relaxed italic">{client.ai_summary}</p>
                  </div>
                ) : (
                  <div className="flex-1 max-w-[400px] mx-4">
                    <span className="text-[11px] text-slate-300 italic">Sin resumen IA</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  {client.ai_summary && <span className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">IA</span>}
                  <Eye className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* SLIDE-OVER CLIENT DETAIL PANEL */}
      {panelOpen && selectedClient && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setPanelOpen(false)}></div>
          <div className="relative w-full max-w-[580px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 overflow-y-auto">
            
            {/* Panel Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center">
                <img src="/images.png" alt="" className="w-12 h-12 rounded-full object-cover border-2 border-white/30 mr-4" />
                <div>
                  {editingName ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        value={editName} 
                        onChange={e => setEditName(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && saveClientName()}
                        className="bg-white/20 text-white border border-white/30 rounded-lg px-3 py-1.5 text-[15px] font-bold focus:outline-none focus:bg-white/30 w-[200px]"
                        autoFocus
                      />
                      <button onClick={saveClientName} className="bg-white/20 hover:bg-white/30 text-white p-1.5 rounded-lg transition-colors"><Check className="w-4 h-4" /></button>
                      <button onClick={() => setEditingName(false)} className="text-white/60 hover:text-white p-1.5 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-bold text-[17px]">{selectedClient.name || 'Sin nombre'}</h3>
                      <button onClick={() => { setEditName(selectedClient.name || ''); setEditingName(true); }} className="text-white/50 hover:text-white p-1 rounded transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-3 h-3 text-indigo-200" />
                    <p className="text-indigo-100 text-[13px] font-mono">{selectedClient.phone}</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setPanelOpen(false)} className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* AI Summary Card */}
            <div className="p-5 border-b border-slate-100 flex-shrink-0">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Resumen Inteligente
                  </p>
                  <button onClick={() => refreshSingleSummary(selectedClient.id)} className="text-[10px] font-bold text-indigo-400 hover:text-indigo-600 flex items-center gap-1 transition-colors">
                    <RefreshCw className="w-3 h-3" /> Regenerar
                  </button>
                </div>
                <p className="text-[13px] text-slate-700 leading-relaxed">
                  {selectedClient.ai_summary || 'Resumen pendiente de generación...'}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 px-5 py-4 border-b border-slate-100 flex-shrink-0">
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Facturas</p>
                <p className="text-[20px] font-extrabold text-blue-700">{clientInvoices.length}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <p className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Facturado</p>
                <p className="text-[16px] font-extrabold text-green-700">{formatMoney(totalInvoiceAmount(clientInvoices))}</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 text-center">
                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Mensajes</p>
                <p className="text-[20px] font-extrabold text-amber-700">{clientMsgCount}</p>
              </div>
            </div>

            {/* Invoices Section */}
            <div className="p-5 border-b border-slate-100 flex-shrink-0">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <ShoppingCart className="w-3.5 h-3.5" /> Facturas Asociadas
              </p>
              {clientInvoices.length === 0 ? (
                <p className="text-[13px] text-slate-400 italic">Sin facturas registradas</p>
              ) : clientInvoices.map((inv: any, idx: number) => (
                <div key={idx} className="bg-slate-50 rounded-xl p-4 mb-3 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-bold text-slate-600">
                      {inv.invoice_number ? `Factura N° ${inv.invoice_number}` : `Factura #${idx + 1}`}
                    </span>
                    <span className="text-[14px] font-extrabold text-green-700">{formatMoney(inv.amount || 0)}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2">{inv.purchase_date ? new Date(inv.purchase_date + 'T12:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Sin fecha'}</p>
                  
                  {/* Products table for this invoice */}
                  {Array.isArray(inv.items) && inv.items.length > 0 && (
                    <div className="border border-slate-200 rounded-lg overflow-hidden mt-2">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-white">
                            <th className="text-left px-3 py-2 text-[9px] font-bold text-slate-400 uppercase">Cant.</th>
                            <th className="text-left px-3 py-2 text-[9px] font-bold text-slate-400 uppercase">Producto</th>
                            <th className="text-right px-3 py-2 text-[9px] font-bold text-slate-400 uppercase">Importe</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {inv.items.map((item: any, i: number) => (
                            <tr key={i}>
                              <td className="px-3 py-1.5 text-[12px] font-bold text-slate-700">{typeof item === 'object' ? (item.qty || 1) : 1}</td>
                              <td className="px-3 py-1.5 text-[12px] text-slate-700">{typeof item === 'object' ? item.description : item}</td>
                              <td className="px-3 py-1.5 text-[12px] font-mono text-right text-slate-600">{typeof item === 'object' && item.total ? formatMoney(item.total) : '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Follow-ups Section */}
            <div className="p-5 flex-shrink-0">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> Seguimientos
              </p>
              {clientFollowUps.length === 0 ? (
                <p className="text-[13px] text-slate-400 italic">Sin seguimientos registrados</p>
              ) : clientFollowUps.map((fu: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${fu.status === 'pending' ? 'bg-amber-400' : fu.status === 'completed' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-slate-700">{fu.reason}</p>
                    {fu.observations && <p className="text-[11px] text-slate-400 italic truncate">{fu.observations}</p>}
                  </div>
                  <span className="text-[11px] text-slate-400 flex-shrink-0">{new Date(fu.scheduled_date).toLocaleDateString('es-AR')}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${fu.status === 'pending' ? 'bg-amber-100 text-amber-700' : fu.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {fu.status === 'pending' ? 'Pendiente' : fu.status === 'completed' ? 'Completado' : 'Cancelado'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ConfigTemplates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string|null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ shortcut: '/', name: '', category: 'General', body: '' });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    const { data } = await supabase.from('ng_templates').select('*').order('created_at', { ascending: false });
    setTemplates(data || []);
    setLoading(false);
  };

  const saveTemplate = async () => {
    const defaultTemplate = {
      shortcut: newTemplate.shortcut.startsWith('/') ? newTemplate.shortcut.toUpperCase() : `/${newTemplate.shortcut.toUpperCase()}`,
      body: newTemplate.body,
      category: newTemplate.category
    };
    await supabase.from('ng_templates').insert([defaultTemplate]);
    setIsModalOpen(false);
    fetchTemplates();
    setNewTemplate({ shortcut: '/', name: '', category: 'General', body: '' });
  };

  const categories = ['Todos', 'Documentación', 'Obra Social', 'Pagos', 'Confirmación', 'Información', 'DAMSU', 'General'];
  const filtered = templates.filter(t => 
    (filter === 'Todos' || t.category === filter) &&
    (t.shortcut.toLowerCase().includes(search.toLowerCase()) || t.body.toLowerCase().includes(search.toLowerCase()))
  );

  const { isSidebarOpen } = React.useContext(AppContext);

  return (
    <div className={`flex-1 transition-[margin] duration-300 ${isSidebarOpen ? 'ml-[280px]' : 'ml-[80px]'} min-h-screen bg-[#F8FAFC] flex flex-col`}>
      <TopBar title="Configuración" subtitle="Gallo Neumáticos" />
      <main className="px-10 py-6 w-full">
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-slate-800">Plantillas de Mensajes</h2>
              <p className="text-[13px] text-slate-500">Atajos rápidos con variables dinámicas · Se activan con "/" en el chat</p>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium text-slate-400 mr-4">{templates.length} plantillas</span>
            <button onClick={() => setIsModalOpen(true)} className="bg-[#EAB308] hover:bg-yellow-400 text-yellow-950 font-bold px-4 py-2.5 rounded-lg shadow-sm text-sm flex items-center transition-colors">
              + Nueva Plantilla
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden mb-6">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex-1 max-w-md relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar plantillas..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-[13px] font-medium text-slate-700 focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
              />
            </div>
            <div className="flex space-x-1.5 overflow-x-auto ml-4">
              {categories.map(c => (
                <button 
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`px-4 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-colors ${
                    filter === c ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? <p className="p-8 text-center text-slate-400">Cargando...</p> : 
             filtered.map(t => (
               <div key={t.id} className="group">
                 <div 
                   onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}
                   className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                 >
                   <div className="flex items-center flex-1">
                     <ChevronDown className={`w-4 h-4 text-slate-400 mr-3 transition-transform ${expandedId === t.id ? 'rotate-180' : ''}`} />
                     <span className="text-[13px] font-bold text-blue-600 mr-3 w-[120px] tracking-wider uppercase">{t.shortcut}</span>
                     <span className="text-[14px] font-bold text-slate-800 truncate uppercase">{t.shortcut.replace('/', '')}</span>
                   </div>
                   <div className="flex items-center space-x-4">
                     <span className="text-[11px] font-bold px-2 py-0.5 rounded text-slate-500 uppercase tracking-wider">{t.category}</span>
                     <span className="text-[11px] font-bold text-[#EAB308] bg-[#EAB308]/10 px-2 py-0.5 rounded flex items-center">
                       {'{ }'} {t.body.match(/\{\{.+?\}\}/g)?.length || 0}
                     </span>
                     <div className="flex items-center space-x-1">
                       <button className="p-1.5 text-blue-400 hover:bg-blue-50 rounded transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                       <button onClick={async (e) => { e.stopPropagation(); await supabase.from('ng_templates').delete().eq('id', t.id); fetchTemplates(); }} className="p-1.5 text-red-400 hover:bg-red-50 rounded transition-colors">
                         <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                       </button>
                     </div>
                   </div>
                 </div>
                 {expandedId === t.id && (
                   <div className="bg-slate-50 p-6 border-t border-slate-100 text-[13px] text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
                     {t.body}
                   </div>
                 )}
               </div>
             ))
            }
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-8">
          <div className="bg-[#FFFDF5] w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-full">
            <div className="px-8 py-5 border-b border-orange-100 flex justify-between items-center bg-orange-50/50">
              <h3 className="text-[#C2410C] text-[13px] font-bold tracking-wider flex items-center">
                <FileText className="w-4 h-4 mr-2" /> NUEVA PLANTILLA
              </h3>
              <button className="text-orange-800 text-[11px] font-bold border border-orange-200 px-3 py-1.5 rounded bg-white hover:bg-slate-50 transition-colors">
                Ver Preview
              </button>
            </div>
            
            <div className="p-8 flex-1 overflow-y-auto">
              <div className="flex space-x-6 mb-8">
                <div className="w-40">
                  <label className="block text-[10px] font-bold text-slate-500 tracking-wider mb-2 uppercase">Comando</label>
                  <input type="text" value={newTemplate.shortcut} onChange={e => setNewTemplate({...newTemplate, shortcut: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[14px] font-bold focus:border-orange-400 focus:outline-none" />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-500 tracking-wider mb-2 uppercase">Nombre de la Plantilla</label>
                  <input type="text" value={newTemplate.name} onChange={e => setNewTemplate({...newTemplate, name: e.target.value})} placeholder="Ej: Saludo inicial" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[14px] focus:border-orange-400 focus:outline-none" />
                </div>
                <div className="w-48">
                  <label className="block text-[10px] font-bold text-slate-500 tracking-wider mb-2 uppercase">Categoría</label>
                  <select value={newTemplate.category} onChange={e => setNewTemplate({...newTemplate, category: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[14px] bg-white focus:border-orange-400 focus:outline-none">
                    {categories.slice(1).map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-[10px] font-bold text-slate-500 tracking-wider mb-2 uppercase flex items-center">
                   <span className="mr-2">(+) Variables Disponibles</span> <span className="text-slate-300 font-normal"> — Click para insertar en el mensaje</span>
                </label>
                <div className="bg-yellow-50/50 border border-yellow-100 rounded-lg p-3 text-[12px] text-yellow-800 italic mb-3">
                  ⚡ Las variables son campos que se reemplazan automáticamente por los datos reales del cliente al usar la plantilla. Ej: {'{nombre}'} se convierte en el nombre.
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] font-bold">
                  {['nombre', 'productos', 'fecha', 'importe'].map(vr => (
                    <button key={vr} onClick={() => setNewTemplate({...newTemplate, body: newTemplate.body + `{{${vr}}}`})} className="bg-white border border-slate-200 px-3 py-1.5 rounded text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                      {`{${vr}}`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 tracking-wider mb-2 uppercase">Mensaje</label>
                <textarea 
                  value={newTemplate.body} 
                  onChange={e => setNewTemplate({...newTemplate, body: e.target.value})} 
                  placeholder="Escribí el mensaje de la plantilla... Usá las variables de arriba para personalizar."
                  className="w-full h-[200px] border border-slate-200 rounded-lg p-4 text-[14px] text-slate-700 resize-none focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-500/10"
                ></textarea>
                <div className="flex justify-between items-center mt-2 text-[11px] text-slate-400 font-medium">
                  <span>{newTemplate.body.length} caracteres</span>
                  <span>{newTemplate.body.match(/\{\{.+?\}\}/g)?.length || 0} variables</span>
                </div>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-slate-100 bg-orange-50/30 flex justify-end items-center space-x-3">
              <button onClick={() => setIsModalOpen(false)} className="text-[13px] font-bold text-slate-500 hover:text-slate-700 px-4 py-2">Cancelar</button>
              <button onClick={saveTemplate} className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-2.5 rounded-lg text-[13px] font-bold flex items-center shadow-sm transition-colors">
                <FileText className="w-4 h-4 mr-2" />
                Guardar Plantilla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Estilos globales oscuros inyectados (Tema Azul Oscuro Gallo)
const darkThemeCss = `
  html.dark body, html.dark .bg-\\[\\#F8FAFC\\] { background-color: #01132B !important; } /* Fondo Base (Azul Noche Profundo) */
  html.dark .bg-white { background-color: #03214A !important; border-color: #073570 !important; color: #ffffff !important; box-shadow: none !important; } 
  html.dark .text-slate-800, html.dark .text-slate-900 { color: #ffffff !important; }
  html.dark .text-slate-600, html.dark .text-slate-700 { color: #A4BCE1 !important; }
  html.dark .text-slate-400, html.dark .text-slate-500 { color: #6088C3 !important; }
  html.dark .bg-slate-50, html.dark .bg-slate-100 { background-color: #052654 !important; border-color: #073570 !important; }
  html.dark .border-slate-100, html.dark .border-slate-200, html.dark .border-slate-200\\/60 { border-color: #073570 !important; }
  html.dark header, html.dark .bg-white\\/80 { background-color: rgba(3, 33, 74, 0.85) !important; backdrop-filter: blur(12px) !important; border-bottom-color: #073570 !important; }
  html.dark input, html.dark select, html.dark textarea { background-color: #052654 !important; border-color: #073570 !important; color: #ffffff !important; }
  html.dark input::placeholder { color: #6088C3 !important; }
  html.dark .bg-blue-50 { background-color: #0A3978 !important; }
  html.dark .text-blue-600, html.dark .text-blue-800 { color: #5B9BFF !important; }
  html.dark .bg-[#090E17] { background-color: #010C1A !important; border-color: #073570 !important;} /* Ajuste estricto panel derecho */
  html.dark .border-b.border-slate-50 { border-color: #073570 !important; }
  html.dark .hover\\:bg-slate-50:hover { background-color: #0A3978 !important; }
`;

function SystemModal({ 
  isOpen, title, message, type, onClose 
}: { 
  isOpen: boolean, title: string, message: string, type: ModalType, onClose: () => void 
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && (e.key === 'Enter' || e.key === 'Escape')) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const bgClasses = {
    'error': 'bg-red-50 text-red-600 border-red-200',
    'success': 'bg-green-50 text-green-600 border-green-200',
    'info': 'bg-blue-50 text-blue-600 border-blue-200'
  };

  const Icon = {
    'error': AlertTriangle,
    'success': CheckCircle,
    'info': Info
  }[type];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className={`px-6 py-4 border-b flex items-center justify-between ${bgClasses[type]}`}>
          <div className="flex items-center">
            <Icon className="w-5 h-5 mr-2" />
            <h3 className="font-bold text-[16px] uppercase tracking-wide">{title}</h3>
          </div>
          <button onClick={onClose} className="hover:opacity-70 transition-opacity p-1">
            <span className="sr-only">Close</span>
            <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="p-6">
          <p className="text-slate-600 text-[14px] leading-relaxed whitespace-pre-wrap">{message}</p>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button onClick={async () => {
            // Log issue to DB
            supabase.from('ng_error_logs').insert([{ title, message, type }]).then();
            
            // Send WhatsApp to admin via BuilderBot
            const builderBotUrl = import.meta.env.VITE_BUILDERBOT_API_URL;
            const builderBotKey = import.meta.env.VITE_BUILDERBOT_API_KEY;
            if (builderBotUrl && builderBotKey) {
              try {
                const alertMsg = `⚠️ *REPORTE DE PROBLEMA*\n\n📋 *Título:* ${title}\n💬 *Detalle:* ${message}\n🏷️ *Tipo:* ${type}\n📅 *Fecha:* ${new Date().toLocaleString('es-AR')}`;
                await fetch(`${builderBotUrl}/messages/send`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${builderBotKey}` },
                  body: JSON.stringify({ number: '5492645438114', message: alertMsg })
                });
              } catch (err) { console.error('Error sending alert to admin:', err); }
            }
            onClose();
          }} className="text-[11px] font-medium text-slate-400 hover:text-blue-600 underline">
            Reportar problema
          </button>
          <button onClick={onClose} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-sm cursor-pointer border-none outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [modalState, setModalState] = useState<{isOpen: boolean, title: string, message: string, type: ModalType}>({
    isOpen: false, title: '', message: '', type: 'info'
  });

  const showSystemModal = (title: string, message: string, type: ModalType = 'info') => {
    setModalState({ isOpen: true, title, message, type });
  };

  useEffect(() => {
    // Inyectamos nuestro theme manager
    const style = document.createElement('style');
    style.innerHTML = darkThemeCss;
    document.head.appendChild(style);
    
    // Asignamos la funcion global
    (window as any).toggleTheme = () => {
      document.documentElement.classList.toggle('dark');
    };
    
    return () => {
      document.head.removeChild(style);
      delete (window as any).toggleTheme;
    };
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <AppContext.Provider value={{ isSidebarOpen, toggleSidebar, showSystemModal }}>
      <div className="flex h-screen overflow-x-hidden overflow-y-auto font-sans selection:bg-blue-100 transition-colors duration-300 relative bg-[#000]">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/subir" element={<UploadInvoice />} />
          <Route path="/mensajeria" element={<Messenger />} />
          <Route path="/clientes" element={<Clients />} />
          <Route path="/seguimientos" element={<FollowUps />} />
          <Route path="/configuracion" element={<ConfigTemplates />} />
        </Routes>
        <SystemModal 
          isOpen={modalState.isOpen} 
          title={modalState.title} 
          message={modalState.message} 
          type={modalState.type} 
          onClose={() => setModalState(s => ({ ...s, isOpen: false }))} 
        />
      </div>
    </AppContext.Provider>
  );
}

export default App;
