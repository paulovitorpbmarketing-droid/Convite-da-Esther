function setupAttendanceToggle() {
  const radios = document.querySelectorAll('input[name="attendance"]');
  const peopleFields = document.getElementById("peopleFields");
  const adults = document.getElementById("adults");
  const children = document.getElementById("children");

  radios.forEach(radio => radio.addEventListener("change", () => {
    const attending = document.querySelector('input[name="attendance"]:checked').value === "Sim";
    peopleFields.hidden = !attending;
    adults.required = attending;
    children.required = attending;

    if (!attending) {
      adults.value = 0;
      children.value = 0;
    } else if (Number(adults.value) === 0) {
      adults.value = 1;
    }
  }));
}

function validatePeople(attendance, adults, children) {
  if (attendance !== "Sim") return true;
  return Number.isInteger(adults) && Number.isInteger(children) && adults >= 0 && children >= 0 && (adults + children) > 0;
}

function setupForm() {
  const form = document.getElementById("rsvpForm");
  const button = document.getElementById("submitButton");
  const status = document.getElementById("formStatus");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.className = "form-status";
    status.textContent = "";

    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const attendance = String(formData.get("attendance") || "");
    const adults = Number(formData.get("adults") || 0);
    const children = Number(formData.get("children") || 0);

    if (!validatePeople(attendance, adults, children)) {
      status.className = "form-status error";
      status.textContent = "Informe pelo menos uma pessoa para a confirmação.";
      return;
    }

    if (!CONFIG.rsvpEndpoint || CONFIG.rsvpEndpoint.includes("COLE_AQUI")) {
      status.className = "form-status error";
      status.textContent = "O formulário ainda precisa ser conectado ao Google Sheets.";
      return;
    }

    const payload = new URLSearchParams({
      name: String(formData.get("name") || "").trim(),
      attendance,
      adults: String(attendance === "Sim" ? adults : 0),
      children: String(attendance === "Sim" ? children : 0),
      message: String(formData.get("message") || "").trim(),
      website: String(formData.get("website") || ""),
      source: window.location.href
    });

    button.disabled = true;
    button.textContent = "Enviando...";

    try {
      await fetch(CONFIG.rsvpEndpoint, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: payload.toString(),
        mode: "no-cors"
      });

      status.className = "form-status success";
      status.textContent = attendance === "Sim"
        ? "Presença confirmada! A família já recebeu sua resposta. ♡"
        : "Resposta registrada. Obrigado por avisar a família. ♡";

      form.reset();
      document.querySelector('input[name="attendance"][value="Sim"]').checked = true;
      document.getElementById("adults").value = 1;
      document.getElementById("children").value = 0;
      document.getElementById("peopleFields").hidden = false;
    } catch (error) {
      console.error(error);
      status.className = "form-status error";
      status.textContent = "Não foi possível enviar agora. Verifique a conexão e tente novamente.";
    } finally {
      button.disabled = false;
      button.textContent = "Enviar confirmação";
    }
  });
}
