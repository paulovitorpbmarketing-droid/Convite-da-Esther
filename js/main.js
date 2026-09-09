function initializeInvitation() {
  applyConfig();
  startCountdown();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeInvitation, { once: true });
} else {
  initializeInvitation();
}
