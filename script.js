document.documentElement.classList.add("js");

const WEDDING_CONFIG = {
    couple: {
        person1: "Ali",
        person2: "Narcy"
    },

    wedding: {
        title: "Boda de Ali y Narcy",
        date: "2026-12-05",
        startTime: "18:00",
        endTime: "03:00",
        city: "Montevideo, Uruguay",
        timeZone: "America/Montevideo",
        description: "[DESCRIPCI\u00d3N]"
    },

    location: {
        name: "Bodega Familia Deicas",
        address: "Brigadier Gral. Fructuoso Rivera km 38.200, 90000 Juanicó, Departamento de Canelones",
        mapsUrl: "https://www.google.com/maps/place/Bodega+Familia+Deicas+-+COCINA+DEICAS/@-34.5901181,-56.2653343,17z/data=!3m1!4b1!4m6!3m5!1s0x95a65d043dc72011:0xcb18f4ac189a9ede!8m2!3d-34.5901225!4d-56.2627594!16s%2Fg%2F11h994685d?entry=ttu&g_ep=EgoyMDI2MDgwNS4xIKXMDSoASAFQAw%3D%3D"
    },

    rsvp: {
        googleFormUrl: "[GOOGLE_FORM_URL]"
    },

    gift: {
        bank: "BBVA",
        holder: "Alicia Schandy",
        account: "1234567",
    }
};

const AUDIO_CONFIG = {
    src: "./audio/nuestra-cancion.mp3",
    volume: 0.35,
    loop: true,
    fadeDuration: 1200
};

const EVENT_TITLE = WEDDING_CONFIG.wedding.title;
const EVENT_DATE = WEDDING_CONFIG.wedding.date;
const EVENT_START_TIME = WEDDING_CONFIG.wedding.startTime;
const EVENT_END_TIME = WEDDING_CONFIG.wedding.endTime;
const EVENT_LOCATION = `${WEDDING_CONFIG.location.name}, ${WEDDING_CONFIG.location.address}, ${WEDDING_CONFIG.wedding.city}`;
const EVENT_DESCRIPTION = WEDDING_CONFIG.wedding.description;
const MONTEVIDEO_OFFSET = "-03:00";

const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

function getConfigValue(path) {
    return path.split(".").reduce((value, key) => {
        if (value && Object.prototype.hasOwnProperty.call(value, key)) {
            return value[key];
        }

        return "";
    }, WEDDING_CONFIG);
}

function isPlaceholder(value) {
    return typeof value !== "string" || value.trim() === "" || /^\[[^\]]+\]$/.test(value.trim());
}

function populateConfigValues() {
    document.querySelectorAll("[data-config]").forEach((element) => {
        const value = getConfigValue(element.dataset.config);

        if (value) {
            element.textContent = value;
        }
    });
}

function toCompactDate(date) {
    return date.replace(/-/g, "");
}

function addDays(date, amount) {
    const next = new Date(`${date}T00:00:00${MONTEVIDEO_OFFSET}`);
    next.setDate(next.getDate() + amount);
    return next.toISOString().slice(0, 10);
}

function isValidTime(time) {
    return /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
}

function compactTime(time) {
    return time.replace(":", "");
}

function getEventTiming() {
    const hasTimedEvent = isValidTime(EVENT_START_TIME) && isValidTime(EVENT_END_TIME);

    if (!hasTimedEvent) {
        return {
            isAllDay: true,
            googleDates: `${toCompactDate(EVENT_DATE)}/${toCompactDate(addDays(EVENT_DATE, 1))}`,
            icsStart: `DTSTART;VALUE=DATE:${toCompactDate(EVENT_DATE)}`,
            icsEnd: `DTEND;VALUE=DATE:${toCompactDate(addDays(EVENT_DATE, 1))}`
        };
    }

    const startDateTime = new Date(`${EVENT_DATE}T${EVENT_START_TIME}:00${MONTEVIDEO_OFFSET}`);
    const endDate = new Date(`${EVENT_DATE}T${EVENT_END_TIME}:00${MONTEVIDEO_OFFSET}`) <= startDateTime
        ? addDays(EVENT_DATE, 1)
        : EVENT_DATE;

    const compactStart = `${toCompactDate(EVENT_DATE)}T${compactTime(EVENT_START_TIME)}00`;
    const compactEnd = `${toCompactDate(endDate)}T${compactTime(EVENT_END_TIME)}00`;

    return {
        isAllDay: false,
        googleDates: `${compactStart}/${compactEnd}`,
        icsStart: `DTSTART;TZID=${WEDDING_CONFIG.wedding.timeZone}:${compactStart}`,
        icsEnd: `DTEND;TZID=${WEDDING_CONFIG.wedding.timeZone}:${compactEnd}`
    };
}

