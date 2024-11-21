function calculateAmortization() {
  // Obtener valores del formulario
  const amount = parseFloat(document.getElementById("amount").value); // Monto del préstamo
  const interestRate = parseFloat(document.getElementById("interestRate").value) / 100; // Tasa de interés (en formato decimal)
  const insuranceRate = parseFloat(document.getElementById("insuranceRate").value) / 100; // Tasa de seguro (en formato decimal)
  const disbursementDate = new Date(document.getElementById("disbursementDate").value); // Fecha de desembolso
  const firstPaymentDate = new Date(document.getElementById("firstPaymentDate").value); // Fecha del primer pago
  const term = parseInt(document.getElementById("term").value); // Plazo en meses
  const days = parseInt(document.getElementById("days").value); // Días entre desembolso y primer pago (del formulario)

  // Inicializar tabla y variables
  const amortizationTable = document.getElementById("amortizationTable").getElementsByTagName("tbody")[0];
  amortizationTable.innerHTML = ""; // Limpiar tabla
  const monthlyPayment = amount / term; // Cuota mensual fija
  let initialBalance = amount; // Saldo inicial igual al monto del préstamo
  let currentDate = new Date(firstPaymentDate);

  // Variables para los totales
  let totalInterest = 0; // Acumulador para intereses
  let totalInsurance = 0; // Acumulador para seguros
  let totalPayment = 0; // Acumulador para total a pagar

  for (let i = 1; i <= term; i++) {
    // Obtener fecha anterior
    const previousDate = i === 1 ? disbursementDate : calcularFechaAnterior(currentDate);

    // Calcular días entre pagos
    let daysBetween = Math.round((currentDate - previousDate) / (1000 * 60 * 60 * 24));
    if (i === 1) {
      daysBetween = days; // Usar días especificados para el primer pago
    }

    // Cálculo del interés
    const interest = (initialBalance * interestRate * daysBetween) / 30;

    // Cálculo del seguro
    let insurance = initialBalance * insuranceRate;
    if (insurance < 2) {
      insurance = 2; // Seguro mínimo
    }

    // Calcular el total a pagar
    const totalRowPayment = monthlyPayment + interest + insurance;
    const newBalance = initialBalance - monthlyPayment;

    // Acumular totales
    totalInterest += interest;
    totalInsurance += insurance;
    totalPayment += totalRowPayment;

    // Agregar fila a la tabla
    const row = amortizationTable.insertRow();
    row.insertCell().textContent = i; // Mes
    row.insertCell().textContent = currentDate.toLocaleDateString("es-NI"); // Fecha de pago
    row.insertCell().textContent = daysBetween; // Días entre pagos
    row.insertCell().textContent = initialBalance.toLocaleString("es-NI", { style: "currency", currency: "NIO" }); // Saldo inicial
    row.insertCell().textContent = monthlyPayment.toLocaleString("es-NI", { style: "currency", currency: "NIO" }); // Cuota mensual
    row.insertCell().textContent = insurance.toLocaleString("es-NI", { style: "currency", currency: "NIO" }); // Seguro
    row.insertCell().textContent = interest.toLocaleString("es-NI", { style: "currency", currency: "NIO" }); // Interés
    row.insertCell().textContent = totalRowPayment.toLocaleString("es-NI", { style: "currency", currency: "NIO" }); // Total a pagar
    row.insertCell().textContent = newBalance.toLocaleString("es-NI", { style: "currency", currency: "NIO" }); // Nuevo saldo

    // Actualizar valores para el siguiente mes
    initialBalance = newBalance;
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Agregar fila resumen de totales al final de la tabla
  const footerRow = amortizationTable.insertRow();
  const footerCell = footerRow.insertCell();
  footerCell.colSpan = 5;
  footerCell.textContent = "Totales:";
  footerCell.style.fontWeight = "bold";

  const totalInsuranceCell = footerRow.insertCell();
  totalInsuranceCell.textContent = totalInsurance.toLocaleString("es-NI", { style: "currency", currency: "NIO" });
  totalInsuranceCell.style.fontWeight = "bold";

  const totalInterestCell = footerRow.insertCell();
  totalInterestCell.textContent = totalInterest.toLocaleString("es-NI", { style: "currency", currency: "NIO" });
  totalInterestCell.style.fontWeight = "bold";

  const totalPaymentCell = footerRow.insertCell();
  totalPaymentCell.textContent = totalPayment.toLocaleString("es-NI", { style: "currency", currency: "NIO" });
  totalPaymentCell.style.fontWeight = "bold";

  // Celda vacía para el último saldo
  const emptyCell = footerRow.insertCell();
  emptyCell.textContent = "";
}
