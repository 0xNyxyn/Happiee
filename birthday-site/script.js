/* ---------------------------------------------------------------------
SMALL HELPER FUNCTIONS
--------------------------------------------------------------------- */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const rnd = (a, b) => a + Math.random() * (b - a);
function go(id) {
    $$('.screen').forEach((screen) => screen.classList.remove('active'));
    $(id).classList.add('active');
}

/* ---------------------------------------------------------------------
2. FLOATING BACKGROUND DECORATIONS — SUNFLOWER THEME 🌻
--------------------------------------------------------------------- */
(function createFloatingHearts() {
    const box = $('#bgHearts');
    const emojis = ['🌻', '🌼', '🌞', '🍂', '✨', '💛'];
    for (let i = 0; i < 14; i++) {
        const heart = document.createElement('span');
        heart.textContent = emojis[i % emojis.length];
        heart.style.left = `${rnd(0, 96)}vw`;
        heart.style.fontSize = `${rnd(12, 26)}px`;
        heart.style.animationDuration = `${rnd(9, 18)}s`;
        heart.style.animationDelay = `${-rnd(0, 18)}s`;
        box.appendChild(heart);
    }
})();

/* ---------------------------------------------------------------------
3. LITTLE SUNFLOWER BURST WHEN THE USER TAPS
--------------------------------------------------------------------- */
document.addEventListener('pointerdown', (event) => {
    for (let i = 0; i < 5; i++) {
        const heart = document.createElement('span');
        heart.className = 'hpop';
        heart.textContent = ['🌻', '💛', '✨'][i % 3];
        heart.style.left = `${event.clientX}px`;
        heart.style.top = `${event.clientY}px`;
        heart.style.setProperty('--dx', `${rnd(-70, 70)}px`);
        heart.style.setProperty('--dy', `${rnd(-95, -25)}px`);
        document.body.appendChild(heart);
        heart.addEventListener('animationend', () => heart.remove(), { once: true });
    }
});

/* ---------------------------------------------------------------------
4. TOAST MESSAGES
--------------------------------------------------------------------- */
let toastTimer;
function toast(message) {
    const element = $('#toast');
    element.textContent = message;
    element.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => element.classList.remove('show'), 1900);
}

/* ---------------------------------------------------------------------
5. CONFETTI / FIREWORKS CANVAS — WARM PALETTE
--------------------------------------------------------------------- */
const canvas = $('#fx');
const context = canvas.getContext('2d');
let particles = [];
const CONFETTI_COLOURS = [
    '#ffc93c', '#ffd27a', '#ff8c42', '#ffa726',
    '#ffb347', '#6b8e23', '#ff6f00', '#fff4c2'
];
function sizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
sizeCanvas();
window.addEventListener('resize', sizeCanvas);

function confetti(x, y, count = 90, power = 7) {
    for (let i = 0; i < count; i++) {
        const angle = rnd(0, Math.PI * 2);
        const speed = rnd(2, power);
        particles.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2,
            gravity: 0.14,
            size: rnd(4, 8),
            colour: CONFETTI_COLOURS[i % CONFETTI_COLOURS.length],
            rotation: rnd(0, 6.3),
            rotationSpeed: rnd(-0.2, 0.2),
            life: 0,
            maxLife: rnd(60, 110),
            circle: i % 2
        });
    }
}
function rain(count) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: rnd(0, canvas.width),
            y: -12,
            vx: rnd(-1, 1),
            vy: rnd(1.5, 3.5),
            gravity: 0.03,
            size: rnd(4, 8),
            colour: CONFETTI_COLOURS[i % CONFETTI_COLOURS.length],
            rotation: rnd(0, 6.3),
            rotationSpeed: rnd(-0.15, 0.15),
            life: 0,
            maxLife: rnd(140, 220),
            circle: i % 2
        });
    }
}
function explode(x, y) {
    const colour = `hsl(${rnd(30, 60)}, 90%, 65%)`;
    for (let i = 0; i < 42; i++) {
        const angle = (Math.PI * 2 / 42) * i;
        const speed = rnd(1.5, 5.5);
        particles.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            gravity: 0.06,
            size: rnd(2, 4),
            colour,
            rotation: 0,
            rotationSpeed: 0,
            life: 0,
            maxLife: rnd(50, 90),
            circle: 1
        });
    }
}
(function animationLoop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(
        (particle) => particle.life < particle.maxLife && particle.y < canvas.height + 30
    );
    for (const particle of particles) {
        particle.life++;
        particle.vy += particle.gravity;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;
        context.save();
        context.globalAlpha = Math.max(0, 1 - particle.life / particle.maxLife);
        context.translate(particle.x, particle.y);
        context.rotate(particle.rotation);
        context.fillStyle = particle.colour;
        if (particle.circle) {
            context.beginPath();
            context.arc(0, 0, particle.size / 2, 0, 6.3);
            context.fill();
        } else {
            context.fillRect(
                -particle.size / 2,
                -particle.size / 2,
                particle.size,
                particle.size * 0.6
            );
        }
        context.restore();
    }
    requestAnimationFrame(animationLoop);
})();

