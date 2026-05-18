import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";

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
const VAPID_KEY = "BGVl82Wo5C6bdx45M-YjWn7kl6t1K72q4TptRBHMmDGNDtFJ671C1AulleOm7KoRM2NSQeKkeqUexMYAJIxXHnU";

async function pedirPermisoNotificaciones() {
  try {
    const permission = await Notification.requestPermission();
    if(permission !== 'granted') return null;
    const messaging = getMessaging(firebaseApp);
    const token = await getToken(messaging, {vapidKey: VAPID_KEY});
    return token;
  } catch(e) { return null; }
}

async function enviarNotificacion(title, body) {
  try {
    const snap = await new Promise(res => {
      const unsub = onSnapshot(doc(db,"app","tokens"), d => { unsub(); res(d); });
    });
    const tokens = Object.keys(snap.data()||{});
    if(!tokens.length) return;
    await fetch('/api/send-notification', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({tokens, title, body})
    });
  } catch(e) {}
}

// ============================================================
// DATOS
// ============================================================
const DEFAULT_HIJOS = [
  {id:"gennaro",nombre:"Gennaro",nacimiento:"2024-02-11",color:"#4F8EF7",colorLight:"#EBF2FF",emoji:"👦",foto:null},
  {id:"francesco",nombre:"Francesco",nacimiento:"2025-11-11",color:"#F7824F",colorLight:"#FFF2EB",emoji:"👶",foto:null},
];

const DATOS_INICIALES = {
  gennaro:{fiebre:[],comidas:[],vacunas:[],sueño:[],agenda:[],
    jardin:{nombre:"Jardín Barriletes",sala:"Sala de 2",horario:"Lunes a Viernes 8:00 - 16:30",
      maestras:[{nombre:"Valeria",turno:"Mañana"},{nombre:"Agus",turno:"Tarde"}],
      comidas:["Desayuno","Almuerzo","Merienda"],nota:"Lleva la comida de casa",
      eventos:[],tareas:[],pagos:[]},
    medico:[
      {id:30,fecha:"2026-02-09",medico:"Dr. Santiago Rossi",motivo:"Control 24 meses",peso:"14.8",talla:"90",nota:""},
      {id:29,fecha:"2025-09-15",medico:"Dr. Santiago Rossi",motivo:"Control 21 meses",peso:"13.05",talla:"85",nota:""},
      {id:28,fecha:"2025-08-11",medico:"Dr. Santiago Rossi",motivo:"Control 18 meses",peso:"12.8",talla:"84",nota:"Perímetro cefálico: 38.5 cm."},
      {id:27,fecha:"2025-05-05",medico:"Dr. Santiago Rossi",motivo:"Control 15 meses",peso:"12.1",talla:"81",nota:""},
      {id:26,fecha:"2025-02-03",medico:"Dr. Santiago Rossi",motivo:"Control 11 meses",peso:"11.3",talla:"77",nota:""},
      {id:25,fecha:"2024-09-23",medico:"Dr. Santiago Rossi",motivo:"Control 7 meses",peso:"10.2",talla:"71",nota:""},
      {id:24,fecha:"2024-07-15",medico:"Dr. Santiago Rossi",motivo:"Control 5 meses",peso:"8.9",talla:"66",nota:""},
      {id:23,fecha:"2024-06-10",medico:"Dr. Santiago Rossi",motivo:"Control 4 meses",peso:"8",talla:"64",nota:""},
      {id:22,fecha:"2024-05-13",medico:"Dr. Santiago Rossi",motivo:"Control 3 meses",peso:"7.15",talla:"61",nota:""},
      {id:21,fecha:"2024-04-15",medico:"Dr. Santiago Rossi",motivo:"Control 2 meses",peso:"6",talla:"59.5",nota:""},
      {id:20,fecha:"2024-03-18",medico:"Dr. Santiago Rossi",motivo:"Control 1 mes",peso:"4.7",talla:"54",nota:""},
      {id:19,fecha:"2024-03-04",medico:"Dr. Santiago Rossi",motivo:"Control 21 días",peso:"4",talla:"",nota:""},
      {id:18,fecha:"2024-02-26",medico:"Dr. Santiago Rossi",motivo:"Control 15 días",peso:"3.67",talla:"",nota:""},
      {id:17,fecha:"2024-02-19",medico:"Dr. Santiago Rossi",motivo:"Control 8 días",peso:"3.35",talla:"",nota:""},
    ],
    crecimiento:[
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
    ]},
  francesco:{fiebre:[],comidas:[],vacunas:[],sueño:[],agenda:[],
    jardin:{nombre:"Por definir",sala:"Sala de 2",horario:"Comienza Marzo 2027",maestras:[],comidas:[],nota:"Comienza en Marzo 2027",eventos:[],tareas:[],pagos:[]},
    medico:[
      {id:46,fecha:"2026-05-13",medico:"Dr. Santiago Rossi",motivo:"Control 6 meses",peso:"8.1",talla:"67.5",nota:"Perímetro cefálico: 43 cm."},
      {id:45,fecha:"2026-04-08",medico:"Dr. Santiago Rossi",motivo:"Control 4 meses",peso:"7.6",talla:"66",nota:"Perímetro cefálico: 43 cm."},
      {id:44,fecha:"2026-02-09",medico:"Dr. Santiago Rossi",motivo:"Control 3 meses",peso:"6.3",talla:"60.5",nota:"Perímetro cefálico: 40 cm."},
      {id:43,fecha:"2026-01-07",medico:"Dr. Santiago Rossi",motivo:"Control 1 mes",peso:"5.2",talla:"58",nota:"Perímetro cefálico: 40 cm."},
      {id:42,fecha:"2025-11-17",medico:"Dr. Santiago Rossi",motivo:"Control 6 días",peso:"2.95",talla:"",nota:"Primer control neonatal."},
    ],
    crecimiento:[
      {id:41,fecha:"2026-05-13",peso:"8.1",talla:"67.5",nota:"Control 6m."},
      {id:40,fecha:"2026-04-08",peso:"7.6",talla:"66",nota:"Control 4m."},
      {id:39,fecha:"2026-02-09",peso:"6.3",talla:"60.5",nota:"Control 3m."},
      {id:38,fecha:"2026-01-07",peso:"5.2",talla:"58",nota:"Control 1m."},
      {id:37,fecha:"2025-11-17",peso:"2.95",talla:"",nota:"6 días."},
    ]},
  eventos_familia:[
    {id:1,nombre:"Cumple Gennaro",fecha:"2027-02-11",tipo:"cumple",nota:""},
    {id:2,nombre:"Cumple Francesco",fecha:"2026-11-11",tipo:"cumple",nota:""},
  ],
};

// ============================================================
// RECETAS
// ============================================================
const RECETAS_FRANCESCO = [
  {id:"r1",nombre:"Panqueques de banana",categoria:"6 meses",tiempo:"10 min",ingredientes:["2 huevos","3 cucharadas de avena","1 banana"],pasos:["Licuar los 3 ingredientes","Calentar sartén con gotas de aceite","Verter de a cucharadas","Dar vuelta cuando hagan burbujitas"]},
  {id:"r2",nombre:"Puré de zanahoria",categoria:"6 meses",tiempo:"20 min",ingredientes:["2 zanahorias","Aceite de oliva"],pasos:["Cortar en bastones","Hornear a 180° hasta que esté blandita","Procesar y agregar aceite de oliva"]},
  {id:"r3",nombre:"Pizzitas de zanahoria",categoria:"6 meses",tiempo:"25 min",ingredientes:["3 zanahorias","2 huevos","2 cucharadas de harina o avena"],pasos:["Saltear zanahorias hasta dorar","Procesar con los huevos y la harina","Verter en sartén como panqueques a fuego bajo","Dar vuelta y cocinar bien"]},
  {id:"r4",nombre:"Puré de manzana y zapallo",categoria:"6 meses",tiempo:"20 min",ingredientes:["1 taza de cubos de zapallo","1 manzana pelada"],pasos:["Cocinar zapallo 5 min en agua","Agregar manzana y cocinar hasta que estén blandos","Pisar con tenedor, sin sal ni azúcar"]},
  {id:"r5",nombre:"Untable de garbanzos",categoria:"6 meses",tiempo:"30 min",ingredientes:["1 taza de garbanzos","Aceite de oliva"],pasos:["Remojar garbanzos toda la noche","Hervir hasta que estén blandos","Procesar agregando aceite hasta que quede cremoso"]},
  {id:"r6",nombre:"Pancito de calabaza",categoria:"6 meses",tiempo:"30 min",ingredientes:["4 rodajas de calabaza cocida","2 huevos","1 chorrito de aceite","4 cucharadas de harina","1 cdita de polvo para hornear"],pasos:["Pisar la calabaza dejando textura","Mezclar con el resto de ingredientes","Verter en molde aceitado","Hornear 20 minutos"]},
  {id:"r7",nombre:"Bocaditos de lentejas",categoria:"6 meses",tiempo:"30 min",ingredientes:["250g lentejas rojas","1 cebolla","1/4 cdita cúrcuma"],pasos:["Remojar lentejas 2 horas","Procesar hasta pasta","Agregar cebolla picada y cúrcuma","Formar bolitas, aplastar y cocinar en sartén con aceite"]},
  {id:"r8",nombre:"Milanesitas de zucchini",categoria:"6 meses",tiempo:"20 min",ingredientes:["1 zucchini","1 huevo","Pan rallado"],pasos:["Cortar en rodajas de 1/2 cm","Pasar por huevo y pan rallado","Hornear con aceite hasta dorar de ambos lados"]},
  {id:"r9",nombre:"Muffins de manzana",categoria:"Desayunos",tiempo:"30 min",ingredientes:["2 manzanas","3 cucharadas de harina","3 huevos"],pasos:["Batir los huevos","Agregar manzana rallada","Agregar harina de a poco","Verter en moldes","Hornear a temperatura baja 25 minutos"]},
  {id:"r10",nombre:"Primeras galletitas",categoria:"Desayunos",tiempo:"20 min",ingredientes:["1 banana","1 taza de coco rallado o harina de almendras"],pasos:["Pisar la banana","Mezclar con el coco","Armar bolitas y aplastar","Hornear hasta dorar levemente"]},
  {id:"r11",nombre:"Heladito de arándanos y maní",categoria:"Desayunos",tiempo:"10 min + freezer",ingredientes:["1 taza de arándanos","1 cucharada de manteca de maní"],pasos:["Procesar arándanos con la manteca de maní","Colocar en moldes","Freezer mínimo 2 horas","Desmoldar y servir"]},
  {id:"r12",nombre:"Torta cumple 1 año",categoria:"+1 año",tiempo:"45 min",ingredientes:["15 dátiles","2 huevos","1/2 taza de aceite","1 y 1/2 taza harina leudante"],pasos:["Hidratar dátiles 2 horas y procesar","Batir huevos con aceite","Agregar harina de a poco","Sumar crema de dátiles","Hornear en molde 20cm a temperatura baja","Rellenar con pasta de maní o dátiles"]},
  {id:"r13",nombre:"Buñuelos de acelga",categoria:"+1 año",tiempo:"20 min",ingredientes:["6 hojas de acelga","2 huevos","1/2 taza queso en hebras","1/2 taza harina"],pasos:["Hervir la acelga y procesar","Agregar huevos, queso y harina","Verter de a poco en sartén aceitada","Dar vuelta hasta cocinar bien"]},
  {id:"r14",nombre:"Postre de chocolate y banana",categoria:"+1 año",tiempo:"15 min + heladera",ingredientes:["1 banana","2 cdas cacao amargo","1 cda almidón de maíz","1/2 taza leche"],pasos:["Licuar todo","Llevar a fuego medio revolviendo 10 min","Colocar en recipiente","Heladera 4-5 horas"]},
];

