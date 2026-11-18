// ===================================================
// CUMPLEAÑOS DE EVA (15 AÑOS) - JAVASCRIPT
// Lógica para Blanca (la perrita), galería de 8 fotos y gestos táctiles
// ===================================================

let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Sonido tierno sintetizado de ladrido alegre ("¡Arf arf!")
function playBarkSound() {
  try {
    initAudio();
    const now = audioCtx.currentTime;

    function singleBark(delay, freqStart, freqEnd) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freqStart, now + delay);
      osc.frequency.exponentialRampToValueAtTime(freqEnd, now + delay + 0.12);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(950, now + delay);
      filter.Q.setValueAtTime(2.5, now + delay);

      gain.gain.setValueAtTime(0.001, now + delay);
      gain.gain.linearRampToValueAtTime(0.2, now + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.14);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.15);
    }

    singleBark(0, 480, 260);
    singleBark(0.16, 520, 290);
  } catch (e) {}
}

// Campanitas de fiesta
function playChimeSound() {
  try {
    initAudio();
    const notes = [523.25, 659.25, 783.99, 1046.50];
    const now = audioCtx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0.001, now + idx * 0.07);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.45);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.5);
    });
  } catch (e) {}
}

// ===================================================
// CONFETI LIGERO EN CANVAS
// ===================================================
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Confetti {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 7 + 4;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 3;
    this.gravity = 0.25;
    this.rotation = Math.random() * 360;
    this.rotSpeed = (Math.random() - 0.5) * 12;
    const colors = ['#e63963', '#ff758f', '#f4be5c', '#06d6a0', '#118ab2', '#ffd166'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.life = 1;
    this.decay = Math.random() * 0.02 + 0.015;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.rotation += this.rotSpeed;
    this.life -= this.decay;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.7);
    ctx.restore();
  }
}

function launchConfetti(x, y, count = 45) {
  for (let i = 0; i < count; i++) {
    particles.push(new Confetti(x, y));
  }
}

function renderConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.draw();
    if (p.life <= 0 || p.y > canvas.height + 20) {
      particles.splice(i, 1);
    }
  }
  requestAnimationFrame(renderConfetti);
}
renderConfetti();

// ===================================================
// BLANCA INTERACTIVA (FRASES PERSONALIZADAS)
// ===================================================
const dogStage = document.getElementById('dog-stage');
const dogSpeechBubble = document.getElementById('dog-speech');
const dogSpeechText = document.getElementById('dog-speech-text');
const openSurpriseBtn = document.getElementById('btn-open-surprise');
const surpriseContent = document.getElementById('surprise-content');

const blancaPhrases = [
  "¡Guau guau! ¡Soy Blanca! 🐾 ¡Felices 15 Años, Eva! 💐",
  "¡Blanca te manda muchos lengüetazos y besitos de cumpleaños! 🐶💖",
  "¡Te traje estas flores con todo mi amor perruno! 🌸✨",
  "¡Gracias por ser mi humana favorita en el mundo entero! 🐾🥰",
  "¡Toda la familia te manda un abrazo gigante! 🫂❤️",
  "¡A Blanca le encantan tus caricias! Tócame otra vez 🐶"
];
let phraseIdx = 0;

function animateDog(customText = null) {
  playBarkSound();
  playChimeSound();

  // Animación del perrito
  dogStage.classList.remove('happy');
  void dogStage.offsetWidth;
  dogStage.classList.add('happy');

  // Tarjeta dinámica
  dogSpeechBubble.style.opacity = '0';
  dogSpeechBubble.style.transform = 'scale(0.96)';

  setTimeout(() => {
    dogSpeechText.textContent = customText || blancaPhrases[phraseIdx % blancaPhrases.length];
    dogSpeechBubble.style.opacity = '1';
    dogSpeechBubble.style.transform = 'scale(1)';
    phraseIdx++;
  }, 160);

  const rect = dogStage.getBoundingClientRect();
  launchConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 30);
}

if (dogStage) {
  dogStage.addEventListener('click', () => animateDog());
}