/* ---------------------------------------------------------------------
6. BACKGROUND MUSIC — "AAROO NEE" FROM SANA 🎵
Place your trimmed MP3 at: assets/aaro-nee.mp3
It will loop automatically.
--------------------------------------------------------------------- */
let musicOn = false;
let audio = null;

function getAudio() {
    if (!audio) {
        audio = new Audio('assets/aaro-nee.mp3');
        audio.loop = true;
        audio.volume = 0.55;
        audio.preload = 'auto';
    }
    return audio;
}

function setMusic(on) {
    musicOn = on;
    $('#musicBtn').textContent = on ? '🎵' : '🔇';
    const a = getAudio();
    if (on) {
        a.play().catch((err) => {
            console.warn('Audio play failed:', err);
            musicOn = false;
            $('#musicBtn').textContent = '🔇';
        });
    } else {
        a.pause();
        // Keep the position so it resumes smoothly next time
    }
}

$('#musicBtn').addEventListener('click', (event) => {
    event.stopPropagation();
    setMusic(!musicOn);
});

/* ---------------------------------------------------------------------
7. PAGE 1 — CAKE / BLOW CANDLES
--------------------------------------------------------------------- */
let wishStarted = false;
let candlesOut = 0;
let cakeTaps = 0;
function enterWish() {
    if (wishStarted) return;
    wishStarted = true;
}
$$('.flame').forEach((flame) => {
    flame.addEventListener('click', (event) => {
        event.stopPropagation();
        blowOne(flame.closest('.candle'));
    });
});
function blowOne(candle) {
    if (!candle || candle.classList.contains('out')) return;
    candle.classList.add('out');
    candlesOut++;
    const rect = candle.getBoundingClientRect();
    confetti(rect.left + rect.width / 2, rect.top, 12, 3);
    if (candlesOut >= 5) {
        wishDone();
    }
}
function blowAll() {
    $$('.candle').forEach((candle, index) => {
        setTimeout(() => blowOne(candle), index * 160);
    });
}
function wishDone() {
    setTimeout(() => {
        toast('Wish locked in! 💫');
        confetti(window.innerWidth / 2, window.innerHeight * 0.35, 140, 8);
        rain(80);
        setTimeout(() => go('#s-intro'), 1500);
    }, 350);
}
$('#blowBtn').addEventListener('click', async (event) => {
    event.stopPropagation();
    if (!musicOn) setMusic(true);
    const button = event.currentTarget;
    button.textContent = 'listening… 👂';
    if (!navigator.mediaDevices?.getUserMedia) {
        button.textContent = '🌬 Hold & blow';
        toast('Tap each flame instead ✨');
        return;
    }
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);
        const data = new Uint8Array(analyser.frequencyBinCount);
        let level = 0;
        const interval = setInterval(() => {
            analyser.getByteFrequencyData(data);
            const average = data.reduce((sum, value) => sum + value, 0) / data.length;
            level = average > 40 ? level + 1 : Math.max(0, level - 1);
            if (level > 7) {
                clearInterval(interval);
                stream.getTracks().forEach((track) => track.stop());
                ctx.close();
                button.textContent = '🌬 Hold & blow';
                blowAll();
            }
        }, 60);
        setTimeout(() => {
            if (level <= 7) {
                clearInterval(interval);
                stream.getTracks().forEach((track) => track.stop());
                ctx.close();
                button.textContent = '🌬 Hold & blow';
                toast('Can’t hear you 🙈 tap the flames ✨');
            }
        }, 6000);
    } catch (error) {
        button.textContent = '🌬 Hold & blow';
        toast('Mic says no 🙈 — tap the flames ✨');
    }
});
$('#cakeWrap').addEventListener('click', () => {
    cakeTaps++;
    if (cakeTaps === 3) {
        toast('Extra sunshine for you 🌻✨');
        confetti(window.innerWidth / 2, window.innerHeight / 2, 50, 5);
        cakeTaps = 0;
    }
});