const RECETAS_FAMILIA = [
  {id:"f1",nombre:"Pasta Alfredo con pollo",categoria:"Pastas",tiempo:"30 min",ingredientes:["1/2 pechuga de pollo","1 diente de ajo","250g crema","200g pasta","100g queso rallado"],pasos:["Dorar el pollo en trozos","Agregar ajo","Agregar crema y agua","Incorporar pasta y cocinar tapado el tiempo del paquete","Apagar, agregar queso y tapar 1 minuto"]},
  {id:"f2",nombre:"Pizza sin horno",categoria:"Rápidas",tiempo:"20 min",ingredientes:["1.5 tazas harina","1 cdita polvo hornear","1 cdita sal","1 cda aceite","11 cdas agua"],pasos:["Mezclar todo hasta masa suave","Reposar 10 minutos","Estirar y poner en sartén con aceite","Agregar salsa y queso","Tapar a fuego mínimo hasta derretir"]},
  {id:"f3",nombre:"Nuggets de pollo caseros",categoria:"Rápidas",tiempo:"30 min",ingredientes:["1 pechuga","1 cda queso crema","2 rodajas pan de molde","1 vaso leche","1 huevo","Harina y pan rallado"],pasos:["Remojar pan en leche","Procesar pollo hasta pasta","Agregar queso crema y pan escurrido","Formar bolitas con manos mojadas","Pasar por harina, huevo y pan rallado","Freír o hornear con aceite"]},
  {id:"f4",nombre:"Tortitas de choclo",categoria:"Rápidas",tiempo:"20 min",ingredientes:["1 lata de choclo","1/2 taza leche","1/2 taza harina leudante","1 huevo","1/2 taza queso rallado"],pasos:["Licuar choclo con leche","Agregar huevo y seguir licuando","Pasar a bol, agregar harina","Agregar queso, sal y pimienta","Cocinar de a cucharadas en sartén"]},
  {id:"f5",nombre:"Pollo al ajillo",categoria:"Pollo",tiempo:"30 min",ingredientes:["4 muslos de pollo","4 dientes de ajo","1 taza vino blanco","2 tazas caldo de pollo","Aceite de oliva"],pasos:["Rehogar ajo en aceite sin dorar","Retirar ajo y dorar el pollo","Agregar vino y esperar que evapore","Agregar ajo y caldo","Tapar y cocinar 10 minutos"]},
  {id:"f6",nombre:"Alitas adobadas",categoria:"Pollo",tiempo:"30 min",ingredientes:["1kg alitas","1 diente ajo","Salsa de soja","Jugo de 1 limón","1 cda miel","1 cda orégano"],pasos:["Lavar y separar alitas","Salpimentar con orégano","Mezclar soja, miel, ajo y limón","Cubrir las alitas con el adobo","Horno fuerte dando vuelta a mitad"]},
  {id:"f7",nombre:"Guisito de lentejas express",categoria:"Legumbres",tiempo:"30 min",ingredientes:["2 latas lentejas","1 cebolla","200g panceta","1/2 calabaza","1 chorizo colorado","Puré de tomate"],pasos:["Dorar panceta y chorizo","Rehogar cebolla, verdeo y morrón","Agregar calabaza y tomate seco","Sumar caldo y puré de tomate","Incorporar lentejas y cocinar 5 minutos más"]},
  {id:"f8",nombre:"Fajitas mentirosas",categoria:"Rápidas",tiempo:"25 min",ingredientes:["6 tapas de empanadas","1 pechuga","1/2 morrón rojo","1/2 morrón amarillo","1 cebolla","1 palta","Queso crema"],pasos:["Estirar tapas y cocinar en sartén seca","Saltear pollo en tiritas","Saltear verduras al dente","Hacer salsa pisando palta con queso crema","Armar cada uno su fajita"]},
  {id:"f9",nombre:"Tortitas de papa",categoria:"Guarniciones",tiempo:"25 min",ingredientes:["2 papas","1 verdeo","Perejil","1 huevo","1 cda harina"],pasos:["Rallar papas y remojar en agua","Escurrir bien apretando","Mezclar con huevo, verdeo y perejil picados","Agregar harina","Cocinar en sartén con poco aceite dando vuelta"]},
  {id:"f10",nombre:"Tarta de peras y provolone",categoria:"Tartas",tiempo:"30 min",ingredientes:["1 disco de masa","3 peras","2 rodajas de provoleta","Tomillo fresco"],pasos:["Poner masa en tartera","Cortar peras y provoleta en trozos","Distribuir sobre la masa al tuntún","Agregar tomillo","Hornear hasta dorar"]},
  {id:"f11",nombre:"Hamburguesas rellenas",categoria:"Rápidas",tiempo:"20 min",ingredientes:["1/2 kg carne picada","1 verdeo","Pan rallado","Queso mozzarella"],pasos:["Mezclar carne con verdeo y pan rallado","Formar disco de carne","Poner queso en el centro","Cubrir con otro disco sellando bien","Cocinar 2-3 min de cada lado en plancha bien caliente"]},
  {id:"f12",nombre:"Mousse de chocolate",categoria:"Postres",tiempo:"15 min + frío",ingredientes:["600g crema de leche","320g chocolate a elección"],pasos:["Batir crema a medio punto","Derretir chocolate","Mezclar chocolate caliente con parte de la crema","Mixear 1 minuto","Incorporar el resto de la crema con movimientos suaves","Frío y listo"]},
];

const CATS_SUPERMERCADO = ["🥦 Verduras y frutas","🥛 Lácteos","🥩 Carnes","🍝 Almacén","🧴 Limpieza","🍞 Panadería","🥶 Congelados","📦 Otros"];

function categoriaAuto(item) {
  const i = item.toLowerCase();
  if(/leche|yogur|queso|crema|mantec|ricota/.test(i)) return "🥛 Lácteos";
  if(/pollo|carne|milanesa|churrasco|bondiola|pescado|atun|salmon/.test(i)) return "🥩 Carnes";
  if(/zapallo|zanahoria|papa|batata|cebolla|tomate|lechuga|espinaca|brocoli|manzana|banana|pera|naranja|limon|palta|fruta|verdura/.test(i)) return "🥦 Verduras y frutas";
  if(/detergente|jabon|lavandina|suavizante|limpieza|desodorante|shampoo/.test(i)) return "🧴 Limpieza";
  if(/pan|factura|medialunas|galleta|tostada/.test(i)) return "🍞 Panadería";
  if(/helado|congelad/.test(i)) return "🥶 Congelados";
  if(/arroz|fideos|pasta|harina|aceite|sal|azucar|lenteja|garbanzo|poroto|sopa|caldo/.test(i)) return "🍝 Almacén";
  return "📦 Otros";
}

function calcularEdad(nac) {
  const hoy = new Date();
  const n = new Date(nac);
  let años = hoy.getFullYear() - n.getFullYear();
  let meses = hoy.getMonth() - n.getMonth();
  if(meses < 0) { años--; meses += 12; }
  if(hoy.getDate() < n.getDate()) meses--;
  if(meses < 0) { años--; meses += 12; }
  if(años === 0) return `${meses} meses`;
  if(meses === 0) return `${años} años`;
  return `${años}a ${meses}m`;
}

function diasParaCumple(nac) {
  const hoy = new Date(); hoy.setHours(0,0,0,0);
  const n = new Date(nac);
  let p = new Date(hoy.getFullYear(), n.getMonth(), n.getDate());
  if(p < hoy) p.setFullYear(hoy.getFullYear()+1);
  const d = Math.round((p-hoy)/(864e5));
  return d===0?"¡Hoy es su cumple! 🎂":d===1?"¡Mañana! 🎂":`Cumple en ${d} días`;
}

function hoyISO(){ return new Date().toISOString(); }
function inputFechaHoy(){ const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
function formatHora(iso){ return new Date(iso).toLocaleTimeString("es-AR",{hour:"2-digit",minute:"2-digit"}); }
function formatFecha(iso){ return new Date(iso).toLocaleDateString("es-AR",{day:"2-digit",month:"2-digit",year:"numeric"}); }
function soloFecha(iso){ return iso.slice(0,10); }

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
  {id:"jardin",label:"Jardín",icon:"🏫"},
  {id:"agenda",label:"Agenda",icon:"📅"},
];

const GUIA_ALIMENTACION = {
  "6 meses":{color:"#F7824F",items:["Puré de zapallo, zanahoria, calabaza (con aceite)","Cereales de arroz o maíz, polenta","Banana pisada, manzana rallada, puré de durazno o pera"]},
  "7-9 meses":{color:"#f59e0b",items:["Puré de carne de vaca o pollo sin piel","Cereales de trigo, avena, fideos cabello de ángel","Condimentar con aceite, queso crema, ricota"]},
  "10-12 meses":{color:"#22c55e",items:["Otras carnes y pastas","Guisos livianos","Frutas y vegetales trozados","Pan fresco, galletitas Vocación o Manón"]},
};

function comprimirFoto(file) {
  return new Promise(resolve => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxSize = 150;
      let w=img.width, h=img.height;
      if(w>h){h=Math.round(h*maxSize/w);w=maxSize;}
      else{w=Math.round(w*maxSize/h);h=maxSize;}
      canvas.width=w; canvas.height=h;
      canvas.getContext('2d').drawImage(img,0,0,w,h);
      resolve(canvas.toDataURL('image/jpeg',0.5));
      URL.revokeObjectURL(url);
    };
    img.src=url;
  });
}

