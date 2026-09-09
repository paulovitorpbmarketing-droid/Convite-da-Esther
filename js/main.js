function initializeInvitation() {
  applyConfig();
  startCountdown();
  setupAttendanceToggle();
  setupForm();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeInvitation, { once: true });
} else {
  initializeInvitation();
}
