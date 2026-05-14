// ============================================================
// App HIJOS - Versión Firebase
// Archivo: src/App.jsx
// ============================================================

import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";


// 🔥 TUS CREDENCIALES DE FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyCSK0q0NE4SCJop_-e9RJ9YvOFxGfQOxAk",
  authDomain: "app-familia-2ebff.firebaseapp.com",
  projectId: "app-familia-2ebff",
  storageBucket: "app-familia-2ebff.firebasestorage.app",
  messagingSenderId: "675531086251",
  appId: "1:675531086251:web:4ed44dec0d7c032e6d5aee",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// ============================================================
// DATOS INICIALES - Historial completo del pediatra
// ============================================================
const DATOS_INICIALES = {
  gennaro: {
    fiebre: [], comidas: [], vacunas: [], sueño: [],
    medico: [
      {id:30,fecha:"2026-02-09",medico:"Dr. Santiago Rossi",motivo:"Control 24 meses",peso:"14.8",talla:"90",nota:"Pautas 24-30m: se quita zapatos, apila cubos, dice frases completas."},
      {id:29,fecha:"2025-09-15",medico:"Dr. Santiago Rossi",motivo:"Control 21 meses",peso:"13.05",talla:"85",nota:"Pautas 18-24m: dice frases de dos palabras, patea pelota."},
      {id:28,fecha:"2025-08-11",medico:"Dr. Santiago Rossi",motivo:"Control 18 meses",peso:"12.8",talla:"84",nota:"Perímetro cefálico: 38.5 cm."},
      {id:27,fecha:"2025-05-05",medico:"Dr. Santiago Rossi",motivo:"Control 15 meses",peso:"12.1",talla:"81",nota:"Perímetro cefálico: 48 cm."},
      {id:26,fecha:"2025-02-03",medico:"Dr. Santiago Rossi",motivo:"Control 11 meses",peso:"11.3",talla:"77",nota:"Perímetro cefálico: 47 cm."},
      {id:25,fecha:"2024-09-23",medico:"Dr. Santiago Rossi",motivo:"Control 7 meses",peso:"10.2",talla:"71",nota:"Perímetro cefálico: 45.5 cm."},
      {id:24,fecha:"2024-07-15",medico:"Dr. Santiago Rossi",motivo:"Control 5 meses",peso:"8.9",talla:"66",nota:"Perímetro cefálico: 44 cm."},
      {id:23,fecha:"2024-06-10",medico:"Dr. Santiago Rossi",motivo:"Control 4 meses",peso:"8",talla:"64",nota:"Perímetro cefálico: 42.5 cm."},
      {id:22,fecha:"2024-05-13",medico:"Dr. Santiago Rossi",motivo:"Control 3 meses",peso:"7.15",talla:"61",nota:"Perímetro cefálico: 41.5 cm."},
      {id:21,fecha:"2024-04-15",medico:"Dr. Santiago Rossi",motivo:"Control 2 meses",peso:"6",talla:"59.5",nota:"Perímetro cefálico: 39.5 cm."},
      {id:20,fecha:"2024-03-18",medico:"Dr. Santiago Rossi",motivo:"Control 1 mes",peso:"4.7",talla:"54",nota:"Perímetro cefálico: 38 cm."},
      {id:19,fecha:"2024-03-04",medico:"Dr. Santiago Rossi",motivo:"Control 21 días",peso:"4",talla:"",nota:""},
      {id:18,fecha:"2024-02-26",medico:"Dr. Santiago Rossi",motivo:"Control 15 días",peso:"3.67",talla:"",nota:""},
      {id:17,fecha:"2024-02-19",medico:"Dr. Santiago Rossi",motivo:"Control 8 días",peso:"3.35",talla:"",nota:""},
    ],
    crecimiento: [
      {id:16,fecha:"2026-02-09",peso:"14.8",talla:"90",nota:"Control 24m."},
      {id:15,fecha:"2025-09-15",peso:"13.05",talla:"85",nota:"Control 21m."},
      {id:14,fecha:"2025-08-11",peso:"12.8",talla:"84",nota:"Control 18m."},
      {id:13,fecha:"2025-05-05",peso:"12.1",talla:"81",nota:"Control 15m."},
      {id:12,fecha:"2025-02-03",peso:"11.3",talla:"77",nota:"Control 11m."},
      {id:11,fecha:"2024-09-23",peso:"10.2",talla:"71",nota:"Control 7m."},
      {id:10,fecha:"2024-07-15",peso:"8.9",talla:"66",nota:"Control 5m."},
      {id:9,fecha:"2024-06-10",peso:"8",talla:"64",nota:"Control 4m."},
      {id:8,fecha:"2024-05-13",peso:"7.15",talla:"61",nota:"Control 3m."},
      {id:7,fecha:"2024-04-15",peso:"6",talla:"59.5",nota:"Control 2m."},
      {id:6,fecha:"2024-03-18",peso:"4.7",talla:"54",nota:"Control 1m."},
      {id:5,fecha:"2024-03-04",peso:"4",talla:"",nota:"21 días."},
      {id:4,fecha:"2024-02-26",peso:"3.67",talla:"",nota:"15 días."},
      {id:3,fecha:"2024-02-19",peso:"3.35",talla:"",nota:"8 días."},
    ],
  },
  francesco: {
    fiebre: [], comidas: [], vacunas: [], sueño: [],
    medico: [
      {id:46,fecha:"2026-05-13",medico:"Dr. Santiago Rossi",motivo:"Control 6 meses",peso:"8.1",talla:"67.5",nota:"Perímetro cefálico: 43 cm."},
      {id:45,fecha:"2026-04-08",medico:"Dr. Santiago Rossi",motivo:"Control 4 meses",peso:"7.6",talla:"66",nota:"Perímetro cefálico: 43 cm."},
      {id:44,fecha:"2026-02-09",medico:"Dr. Santiago Rossi",motivo:"Control 3 meses",peso:"6.3",talla:"60.5",nota:"Perímetro cefálico: 40 cm."},
      {id:43,fecha:"2026-01-07",medico:"Dr. Santiago Rossi",motivo:"Control 1 mes",peso:"5.2",talla:"58",nota:"Perímetro cefálico: 40 cm."},
      {id:42,fecha:"2025-11-17",medico:"Dr. Santiago Rossi",motivo:"Control 6 días",peso:"2.95",talla:"",nota:"Primer control neonatal."},
    ],
    crecimiento: [
      {id:41,fecha:"2026-05-13",peso:"8.1",talla:"67.5",nota:"Control 6m."},
      {id:40,fecha:"2026-04-08",peso:"7.6",talla:"66",nota:"Control 4m."},
      {id:39,fecha:"2026-02-09",peso:"6.3",talla:"60.5",nota:"Control 3m."},
      {id:38,fecha:"2026-01-07",peso:"5.2",talla:"58",nota:"Control 1m."},
      {id:37,fecha:"2025-11-17",peso:"2.95",talla:"",nota:"6 días."},
    ],
  },
};