/* ---------------------------------------------------------------------
8. PAGE 2 — ENVELOPE
--------------------------------------------------------------------- */
let envelopeOpened = false;
$('#s-intro').addEventListener('click', () => {
    if (envelopeOpened) return;
    envelopeOpened = true;
    $('#envelope').classList.add('open');
    confetti(window.innerWidth / 2, window.innerHeight / 2, 60, 5);
    setTimeout(() => {
        go('#s-letter');
        startLetter();
    }, 1200);
});

/* ---------------------------------------------------------------------
9. PAGE 3 — LETTER
--------------------------------------------------------------------- */
const LINES = [
    'Happy Birthday,',
    'Goriiiiiii 💛',
    '',
    'My bestestttttttt friend and my favorite hooman',
    'Happy Birthdayyy to my favourite headache 😌💛',
    '',
    'Ninte age koodi koodi verunnu…',
    'but maturity ipozhum “loading…” thannee manduuu 😤',
    '',
    "nth eke aayalm, I still wouldn't trade you",
    'for anyone else…',
    'vivram illelm sneham ond 🫶',
    '',
    'Stay happy, stay pretty, stay crazy —',
    'exactly like you are 💕',
    '',
    'Love you loads vaazhaeeeee 💛🌻',
];
let letterStarted = false;
let letterFinished = false;
let letterLineIndex = 0;
const letterText = $('#letterText');
function startLetter() {
    if (letterStarted) return;
    letterStarted = true;
    confetti(window.innerWidth / 2, window.innerHeight * 0.3, 70, 6);
    typeAllLines();
}
function typeAllLines() {
    if (letterFinished) return;
    if (letterLineIndex >= LINES.length) {
        finishLetter();
        return;
    }
    const line = LINES[letterLineIndex];
    if (line === '') {
        letterText.appendChild(document.createTextNode('\n'));
        letterLineIndex++;
        setTimeout(typeAllLines, 120);
        return;
    }
    const span = document.createElement('span');
    letterText.appendChild(span);
    letterText.appendChild(document.createTextNode('\n'));
    const characters = [...line];
    let characterIndex = 0;
    (function typeCharacter() {
        if (letterFinished) return;
        span.textContent += characters[characterIndex++] || '';
        if (characterIndex < characters.length) {
            setTimeout(typeCharacter, 26);
        } else {
            letterLineIndex++;
            $('.paper').scrollTop = 1e9;
            setTimeout(typeAllLines, 240);
        }
    })();
}
$('#skipBtn').addEventListener('click', (event) => {
    event.stopPropagation();
    letterFinished = true;
    letterText.textContent = LINES.join('\n');
    $('.paper').scrollTop = 1e9;
    finishLetter();
});
function finishLetter() {
    $('#skipBtn').classList.add('hidden');
    $('#toGallery').classList.remove('hidden');
    confetti(window.innerWidth / 2, window.innerHeight * 0.4, 40, 5);
}
$('#toGallery').addEventListener('click', (event) => {
    event.stopPropagation();
    go('#s-gallery');
});