// ============================================================
// APP PRINCIPAL
// ============================================================
export default function App() {
  const [hijos,setHijos]=useState(DEFAULT_HIJOS);
  const [datos,setDatos]=useState(DATOS_INICIALES);
  const [familiaFoto,setFamiliaFoto]=useState(null);
  const [supermercado,setSupermercado]=useState([]);
  const [hijo,setHijo]=useState(null);
  const [modulo,setModulo]=useState(null);
  const [vista,setVista]=useState("inicio"); // inicio | recetario | super | eventos
  const [cargando,setCargando]=useState(true);
  const [guardando,setGuardando]=useState(false);
  const [notifState,setNotifState]=useState("idle");

  useEffect(()=>{
    const unsubDatos=onSnapshot(doc(db,"app","datos"),(snap)=>{
      if(snap.exists()) setDatos(snap.data());
      setCargando(false);
    },()=>setCargando(false));
    const unsubPerfiles=onSnapshot(doc(db,"app","perfiles"),(snap)=>{
      if(snap.exists()){
        setHijos(snap.data().hijos||DEFAULT_HIJOS);
        setFamiliaFoto(snap.data().familiaFoto||null);
      }
    });
    const unsubSuper=onSnapshot(doc(db,"app","supermercado"),(snap)=>{
      if(snap.exists()) setSupermercado(snap.data().items||[]);
    });
    return ()=>{unsubDatos();unsubPerfiles();unsubSuper();};
  },[]);

  const guardarDatos=async(n)=>{setDatos(n);setGuardando(true);try{await setDoc(doc(db,"app","datos"),n);}catch(e){}setGuardando(false);};
  const guardarPerfiles=async(h,f)=>{const nh=h||hijos;const nf=f!==undefined?f:familiaFoto;setHijos(nh);if(f!==undefined)setFamiliaFoto(nf);try{await setDoc(doc(db,"app","perfiles"),{hijos:nh,familiaFoto:nf});}catch(e){}};
  const guardarSuper=async(items)=>{setSupermercado(items);try{await setDoc(doc(db,"app","supermercado"),{items});}catch(e){}};
  const subirFoto=async(id,b64)=>{const nh=hijos.map(h=>h.id===id?{...h,foto:b64}:h);guardarPerfiles(nh,undefined);};
  const subirFotoFamilia=async(b64)=>{guardarPerfiles(undefined,b64);};

  const activarNotificaciones=async()=>{
    setNotifState("loading");
    const token=await pedirPermisoNotificaciones();
    if(token){
      setNotifState("ok");
      setDoc(doc(db,"app","tokens"),{[token]:{activo:true,ts:new Date().toISOString()}},{merge:true});
    } else setNotifState("error");
  };

  const agregarDato=(mod,item)=>{
    const n={...datos};
    n[hijo][mod]=[{id:Date.now(),...item},...(n[hijo][mod]||[])];
    guardarDatos(n);
    const nombres={fiebre:"🌡️ Fiebre",comidas:"🍽️ Comida",vacunas:"💉 Vacuna",medico:"👨‍⚕️ Médico",sueño:"😴 Sueño",crecimiento:"📈 Medición",agenda:"📅 Agenda"};
    const hijoObj=hijos.find(h=>h.id===hijo);
    enviarNotificacion(`${hijoObj?.nombre} — ${nombres[mod]||mod}`,item.temp?`${item.temp}°C`:item.titulo||item.tipo||"Nuevo registro");
  };
  const borrarDato=(mod,id)=>{const n={...datos};n[hijo][mod]=(n[hijo][mod]||[]).filter(x=>x.id!==id);guardarDatos(n);};
  const agregarEventoFamilia=(e)=>{const n={...datos,eventos_familia:[{id:Date.now(),...e},...(datos.eventos_familia||[])]};guardarDatos(n);};
  const borrarEventoFamilia=(id)=>{const n={...datos,eventos_familia:(datos.eventos_familia||[]).filter(x=>x.id!==id)};guardarDatos(n);};

  const hijoObj=hijos.find(h=>h.id===hijo);

  if(cargando) return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",flexDirection:"column",gap:16}}>
      <div style={{fontSize:40}}>👨‍👦‍👦</div>
      <div style={{fontFamily:"system-ui",fontSize:16,color:"#888"}}>Cargando App FAMILIA...</div>
    </div>
  );

  if(vista==="recetario") return <Recetario onBack={()=>setVista("inicio")}/>;
  if(vista==="super") return <SuperMercado items={supermercado} guardar={guardarSuper} onBack={()=>setVista("inicio")}/>;
  if(vista==="eventos") return <EventosFamilia datos={datos.eventos_familia||[]} agregar={agregarEventoFamilia} borrar={borrarEventoFamilia} onBack={()=>setVista("inicio")}/>;

  if(!hijo) return <Inicio hijos={hijos} setHijo={setHijo} datos={datos} familiaFoto={familiaFoto} subirFotoFamilia={subirFotoFamilia} subirFoto={subirFoto} guardando={guardando} setVista={setVista} eventosFamilia={datos.eventos_familia||[]} notifState={notifState} activarNotificaciones={activarNotificaciones} supermercado={supermercado}/>;
  if(!modulo) return <MenuHijo hijo={hijoObj} setModulo={setModulo} setHijo={setHijo} datos={datos[hijo]} subirFoto={subirFoto}/>;

  const props={hijo:hijoObj,datos:datos[hijo][modulo]||[],agregar:(i)=>agregarDato(modulo,i),borrar:(id)=>borrarDato(modulo,id),guardando};

  return(
    <div style={{fontFamily:"system-ui,sans-serif",maxWidth:420,margin:"0 auto",paddingBottom:80}}>
      <Header hijo={hijoObj} titulo={MODULOS.find(m=>m.id===modulo)?.icon+" "+MODULOS.find(m=>m.id===modulo)?.label} onBack={()=>setModulo(null)}/>
      {modulo==="fiebre"&&<ModFiebre {...props}/>}
      {modulo==="comidas"&&<ModComidas {...props}/>}
      {modulo==="vacunas"&&<ModVacunas {...props}/>}
      {modulo==="medico"&&<ModMedico {...props}/>}
      {modulo==="sueño"&&<ModSueno {...props}/>}
      {modulo==="crecimiento"&&<ModCrecimiento {...props}/>}
      {modulo==="jardin"&&<ModJardin hijo={hijoObj} datos={datos[hijo].jardin||{}} agregar={(j)=>{const n={...datos};n[hijo].jardin=j;guardarDatos(n);}}/>}
      {modulo==="agenda"&&<ModAgenda {...props}/>}
    </div>
  );
}

