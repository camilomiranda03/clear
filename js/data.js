divCelular = document.getElementById("numero-celular");
divTotal = document.getElementById("total");
divTotaldesc = document.getElementById("total-desc");

divCelular.innerHTML = info.metaInfo.telnum;

const telnum = info.metaInfo.telnum;
const deuda = debtMap[telnum];
const descuento = 0.5; // Descuento del 10%
const deudaConDescuento = deuda - deuda * descuento;

const formatCurrency = (value) => {
  return value.toLocaleString("es-CO", { style: "currency", currency: "COP" });
};

divCelular.innerHTML = telnum;
divTotal.innerHTML = `${formatCurrency(deuda)}`;
divTotaldesc.innerHTML = `${
  formatCurrency(deudaConDescuento)
}`;