function buildGoogleCalendarUrl() {
    const params = new URLSearchParams({
        action: "TEMPLATE",
        text: EVENT_TITLE,
        dates: getEventTiming().googleDates,
        details: EVENT_DESCRIPTION,
        location: EVENT_LOCATION,
        ctz: WEDDING_CONFIG.wedding.timeZone
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function setupExternalLink(link, url, message) {
    if (!link) {
        return;
    }

    if (isPlaceholder(url)) {
        link.href = "#";
        link.setAttribute("aria-disabled", "true");
        link.addEventListener("click", (event) => {
            event.preventDefault();
            window.alert(message);
        });
        return;
    }

    link.href = url;
    link.removeAttribute("aria-disabled");
}

function setupLinks() {
    const calendarLink = document.getElementById("googleCalendarLink");
    const mapsLink = document.getElementById("mapsLink");
    const rsvpLink = document.getElementById("rsvpLink");

    if (calendarLink) {
        calendarLink.href = buildGoogleCalendarUrl();
    }

    setupExternalLink(
        mapsLink,
        WEDDING_CONFIG.location.mapsUrl,
        "Reemplaza [GOOGLE_MAPS_URL] en script.js para activar este enlace."
    );

    setupExternalLink(
        rsvpLink,
        WEDDING_CONFIG.rsvp.googleFormUrl,
        "Reemplaza [GOOGLE_FORM_URL] en script.js para activar el RSVP."
    );
}

function getCountdownTarget() {
    const time = isValidTime(EVENT_START_TIME) ? EVENT_START_TIME : "00:00";
    return new Date(`${EVENT_DATE}T${time}:00${MONTEVIDEO_OFFSET}`);
}

function pad(value) {
    return String(value).padStart(2, "0");
}

function updateCountdown() {
    const target = getCountdownTarget().getTime();
    const now = Date.now();
    const distance = target - now;
    const countdown = document.querySelector("[data-countdown]");
    const message = document.getElementById("countdownMessage");

    if (!countdown || !message) {
        return;
    }

    if (distance <= 0) {
        countdown.classList.add("is-today");
        countdown.innerHTML = "<p>HOY ES EL D&Iacute;A</p>";
        message.textContent = "Montevideo nos espera.";
        return;
    }

    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    const seconds = Math.floor((distance % 60000) / 1000);

    document.getElementById("countdownDays").textContent = String(days).padStart(3, "0");
    document.getElementById("countdownHours").textContent = pad(hours);
    document.getElementById("countdownMinutes").textContent = pad(minutes);
    document.getElementById("countdownSeconds").textContent = pad(seconds);
}

function escapeIcsText(value) {
    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,")
        .replace(/\n/g, "\\n");
}

function foldIcsLine(line) {
    const maxLength = 73;

    if (line.length <= maxLength) {
        return line;
    }

    const parts = [];
    let remaining = line;

    while (remaining.length > maxLength) {
        parts.push(remaining.slice(0, maxLength));
        remaining = ` ${remaining.slice(maxLength)}`;
    }

    parts.push(remaining);
    return parts.join("\r\n");
}

function utcStamp() {
    return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function buildIcsContent() {
    const timing = getEventTiming();
    const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Ali y Narcy//Invitacion Digital//ES",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VTIMEZONE",
        `TZID:${WEDDING_CONFIG.wedding.timeZone}`,
        "BEGIN:STANDARD",
        "DTSTART:19700101T000000",
        "TZOFFSETFROM:-0300",
        "TZOFFSETTO:-0300",
        "TZNAME:UYT",
        "END:STANDARD",
        "END:VTIMEZONE",
        "BEGIN:VEVENT",
        `UID:ali-narcy-${EVENT_DATE}@boda`,
        `DTSTAMP:${utcStamp()}`,
        timing.icsStart,
        timing.icsEnd,
        `SUMMARY:${escapeIcsText(EVENT_TITLE)}`,
        `DESCRIPTION:${escapeIcsText(EVENT_DESCRIPTION)}`,
        `LOCATION:${escapeIcsText(EVENT_LOCATION)}`,
        "END:VEVENT",
        "END:VCALENDAR"
    ];

    return `${lines.map(foldIcsLine).join("\r\n")}\r\n`;
}

function setupIcsDownload() {
    const link = document.getElementById("icsDownloadLink");

    if (!link || !window.Blob || !window.URL) {
        return;
    }

    const blob = new Blob([buildIcsContent()], { type: "text/calendar;charset=utf-8" });
    link.href = URL.createObjectURL(blob);
    link.download = "wedding.ics";
}

function giftText() {
    const gift = WEDDING_CONFIG.gift;

    return [
        `Banco: ${gift.bank || "[BANCO]"}`,
        `Titular: ${gift.holder || "[TITULAR]"}`,
        `Cuenta: ${gift.account || "[CUENTA]"}`,
        `Alias: ${gift.alias || "[ALIAS]"}`
    ].join("\n");
}

function fallbackCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    const copied = document.execCommand("copy");
    textarea.remove();

    if (!copied) {
        throw new Error("Copy command failed");
    }
}

async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
    }

    fallbackCopy(text);
}