const DEFAULT_HIJOS = [
  { id: "gennaro", nombre: "Gennaro", nacimiento: "2023-02-11", color: "#4F8EF7", colorLight: "#EBF2FF", emoji: "👦", foto: null },
  { id: "francesco", nombre: "Francesco", nacimiento: "2024-11-11", color: "#F7824F", colorLight: "#FFF2EB", emoji: "👶", foto: null },
];

function calcularEdad(nac) {
  const hoy = new Date(), n = new Date(nac);
  const m = (hoy.getFullYear()-n.getFullYear())*12+(hoy.getMonth()-n.getMonth());
  if(m<12) return `${m} meses`;
  const a=Math.floor(m/12),r=m%12;
  return r>0?`${a}a ${r}m`:`${a} años`;
}
function diasParaCumple(nac) {
  const hoy=new Date(), n=new Date(nac);
  const p=new Date(hoy.getFullYear(),n.getMonth(),n.getDate());
  if(p<hoy) p.setFullYear(hoy.getFullYear()+1);
  const d=Math.ceil((p-hoy)/(864e5));
  return d===0?"¡Hoy es su cumple! 🎂":d===1?"¡Mañana! 🎂":`Cumple en ${d} días`;
}
function hoyISO(){ return new Date().toISOString(); }
function inputFechaHoy(){ const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
function formatHora(iso){ return new Date(iso).toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"}); }
function formatFecha(iso){ return new Date(iso).toLocaleDateString("es-AR",{day:"2-digit",month:"2-digit",year:"numeric"}); }

const TEMP_RANGES=[
  {max:37.4,label:"Normal",color:"#22c55e",bg:"#f0fdf4"},
  {max:37.9,label:"Febrícula",color:"#f59e0b",bg:"#fffbeb"},
  {max:999,label:"Fiebre",color:"#ef4444",bg:"#fef2f2"},
];
function getTempStatus(t){ return TEMP_RANGES.find(r=>t<=r.max)||TEMP_RANGES[2]; }

const MEDICAMENTOS=["Ibuprofeno","Paracetamol","Otro"];
const COMIDAS=["Leche materna","Mamadera","Puré","Fruta","Verdura","Carne","Cereal","Sopa","Yogur","Otro"];
const SINTOMAS=["Tos","Vómito","Diarrea","Congestión","Sin apetito","Irritable","Erupción"];
const VACUNAS=["BCG","Hepatitis B","Pentavalente","Antipoliomielítica","Rotavirus","Neumococo","Meningococo","Triple viral","Varicela","Hepatitis A","Triple bacteriana","Influenza","Otra"];
const MODULOS=[
  {id:"fiebre",label:"Fiebre & Síntomas",icon:"🌡️"},
  {id:"comidas",label:"Alimentación",icon:"🍽️"},
  {id:"vacunas",label:"Vacunas",icon:"💉"},
  {id:"medico",label:"Médico & Turnos",icon:"👨‍⚕️"},
  {id:"sueño",label:"Sueño",icon:"😴"},
  {id:"crecimiento",label:"Peso & Talla",icon:"📈"},
];

const GUIA_ALIMENTACION = {
  "6 meses": { color:"#F7824F", items:["Puré de zapallo, zanahoria, calabaza (con aceite)","Cereales de arroz o maíz, polenta","Banana pisada, manzana rallada, puré de durazno o pera"] },
  "7-9 meses": { color:"#f59e0b", items:["Puré de carne de vaca o pollo sin piel","Cereales de trigo, avena, fideos cabello de ángel","Condimentar con aceite, queso crema, ricota"] },
  "10-12 meses": { color:"#22c55e", items:["Otras carnes y pastas","Guisos livianos","Frutas y vegetales trozados","Pan fresco, galletitas Vocación o Manón"] },
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function App() {
  const [hijos, setHijos] = useState(DEFAULT_HIJOS);
  const [datos, setDatos] = useState(DATOS_INICIALES);
  const [familiaFoto, setFamiliaFoto] = useState(null);
  const [hijo, setHijo] = useState(null);
  const [modulo, setModulo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Escuchar cambios en Firebase en tiempo real
  useEffect(() => {
    const unsubDatos = onSnapshot(doc(db, "app", "datos"), (snap) => {
      if (snap.exists()) setDatos(snap.data());
      setCargando(false);
    }, () => setCargando(false));

    const unsubPerfiles = onSnapshot(doc(db, "app", "perfiles"), (snap) => {
      if (snap.exists()) {
        setHijos(snap.data().hijos || DEFAULT_HIJOS);
        setFamiliaFoto(snap.data().familiaFoto || null);
      }
    });

    return () => { unsubDatos(); unsubPerfiles(); };
  }, []);

  const guardarDatos = async (nuevosDatos) => {
    setDatos(nuevosDatos);
    setGuardando(true);
    try {
      await setDoc(doc(db, "app", "datos"), nuevosDatos);
    } catch(e) { console.error(e); }
    setGuardando(false);
  };

  const guardarPerfiles = async (nuevosHijos, nuevaFoto) => {
    const h = nuevosHijos || hijos;
    const f = nuevaFoto !== undefined ? nuevaFoto : familiaFoto;
    setHijos(h);
    if(nuevaFoto !== undefined) setFamiliaFoto(f);
    try {
      await setDoc(doc(db, "app", "perfiles"), { hijos: h, familiaFoto: f });
    } catch(e) { console.error(e); }
  };

  const subirFoto = async (id, base64) => {
    const nuevosHijos = hijos.map(h => h.id === id ? {...h, foto: base64} : h);
    guardarPerfiles(nuevosHijos, undefined);
  };

  const subirFotoFamilia = async (base64) => {
    guardarPerfiles(undefined, base64);
  };

  const agregarDato = (mod, item) => {
    const n = {...datos};
    n[hijo][mod] = [{id: Date.now(), ...item}, ...n[hijo][mod]];
    guardarDatos(n);
  };

  const borrarDato = (mod, id) => {
    const n = {...datos};
    n[hijo][mod] = n[hijo][mod].filter(x => x.id !== id);
    guardarDatos(n);
  };

  const hijoObj = hijos.find(h => h.id === hijo);

  if (cargando) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",flexDirection:"column",gap:16}}>
      <div style={{fontSize:40}}>👨‍👦‍👦</div>
      <div style={{fontFamily:"system-ui",fontSize:16,color:"#888"}}>Cargando App HIJOS...</div>
    </div>
  );

  if (!hijo) return <Inicio hijos={hijos} setHijo={setHijo} datos={datos} familiaFoto={familiaFoto} subirFotoFamilia={subirFotoFamilia} subirFoto={subirFoto} guardando={guardando}/>;
  if (!modulo) return <MenuHijo hijo={hijoObj} setModulo={setModulo} setHijo={setHijo} datos={datos[hijo]} subirFoto={subirFoto} />;

  const props = {
    hijo: hijoObj,
    datos: datos[hijo][modulo] || [],
    agregar: (i) => agregarDato(modulo, i),
    borrar: (id) => borrarDato(modulo, id),
    guardando,
  };

  return (
    <div style={{fontFamily:"system-ui,sans-serif",maxWidth:420,margin:"0 auto",paddingBottom:80}}>
      <Header hijo={hijoObj} titulo={MODULOS.find(m=>m.id===modulo)?.icon+" "+MODULOS.find(m=>m.id===modulo)?.label} onBack={()=>setModulo(null)} />
      {modulo==="fiebre" && <ModFiebre {...props}/>}
      {modulo==="comidas" && <ModComidas {...props}/>}
      {modulo==="vacunas" && <ModVacunas {...props}/>}
      {modulo==="medico" && <ModMedico {...props}/>}
      {modulo==="sueño" && <ModSueno {...props}/>}
      {modulo==="crecimiento" && <ModCrecimiento {...props}/>}
    </div>
  );
}

// ============================================================
// COMPONENTES UI (igual que antes, resumidos)
// ============================================================

function comprimirFoto(file, maxSize=400) {
  return new Promise(resolve => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let w = img.width, h = img.height;
      if(w > h) { if(w > maxSize) { h = h*maxSize/w; w = maxSize; } }
      else { if(h > maxSize) { w = w*maxSize/h; h = maxSize; } }
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

function FotoUpload({foto, onFoto, size=64, emoji, color}) {
  const ref = useRef();
  const handleFile = async e => {
    const f = e.target.files[0];
    if(!f) return;
    const comprimida = await comprimirFoto(f);
    onFoto(comprimida);
  };
  return (
    <div onClick={()=>ref.current.click()} style={{width:size,height:size,borderRadius:"50%",background:color||"#eee",cursor:"pointer",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.4,flexShrink:0,border:"2.5px dashed rgba(255,255,255,0.5)"}}>
      {foto ? <img src={foto} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="foto"/> : <span>{emoji||"📷"}</span>}
      <input ref={ref} type="file" accept="image/*" style={{display:"none"}} onChange={handleFile}/>
    </div>
  );
}

function Badge({children,color,bg}){
  return <span style={{fontSize:12,background:bg,color,padding:"3px 10px",borderRadius:20,fontWeight:600}}>{children}</span>;
}

function Card({children,style}){
  return <div style={{background:"#fff",borderRadius:14,padding:"16px",border:"1px solid #f0f0f0",marginBottom:10,...style}}>{children}</div>;
}

function Inp({label,...props}){
  return (
    <div style={{marginBottom:12}}>
      {label&&<label style={{fontSize:12,color:"#888",display:"block",marginBottom:4}}>{label}</label>}
      <input style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"1.5px solid #e5e5e5",fontSize:15,boxSizing:"border-box",outline:"none"}} {...props}/>
    </div>
  );
}

function Btn({children,onClick,color="#4F8EF7",full,secondary}){
  return <button onClick={onClick} style={{background:secondary?"#f5f5f5":color,color:secondary?"#555":"#fff",border:"none",borderRadius:12,padding:"12px 20px",fontWeight:700,fontSize:15,cursor:"pointer",width:full?"100%":"auto"}}>{children}</button>;
}

function Chip({children,active,onClick,color}){
  return <button onClick={onClick} style={{padding:"5px 12px",borderRadius:20,border:`1.5px solid ${active?color:"#e5e5e5"}`,background:active?color:"#fff",color:active?"#fff":"#555",fontSize:13,cursor:"pointer",fontWeight:active?600:400}}>{children}</button>;
}

function Empty({children}){
  return <div style={{textAlign:"center",color:"#bbb",padding:"32px 0",fontSize:14}}>{children}</div>;
}

function SectionLabel({children,color}){
  return <div style={{fontSize:12,fontWeight:700,color,marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>{children}</div>;
}

function Header({hijo,titulo,onBack}){
  return (
    <div style={{background:hijo.color,padding:"16px 20px",display:"flex",alignItems:"center",gap:12}}>
      <button onClick={onBack} style={{background:"rgba(255,255,255,0.25)",border:"none",borderRadius:10,width:36,height:36,cursor:"pointer",fontSize:18,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
      <div style={{flex:1}}>
        <div style={{color:"rgba(255,255,255,0.8)",fontSize:12}}>{hijo.emoji} {hijo.nombre}</div>
        <div style={{color:"#fff",fontWeight:700,fontSize:17}}>{titulo}</div>
      </div>
    </div>
  );
}

function Inicio({hijos,setHijo,datos,familiaFoto,subirFotoFamilia,subirFoto,guardando}){
  return (
    <div style={{fontFamily:"system-ui,sans-serif",maxWidth:420,margin:"0 auto",background:"#f8f9fb",minHeight:"100vh"}}>
      <div style={{background:"linear-gradient(135deg,#4F8EF7,#a78bfa)",padding:"28px 20px 24px"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <FotoUpload foto={familiaFoto} onFoto={subirFotoFamilia} size={56} emoji="👨‍👩‍👦" color="rgba(255,255,255,0.2)"/>
          <div>
            <h1 style={{margin:0,fontSize:26,fontWeight:800,color:"#fff"}}>App HIJOS</h1>
            <p style={{margin:"2px 0 0",color:"rgba(255,255,255,0.8)",fontSize:12}}>
              {guardando ? "💾 Guardando..." : "✅ Sincronizado con Marina"}
            </p>
          </div>
        </div>
      </div>
      <div style={{padding:"20px 16px"}}>
        {hijos.map(h => {
          const d = datos[h.id] || {};
          const ultimaTemp = d.fiebre?.[0];
          const proxTurno = d.medico?.filter(x=>x.fecha>=inputFechaHoy()).sort((a,b)=>a.fecha>b.fecha?1:-1)[0];
          const ultimoPeso = d.crecimiento?.[0];
          return (
            <div key={h.id} onClick={()=>setHijo(h.id)} style={{background:"#fff",borderRadius:20,padding:"18px 20px",marginBottom:14,cursor:"pointer",boxShadow:"0 4px 20px rgba(0,0,0,0.07)",border:`2px solid ${h.color}20`}}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:12}}>
                <FotoUpload foto={h.foto} onFoto={foto=>subirFoto(h.id,foto)} size={60} emoji={h.emoji} color={h.colorLight}/>
                <div style={{flex:1}}>
                  <div style={{fontWeight:800,fontSize:21,color:"#1a1a2e"}}>{h.nombre}</div>
                  <div style={{fontSize:13,color:"#888"}}>{calcularEdad(h.nacimiento)}</div>
                  <div style={{fontSize:12,color:h.color,fontWeight:600}}>{diasParaCumple(h.nacimiento)}</div>
                </div>
                <span style={{color:"#ddd",fontSize:22}}>›</span>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {ultimaTemp&&<Badge color={getTempStatus(ultimaTemp.temp).color} bg={getTempStatus(ultimaTemp.temp).bg}>{getTempStatus(ultimaTemp.temp).label} {ultimaTemp.temp}°</Badge>}
                {ultimoPeso&&<Badge color={h.color} bg={h.colorLight}>⚖️ {ultimoPeso.peso}kg</Badge>}
                {proxTurno&&<Badge color="#4F8EF7" bg="#EBF2FF">👨‍⚕️ {proxTurno.fecha?formatFecha(proxTurno.fecha+"T12:00:00"):""}</Badge>}
                {!ultimaTemp&&!proxTurno&&!ultimoPeso&&<span style={{fontSize:12,color:"#bbb"}}>Tocá para ver el historial</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MenuHijo({hijo,setModulo,setHijo,datos,subirFoto}){
  return (
    <div style={{fontFamily:"system-ui,sans-serif",maxWidth:420,margin:"0 auto",background:"#f8f9fb",minHeight:"100vh"}}>
      <div style={{background:hijo.color,padding:"24px 20px 28px"}}>
        <button onClick={()=>setHijo(null)} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:10,padding:"6px 14px",color:"#fff",cursor:"pointer",fontSize:13,marginBottom:14}}>← Inicio</button>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <FotoUpload foto={hijo.foto} onFoto={foto=>subirFoto(hijo.id,foto)} size={72} emoji={hijo.emoji} color="rgba(255,255,255,0.25)"/>
          <div>
            <div style={{color:"#fff",fontWeight:800,fontSize:26}}>{hijo.nombre}</div>
            <div style={{color:"rgba(255,255,255,0.85)",fontSize:14}}>{calcularEdad(hijo.nacimiento)}</div>
            <div style={{color:"rgba(255,255,255,0.9)",fontSize:13,fontWeight:600,marginTop:2}}>{diasParaCumple(hijo.nacimiento)}</div>
          </div>
        </div>
      </div>
      <div style={{padding:"16px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {MODULOS.map(m => {
            const count = datos[m.id]?.length||0;
            return (
              <div key={m.id} onClick={()=>setModulo(m.id)} style={{background:"#fff",borderRadius:16,padding:"18px 14px",cursor:"pointer",boxShadow:"0 2px 10px rgba(0,0,0,0.05)",border:"1px solid #f0f0f0"}}>
                <div style={{fontSize:30,marginBottom:8}}>{m.icon}</div>
                <div style={{fontWeight:700,fontSize:14,color:"#1a1a2e",lineHeight:1.2}}>{m.label}</div>
                <div style={{fontSize:12,color:"#aaa",marginTop:4}}>{count} registro{count!==1?"s":""}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ModFiebre({hijo,datos,agregar,borrar}){
  const [form,setForm]=useState({temp:"",nota:"",meds:[],sintomas:[]});
  const [open,setOpen]=useState(false);
  const s=t=>setForm(f=>({...f,...t}));
  const toggle=(arr,key,val)=>s({[key]:arr.includes(val)?arr.filter(x=>x!==val):[...arr,val]});
  const guardar=()=>{
    if(!form.temp||isNaN(form.temp))return;
    agregar({temp:parseFloat(form.temp),nota:form.nota,meds:form.meds,sintomas:form.sintomas,ts:hoyISO()});
    setForm({temp:"",nota:"",meds:[],sintomas:[]});setOpen(false);
  };
  return (
    <div style={{padding:16}}>
      {datos.length>0&&(
        <Card style={{background:"#fafafa",marginBottom:14}}>
          <div style={{fontSize:12,color:"#888",marginBottom:8}}>Últimas temperaturas</div>
          <div style={{display:"flex",gap:6,alignItems:"flex-end",height:70}}>
            {datos.slice(0,6).slice().reverse().map(r=>{
              const h=Math.max(((r.temp-36)/4)*60,8);
              const st=getTempStatus(r.temp);
              return (
                <div key={r.id} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                  <div style={{fontSize:10,color:st.color,fontWeight:700}}>{r.temp}</div>
                  <div style={{width:"100%",height:h,background:st.color,borderRadius:4,opacity:.85}}/>
                  <div style={{fontSize:9,color:"#aaa"}}>{formatHora(r.ts)}</div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
      <Btn full color={hijo.color} onClick={()=>setOpen(!open)}>+ Registrar temperatura</Btn>
      {open&&(
        <Card style={{marginTop:10}}>
          <Inp label="Temperatura (°C)" type="number" step="0.1" min="35" max="42" placeholder="38.5" value={form.temp} onChange={e=>s({temp:e.target.value})}/>
          <div style={{marginBottom:12}}>
            <label style={{fontSize:12,color:"#888",display:"block",marginBottom:6}}>Síntomas</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{SINTOMAS.map(x=><Chip key={x} active={form.sintomas.includes(x)} onClick={()=>toggle(form.sintomas,"sintomas",x)} color={hijo.color}>{x}</Chip>)}</div>
          </div>
          <div style={{marginBottom:12}}>
            <label style={{fontSize:12,color:"#888",display:"block",marginBottom:6}}>Medicación</label>
            <div style={{display:"flex",gap:6}}>{MEDICAMENTOS.map(x=><Chip key={x} active={form.meds.includes(x)} onClick={()=>toggle(form.meds,"meds",x)} color={hijo.color}>{x}</Chip>)}</div>
          </div>
          <Inp label="Nota" placeholder="Ej: vomitó, comió poco..." value={form.nota} onChange={e=>s({nota:e.target.value})}/>
          <div style={{display:"flex",gap:8}}><Btn onClick={guardar} color={hijo.color} full>Guardar</Btn><Btn onClick={()=>setOpen(false)} secondary>Cancelar</Btn></div>
        </Card>
      )}
      <div style={{marginTop:16}}>
        {datos.map(r=>{
          const st=getTempStatus(r.temp);
          return (
            <Card key={r.id}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:22,fontWeight:800,color:st.color}}>{r.temp}°C</span>
                    <Badge color={st.color} bg={st.bg}>{st.label}</Badge>
                  </div>
                  <div style={{fontSize:12,color:"#aaa",marginTop:2}}>{formatFecha(r.ts)} {formatHora(r.ts)}</div>
                  {r.sintomas?.length>0&&<div style={{fontSize:12,color:"#666",marginTop:4}}>{r.sintomas.join(", ")}</div>}
                  {r.meds?.length>0&&<div style={{fontSize:12,color:hijo.color,marginTop:2}}>💊 {r.meds.join(", ")}</div>}
                  {r.nota&&<div style={{fontSize:12,color:"#888",fontStyle:"italic",marginTop:2}}>{r.nota}</div>}
                </div>
                <button onClick={()=>borrar(r.id)} style={{background:"none",border:"none",color:"#ddd",cursor:"pointer",fontSize:18}}>×</button>
              </div>
            </Card>
          );
        })}
        {datos.length===0&&<Empty>Sin registros de temperatura</Empty>}
      </div>
    </div>
  );
}

function ModComidas({hijo,datos,agregar,borrar}){
  const [form,setForm]=useState({tipo:"",cantidad:"",nota:""});
  const [open,setOpen]=useState(false);
  const [verGuia,setVerGuia]=useState(false);
  const s=t=>setForm(f=>({...f,...t}));
  const guardar=()=>{if(!form.tipo)return;agregar({tipo:form.tipo,cantidad:form.cantidad,nota:form.nota,ts:hoyISO()});setForm({tipo:"",cantidad:"",nota:""});setOpen(false);};
  const esFrancesco=hijo.id==="francesco";
  const hoy=datos.filter(d=>d.ts&&d.ts.startsWith(inputFechaHoy()));
  return (
    <div style={{padding:16}}>
      {hoy.length>0&&<Card style={{background:"#fafafa",marginBottom:14}}><div style={{fontSize:12,color:"#888",marginBottom:6}}>Hoy ({hoy.length} veces)</div><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{hoy.map(r=><Badge key={r.id} color={hijo.color} bg={hijo.colorLight}>{r.tipo}</Badge>)}</div></Card>}
      {esFrancesco&&(
        <div style={{marginBottom:14}}>
          <button onClick={()=>setVerGuia(!verGuia)} style={{width:"100%",padding:"12px 16px",background:"#FFF2EB",border:"1.5px solid #F7824F40",borderRadius:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontWeight:700,color:"#F7824F",fontSize:14}}>📋 Guía del Dr. Rossi</span>
            <span style={{color:"#F7824F"}}>{verGuia?"▲":"▼"}</span>
          </button>
          {verGuia&&(
            <Card style={{marginTop:6,borderTop:"3px solid #F7824F"}}>
              {Object.entries(GUIA_ALIMENTACION).map(([etapa,data])=>(
                <div key={etapa} style={{marginBottom:14}}>
                  <div style={{fontSize:13,fontWeight:700,color:data.color,marginBottom:6}}>{etapa}</div>
                  {data.items.map((item,i)=><div key={i} style={{fontSize:13,color:"#555",padding:"3px 0",paddingLeft:12,borderLeft:`2px solid ${data.color}40`}}>• {item}</div>)}
                </div>
              ))}
              <div style={{padding:10,background:"#fffbeb",borderRadius:8,fontSize:12,color:"#92400e"}}>⚠️ No agregar sal ni azúcar. No dar miel hasta el año y medio.</div>
            </Card>
          )}
        </div>
      )}
      <Btn full color={hijo.color} onClick={()=>setOpen(!open)}>+ Registrar comida</Btn>
      {open&&(
        <Card style={{marginTop:10}}>
          <div style={{marginBottom:12}}>
            <label style={{fontSize:12,color:"#888",display:"block",marginBottom:6}}>¿Qué comió?</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{COMIDAS.map(x=><Chip key={x} active={form.tipo===x} onClick={()=>s({tipo:x})} color={hijo.color}>{x}</Chip>)}</div>
          </div>
          <Inp label="Cantidad" placeholder="200ml, medio plato..." value={form.cantidad} onChange={e=>s({cantidad:e.target.value})}/>
          <Inp label="Nota" placeholder="Le gustó mucho, no quiso terminar..." value={form.nota} onChange={e=>s({nota:e.target.value})}/>
          <div style={{display:"flex",gap:8}}><Btn onClick={guardar} color={hijo.color} full>Guardar</Btn><Btn onClick={()=>setOpen(false)} secondary>Cancelar</Btn></div>
        </Card>
      )}
      <div style={{marginTop:16}}>
        {datos.map(r=>(
          <Card key={r.id}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <div>
                <div style={{fontWeight:700,fontSize:16}}>🍽️ {r.tipo}</div>
                {r.cantidad&&<div style={{fontSize:13,color:"#666"}}>{r.cantidad}</div>}
                <div style={{fontSize:12,color:"#aaa"}}>{formatFecha(r.ts)} {formatHora(r.ts)}</div>
                {r.nota&&<div style={{fontSize:12,color:"#888",fontStyle:"italic"}}>{r.nota}</div>}
              </div>
              <button onClick={()=>borrar(r.id)} style={{background:"none",border:"none",color:"#ddd",cursor:"pointer",fontSize:18}}>×</button>
            </div>
          </Card>
        ))}
        {datos.length===0&&<Empty>Sin registros de comidas</Empty>}
      </div>
    </div>
  );
}

function ModVacunas({hijo,datos,agregar,borrar}){
  const [form,setForm]=useState({nombre:"",fecha:inputFechaHoy(),proxima:"",nota:""});
  const [open,setOpen]=useState(false);
  const s=t=>setForm(f=>({...f,...t}));
  const guardar=()=>{if(!form.nombre)return;agregar({...form});setForm({nombre:"",fecha:inputFechaHoy(),proxima:"",nota:""});setOpen(false);};
  return (
    <div style={{padding:16}}>
      <Btn full color={hijo.color} onClick={()=>setOpen(!open)}>+ Agregar vacuna</Btn>
      {open&&(
        <Card style={{marginTop:10}}>
          <div style={{marginBottom:12}}>
            <label style={{fontSize:12,color:"#888",display:"block",marginBottom:6}}>Vacuna</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{VACUNAS.map(x=><Chip key={x} active={form.nombre===x} onClick={()=>s({nombre:x})} color={hijo.color}>{x}</Chip>)}</div>
          </div>
          <Inp label="Fecha de aplicación" type="date" value={form.fecha} onChange={e=>s({fecha:e.target.value})}/>
          <Inp label="Próximo refuerzo (opcional)" type="date" value={form.proxima} onChange={e=>s({proxima:e.target.value})}/>
          <Inp label="Nota" placeholder="Reacción, médico..." value={form.nota} onChange={e=>s({nota:e.target.value})}/>
          <div style={{display:"flex",gap:8}}><Btn onClick={guardar} color={hijo.color} full>Guardar</Btn><Btn onClick={()=>setOpen(false)} secondary>Cancelar</Btn></div>
        </Card>
      )}
      <div style={{marginTop:16}}>
        {datos.map(r=>(
          <Card key={r.id}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <div>
                <div style={{fontWeight:700,fontSize:15}}>💉 {r.nombre}</div>
                <div style={{fontSize:12,color:"#aaa"}}>Aplicada: {r.fecha?formatFecha(r.fecha+"T12:00:00"):"-"}</div>
                {r.proxima&&<div style={{fontSize:12,color:hijo.color,fontWeight:600}}>Próxima: {formatFecha(r.proxima+"T12:00:00")}</div>}
                {r.nota&&<div style={{fontSize:12,color:"#888",fontStyle:"italic"}}>{r.nota}</div>}
              </div>
              <button onClick={()=>borrar(r.id)} style={{background:"none",border:"none",color:"#ddd",cursor:"pointer",fontSize:18}}>×</button>
            </div>
          </Card>
        ))}
        {datos.length===0&&<Empty>Sin vacunas registradas</Empty>}
      </div>
    </div>
  );
}

function ModMedico({hijo,datos,agregar,borrar}){
  const [form,setForm]=useState({fecha:inputFechaHoy(),medico:"",motivo:"",peso:"",talla:"",nota:""});
  const [open,setOpen]=useState(false);
  const s=t=>setForm(f=>({...f,...t}));
  const guardar=()=>{if(!form.fecha)return;agregar({...form});setForm({fecha:inputFechaHoy(),medico:"",motivo:"",peso:"",talla:"",nota:""});setOpen(false);};
  const proximos=datos.filter(d=>d.fecha>=inputFechaHoy()).sort((a,b)=>a.fecha>b.fecha?1:-1);
  const pasados=datos.filter(d=>d.fecha<inputFechaHoy()).sort((a,b)=>a.fecha<b.fecha?1:-1);
  return (
    <div style={{padding:16}}>
      <Btn full color={hijo.color} onClick={()=>setOpen(!open)}>+ Agregar turno / consulta</Btn>
      {open&&(
        <Card style={{marginTop:10}}>
          <Inp label="Fecha" type="date" value={form.fecha} onChange={e=>s({fecha:e.target.value})}/>
          <Inp label="Médico" placeholder="Dr. Santiago Rossi" value={form.medico} onChange={e=>s({medico:e.target.value})}/>
          <Inp label="Motivo" placeholder="Control, fiebre, tos..." value={form.motivo} onChange={e=>s({motivo:e.target.value})}/>
          <div style={{display:"flex",gap:8}}>
            <Inp label="Peso (kg)" type="number" step="0.1" placeholder="10.5" value={form.peso} onChange={e=>s({peso:e.target.value})}/>
            <Inp label="Talla (cm)" type="number" placeholder="85" value={form.talla} onChange={e=>s({talla:e.target.value})}/>
          </div>
          <Inp label="Indicaciones" placeholder="Qué dijo, qué recetó..." value={form.nota} onChange={e=>s({nota:e.target.value})}/>
          <div style={{display:"flex",gap:8}}><Btn onClick={guardar} color={hijo.color} full>Guardar</Btn><Btn onClick={()=>setOpen(false)} secondary>Cancelar</Btn></div>
        </Card>
      )}
      {proximos.length>0&&<div style={{marginTop:16}}><SectionLabel color={hijo.color}>Próximos turnos</SectionLabel>{proximos.map(r=><TurnoCard key={r.id} r={r} hijo={hijo} borrar={borrar}/>)}</div>}
      {pasados.length>0&&<div style={{marginTop:16}}><SectionLabel color="#aaa">Historial</SectionLabel>{pasados.map(r=><TurnoCard key={r.id} r={r} hijo={hijo} borrar={borrar}/>)}</div>}
      {datos.length===0&&<Empty>Sin turnos registrados</Empty>}
    </div>
  );
}

function TurnoCard({r,hijo,borrar}){
  return (
    <Card>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <div>
          <div style={{fontWeight:700,fontSize:15}}>👨‍⚕️ {r.medico||"Médico"}</div>
          <div style={{fontSize:12,color:"#aaa"}}>{r.fecha?formatFecha(r.fecha+"T12:00:00"):"-"} • {r.motivo||"Consulta"}</div>
          {(r.peso||r.talla)&&<div style={{fontSize:12,color:hijo.color}}>⚖️ {r.peso?r.peso+" kg":""} {r.talla?"• "+r.talla+" cm":""}</div>}
          {r.nota&&<div style={{fontSize:12,color:"#888",fontStyle:"italic",marginTop:2}}>{r.nota}</div>}
        </div>
        <button onClick={()=>borrar(r.id)} style={{background:"none",border:"none",color:"#ddd",cursor:"pointer",fontSize:18}}>×</button>
      </div>
    </Card>
  );
}

function ModSueno({hijo,datos,agregar,borrar}){
  const [form,setForm]=useState({inicio:"",fin:"",nota:""});
  const [open,setOpen]=useState(false);
  const s=t=>setForm(f=>({...f,...t}));
  const guardar=()=>{if(!form.inicio)return;agregar({...form,ts:hoyISO()});setForm({inicio:"",fin:"",nota:""});setOpen(false);};
  const duracion=(ini,fin)=>{
    const base=inputFechaHoy();
    let d=new Date(base+"T"+fin)-new Date(base+"T"+ini);
    if(d<0)d+=864e5;
    const h=Math.floor(d/3600000),m=Math.floor((d%3600000)/60000);
    return `${h}h ${m}m`;
  };
  return (
    <div style={{padding:16}}>
      <Btn full color={hijo.color} onClick={()=>setOpen(!open)}>+ Registrar sueño</Btn>
      {open&&(
        <Card style={{marginTop:10}}>
          <div style={{display:"flex",gap:8}}>
            <Inp label="Se durmió" type="time" value={form.inicio} onChange={e=>s({inicio:e.target.value})}/>
            <Inp label="Se despertó" type="time" value={form.fin} onChange={e=>s({fin:e.target.value})}/>
          </div>
          <Inp label="Nota" placeholder="Durmió bien, se despertó llorando..." value={form.nota} onChange={e=>s({nota:e.target.value})}/>
          <div style={{display:"flex",gap:8}}><Btn onClick={guardar} color={hijo.color} full>Guardar</Btn><Btn onClick={()=>setOpen(false)} secondary>Cancelar</Btn></div>
        </Card>
      )}
      <div style={{marginTop:16}}>
        {datos.map(r=>(
          <Card key={r.id}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <div>
                <div style={{fontWeight:700,fontSize:15}}>😴 {r.inicio} → {r.fin||"..."}</div>
                {r.inicio&&r.fin&&<div style={{fontSize:13,color:hijo.color,fontWeight:600}}>{duracion(r.inicio,r.fin)}</div>}
                <div style={{fontSize:12,color:"#aaa"}}>{formatFecha(r.ts)}</div>
                {r.nota&&<div style={{fontSize:12,color:"#888",fontStyle:"italic"}}>{r.nota}</div>}
              </div>
              <button onClick={()=>borrar(r.id)} style={{background:"none",border:"none",color:"#ddd",cursor:"pointer",fontSize:18}}>×</button>
            </div>
          </Card>
        ))}
        {datos.length===0&&<Empty>Sin registros de sueño</Empty>}
      </div>
    </div>
  );
}

function ModCrecimiento({hijo,datos,agregar,borrar}){
  const [form,setForm]=useState({fecha:inputFechaHoy(),peso:"",talla:"",nota:""});
  const [open,setOpen]=useState(false);
  const s=t=>setForm(f=>({...f,...t}));
  const guardar=()=>{if(!form.peso&&!form.talla)return;agregar({...form});setForm({fecha:inputFechaHoy(),peso:"",talla:"",nota:""});setOpen(false);};
  const sorted=[...datos].sort((a,b)=>a.fecha>b.fecha?1:-1);
  const conPeso=sorted.filter(d=>d.peso);
  const conTalla=sorted.filter(d=>d.talla);
  return (
    <div style={{padding:16}}>
      {conPeso.length>1&&(
        <Card style={{background:"#fafafa",marginBottom:14}}>
          <div style={{fontSize:12,color:"#888",marginBottom:8}}>Evolución de peso (kg)</div>
          <MiniChart datos={conPeso.map(d=>({label:d.fecha.slice(5),val:parseFloat(d.peso)}))} color={hijo.color}/>
        </Card>
      )}
      {conTalla.length>1&&(
        <Card style={{background:"#fafafa",marginBottom:14}}>
          <div style={{fontSize:12,color:"#888",marginBottom:8}}>Evolución de talla (cm)</div>
          <MiniChart datos={conTalla.map(d=>({label:d.fecha.slice(5),val:parseFloat(d.talla)}))} color="#a78bfa"/>
        </Card>
      )}
      <Btn full color={hijo.color} onClick={()=>setOpen(!open)}>+ Registrar medición</Btn>
      {open&&(
        <Card style={{marginTop:10}}>
          <Inp label="Fecha" type="date" value={form.fecha} onChange={e=>s({fecha:e.target.value})}/>
          <div style={{display:"flex",gap:8}}>
            <Inp label="Peso (kg)" type="number" step="0.1" placeholder="10.5" value={form.peso} onChange={e=>s({peso:e.target.value})}/>
            <Inp label="Talla (cm)" type="number" placeholder="75" value={form.talla} onChange={e=>s({talla:e.target.value})}/>
          </div>
          <Inp label="Nota" placeholder="Control, vacuna..." value={form.nota} onChange={e=>s({nota:e.target.value})}/>
          <div style={{display:"flex",gap:8}}><Btn onClick={guardar} color={hijo.color} full>Guardar</Btn><Btn onClick={()=>setOpen(false)} secondary>Cancelar</Btn></div>
        </Card>
      )}
      <div style={{marginTop:16}}>
        {[...datos].sort((a,b)=>a.fecha<b.fecha?1:-1).map(r=>(
          <Card key={r.id}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <div>
                <div style={{fontWeight:700,fontSize:15}}>📏 {r.fecha?formatFecha(r.fecha+"T12:00:00"):"-"}</div>
                <div style={{fontSize:14,color:hijo.color,fontWeight:600}}>
                  {r.peso?`⚖️ ${r.peso} kg`:""} {r.talla?`• 📏 ${r.talla} cm`:""}
                </div>
                {r.nota&&<div style={{fontSize:12,color:"#888",fontStyle:"italic"}}>{r.nota}</div>}
              </div>
              <button onClick={()=>borrar(r.id)} style={{background:"none",border:"none",color:"#ddd",cursor:"pointer",fontSize:18}}>×</button>
            </div>
          </Card>
        ))}
        {datos.length===0&&<Empty>Sin mediciones registradas</Empty>}
      </div>
    </div>
  );
}

function MiniChart({datos,color}){
  if(!datos.length)return null;
  const vals=datos.map(d=>d.val);
  const min=Math.min(...vals),max=Math.max(...vals);
  const range=max-min||1;
  const W=320,H=60,pad=20;
  const x=(i)=>pad+(i/(datos.length-1||1))*(W-pad*2);
  const y=(v)=>H-8-((v-min)/range)*(H-16);
  const pts=datos.map((d,i)=>`${x(i)},${y(d.val)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:H}}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {datos.map((d,i)=>(
        <g key={i}>
          <circle cx={x(i)} cy={y(d.val)} r="4" fill={color}/>
          <text x={x(i)} y={H} textAnchor="middle" fontSize="9" fill="#aaa">{d.label}</text>
          <text x={x(i)} y={y(d.val)-7} textAnchor="middle" fontSize="9" fontWeight="700" fill={color}>{d.val}</text>
        </g>
      ))}
    </svg>
  );
}
