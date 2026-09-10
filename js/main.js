function initializeInvitation() {
  applyConfig();
  startCountdown();
  setupHeroMotion();
  setupForm();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeInvitation, { once: true });
} else {
  initializeInvitation();
}