function setupGiftCopy() {
    const button = document.getElementById("copyGiftButton");
    const status = document.getElementById("copyStatus");

    if (!button || !status) {
        return;
    }

    button.addEventListener("click", async () => {
        try {
            await copyText(giftText());
            status.textContent = "COPIADO \u2713";
            button.textContent = "COPIADO \u2713";
        } catch (error) {
            status.textContent = "No se pudo copiar automaticamente.";
        }

        window.setTimeout(() => {
            status.textContent = "";
            button.textContent = "COPIAR DATOS \u2192";
        }, 2600);
    });
}

function setupAudioExperience() {
    const entryScreen = document.getElementById("entryScreen");
    const enterWithMusic = document.getElementById("enterWithMusic");
    const enterWithoutMusic = document.getElementById("enterWithoutMusic");
    const audio = document.getElementById("backgroundAudio");
    const control = document.getElementById("musicControl");
    const controlState = document.getElementById("musicControlState");

    if (!entryScreen || !enterWithMusic || !enterWithoutMusic || !audio || !control || !controlState) {
        return;
    }

    let fadeTimer = null;
    let finishFade = null;
    let audioWanted = false;

    audio.src = AUDIO_CONFIG.src;
    audio.loop = AUDIO_CONFIG.loop;
    audio.volume = 0;

    document.body.classList.add("intro-active");

    const targetVolume = () => Math.max(0, Math.min(AUDIO_CONFIG.volume, 1));

    const wait = (milliseconds) => new Promise((resolve) => {
        window.setTimeout(resolve, milliseconds);
    });

    const updateControl = (isPlaying) => {
        control.setAttribute("aria-pressed", String(isPlaying));
        control.setAttribute("aria-label", isPlaying ? "Pausar m\u00fasica" : "Activar m\u00fasica");
        controlState.textContent = isPlaying ? "\u2161" : "\u25b6";
    };

    const handlePlaybackFailure = () => {
        audioWanted = false;
        stopFade();
        audio.pause();
        audio.volume = 0;
        updateControl(false);
    };

    const showControl = () => {
        control.classList.add("is-visible");
    };

    const closeEntry = () => {
        const cleanupDelay = motionQuery.matches ? 0 : 980;

        entryScreen.classList.add("is-leaving");

        window.setTimeout(() => {
            entryScreen.classList.add("is-hidden");
            entryScreen.setAttribute("hidden", "");
            document.body.classList.remove("intro-active");
            showControl();
        }, cleanupDelay);
    };

    const stopFade = () => {
        if (fadeTimer) {
            window.clearInterval(fadeTimer);
            fadeTimer = null;
        }

        if (finishFade) {
            finishFade();
            finishFade = null;
        }
    };

    const fadeVolume = (toVolume, duration) => {
        stopFade();

        const fromVolume = audio.volume;
        const safeToVolume = Math.max(0, Math.min(toVolume, 1));
        const safeDuration = Math.max(duration, 0);

        if (safeDuration === 0) {
            audio.volume = safeToVolume;
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            const startTime = window.performance.now();
            finishFade = resolve;

            const step = () => {
                const now = window.performance.now();
                const progress = Math.min((now - startTime) / safeDuration, 1);
                audio.volume = fromVolume + (safeToVolume - fromVolume) * progress;

                if (progress < 1) {
                    return;
                }

                window.clearInterval(fadeTimer);
                fadeTimer = null;
                finishFade = null;
                resolve();
            };

            fadeTimer = window.setInterval(step, 40);
            step();
        });
    };

    const requestPlayback = async () => {
        const playPromise = audio.play();

        if (!playPromise || typeof playPromise.then !== "function") {
            if (audio.paused) {
                throw new Error("Audio playback was blocked.");
            }

            return;
        }

        let playError = null;

        playPromise.catch((error) => {
            playError = error;
            handlePlaybackFailure();
        });

        await Promise.race([
            playPromise.catch((error) => {
                playError = error;
            }),
            wait(700)
        ]);

        if (playError || audio.paused) {
            throw playError || new Error("Audio playback was blocked.");
        }
    };

    const playAudio = async () => {
        audioWanted = true;
        audio.loop = AUDIO_CONFIG.loop;

        try {
            if (audio.paused) {
                audio.volume = 0;
                await requestPlayback();
            }

            updateControl(true);
            await fadeVolume(targetVolume(), AUDIO_CONFIG.fadeDuration);
        } catch (error) {
            handlePlaybackFailure();
        }
    };

    const pauseAudio = async () => {
        audioWanted = false;
        updateControl(false);

        if (audio.paused) {
            return;
        }

        await fadeVolume(0, AUDIO_CONFIG.fadeDuration);

        if (!audioWanted) {
            audio.pause();
        }
    };

    enterWithMusic.addEventListener("click", () => {
        playAudio();
        closeEntry();
    });

    enterWithoutMusic.addEventListener("click", () => {
        audioWanted = false;
        stopFade();
        audio.pause();
        audio.volume = 0;
        updateControl(false);
        closeEntry();
    });

    control.addEventListener("click", () => {
        if (audioWanted) {
            pauseAudio();
            return;
        }

        playAudio();
    });

    audio.addEventListener("ended", () => {
        audioWanted = false;
        audio.volume = 0;
        updateControl(false);
    });

    audio.addEventListener("error", () => {
        stopFade();
        updateControl(false);
    });

    updateControl(false);
}

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            if (link.getAttribute("aria-disabled") === "true") {
                return;
            }

            const target = document.querySelector(link.getAttribute("href"));

            if (!target) {
                return;
            }

            event.preventDefault();
            target.scrollIntoView({
                behavior: motionQuery.matches ? "auto" : "smooth",
                block: "start"
            });
        });
    });
}

function setupGalleryNotes() {
    document.querySelectorAll("[data-gallery-note]").forEach((note) => {
        if (isPlaceholder(note.textContent)) {
            note.setAttribute("hidden", "");
        }
    });
}

function setupReveal() {
    const elements = document.querySelectorAll(".reveal");

    if (motionQuery.matches || !("IntersectionObserver" in window)) {
        elements.forEach((element) => element.classList.add("is-visible"));
        return;
    }

    const revealVisibleElements = () => {
        elements.forEach((element) => {
            const rect = element.getBoundingClientRect();
            const visible = rect.top < window.innerHeight && rect.bottom > 0;

            if (visible) {
                element.classList.add("is-visible");
            }
        });
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.12
    });

    elements.forEach((element) => observer.observe(element));
    window.requestAnimationFrame(revealVisibleElements);
    window.addEventListener("load", revealVisibleElements, { once: true });
}

populateConfigValues();
setupLinks();
setupIcsDownload();
setupGiftCopy();
setupAudioExperience();
setupSmoothScroll();
setupGalleryNotes();
setupReveal();
updateCountdown();
window.setInterval(updateCountdown, 1000);
