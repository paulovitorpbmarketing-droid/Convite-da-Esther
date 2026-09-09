function splitGraphemes(text) {
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    const segmenter = new Intl.Segmenter("pt-BR", { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), part => part.segment);
  }

  return Array.from(text);
}

function renderAnimatedName(name) {
  const element = document.getElementById("babyName");
  if (!element) return;

  const words = String(name || "").trim().split(/\s+/).filter(Boolean);
  const fragment = document.createDocumentFragment();
  const letters = [];
  let letterIndex = 0;

  element.className = "animated-name";
  element.setAttribute("aria-label", name);

  words.forEach(word => {
    const wordElement = document.createElement("span");
    wordElement.className = "name-word";
    wordElement.setAttribute("aria-hidden", "true");

    splitGraphemes(word).forEach(character => {
      const letter = document.createElement("span");
      letter.className = "name-letter";
      letter.textContent = character;
      letter.style.setProperty("--letter-delay", `${180 + letterIndex * 120}ms`);
      wordElement.appendChild(letter);
      letters.push(letter);
      letterIndex += 1;
    });

    fragment.appendChild(wordElement);
  });

  element.replaceChildren(fragment);

  const finish = () => element.classList.add("is-complete");
  const lastLetter = letters[letters.length - 1];

  if (lastLetter) {
    lastLetter.addEventListener("animationend", finish, { once: true });
    window.setTimeout(finish, 3000);
  } else {
    finish();
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => element.classList.add("is-revealing"));
  });
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function applyConfig() {
  document.title = `Jardim Encantado • ${CONFIG.babyName}`;
  renderAnimatedName(CONFIG.babyName);

  setText("babyAge", CONFIG.babyAge);
  setText("heroMessage", CONFIG.heroMessage);
  setText("dateText", CONFIG.dateText);
  setText("timeText", CONFIG.timeText);
  setText("venueName", CONFIG.venueName);
  setText("venueAddress", CONFIG.venueAddress);
  setText("giftMessage", CONFIG.giftMessage);

  const mapsButton = document.getElementById("mapsButton");
  if (mapsButton) {
    if (CONFIG.mapsUrl) {
      mapsButton.href = CONFIG.mapsUrl;
      mapsButton.hidden = false;
    } else {
      mapsButton.hidden = true;
    }
  }

  if (CONFIG.babyPhoto) {
    const frame = document.getElementById("photoFrame");
    const image = document.getElementById("babyPhoto");
    const icon = document.getElementById("babyIcon");

    if (frame && image) {
      image.src = CONFIG.babyPhoto;
      image.alt = `Foto de ${CONFIG.babyName}`;
      frame.hidden = false;
    }

    if (icon) icon.hidden = true;
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
      Object.values(parts).forEach(element => {
        if (element) element.textContent = "00";
      });

      const eventOver = document.getElementById("eventOver");
      if (eventOver) eventOver.hidden = false;
      return false;
    }

    const values = {
      days: Math.floor(distance / 86400000),
      hours: Math.floor((distance % 86400000) / 3600000),
      minutes: Math.floor((distance % 3600000) / 60000),
      seconds: Math.floor((distance % 60000) / 1000)
    };

    Object.entries(values).forEach(([key, value]) => {
      if (parts[key]) parts[key].textContent = String(value).padStart(2, "0");
    });

    return true;
  }

  update();
  const timer = window.setInterval(() => {
    if (!update()) window.clearInterval(timer);
  }, 1000);
}

function setupHeroMotion() {
  const hero = document.querySelector(".hero");
  if (!hero || typeof IntersectionObserver !== "function") return;

  const observer = new IntersectionObserver(([entry]) => {
    hero.classList.toggle("is-offscreen", !entry.isIntersecting);
  }, { threshold: 0 });

  observer.observe(hero);
}