// ============================================================
// UI BASE
// ============================================================
function FotoUpload({foto,onFoto,size=64,emoji,color}){
  const ref=useRef();
  const handleFile=async e=>{const f=e.target.files[0];if(!f)return;onFoto(await comprimirFoto(f));};
  return(
    <div onClick={()=>ref.current.click()} style={{width:size,height:size,borderRadius:"50%",background:color||"#eee",cursor:"pointer",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.4,flexShrink:0,border:"2.5px dashed rgba(255,255,255,0.5)"}}>
      {foto?<img src={foto} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="foto"/>:<span>{emoji||"📷"}</span>}
      <input ref={ref} type="file" accept="image/*" style={{display:"none"}} onChange={handleFile}/>
    </div>
  );
}
function Badge({children,color,bg}){return <span style={{fontSize:12,background:bg,color,padding:"3px 10px",borderRadius:20,fontWeight:600}}>{children}</span>;}
function Card({children,style}){return <div style={{background:"#fff",borderRadius:14,padding:"16px",border:"1px solid #f0f0f0",marginBottom:10,...style}}>{children}</div>;}
function Inp({label,...props}){return(<div style={{marginBottom:12}}>{label&&<label style={{fontSize:12,color:"#888",display:"block",marginBottom:4}}>{label}</label>}<input style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"1.5px solid #e5e5e5",fontSize:15,boxSizing:"border-box",outline:"none"}} {...props}/></div>);}
function Btn({children,onClick,color="#4F8EF7",full,secondary,small}){return <button onClick={onClick} style={{background:secondary?"#f5f5f5":color,color:secondary?"#555":"#fff",border:"none",borderRadius:12,padding:small?"8px 14px":"12px 20px",fontWeight:700,fontSize:small?13:15,cursor:"pointer",width:full?"100%":"auto"}}>{children}</button>;}
function Chip({children,active,onClick,color}){return <button onClick={onClick} style={{padding:"5px 12px",borderRadius:20,border:`1.5px solid ${active?color:"#e5e5e5"}`,background:active?color:"#fff",color:active?"#fff":"#555",fontSize:13,cursor:"pointer",fontWeight:active?600:400}}>{children}</button>;}
function Empty({children}){return <div style={{textAlign:"center",color:"#bbb",padding:"32px 0",fontSize:14}}>{children}</div>;}
function SectionLabel({children,color}){return <div style={{fontSize:12,fontWeight:700,color,marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>{children}</div>;}
function Header({hijo,titulo,onBack}){
  return(
    <div style={{background:hijo.color,padding:"16px 20px",display:"flex",alignItems:"center",gap:12}}>
      <button onClick={onBack} style={{background:"rgba(255,255,255,0.25)",border:"none",borderRadius:10,width:36,height:36,cursor:"pointer",fontSize:18,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
      <div style={{flex:1}}>
        <div style={{color:"rgba(255,255,255,0.8)",fontSize:12}}>{hijo.emoji} {hijo.nombre}</div>
        <div style={{color:"#fff",fontWeight:700,fontSize:17}}>{titulo}</div>
      </div>
    </div>
  );
}

// ============================================================
// PANTALLA INICIO
// ============================================================
function Inicio({hijos,setHijo,datos,familiaFoto,subirFotoFamilia,subirFoto,guardando,setVista,eventosFamilia,notifState,activarNotificaciones,supermercado}){
  const proxEvento=(eventosFamilia||[]).filter(e=>e.fecha>=inputFechaHoy()).sort((a,b)=>a.fecha>b.fecha?1:-1)[0];
  const pendientesSuper=(supermercado||[]).filter(x=>!x.tachado).length;
  return(
    <div style={{fontFamily:"system-ui,sans-serif",maxWidth:420,margin:"0 auto",background:"#f8f9fb",minHeight:"100vh"}}>
      <div style={{background:"linear-gradient(135deg,#4F8EF7,#a78bfa)",padding:"28px 20px 24px"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <FotoUpload foto={familiaFoto} onFoto={subirFotoFamilia} size={56} emoji="👨‍👩‍👦" color="rgba(255,255,255,0.2)"/>
          <div>
            <h1 style={{margin:0,fontSize:26,fontWeight:800,color:"#fff"}}>App FAMILIA</h1>
            <p style={{margin:"2px 0 0",color:"rgba(255,255,255,0.8)",fontSize:12}}>{guardando?"💾 Guardando...":"✅ Sincronizado con Marina"}</p>
          </div>
        </div>
      </div>
      <div style={{padding:"16px"}}>

        {/* Notificaciones */}
        {notifState!=="ok"&&(
          <div onClick={activarNotificaciones} style={{background:notifState==="error"?"#fff2f2":"#f0f9ff",borderRadius:14,padding:"12px 16px",marginBottom:12,cursor:"pointer",border:`1px solid ${notifState==="error"?"#fca5a5":"#bae6fd"}`,display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:22}}>{notifState==="loading"?"⏳":notifState==="error"?"❌":"🔔"}</span>
            <div>
              <div style={{fontWeight:700,fontSize:14,color:notifState==="error"?"#ef4444":"#0284c7"}}>{notifState==="loading"?"Activando...":notifState==="error"?"Reintentar notificaciones":"Activar notificaciones"}</div>
              {notifState==="idle"&&<div style={{fontSize:12,color:"#888"}}>Recibí avisos cuando Marina cargue algo</div>}
            </div>
          </div>
        )}

        {/* Evento familiar */}
        <div onClick={()=>setVista("eventos")} style={{background:proxEvento?"linear-gradient(135deg,#a78bfa20,#ec489920)":"#f0f0f0",borderRadius:14,padding:"12px 16px",marginBottom:12,cursor:"pointer",border:"1px solid #a78bfa30"}}>
          {proxEvento?(
            <>
              <div style={{fontSize:12,color:"#a78bfa",fontWeight:700,marginBottom:2}}>🎉 Próximo evento familiar</div>
              <div style={{fontWeight:700,fontSize:15}}>{proxEvento.nombre}</div>
              <div style={{fontSize:12,color:"#888"}}>{formatFecha(proxEvento.fecha+"T12:00:00")}</div>
            </>
          ):<div style={{textAlign:"center",fontSize:13,color:"#aaa"}}>🎉 Ver eventos familiares</div>}
        </div>

        {/* Tarjetas de hijos */}
        {hijos.map(h=>{
          const d=datos[h.id]||{};
          const ultimaTemp=d.fiebre?.[0];
          const proxTurno=d.medico?.filter(x=>x.fecha>=inputFechaHoy()).sort((a,b)=>a.fecha>b.fecha?1:-1)[0];
          const ultimoPeso=d.crecimiento?.[0];
          const proxAgenda=d.agenda?.filter(x=>x.fecha>=inputFechaHoy()).sort((a,b)=>a.fecha>b.fecha?1:-1)[0];
          return(
            <div key={h.id} onClick={()=>setHijo(h.id)} style={{background:"#fff",borderRadius:20,padding:"18px 20px",marginBottom:12,cursor:"pointer",boxShadow:"0 4px 20px rgba(0,0,0,0.07)",border:`2px solid ${h.color}20`}}>
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
                {proxTurno&&<Badge color="#4F8EF7" bg="#EBF2FF">👨‍⚕️ {formatFecha(proxTurno.fecha+"T12:00:00")}</Badge>}
                {proxAgenda&&<Badge color="#a78bfa" bg="#f5f3ff">📅 {proxAgenda.titulo}</Badge>}
              </div>
            </div>
          );
        })}

        {/* Recetario y Supermercado */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:4}}>
          <div onClick={()=>setVista("recetario")} style={{background:"#fff",borderRadius:16,padding:"18px",cursor:"pointer",boxShadow:"0 2px 10px rgba(0,0,0,0.05)",border:"1px solid #f0f0f0",textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:6}}>🍳</div>
            <div style={{fontWeight:700,fontSize:15,color:"#1a1a2e"}}>Recetario</div>
            <div style={{fontSize:12,color:"#aaa",marginTop:2}}>{RECETAS_FRANCESCO.length + RECETAS_FAMILIA.length} recetas</div>
          </div>
          <div onClick={()=>setVista("super")} style={{background:"#fff",borderRadius:16,padding:"18px",cursor:"pointer",boxShadow:"0 2px 10px rgba(0,0,0,0.05)",border:"1px solid #f0f0f0",textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:6}}>🛒</div>
            <div style={{fontWeight:700,fontSize:15,color:"#1a1a2e"}}>Lista del súper</div>
            <div style={{fontSize:12,color:"#aaa",marginTop:2}}>{pendientesSuper} pendientes</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MENU HIJO
// ============================================================
function MenuHijo({hijo,setModulo,setHijo,datos,subirFoto}){
  return(
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
          {MODULOS.map(m=>{
            const count=datos[m.id]?.length||(m.id==="jardin"?1:0);
            return(
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

// ============================================================
// FIEBRE — mejorada con agrupación por día y gráfico de línea
// ============================================================
function ModFiebre({hijo,datos,agregar,borrar}){
  const [form,setForm]=useState({temp:"",nota:"",meds:[],sintomas:[],foto:null});
  const [open,setOpen]=useState(false);
  const [error,setError]=useState("");
  const s=t=>setForm(f=>({...f,...t}));
  const toggle=(arr,key,val)=>s({[key]:arr.includes(val)?arr.filter(x=>x!==val):[...arr,val]});

  const guardar=()=>{
    const t=parseFloat(form.temp);
    if(!form.temp||isNaN(t)){setError("Ingresá una temperatura");return;}
    if(t<35||t>42){setError("⚠️ Temperatura fuera de rango (35-42°C)");return;}
    setError("");
    agregar({temp:t,nota:form.nota,meds:form.meds,sintomas:form.sintomas,foto:form.foto||null,ts:hoyISO()});
    setForm({temp:"",nota:"",meds:[],sintomas:[],foto:null});setOpen(false);
  };

  const subirFotoRegistro=async(e)=>{
    const f=e.target.files[0];
    if(!f) return;
    const comprimida=await comprimirFoto(f);
    setForm(fm=>({...fm,foto:comprimida}));
  };

  // Agrupar por día
  const porDia={};
  datos.forEach(r=>{
    const fecha=soloFecha(r.ts);
    if(!porDia[fecha]) porDia[fecha]=[];
    porDia[fecha].push(r);
  });
  const dias=Object.keys(porDia).sort((a,b)=>b>a?1:-1);

  // Gráfico de línea con últimas 8 temperaturas
  const ultimas=[...datos].slice(0,8).reverse();

  // Alerta si última temp > 38.5
  const ultimaTemp=datos[0];
  const hayFiebreAlta=ultimaTemp&&ultimaTemp.temp>=38.5;

  // Recordatorio medicación
  const ultimaMed=datos.find(r=>r.meds?.length>0);
  let recordatorio=null;
  if(ultimaMed){
    const horasMed=(new Date()-new Date(ultimaMed.ts))/3600000;
    if(horasMed>=6) recordatorio=`⏰ Han pasado ${Math.floor(horasMed)}hs desde el último ${ultimaMed.meds[0]}`;
  }

  return(
    <div style={{padding:16}}>
      {/* Alerta fiebre alta */}
      {hayFiebreAlta&&(
        <div style={{background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:12,padding:"12px 16px",marginBottom:14,display:"flex",gap:10,alignItems:"center"}}>
          <span style={{fontSize:24}}>🚨</span>
          <div>
            <div style={{fontWeight:700,color:"#ef4444"}}>Temperatura alta: {ultimaTemp.temp}°C</div>
            <div style={{fontSize:12,color:"#888"}}>Consultá al médico si persiste</div>
          </div>
        </div>
      )}

      {/* Recordatorio medicación */}
      {recordatorio&&(
        <div style={{background:"#fffbeb",border:"1px solid #fde68a",borderRadius:12,padding:"12px 16px",marginBottom:14}}>
          <div style={{fontSize:13,color:"#92400e"}}>{recordatorio}</div>
        </div>
      )}

      {/* Gráfico de línea */}
      {ultimas.length>1&&(
        <Card style={{background:"#fafafa",marginBottom:14}}>
          <div style={{fontSize:12,color:"#888",marginBottom:8}}>Evolución de temperatura</div>
          <GraficoLinea datos={ultimas} color={hijo.color}/>
        </Card>
      )}

      <Btn full color={hijo.color} onClick={()=>setOpen(!open)}>+ Registrar temperatura</Btn>

      {open&&(
        <Card style={{marginTop:10}}>
          <Inp label="Temperatura (°C)" type="number" step="0.1" min="35" max="42" placeholder="38.5" value={form.temp} onChange={e=>{s({temp:e.target.value});setError("");}}/>
          {error&&<div style={{color:"#ef4444",fontSize:13,marginTop:-8,marginBottom:8}}>{error}</div>}
          <div style={{marginBottom:12}}>
            <label style={{fontSize:12,color:"#888",display:"block",marginBottom:6}}>Síntomas</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{SINTOMAS.map(x=><Chip key={x} active={form.sintomas.includes(x)} onClick={()=>toggle(form.sintomas,"sintomas",x)} color={hijo.color}>{x}</Chip>)}</div>
          </div>
          <div style={{marginBottom:12}}>
            <label style={{fontSize:12,color:"#888",display:"block",marginBottom:6}}>Medicación</label>
            <div style={{display:"flex",gap:6}}>{MEDICAMENTOS.map(x=><Chip key={x} active={form.meds.includes(x)} onClick={()=>toggle(form.meds,"meds",x)} color={hijo.color}>{x}</Chip>)}</div>
          </div>
          <Inp label="Nota" placeholder="Ej: vomitó, comió poco..." value={form.nota} onChange={e=>s({nota:e.target.value})}/>
          {/* Foto opcional */}
          <div style={{marginBottom:12}}>
            <label style={{fontSize:12,color:"#888",display:"block",marginBottom:6}}>📷 Foto (opcional)</label>
            {form.foto?(
              <div style={{position:"relative",display:"inline-block"}}>
                <img src={form.foto} style={{width:120,height:120,objectFit:"cover",borderRadius:10,border:"2px solid #e5e5e5"}} alt="foto"/>
                <button onClick={()=>s({foto:null})} style={{position:"absolute",top:-8,right:-8,background:"#ef4444",color:"#fff",border:"none",borderRadius:"50%",width:24,height:24,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
              </div>
            ):(
              <label style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderRadius:10,border:"1.5px dashed #e5e5e5",cursor:"pointer",color:"#888",fontSize:13,background:"#fafafa"}}>
                <span style={{fontSize:20}}>📷</span>
                <span>Sacar foto o elegir de galería</span>
                <input type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={subirFotoRegistro}/>
              </label>
            )}
          </div>
          <div style={{display:"flex",gap:8}}><Btn onClick={guardar} color={hijo.color} full>Guardar</Btn><Btn onClick={()=>{setOpen(false);setError("");}} secondary>Cancelar</Btn></div>
        </Card>
      )}

      {/* Agrupado por día */}
      <div style={{marginTop:16}}>
        {dias.map(dia=>{
          const registros=porDia[dia];
          const maxTemp=Math.max(...registros.map(r=>r.temp));
          const st=getTempStatus(maxTemp);
          const fechaLabel=formatFecha(dia+"T12:00:00");
          return(
            <div key={dia} style={{marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                <div style={{fontSize:13,fontWeight:700,color:"#555"}}>📅 {fechaLabel}</div>
                <Badge color={st.color} bg={st.bg}>Máx {maxTemp}°C</Badge>
              </div>
              {registros.map(r=>{
                const rst=getTempStatus(r.temp);
                return(
                  <Card key={r.id} style={{marginBottom:6}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:20,fontWeight:800,color:rst.color}}>{r.temp}°C</span>
                          <Badge color={rst.color} bg={rst.bg}>{rst.label}</Badge>
                        </div>
                        <div style={{fontSize:12,color:"#aaa",marginTop:2}}>{formatHora(r.ts)}</div>
                        {r.sintomas?.length>0&&<div style={{fontSize:12,color:"#666",marginTop:2}}>{r.sintomas.join(", ")}</div>}
                        {r.meds?.length>0&&<div style={{fontSize:12,color:hijo.color,marginTop:2}}>💊 {r.meds.join(", ")}</div>}
                        {r.nota&&<div style={{fontSize:12,color:"#888",fontStyle:"italic",marginTop:2}}>{r.nota}</div>}
                  {r.foto&&(
                    <img src={r.foto} style={{width:80,height:80,objectFit:"cover",borderRadius:8,marginTop:6,border:"1px solid #f0f0f0",cursor:"pointer"}} alt="foto registro"
                      onClick={e=>{e.stopPropagation();window.open(r.foto,'_blank');}}/>
                  )}
                      </div>
                      <button onClick={()=>borrar(r.id)} style={{background:"none",border:"none",color:"#ddd",cursor:"pointer",fontSize:18}}>×</button>
                    </div>
                  </Card>
                );
              })}
            </div>
          );
        })}
        {datos.length===0&&<Empty>Sin registros de temperatura</Empty>}
      </div>
    </div>
  );
}

function GraficoLinea({datos,color}){
  if(datos.length<2) return null;
  const vals=datos.map(d=>d.temp);
  const min=Math.min(...vals)-0.5, max=Math.max(...vals)+0.5;
  const range=max-min||1;
  const W=320,H=80,padX=10,padY=10;
  const x=i=>padX+(i/(datos.length-1))*(W-padX*2);
  const y=v=>H-padY-((v-min)/range)*(H-padY*2);
  const pts=datos.map((d,i)=>`${x(i)},${y(d.temp)}`).join(" ");
  // Líneas de referencia
  const y375=y(37.5), y38=y(38);
  return(
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:H}}>
      <line x1={padX} y1={y375} x2={W-padX} y2={y375} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3"/>
      <line x1={padX} y1={y38} x2={W-padX} y2={y38} stroke="#ef4444" strokeWidth="1" strokeDasharray="3"/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {datos.map((d,i)=>{
        const st=getTempStatus(d.temp);
        return(
          <g key={i}>
            <circle cx={x(i)} cy={y(d.temp)} r="4" fill={st.color}/>
            <text x={x(i)} y={y(d.temp)-8} textAnchor="middle" fontSize="9" fontWeight="700" fill={st.color}>{d.temp}</text>
            <text x={x(i)} y={H} textAnchor="middle" fontSize="8" fill="#aaa">{formatHora(d.ts)}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ============================================================
// SUPERMERCADO
// ============================================================
function SuperMercado({items,guardar,onBack}){
  const [input,setInput]=useState("");
  const [usuario,setUsuario]=useState(()=>localStorage.getItem("usuario")||"");
  const [setNombre,setSetNombre]=useState(!localStorage.getItem("usuario"));

  const agregar=()=>{
    if(!input.trim()) return;
    const cat=categoriaAuto(input);
    const nuevo={id:Date.now(),texto:input.trim(),categoria:cat,tachado:false,quien:usuario,ts:hoyISO()};
    guardar([nuevo,...items]);
    setInput("");
  };

  const tachar=(id)=>{
    guardar(items.map(x=>x.id===id?{...x,tachado:!x.tachado,quienTacho:x.tachado?"":usuario}:x));
  };

  const borrar=(id)=>guardar(items.filter(x=>x.id!==id));
  const limpiarTachados=()=>guardar(items.filter(x=>!x.tachado));

  if(setNombre) return(
    <div style={{fontFamily:"system-ui",maxWidth:420,margin:"0 auto",padding:32,textAlign:"center"}}>
      <div style={{fontSize:40,marginBottom:16}}>🛒</div>
      <h2 style={{margin:"0 0 8px"}}>¿Quién sos?</h2>
      <p style={{color:"#888",marginBottom:24}}>Para registrar quién agregó cada cosa</p>
      <div style={{display:"flex",gap:12,justifyContent:"center"}}>
        {["Yo","Marina"].map(n=>(
          <button key={n} onClick={()=>{localStorage.setItem("usuario",n);setUsuario(n);setSetNombre(false);}} style={{padding:"14px 28px",borderRadius:14,border:"none",background:n==="Yo"?"#4F8EF7":"#F7824F",color:"#fff",fontWeight:700,fontSize:16,cursor:"pointer"}}>{n}</button>
        ))}
      </div>
    </div>
  );

  // Agrupar por categoría
  const grupos={};
  CATS_SUPERMERCADO.forEach(c=>{grupos[c]=[];});
  items.forEach(x=>{if(grupos[x.categoria]) grupos[x.categoria].push(x); else grupos["📦 Otros"].push(x);});
  const pendientes=items.filter(x=>!x.tachado).length;

  return(
    <div style={{fontFamily:"system-ui,sans-serif",maxWidth:420,margin:"0 auto",background:"#f8f9fb",minHeight:"100vh"}}>
      <div style={{background:"linear-gradient(135deg,#22c55e,#16a34a)",padding:"20px 20px 24px"}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:10,padding:"6px 14px",color:"#fff",cursor:"pointer",fontSize:13,marginBottom:14}}>← Inicio</button>
        <div style={{color:"#fff",fontWeight:800,fontSize:22}}>🛒 Lista del súper</div>
        <div style={{color:"rgba(255,255,255,0.85)",fontSize:13,marginTop:4}}>{pendientes} pendientes · Hola, {usuario}! <span onClick={()=>{localStorage.removeItem("usuario");setSetNombre(true);}} style={{cursor:"pointer",textDecoration:"underline"}}>cambiar</span></div>
      </div>
      <div style={{padding:16}}>
        {/* Input agregar */}
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&agregar()} placeholder="Agregar producto..." style={{flex:1,padding:"12px 16px",borderRadius:12,border:"1.5px solid #e5e5e5",fontSize:15,outline:"none"}}/>
          <button onClick={agregar} style={{background:"#22c55e",color:"#fff",border:"none",borderRadius:12,padding:"12px 16px",fontWeight:700,fontSize:18,cursor:"pointer"}}>+</button>
        </div>

        {items.filter(x=>x.tachado).length>0&&(
          <button onClick={limpiarTachados} style={{width:"100%",marginBottom:12,padding:"10px",background:"#f0fdf4",border:"1px solid #86efac",borderRadius:10,color:"#16a34a",fontWeight:600,fontSize:13,cursor:"pointer"}}>🗑️ Limpiar tachados ({items.filter(x=>x.tachado).length})</button>
        )}

        {CATS_SUPERMERCADO.map(cat=>{
          const its=grupos[cat]||[];
          if(!its.length) return null;
          return(
            <div key={cat} style={{marginBottom:16}}>
              <div style={{fontSize:12,fontWeight:700,color:"#888",marginBottom:6,textTransform:"uppercase"}}>{cat}</div>
              {its.map(item=>(
                <div key={item.id} style={{background:"#fff",borderRadius:12,padding:"12px 16px",marginBottom:6,display:"flex",alignItems:"center",gap:12,opacity:item.tachado?0.5:1}}>
                  <div onClick={()=>tachar(item.id)} style={{width:24,height:24,borderRadius:"50%",border:`2px solid #22c55e`,background:item.tachado?"#22c55e":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {item.tachado&&<span style={{color:"#fff",fontSize:14}}>✓</span>}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:15,textDecoration:item.tachado?"line-through":"none",color:item.tachado?"#aaa":"#1a1a2e"}}>{item.texto}</div>
                    <div style={{fontSize:11,color:"#bbb"}}>
                      {item.quien&&`Agregó ${item.quien}`}
                      {item.tachado&&item.quienTacho&&` · Tachó ${item.quienTacho}`}
                    </div>
                  </div>
                  <button onClick={()=>borrar(item.id)} style={{background:"none",border:"none",color:"#ddd",cursor:"pointer",fontSize:18}}>×</button>
                </div>
              ))}
            </div>
          );
        })}
        {items.length===0&&<Empty>La lista está vacía 🛒</Empty>}
      </div>
    </div>
  );
}

// ============================================================
// RECETARIO
// ============================================================
const SISTEMA_CHEF = `Sos el chef personal de la familia Pigliapoco. Conocés perfectamente 3 libros de recetas:

1. "Primeras Comidas" (Dra. Jurozdicki) - Para bebés desde 6 meses. Incluye: panqueques de banana, purés de zanahoria/berenjena/papa, untable de garbanzos, pizzitas de zanahoria, rectángulos de batata y avena, fainá, pastel de papa, bolitas de pescado y arroz, milanesitas de arvejas/zucchini, ñoquis de remolacha, bocaditos de lentejas, bolitas de calabaza y polenta, empanadas de pollo, muffins de manzana, galletitas de banana y coco, heladito de arándanos y maní, torta cumple sin azúcar, buñuelos de acelga, ñoquis de queso, postre de chocolate y banana.

2. "Ñam Ñam" (Narda Lepes) - Bebés y niños. Incluye: purés de manzana y zapallo, batata y choclo, batata y ananá, lentejas y batata, papa y remolacha, palta y banana, sopa crema de coliflor, okayu (arroz japonés), galletitas de patitas de queso, vegetales asados, torta de frutas, hummus, sopa de garbanzos, risotto blanco, ñoquis de calabaza y ricota, malfatti, pancitos de leche, misoshiru, yakitori, quesadillas, arepas, fish pie, muffins salados, lasaña, carrot cake, arroz con leche, galletas, chicken pie, albondiguitas de pollo y manzana, milanesas, croquetas de pescado, estofado de carne, cordero braseado, pollo a la plancha, hamburguesas.

3. "Paulina Cocina en 30 minutos" (Paulina Cocina) - Para toda la familia. Incluye: masa para tarta 9-9-9, tarta de peras y provolone, tarta de ricota y tomate, strata de brócoli, crumble de verduras, torta de papas, pasta alfredo con pollo, pasta mediterránea, pasta con espinaca, pasta al vino tinto, tabulé, ensalada de palta y mango, brócoli gratinado, papas en paquetito, ensalada de remolacha, puré de papas y manzanas, berenjena 4 minutos, tortitas de choclo, coliflor grillada, provoleta con rúcula, cruet de merluza, pescado a la sal, ceviche, pescado provenzal, pescado en paquetito, pollo a la cacerola marroquí, bolsitas de pollo marinado, alitas adobadas, pollo al ajillo, bastones de pollo y parmesano, pollo al curry, cerdo al aceto, bondiola a la naranja, milanesitas de cerdo, solomillo al whisky, cerdo agridulce, churrasco con café, carne al vino tinto, guisito de lentejas, falafel, guiso blanco y rojo, medallones de garbanzo, palmeritas saladas, nuggets de pollo, pizza sin horno, hamburguesas rellenas, fajitas mentirosas, mousse de chocolate, flan, torta banoffee, mug cake, trufas, muffins salados.

La familia tiene dos hijos:
- GENNARO (2 años): puede comer de todo, le gustan los sabores variados
- FRANCESCO (6 meses): recién empieza con sólidos, solo puede comer recetas de bebé sin sal ni azúcar

Cuando te pregunten sobre recetas:
- Respondé en español
- Sé amigable y conciso
- Si preguntan por un hijo específico, adaptá las sugerencias a su edad
- Dá 3-4 opciones con nombre, tiempo y una línea de descripción
- Si piden una receta específica, dá los ingredientes y pasos completos
- Podés sugerir adaptaciones para hacerla apta para bebés cuando sea posible`;

function Recetario({onBack}){
  const [vista,setVista]=useState("inicio"); // inicio | lista | chat
  const [seccion,setSeccion]=useState("familia");
  const [recetaSeleccionada,setRecetaSeleccionada]=useState(null);
  const [filtroCategoria,setFiltroCategoria]=useState("Todas");
  const [mensajes,setMensajes]=useState([
    {rol:"assistant",texto:"¡Hola! Soy tu chef personal 👨‍🍳 Puedo ayudarte a encontrar recetas de los 3 libros de la familia.\n\nProbá preguntarme:\n• \"Qué le puedo dar hoy a Francesco\"\n• \"Recetas rápidas para Gennaro\"\n• \"Cómo hago los ñoquis de remolacha\"\n• \"Algo con pollo para esta noche\""}
  ]);
  const [input,setInput]=useState("");
  const [cargando,setCargando]=useState(false);
  const chatRef=useRef(null);

  const enviarMensaje=async()=>{
    if(!input.trim()||cargando) return;
    const userMsg={rol:"user",texto:input.trim()};
    setMensajes(m=>[...m,userMsg]);
    setInput("");
    setCargando(true);
    try{
      const historial=mensajes.map(m=>({role:m.rol==="user"?"user":"assistant",content:m.texto}));
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system:SISTEMA_CHEF,
          messages:[...historial,{role:"user",content:userMsg.texto}]
        })
      });
      const data=await res.json();
      const respuesta=data.content?.[0]?.text||"No pude encontrar esa receta, probá con otra pregunta.";
      setMensajes(m=>[...m,{rol:"assistant",texto:respuesta}]);
    }catch(e){
      setMensajes(m=>[...m,{rol:"assistant",texto:"Ups, hubo un error. Intentá de nuevo 🙏"}]);
    }
    setCargando(false);
    setTimeout(()=>chatRef.current?.scrollTo(0,chatRef.current.scrollHeight),100);
  };

  if(recetaSeleccionada) return <DetalleReceta receta={recetaSeleccionada} onBack={()=>setRecetaSeleccionada(null)}/>;

  const recetas=seccion==="familia"?RECETAS_FAMILIA:RECETAS_FRANCESCO;
  const categorias=["Todas",...[...new Set(recetas.map(r=>r.categoria))]];
  const filtradas=filtroCategoria==="Todas"?recetas:recetas.filter(r=>r.categoria===filtroCategoria);

  return(
    <div style={{fontFamily:"system-ui,sans-serif",maxWidth:420,margin:"0 auto",background:"#f8f9fb",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <div style={{background:"linear-gradient(135deg,#f59e0b,#ef4444)",padding:"20px 20px 24px"}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:10,padding:"6px 14px",color:"#fff",cursor:"pointer",fontSize:13,marginBottom:14}}>← Inicio</button>
        <div style={{color:"#fff",fontWeight:800,fontSize:22}}>🍳 Recetario</div>
        <div style={{color:"rgba(255,255,255,0.85)",fontSize:13,marginTop:4}}>Recetas para toda la familia</div>
        {/* Tabs */}
        <div style={{display:"flex",gap:8,marginTop:16}}>
          <button onClick={()=>setVista("chat")} style={{flex:1,padding:"10px",borderRadius:12,border:"none",background:vista==="chat"?"rgba(255,255,255,0.95)":"rgba(255,255,255,0.2)",color:vista==="chat"?"#f59e0b":"#fff",fontWeight:700,cursor:"pointer",fontSize:13}}>🤖 Chef IA</button>
          <button onClick={()=>setVista("lista")} style={{flex:1,padding:"10px",borderRadius:12,border:"none",background:vista==="lista"?"rgba(255,255,255,0.95)":"rgba(255,255,255,0.2)",color:vista==="lista"?"#f59e0b":"#fff",fontWeight:700,cursor:"pointer",fontSize:13}}>📋 Lista</button>
        </div>
      </div>

      {/* VISTA CHAT */}
      {vista==="chat"&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",height:"calc(100vh - 180px)"}}>
          <div ref={chatRef} style={{flex:1,overflowY:"auto",padding:16,display:"flex",flexDirection:"column",gap:12}}>
            {mensajes.map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:m.rol==="user"?"flex-end":"flex-start"}}>
                <div style={{maxWidth:"85%",background:m.rol==="user"?"#f59e0b":"#fff",color:m.rol==="user"?"#fff":"#1a1a2e",borderRadius:m.rol==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"12px 16px",fontSize:14,lineHeight:1.5,boxShadow:"0 2px 8px rgba(0,0,0,0.08)",whiteSpace:"pre-wrap"}}>
                  {m.texto}
                </div>
              </div>
            ))}
            {cargando&&(
              <div style={{display:"flex",justifyContent:"flex-start"}}>
                <div style={{background:"#fff",borderRadius:"18px 18px 18px 4px",padding:"12px 16px",boxShadow:"0 2px 8px rgba(0,0,0,0.08)"}}>
                  <div style={{display:"flex",gap:4}}>
                    {[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:"#f59e0b",animation:`bounce 1s ${i*0.2}s infinite`}}/>)}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Sugerencias rápidas */}
          <div style={{padding:"8px 16px",display:"flex",gap:6,flexWrap:"wrap"}}>
            {["Para Francesco hoy","Algo rápido para Gennaro","Receta con pollo","Postre fácil"].map(s=>(
              <button key={s} onClick={()=>{setInput(s);}} style={{padding:"6px 12px",borderRadius:20,border:"1.5px solid #f59e0b",background:"#fff",color:"#f59e0b",fontSize:12,cursor:"pointer",fontWeight:600}}>{s}</button>
            ))}
          </div>
          <div style={{padding:"12px 16px",display:"flex",gap:8,background:"#fff",borderTop:"1px solid #f0f0f0"}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&enviarMensaje()} placeholder="Preguntame sobre recetas..." style={{flex:1,padding:"12px 16px",borderRadius:12,border:"1.5px solid #e5e5e5",fontSize:14,outline:"none"}}/>
            <button onClick={enviarMensaje} disabled={cargando||!input.trim()} style={{background:"#f59e0b",color:"#fff",border:"none",borderRadius:12,padding:"12px 16px",fontWeight:700,fontSize:18,cursor:"pointer",opacity:cargando||!input.trim()?0.5:1}}>↑</button>
          </div>
        </div>
      )}

      {/* VISTA LISTA */}
      {vista==="lista"&&(
        <div style={{padding:16,flex:1,overflowY:"auto"}}>
          <div style={{display:"flex",gap:8,marginBottom:16}}>
            <button onClick={()=>{setSeccion("familia");setFiltroCategoria("Todas");}} style={{flex:1,padding:"10px",borderRadius:12,border:"none",background:seccion==="familia"?"#f59e0b":"#f0f0f0",color:seccion==="familia"?"#fff":"#555",fontWeight:700,cursor:"pointer"}}>👨‍👩‍👦 Familia</button>
            <button onClick={()=>{setSeccion("francesco");setFiltroCategoria("Todas");}} style={{flex:1,padding:"10px",borderRadius:12,border:"none",background:seccion==="francesco"?"#F7824F":"#f0f0f0",color:seccion==="francesco"?"#fff":"#555",fontWeight:700,cursor:"pointer"}}>👶 Francesco</button>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
            {categorias.map(c=>(
              <button key={c} onClick={()=>setFiltroCategoria(c)} style={{padding:"5px 12px",borderRadius:20,border:`1.5px solid ${filtroCategoria===c?(seccion==="familia"?"#f59e0b":"#F7824F"):"#e5e5e5"}`,background:filtroCategoria===c?(seccion==="familia"?"#f59e0b":"#F7824F"):"#fff",color:filtroCategoria===c?"#fff":"#555",fontSize:13,cursor:"pointer",fontWeight:filtroCategoria===c?600:400}}>{c}</button>
            ))}
          </div>
          {filtradas.map(r=>(
            <div key={r.id} onClick={()=>setRecetaSeleccionada(r)} style={{background:"#fff",borderRadius:14,padding:"16px",marginBottom:10,cursor:"pointer",border:"1px solid #f0f0f0",boxShadow:"0 2px 8px rgba(0,0,0,0.05)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:16,color:"#1a1a2e"}}>{r.nombre}</div>
                  <div style={{display:"flex",gap:8,marginTop:4}}>
                    <span style={{fontSize:12,color:"#888"}}>⏱️ {r.tiempo}</span>
                    <span style={{fontSize:12,background:"#f0f0f0",padding:"2px 8px",borderRadius:10,color:"#666"}}>{r.categoria}</span>
                  </div>
                </div>
                <span style={{color:"#ddd",fontSize:20,marginLeft:8}}>›</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DetalleReceta({receta,onBack}){
  const [porciones,setPorciones]=useState(2);
  return(
    <div style={{fontFamily:"system-ui,sans-serif",maxWidth:420,margin:"0 auto",background:"#f8f9fb",minHeight:"100vh",paddingBottom:40}}>
      <div style={{background:"linear-gradient(135deg,#f59e0b,#ef4444)",padding:"20px 20px 24px"}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:10,padding:"6px 14px",color:"#fff",cursor:"pointer",fontSize:13,marginBottom:14}}>← Volver</button>
        <div style={{color:"#fff",fontWeight:800,fontSize:22}}>{receta.nombre}</div>
        <div style={{color:"rgba(255,255,255,0.85)",fontSize:13,marginTop:4}}>⏱️ {receta.tiempo} · {receta.categoria}</div>
      </div>
      <div style={{padding:16}}>
        <Card>
          <div style={{fontWeight:700,fontSize:15,marginBottom:12}}>🥕 Ingredientes</div>
          {receta.ingredientes.map((ing,i)=>(
            <div key={i} style={{padding:"6px 0",borderBottom:"1px solid #f5f5f5",fontSize:14,color:"#444"}}>• {ing}</div>
          ))}
        </Card>
        <Card style={{marginTop:10}}>
          <div style={{fontWeight:700,fontSize:15,marginBottom:12}}>👨‍🍳 Preparación</div>
          {receta.pasos.map((paso,i)=>(
            <div key={i} style={{display:"flex",gap:12,padding:"8px 0",borderBottom:i<receta.pasos.length-1?"1px solid #f5f5f5":"none"}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:"#f59e0b",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>{i+1}</div>
              <div style={{fontSize:14,color:"#444",lineHeight:1.5}}>{paso}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ============================================================
// EVENTOS FAMILIARES
// ============================================================
function EventosFamilia({datos,agregar,borrar,onBack}){
  const [form,setForm]=useState({nombre:"",fecha:inputFechaHoy(),tipo:"evento",nota:""});
  const [open,setOpen]=useState(false);
  const s=t=>setForm(f=>({...f,...t}));
  const guardar=()=>{if(!form.nombre)return;agregar({...form});setForm({nombre:"",fecha:inputFechaHoy(),tipo:"evento",nota:""});setOpen(false);};
  const sorted=[...datos].sort((a,b)=>a.fecha>b.fecha?1:-1);
  const iconTipo={cumple:"🎂",evento:"🎉",vacaciones:"✈️",otro:"📌"};
  const diasHasta=(fecha)=>{
    const hoy=new Date();hoy.setHours(0,0,0,0);
    const f=new Date(fecha+"T12:00:00");
    const diff=Math.round((f-hoy)/(864e5));
    if(diff<0)return null;if(diff===0)return "¡Hoy!";if(diff===1)return "¡Mañana!";
    return `en ${diff} días`;
  };
  return(
    <div style={{fontFamily:"system-ui,sans-serif",maxWidth:420,margin:"0 auto",background:"#f8f9fb",minHeight:"100vh"}}>
      <div style={{background:"linear-gradient(135deg,#a78bfa,#ec4899)",padding:"20px 20px 24px"}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:10,padding:"6px 14px",color:"#fff",cursor:"pointer",fontSize:13,marginBottom:14}}>← Inicio</button>
        <div style={{color:"#fff",fontWeight:800,fontSize:22}}>🎉 Eventos Familiares</div>
      </div>
      <div style={{padding:16}}>
        <Btn full color="#a78bfa" onClick={()=>setOpen(!open)}>+ Agregar evento</Btn>
        {open&&(
          <Card style={{marginTop:10}}>
            <Inp label="Nombre" placeholder="Ej: Cumple abuela Rosa..." value={form.nombre} onChange={e=>s({nombre:e.target.value})}/>
            <div style={{marginBottom:12}}>
              <label style={{fontSize:12,color:"#888",display:"block",marginBottom:6}}>Tipo</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {["cumple","evento","vacaciones","otro"].map(t=><Chip key={t} active={form.tipo===t} onClick={()=>s({tipo:t})} color="#a78bfa">{iconTipo[t]} {t.charAt(0).toUpperCase()+t.slice(1)}</Chip>)}
              </div>
            </div>
            <Inp label="Fecha" type="date" value={form.fecha} onChange={e=>s({fecha:e.target.value})}/>
            <Inp label="Nota" placeholder="Detalles..." value={form.nota} onChange={e=>s({nota:e.target.value})}/>
            <div style={{display:"flex",gap:8}}><Btn onClick={guardar} color="#a78bfa" full>Guardar</Btn><Btn onClick={()=>setOpen(false)} secondary>Cancelar</Btn></div>
          </Card>
        )}
        <div style={{marginTop:16}}>
          {sorted.map(r=>{
            const dias=diasHasta(r.fecha);
            return(
              <Card key={r.id} style={{borderLeft:"3px solid #a78bfa"}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <div>
                    <div style={{fontWeight:700,fontSize:15}}>{iconTipo[r.tipo]||"📌"} {r.nombre}</div>
                    <div style={{fontSize:12,color:"#aaa"}}>{formatFecha(r.fecha+"T12:00:00")}</div>
                    {dias&&<div style={{fontSize:12,color:"#a78bfa",fontWeight:600}}>{dias}</div>}
                    {r.nota&&<div style={{fontSize:12,color:"#888",fontStyle:"italic"}}>{r.nota}</div>}
                  </div>
                  <button onClick={()=>borrar(r.id)} style={{background:"none",border:"none",color:"#ddd",cursor:"pointer",fontSize:18}}>×</button>
                </div>
              </Card>
            );
          })}
          {datos.length===0&&<Empty>Sin eventos familiares</Empty>}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// RESTO DE MÓDULOS (sin cambios significativos)
// ============================================================
function ModComidas({hijo,datos,agregar,borrar}){
  const [form,setForm]=useState({tipo:"",cantidad:"",nota:""});
  const [open,setOpen]=useState(false);
  const [verGuia,setVerGuia]=useState(false);
  const s=t=>setForm(f=>({...f,...t}));
  const guardar=()=>{if(!form.tipo)return;agregar({tipo:form.tipo,cantidad:form.cantidad,nota:form.nota,ts:hoyISO()});setForm({tipo:"",cantidad:"",nota:""});setOpen(false);};
  const esFrancesco=hijo.id==="francesco";
  const hoy=datos.filter(d=>d.ts&&d.ts.startsWith(inputFechaHoy()));
  return(
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
          <div style={{marginBottom:12}}><label style={{fontSize:12,color:"#888",display:"block",marginBottom:6}}>¿Qué comió?</label><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{COMIDAS.map(x=><Chip key={x} active={form.tipo===x} onClick={()=>s({tipo:x})} color={hijo.color}>{x}</Chip>)}</div></div>
          <Inp label="Cantidad" placeholder="200ml, medio plato..." value={form.cantidad} onChange={e=>s({cantidad:e.target.value})}/>
          <Inp label="Nota" value={form.nota} onChange={e=>s({nota:e.target.value})}/>
          <div style={{display:"flex",gap:8}}><Btn onClick={guardar} color={hijo.color} full>Guardar</Btn><Btn onClick={()=>setOpen(false)} secondary>Cancelar</Btn></div>
        </Card>
      )}
      <div style={{marginTop:16}}>
        {datos.map(r=>(<Card key={r.id}><div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontWeight:700,fontSize:16}}>🍽️ {r.tipo}</div>{r.cantidad&&<div style={{fontSize:13,color:"#666"}}>{r.cantidad}</div>}<div style={{fontSize:12,color:"#aaa"}}>{formatFecha(r.ts)} {formatHora(r.ts)}</div>{r.nota&&<div style={{fontSize:12,color:"#888",fontStyle:"italic"}}>{r.nota}</div>}</div><button onClick={()=>borrar(r.id)} style={{background:"none",border:"none",color:"#ddd",cursor:"pointer",fontSize:18}}>×</button></div></Card>))}
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
  return(<div style={{padding:16}}><Btn full color={hijo.color} onClick={()=>setOpen(!open)}>+ Agregar vacuna</Btn>{open&&(<Card style={{marginTop:10}}><div style={{marginBottom:12}}><label style={{fontSize:12,color:"#888",display:"block",marginBottom:6}}>Vacuna</label><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{VACUNAS.map(x=><Chip key={x} active={form.nombre===x} onClick={()=>s({nombre:x})} color={hijo.color}>{x}</Chip>)}</div></div><Inp label="Fecha" type="date" value={form.fecha} onChange={e=>s({fecha:e.target.value})}/><Inp label="Próximo refuerzo" type="date" value={form.proxima} onChange={e=>s({proxima:e.target.value})}/><Inp label="Nota" value={form.nota} onChange={e=>s({nota:e.target.value})}/><div style={{display:"flex",gap:8}}><Btn onClick={guardar} color={hijo.color} full>Guardar</Btn><Btn onClick={()=>setOpen(false)} secondary>Cancelar</Btn></div></Card>)}<div style={{marginTop:16}}>{datos.map(r=>(<Card key={r.id}><div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontWeight:700,fontSize:15}}>💉 {r.nombre}</div><div style={{fontSize:12,color:"#aaa"}}>Aplicada: {r.fecha?formatFecha(r.fecha+"T12:00:00"):"-"}</div>{r.proxima&&<div style={{fontSize:12,color:hijo.color,fontWeight:600}}>Próxima: {formatFecha(r.proxima+"T12:00:00")}</div>}{r.nota&&<div style={{fontSize:12,color:"#888",fontStyle:"italic"}}>{r.nota}</div>}</div><button onClick={()=>borrar(r.id)} style={{background:"none",border:"none",color:"#ddd",cursor:"pointer",fontSize:18}}>×</button></div></Card>))}{datos.length===0&&<Empty>Sin vacunas registradas</Empty>}</div></div>);
}

function ModMedico({hijo,datos,agregar,borrar}){
  const [form,setForm]=useState({fecha:inputFechaHoy(),medico:"",motivo:"",peso:"",talla:"",nota:""});
  const [open,setOpen]=useState(false);
  const s=t=>setForm(f=>({...f,...t}));
  const guardar=()=>{if(!form.fecha)return;agregar({...form});setForm({fecha:inputFechaHoy(),medico:"",motivo:"",peso:"",talla:"",nota:""});setOpen(false);};
  const proximos=datos.filter(d=>d.fecha>=inputFechaHoy()).sort((a,b)=>a.fecha>b.fecha?1:-1);
  const pasados=datos.filter(d=>d.fecha<inputFechaHoy()).sort((a,b)=>a.fecha<b.fecha?1:-1);
  return(<div style={{padding:16}}><Btn full color={hijo.color} onClick={()=>setOpen(!open)}>+ Agregar turno / consulta</Btn>{open&&(<Card style={{marginTop:10}}><Inp label="Fecha" type="date" value={form.fecha} onChange={e=>s({fecha:e.target.value})}/><Inp label="Médico" placeholder="Dr. Santiago Rossi" value={form.medico} onChange={e=>s({medico:e.target.value})}/><Inp label="Motivo" value={form.motivo} onChange={e=>s({motivo:e.target.value})}/><div style={{display:"flex",gap:8}}><Inp label="Peso (kg)" type="number" step="0.1" value={form.peso} onChange={e=>s({peso:e.target.value})}/><Inp label="Talla (cm)" type="number" value={form.talla} onChange={e=>s({talla:e.target.value})}/></div><Inp label="Indicaciones" value={form.nota} onChange={e=>s({nota:e.target.value})}/><div style={{display:"flex",gap:8}}><Btn onClick={guardar} color={hijo.color} full>Guardar</Btn><Btn onClick={()=>setOpen(false)} secondary>Cancelar</Btn></div></Card>)}{proximos.length>0&&<div style={{marginTop:16}}><SectionLabel color={hijo.color}>Próximos turnos</SectionLabel>{proximos.map(r=><TurnoCard key={r.id} r={r} hijo={hijo} borrar={borrar}/>)}</div>}{pasados.length>0&&<div style={{marginTop:16}}><SectionLabel color="#aaa">Historial</SectionLabel>{pasados.map(r=><TurnoCard key={r.id} r={r} hijo={hijo} borrar={borrar}/>)}</div>}{datos.length===0&&<Empty>Sin turnos registrados</Empty>}</div>);
}

function TurnoCard({r,hijo,borrar}){
  return(<Card><div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontWeight:700,fontSize:15}}>👨‍⚕️ {r.medico||"Médico"}</div><div style={{fontSize:12,color:"#aaa"}}>{r.fecha?formatFecha(r.fecha+"T12:00:00"):"-"} · {r.motivo||"Consulta"}</div>{(r.peso||r.talla)&&<div style={{fontSize:12,color:hijo.color}}>⚖️ {r.peso?r.peso+" kg":""}{r.talla?" · "+r.talla+" cm":""}</div>}{r.nota&&<div style={{fontSize:12,color:"#888",fontStyle:"italic",marginTop:2}}>{r.nota}</div>}</div><button onClick={()=>borrar(r.id)} style={{background:"none",border:"none",color:"#ddd",cursor:"pointer",fontSize:18}}>×</button></div></Card>);
}

function ModSueno({hijo,datos,agregar,borrar}){
  const [form,setForm]=useState({inicio:"",fin:"",nota:""});
  const [open,setOpen]=useState(false);
  const s=t=>setForm(f=>({...f,...t}));
  const guardar=()=>{if(!form.inicio)return;agregar({...form,ts:hoyISO()});setForm({inicio:"",fin:"",nota:""});setOpen(false);};
  const dur=(ini,fin)=>{let d=new Date(inputFechaHoy()+"T"+fin)-new Date(inputFechaHoy()+"T"+ini);if(d<0)d+=864e5;return `${Math.floor(d/3600000)}h ${Math.floor((d%3600000)/60000)}m`;};
  return(<div style={{padding:16}}><Btn full color={hijo.color} onClick={()=>setOpen(!open)}>+ Registrar sueño</Btn>{open&&(<Card style={{marginTop:10}}><div style={{display:"flex",gap:8}}><Inp label="Se durmió" type="time" value={form.inicio} onChange={e=>s({inicio:e.target.value})}/><Inp label="Se despertó" type="time" value={form.fin} onChange={e=>s({fin:e.target.value})}/></div><Inp label="Nota" value={form.nota} onChange={e=>s({nota:e.target.value})}/><div style={{display:"flex",gap:8}}><Btn onClick={guardar} color={hijo.color} full>Guardar</Btn><Btn onClick={()=>setOpen(false)} secondary>Cancelar</Btn></div></Card>)}<div style={{marginTop:16}}>{datos.map(r=>(<Card key={r.id}><div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontWeight:700,fontSize:15}}>😴 {r.inicio} → {r.fin||"..."}</div>{r.inicio&&r.fin&&<div style={{fontSize:13,color:hijo.color,fontWeight:600}}>{dur(r.inicio,r.fin)}</div>}<div style={{fontSize:12,color:"#aaa"}}>{formatFecha(r.ts)}</div>{r.nota&&<div style={{fontSize:12,color:"#888",fontStyle:"italic"}}>{r.nota}</div>}</div><button onClick={()=>borrar(r.id)} style={{background:"none",border:"none",color:"#ddd",cursor:"pointer",fontSize:18}}>×</button></div></Card>))}{datos.length===0&&<Empty>Sin registros de sueño</Empty>}</div></div>);
}

function ModCrecimiento({hijo,datos,agregar,borrar}){
  const [form,setForm]=useState({fecha:inputFechaHoy(),peso:"",talla:"",nota:""});
  const [open,setOpen]=useState(false);
  const s=t=>setForm(f=>({...f,...t}));
  const guardar=()=>{if(!form.peso&&!form.talla)return;agregar({...form});setForm({fecha:inputFechaHoy(),peso:"",talla:"",nota:""});setOpen(false);};
  const sorted=[...datos].sort((a,b)=>a.fecha>b.fecha?1:-1);
  const conPeso=sorted.filter(d=>d.peso);
  const conTalla=sorted.filter(d=>d.talla);
  return(<div style={{padding:16}}>{conPeso.length>1&&(<Card style={{background:"#fafafa",marginBottom:14}}><div style={{fontSize:12,color:"#888",marginBottom:8}}>Evolución de peso (kg)</div><MiniChart datos={conPeso.map(d=>({label:d.fecha.slice(5),val:parseFloat(d.peso)}))} color={hijo.color}/></Card>)}{conTalla.length>1&&(<Card style={{background:"#fafafa",marginBottom:14}}><div style={{fontSize:12,color:"#888",marginBottom:8}}>Evolución de talla (cm)</div><MiniChart datos={conTalla.map(d=>({label:d.fecha.slice(5),val:parseFloat(d.talla)}))} color="#a78bfa"/></Card>)}<Btn full color={hijo.color} onClick={()=>setOpen(!open)}>+ Registrar medición</Btn>{open&&(<Card style={{marginTop:10}}><Inp label="Fecha" type="date" value={form.fecha} onChange={e=>s({fecha:e.target.value})}/><div style={{display:"flex",gap:8}}><Inp label="Peso (kg)" type="number" step="0.1" value={form.peso} onChange={e=>s({peso:e.target.value})}/><Inp label="Talla (cm)" type="number" value={form.talla} onChange={e=>s({talla:e.target.value})}/></div><Inp label="Nota" value={form.nota} onChange={e=>s({nota:e.target.value})}/><div style={{display:"flex",gap:8}}><Btn onClick={guardar} color={hijo.color} full>Guardar</Btn><Btn onClick={()=>setOpen(false)} secondary>Cancelar</Btn></div></Card>)}<div style={{marginTop:16}}>{[...datos].sort((a,b)=>a.fecha<b.fecha?1:-1).map(r=>(<Card key={r.id}><div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontWeight:700,fontSize:15}}>📏 {r.fecha?formatFecha(r.fecha+"T12:00:00"):"-"}</div><div style={{fontSize:14,color:hijo.color,fontWeight:600}}>{r.peso?`⚖️ ${r.peso} kg`:""}{r.talla?` · 📏 ${r.talla} cm`:""}</div>{r.nota&&<div style={{fontSize:12,color:"#888",fontStyle:"italic"}}>{r.nota}</div>}</div><button onClick={()=>borrar(r.id)} style={{background:"none",border:"none",color:"#ddd",cursor:"pointer",fontSize:18}}>×</button></div></Card>))}{datos.length===0&&<Empty>Sin mediciones registradas</Empty>}</div></div>);
}

function ModJardin({hijo,datos,agregar}){
  const [form,setForm]=useState({tipo:"evento",texto:"",fecha:inputFechaHoy(),nota:""});
  const [openForm,setOpenForm]=useState(false);
  const s=t=>setForm(f=>({...f,...t}));
  const guardarItem=()=>{if(!form.texto)return;const key=form.tipo==="evento"?"eventos":form.tipo==="tarea"?"tareas":"pagos";const nuevo={...datos,[key]:[{id:Date.now(),texto:form.texto,fecha:form.fecha,nota:form.nota,hecho:false},...(datos[key]||[])]};agregar(nuevo);setForm({tipo:"evento",texto:"",fecha:inputFechaHoy(),nota:""});setOpenForm(false);};
  const toggleHecho=(key,id)=>{const nuevo={...datos,[key]:datos[key].map(x=>x.id===id?{...x,hecho:!x.hecho}:x)};agregar(nuevo);};
  const borrarItem=(key,id)=>{const nuevo={...datos,[key]:datos[key].filter(x=>x.id!==id)};agregar(nuevo);};
  return(<div style={{padding:16}}><Card style={{background:hijo.colorLight,border:`1.5px solid ${hijo.color}30`,marginBottom:14}}><div style={{fontWeight:800,fontSize:17,color:hijo.color}}>{datos.nombre||"Jardín"}</div><div style={{fontSize:13,color:"#666",marginTop:2}}>{datos.sala}</div><div style={{fontSize:13,color:"#666"}}>⏰ {datos.horario}</div>{datos.maestras?.map((m,i)=><div key={i} style={{fontSize:13,color:"#666"}}>👩‍🏫 {m.nombre} ({m.turno})</div>)}{datos.comidas?.length>0&&<div style={{fontSize:13,color:"#666"}}>🍽️ {datos.comidas.join(", ")}</div>}{datos.nota&&<div style={{fontSize:12,color:"#888",fontStyle:"italic",marginTop:4}}>{datos.nota}</div>}</Card><Btn full color={hijo.color} onClick={()=>setOpenForm(!openForm)}>+ Agregar evento / tarea / pago</Btn>{openForm&&(<Card style={{marginTop:10}}><div style={{marginBottom:12}}><label style={{fontSize:12,color:"#888",display:"block",marginBottom:6}}>Tipo</label><div style={{display:"flex",gap:6}}>{["evento","tarea","pago"].map(t=><Chip key={t} active={form.tipo===t} onClick={()=>s({tipo:t})} color={hijo.color}>{t.charAt(0).toUpperCase()+t.slice(1)}</Chip>)}</div></div><Inp label="Descripción" value={form.texto} onChange={e=>s({texto:e.target.value})}/><Inp label="Fecha" type="date" value={form.fecha} onChange={e=>s({fecha:e.target.value})}/><Inp label="Nota" value={form.nota} onChange={e=>s({nota:e.target.value})}/><div style={{display:"flex",gap:8}}><Btn onClick={guardarItem} color={hijo.color} full>Guardar</Btn><Btn onClick={()=>setOpenForm(false)} secondary>Cancelar</Btn></div></Card>)}{["eventos","tareas","pagos"].map(key=>{const items=(datos[key]||[]);if(!items.length)return null;const icons={eventos:"📅",tareas:"✅",pagos:"💰"};const labels={eventos:"Eventos",tareas:"Tareas",pagos:"Pagos"};const pend=items.filter(x=>!x.hecho);const hechos=items.filter(x=>x.hecho);return(<div key={key} style={{marginTop:16}}><SectionLabel color={hijo.color}>{icons[key]} {labels[key]}</SectionLabel>{pend.map(r=>(<Card key={r.id}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div style={{display:"flex",gap:10,alignItems:"flex-start",flex:1}}><div onClick={()=>toggleHecho(key,r.id)} style={{width:22,height:22,borderRadius:6,border:`2px solid ${hijo.color}`,cursor:"pointer",flexShrink:0,marginTop:2}}/><div><div style={{fontWeight:600,fontSize:15}}>{r.texto}</div>{r.fecha&&<div style={{fontSize:12,color:"#aaa"}}>{formatFecha(r.fecha+"T12:00:00")}</div>}{r.nota&&<div style={{fontSize:12,color:"#888",fontStyle:"italic"}}>{r.nota}</div>}</div></div><button onClick={()=>borrarItem(key,r.id)} style={{background:"none",border:"none",color:"#ddd",cursor:"pointer",fontSize:18}}>×</button></div></Card>))}{hechos.map(r=>(<Card key={r.id} style={{opacity:0.5}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",gap:10,alignItems:"center"}}><div onClick={()=>toggleHecho(key,r.id)} style={{width:22,height:22,borderRadius:6,background:hijo.color,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:14,flexShrink:0}}>✓</div><div style={{textDecoration:"line-through",color:"#aaa",fontSize:14}}>{r.texto}</div></div><button onClick={()=>borrarItem(key,r.id)} style={{background:"none",border:"none",color:"#ddd",cursor:"pointer",fontSize:18}}>×</button></div></Card>))}</div>);})}</div>);
}

function ModAgenda({hijo,datos,agregar,borrar}){
  const [form,setForm]=useState({titulo:"",fecha:inputFechaHoy(),hora:"",tipo:"turno",nota:""});
  const [open,setOpen]=useState(false);
  const s=t=>setForm(f=>({...f,...t}));
  const guardar=()=>{if(!form.titulo)return;agregar({...form,ts:hoyISO()});setForm({titulo:"",fecha:inputFechaHoy(),hora:"",tipo:"turno",nota:""});setOpen(false);};
  const proximos=datos.filter(d=>d.fecha>=inputFechaHoy()).sort((a,b)=>a.fecha>b.fecha?1:-1);
  const pasados=datos.filter(d=>d.fecha<inputFechaHoy()).sort((a,b)=>a.fecha<b.fecha?1:-1);
  const iconTipo={turno:"👨‍⚕️",evento:"📅",recordatorio:"🔔",otro:"📌"};
  return(<div style={{padding:16}}><Btn full color={hijo.color} onClick={()=>setOpen(!open)}>+ Agregar a la agenda</Btn>{open&&(<Card style={{marginTop:10}}><div style={{marginBottom:12}}><label style={{fontSize:12,color:"#888",display:"block",marginBottom:6}}>Tipo</label><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{["turno","evento","recordatorio","otro"].map(t=><Chip key={t} active={form.tipo===t} onClick={()=>s({tipo:t})} color={hijo.color}>{iconTipo[t]} {t.charAt(0).toUpperCase()+t.slice(1)}</Chip>)}</div></div><Inp label="Título" placeholder="Ej: Turno oftalmólogo..." value={form.titulo} onChange={e=>s({titulo:e.target.value})}/><div style={{display:"flex",gap:8}}><Inp label="Fecha" type="date" value={form.fecha} onChange={e=>s({fecha:e.target.value})}/><Inp label="Hora" type="time" value={form.hora} onChange={e=>s({hora:e.target.value})}/></div><Inp label="Nota" value={form.nota} onChange={e=>s({nota:e.target.value})}/><div style={{display:"flex",gap:8}}><Btn onClick={guardar} color={hijo.color} full>Guardar</Btn><Btn onClick={()=>setOpen(false)} secondary>Cancelar</Btn></div></Card>)}{proximos.length>0&&(<div style={{marginTop:16}}><SectionLabel color={hijo.color}>Próximos</SectionLabel>{proximos.map(r=>(<Card key={r.id} style={{borderLeft:`3px solid ${hijo.color}`}}><div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontWeight:700,fontSize:15}}>{iconTipo[r.tipo]} {r.titulo}</div><div style={{fontSize:12,color:"#aaa"}}>{formatFecha(r.fecha+"T12:00:00")} {r.hora&&`· ${r.hora}hs`}</div>{r.nota&&<div style={{fontSize:12,color:"#888",fontStyle:"italic"}}>{r.nota}</div>}</div><button onClick={()=>borrar(r.id)} style={{background:"none",border:"none",color:"#ddd",cursor:"pointer",fontSize:18}}>×</button></div></Card>))}</div>)}{pasados.length>0&&(<div style={{marginTop:16}}><SectionLabel color="#aaa">Pasados</SectionLabel>{pasados.map(r=>(<Card key={r.id} style={{opacity:0.6}}><div style={{display:"flex",justifyContent:"space-between"}}><div><div style={{fontWeight:600,fontSize:14}}>{iconTipo[r.tipo]} {r.titulo}</div><div style={{fontSize:12,color:"#aaa"}}>{formatFecha(r.fecha+"T12:00:00")} {r.hora&&`· ${r.hora}hs`}</div></div><button onClick={()=>borrar(r.id)} style={{background:"none",border:"none",color:"#ddd",cursor:"pointer",fontSize:18}}>×</button></div></Card>))}</div>)}{datos.length===0&&<Empty>Sin eventos en la agenda</Empty>}</div>);
}

function MiniChart({datos,color}){
  if(!datos.length)return null;
  const vals=datos.map(d=>d.val);
  const min=Math.min(...vals),max=Math.max(...vals);
  const range=max-min||1;
  const W=320,H=60,pad=20;
  const x=i=>pad+(i/(datos.length-1||1))*(W-pad*2);
  const y=v=>H-8-((v-min)/range)*(H-16);
  const pts=datos.map((d,i)=>`${x(i)},${y(d.val)}`).join(" ");
  return(<svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:H}}><polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>{datos.map((d,i)=>(<g key={i}><circle cx={x(i)} cy={y(d.val)} r="4" fill={color}/><text x={x(i)} y={H} textAnchor="middle" fontSize="9" fill="#aaa">{d.label}</text><text x={x(i)} y={y(d.val)-7} textAnchor="middle" fontSize="9" fontWeight="700" fill={color}>{d.val}</text></g>))}</svg>);
}