/* ---------------------------------------------------------------------
10. PAGE 4 — GALLERY + PHOTO ZOOM
--------------------------------------------------------------------- */
const FALLBACK_EMOJIS = ['🌻', '🎈', '💛', '🧸'];
$$('.pola img').forEach((image, index) => {
    image.addEventListener('error', () => {
        image.onerror = null;
        image.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">` +
            `<rect width="100%" height="100%" fill="#fff4c2"/>` +
            `<text x="50%" y="54%" font-size="90" text-anchor="middle" ` +
            `dominant-baseline="middle">${FALLBACK_EMOJIS[index]}</text></svg>`
        );
    });
});
$$('.pola').forEach((photo) => {
    photo.addEventListener('click', (event) => {
        event.stopPropagation();
        $('#zoom img').src = photo.querySelector('img').src;
        $('#zoom p').textContent = photo.querySelector('figcaption').textContent;
        $('#zoom').classList.add('show');
    });
});
$('#zoom').addEventListener('click', () => $('#zoom').classList.remove('show'));
$('#toFinale').addEventListener('click', (event) => {
    event.stopPropagation();
    go('#s-finale');
    startFinale();
});

/* ---------------------------------------------------------------------
11. PAGE 5 — FINALE BALLOONS + FIREWORKS
--------------------------------------------------------------------- */
let finaleStarted = false;
let balloonInterval = null;
let fireworksInterval = null;
function startFinale() {
    if (finaleStarted) return;
    finaleStarted = true;
    rain(120);
    confetti(window.innerWidth / 2, window.innerHeight * 0.3, 120, 8);
    spawnBalloon();
    spawnBalloon();
    balloonInterval = setInterval(spawnBalloon, 1500);
    fireworksInterval = setInterval(() => {
        explode(
            rnd(window.innerWidth * 0.15, window.innerWidth * 0.85),
            rnd(window.innerHeight * 0.15, window.innerHeight * 0.45)
        );
    }, 900);
}
const BALLOON_MESSAGES = [
    'You’re the best! 💛',
    'Cutest ever 🌻',
    'Big hug! 🤗',
    'Partners in crime 😌',
    'Sneham forever 🫶',
    'Stay sunny ✨'
];
function spawnBalloon() {
    const wrapper = document.createElement('div');
    wrapper.className = 'bwrap';
    wrapper.style.left = `${rnd(2, 88)}vw`;
    wrapper.style.setProperty('--c', `hsl(${rnd(30, 60)}, 85%, 65%)`);
    wrapper.style.animationDuration = `${rnd(7, 11)}s`;
    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.addEventListener('click', (event) => {
        event.stopPropagation();
        if (balloon.dataset.popped) return;
        balloon.dataset.popped = 'true';
        balloon.classList.add('pop');
        toast(BALLOON_MESSAGES[Math.floor(Math.random() * BALLOON_MESSAGES.length)]);
        const rect = balloon.getBoundingClientRect();
        confetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 26, 4);
        setTimeout(() => wrapper.remove(), 350);
    });
    wrapper.appendChild(balloon);
    $('#balloons').appendChild(wrapper);
    wrapper.addEventListener('animationend', () => wrapper.remove(), { once: true });
}

/* ---------------------------------------------------------------------
12. WHATSAPP / LINK SHARING
--------------------------------------------------------------------- */
function createShareText() {
    return `A little birthday surprise for you 💛🌻\n\n${window.location.href}`;
}
$('#shareWhatsapp').addEventListener('click', (event) => {
    event.stopPropagation();
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(createShareText())}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
});
const shareLinkButton = $('#shareLink');
if (navigator.share) {
    shareLinkButton.classList.remove('hidden');
}
shareLinkButton.addEventListener('click', async (event) => {
    event.stopPropagation();
    try {
        await navigator.share({
            title: document.title,
            text: 'A little birthday surprise for you 💛🌻',
            url: window.location.href
        });
    } catch (error) {}
});

/* ---------------------------------------------------------------------
13. REPLAY
--------------------------------------------------------------------- */
$('#replay').addEventListener('click', (event) => {
    event.stopPropagation();
    clearInterval(balloonInterval);
    clearInterval(fireworksInterval);
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
    window.location.reload();
});

/* ---------------------------------------------------------------------
14. INITIAL PAGE
--------------------------------------------------------------------- */
window.addEventListener('load', () => {
    enterWish();
});