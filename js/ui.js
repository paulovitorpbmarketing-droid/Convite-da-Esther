function renderAnimatedName(name) {
  const element = document.getElementById("babyName");
  element.textContent = "";
  element.setAttribute("aria-label", name);
  element.classList.add("animated-name");

  [...name].forEach((char, index) => {
    const span = document.createElement("span");
    span.setAttribute("aria-hidden", "true");
    span.style.setProperty("--i", index);

    if (char === " ") {
      span.className = "name-space";
      span.innerHTML = "&nbsp;";
    } else {
      span.className = "name-letter";
      span.textContent = char;
    }

    element.appendChild(span);
  });
}

function applyConfig() {
  document.title = `Convite • ${CONFIG.babyName}`;
  renderAnimatedName(CONFIG.babyName);
  document.getElementById("babyAge").textContent = CONFIG.babyAge;
  document.getElementById("heroMessage").textContent = CONFIG.heroMessage;
  document.getElementById("dateText").textContent = CONFIG.dateText;
  document.getElementById("timeText").textContent = CONFIG.timeText;
  document.getElementById("venueName").textContent = CONFIG.venueName;
  document.getElementById("venueAddress").textContent = CONFIG.venueAddress;
  document.getElementById("giftMessage").textContent = CONFIG.giftMessage;

  const mapsButton = document.getElementById("mapsButton");
  if (CONFIG.mapsUrl) {
    mapsButton.href = CONFIG.mapsUrl;
    mapsButton.hidden = false;
  } else {
    mapsButton.hidden = true;
  }

  if (CONFIG.babyPhoto) {
    const frame = document.getElementById("photoFrame");
    const image = document.getElementById("babyPhoto");
    image.src = CONFIG.babyPhoto;
    image.alt = `Foto de ${CONFIG.babyName}`;
    frame.hidden = false;
    document.getElementById("babyIcon").hidden = true;
  }
}

function startCountdown() {
  const target = new Date(CONFIG.eventDate).getTime();
  const parts = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds")
  };

  function update() {
    const distance = target - Date.now();
    if (!Number.isFinite(target) || distance <= 0) {
      Object.values(parts).forEach(el => el.textContent = "00");
      document.getElementById("eventOver").hidden = false;
      return false;
    }

    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    const seconds = Math.floor((distance % 60000) / 1000);

    parts.days.textContent = String(days).padStart(2, "0");
    parts.hours.textContent = String(hours).padStart(2, "0");
    parts.minutes.textContent = String(minutes).padStart(2, "0");
    parts.seconds.textContent = String(seconds).padStart(2, "0");
    return true;
  }

  update();
  const timer = setInterval(() => {
    if (!update()) clearInterval(timer);
  }, 1000);
}
