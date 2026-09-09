function setupAttendanceToggle() {
  // O formulário foi simplificado: nome + confirmação de presença.
}

function setupForm() {
  const form = document.getElementById("rsvpForm");
  const button = document.getElementById("submitButton");
  const status = document.getElementById("formStatus");
  if (!form || !button || !status) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.className = "form-status";
    status.textContent = "";

    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const attendance = String(formData.get("attendance") || "");

    if (!CONFIG.rsvpEndpoint || CONFIG.rsvpEndpoint.includes("COLE_AQUI")) {
      status.className = "form-status error";
      status.textContent = "O formulário ainda precisa ser conectado ao Google Sheets.";
      return;
    }

    const payload = new URLSearchParams({
      name: String(formData.get("name") || "").trim(),
      attendance,
      adults: attendance === "Sim" ? "1" : "0",
      children: "0",
      message: "",
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
      const yes = document.querySelector('input[name="attendance"][value="Sim"]');
      if (yes) yes.checked = true;
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