// Botón de abrir carta y recuerdos
if (openSurpriseBtn) {
  openSurpriseBtn.addEventListener('click', () => {
    initAudio();
    animateDog("¡Guau! ¡Blanca y la familia te queremos infinito! Mira tus fotos y tu carta abajo 💌🐾");

    const btnRect = openSurpriseBtn.getBoundingClientRect();
    launchConfetti(btnRect.left + btnRect.width / 2, btnRect.top + btnRect.height / 2, 70);

    surpriseContent.classList.add('revealed');
    openSurpriseBtn.innerHTML = '<i class="bi bi-heart-fill text-danger me-2"></i> ¡Sorpresa Abierta!';
    openSurpriseBtn.classList.replace('btn-danger', 'btn-light');
    openSurpriseBtn.classList.add('border');

    setTimeout(() => {
      surpriseContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 450);
  });
}

// ===================================================
// GALERÍA DE 8 FOTOS Y MODAL CON DEDICATORIAS
// ===================================================

const photoAlbum = [
  {
    src: "80663945_1929840643825984_5153406189022740480_n.jpg",
    title: "Primeras Sonrisas 🌸",
    note: "Desde pequeña llenando cada rincón de luz, inocencia y risas que alegran la casa.",
    likes: 15
  },
  {
    src: "104467359_2120259758117404_8091098489337952115_n.jpg",
    title: "Juntos en Familia 💖",
    note: "El amor de familia es un lazo infinito que el tiempo y la distancia jamás podrán separar.",
    likes: 15
  },
  {
    src: "506054200_9982438398459063_3584795084433827230_n.jpg",
    title: "Tu Sonrisa Radiante ✨",
    note: "Nunca dejes de sonreír como lo haces, hermanita. Cada recuerdo a tu lado es un tesoro.",
    likes: 15
  },
  {
    src: "506815915_3766581643485199_3505512433295575853_n.jpg",
    title: "Momentos Especiales 🌷",
    note: "Cada instante compartido se convierte en una bendición inolvidable para todos nosotros.",
    likes: 15
  },
  {
    src: "507211594_3772006066276090_3072574327141203786_n.jpg",
    title: "Siempre Cerca 🤍",
    note: "La complicidad y el cariño verdadero se sienten con fuerza en cada paso que das.",
    likes: 15
  },
  {
    src: "508793425_3775232629286767_3144584521456206383_n.jpg",
    title: "Nuestra Quinceañera 👑",
    note: "Una niña maravillosa que hoy florece en sus 15 primaveras. ¡Que Dios te bendiga siempre!",
    likes: 15
  },
  {
    src: "510242110_3783850381758325_3835670269497896167_n.jpg",
    title: "Aventuras & Recuerdos 🎈",
    note: "Por mil momentos hermosos más por vivir, celebrar y compartir con los que más te aman.",
    likes: 15
  },
  {
    src: "511322156_3780467918763238_5311807717233721463_n.jpg",
    title: "Abrazo Infinito 🫂",
    note: "Aunque hoy nos encontremos lejos, te mandamos un abrazo enorme lleno de cariño.",
    likes: 15
  }
];

let currentPhotoIndex = 0;
let photoModalInstance = null;

function getPhotoModal() {
  if (!photoModalInstance) {
    photoModalInstance = new bootstrap.Modal(document.getElementById('photoModal'));
  }
  return photoModalInstance;
}

function openPhotoDetail(index) {
  currentPhotoIndex = index;
  const photo = photoAlbum[index];

  document.getElementById('modalImage').src = photo.src;
  document.getElementById('modalTitle').textContent = photo.title;
  document.getElementById('modalNote').textContent = photo.note;
  document.getElementById('modalLikesCount').textContent = photo.likes;

  getPhotoModal().show();
  playChimeSound();
}

function prevPhoto() {
  currentPhotoIndex = (currentPhotoIndex - 1 + photoAlbum.length) % photoAlbum.length;
  openPhotoDetail(currentPhotoIndex);
}

function nextPhoto() {
  currentPhotoIndex = (currentPhotoIndex + 1) % photoAlbum.length;
  openPhotoDetail(currentPhotoIndex);
}

// Likes
function likeGridPhoto(event, index, btn) {
  event.stopPropagation();
  initAudio();

  photoAlbum[index].likes++;
  const countSpan = btn.querySelector('.like-count');
  if (countSpan) countSpan.textContent = photoAlbum[index].likes;

  const modalLikes = document.getElementById('modalLikesCount');
  if (modalLikes && currentPhotoIndex === index) {
    modalLikes.textContent = photoAlbum[index].likes;
  }

  playChimeSound();
  const rect = btn.getBoundingClientRect();
  launchConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 18);
}

function likeModalPhoto() {
  initAudio();
  photoAlbum[currentPhotoIndex].likes++;
  document.getElementById('modalLikesCount').textContent = photoAlbum[currentPhotoIndex].likes;

  const gridBtns = document.querySelectorAll('.photo-thumb-card .btn-mini-like');
  if (gridBtns[currentPhotoIndex]) {
    const span = gridBtns[currentPhotoIndex].querySelector('.like-count');
    if (span) span.textContent = photoAlbum[currentPhotoIndex].likes;
  }

  playChimeSound();
  launchConfetti(window.innerWidth / 2, window.innerHeight / 2, 25);
}

// Modal de Blanca en foto real
let petModalInstance = null;
function openRealPetModal() {
  if (!petModalInstance) {
    petModalInstance = new bootstrap.Modal(document.getElementById('realPetModal'));
  }
  petModalInstance.show();
  playBarkSound();
}

// ===================================================
// GESTO TÁCTIL SWIPE EN CELULAR (DESLIZAR FOTOS)
// ===================================================
let touchStartX = 0;
let touchEndX = 0;

const modalDialog = document.getElementById('photoModal');
if (modalDialog) {
  modalDialog.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  modalDialog.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
}

function handleSwipe() {
  const threshold = 45; // Mínimo deslizamiento en px
  const diff = touchEndX - touchStartX;
  if (diff < -threshold) {
    // Deslizó hacia la izquierda -> Siguiente foto
    nextPhoto();
  } else if (diff > threshold) {
    // Deslizó hacia la derecha -> Foto anterior
    prevPhoto();
  }
}
