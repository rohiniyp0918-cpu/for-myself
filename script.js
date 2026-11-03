// Floating water-hearts and cute faces stay around the whole experience.
const floatLayer = document.getElementById("floatLayer");
const floatSymbols = ["💗", "💕", "🩷", "💘", "😘", "🫶", "💧", "♡", "🥰"];
for (let i = 0; i < 24; i++) {
  const item = document.createElement("span");
  item.className = "float-item";
  item.textContent = floatSymbols[i % floatSymbols.length];
  item.style.left = `${Math.random() * 96}%`;
  item.style.fontSize = `${16 + Math.random() * 20}px`;
  item.style.animationDuration = `${10 + Math.random() * 13}s`;
  item.style.animationDelay = `${Math.random() * -20}s`;
  floatLayer.appendChild(item);
}

const screens = [...document.querySelectorAll(".screen")];
function showScreen(id) {
  screens.forEach(screen => screen.classList.toggle("active", screen.id === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("openSurprise").addEventListener("click", () => {
  showScreen("balloonsScreen");
});

const balloons = [...document.querySelectorAll(".balloon-wrap")];
const words = [];
const wordLine = document.getElementById("wordLine");
const balloonHint = document.getElementById("balloonHint");

function typeWord(text) {
  wordLine.textContent = "";
  let index = 0;
  const timer = setInterval(() => {
    const span = document.createElement("span");
    span.textContent = text[index];
    wordLine.appendChild(span);
    index++;
    if (index >= text.length) clearInterval(timer);
  }, 115);
}

balloons.forEach((balloon, index) => {
  balloon.addEventListener("click", () => {
    if (balloon.classList.contains("popped")) return;
    const word = balloon.dataset.word;
    words[index] = word;
    balloon.classList.add("popped");
    typeWord(word);
    balloonHint.textContent = `${words.filter(Boolean).length} of 4 balloons popped 💗`;

    if (words.filter(Boolean).length === 4) {
      balloonHint.textContent = "You did it, birthday boy! Get ready... 💥";
      setTimeout(() => showScreen("blastScreen"), 1250);
    }
  });
});

document.getElementById("giftPrompt").addEventListener("click", () => {
  document.getElementById("popOverlay").classList.add("show");
  document.getElementById("popOverlay").setAttribute("aria-hidden", "false");
});

document.getElementById("showCake").addEventListener("click", () => {
  document.getElementById("popOverlay").classList.remove("show");
  document.getElementById("popOverlay").setAttribute("aria-hidden", "true");
  showScreen("cakeScreen");
});

document.getElementById("blowBtn").addEventListener("click", () => {
  const cakeScreen = document.getElementById("cakeScreen");
  cakeScreen.classList.add("blown");
  document.getElementById("cakeMessage").textContent =
    "Wish made! May all your dreams come true, meri jaan! 💗";
  document.getElementById("blowBtn").textContent = "Your surprise is ready 💝";
  document.getElementById("blowBtn").disabled = true;
  setTimeout(() => {
    showScreen("letterScreen");
    startLetterTyping();
  }, 1800);
});

let letterTypingRun = 0;
function startLetterTyping() {
  const run = ++letterTypingRun;
  const letter = document.getElementById("letterContent");
  const template = document.createElement("template");
  template.innerHTML = letter.dataset.original || letter.innerHTML;
  letter.dataset.original = template.innerHTML;
  letter.replaceChildren();

  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  async function typeNode(node, parent) {
    if (run !== letterTypingRun) return;
    if (node.nodeType === Node.TEXT_NODE) {
      const output = document.createTextNode("");
      parent.appendChild(output);
      for (const character of node.textContent) {
        if (run !== letterTypingRun) return;
        output.appendData(character);
        await wait(50);
      }
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const output = document.createElement(node.tagName.toLowerCase());
    for (const attribute of node.attributes) output.setAttribute(attribute.name, attribute.value);
    parent.appendChild(output);
    for (const child of [...node.childNodes]) await typeNode(child, output);
  }
  (async () => {
    for (const child of [...template.content.childNodes]) await typeNode(child, letter);
  })();
}

document.getElementById("replayBtn").addEventListener("click", () => {
  // Reset the experience so the surprise can be enjoyed again.
  balloons.forEach(balloon => balloon.classList.remove("popped"));
  words.length = 0;
  wordLine.textContent = "Your message is waiting...";
  balloonHint.textContent = "Every balloon has a word just for you 💕";
  document.getElementById("cakeScreen").classList.remove("blown");
  document.getElementById("cakeMessage").textContent = "Make your sweetest wish, my love.";
  const blowBtn = document.getElementById("blowBtn");
  blowBtn.disabled = false;
  blowBtn.textContent = "Blow the candles 💨";
  letterTypingRun++;
  const letter = document.getElementById("letterContent");
  if (letter.dataset.original) letter.innerHTML = letter.dataset.original;
  showScreen("welcome");
});
