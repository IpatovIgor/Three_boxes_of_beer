const SESSION_STORAGE_KEY = "interviewSession";
const ALLOWED_COUNTS = new Set(["5", "10", "15", "20"]);

function getCheckedValue(form, name) {
    const selected = form.querySelector(`input[name="${name}"]:checked`);
    return selected ? selected.value : "";
}

function buildSessionPayload(form) {
    const direction = getCheckedValue(form, "direction");
    const level = getCheckedValue(form, "level");
    const count = getCheckedValue(form, "count");

    if (!direction || !level || !count) {
        return { error: "Выберите направление, уровень и количество вопросов." };
    }

    if (!ALLOWED_COUNTS.has(count)) {
        return { error: "Количество вопросов должно быть 5, 10, 15 или 20." };
    }

    return {
        direction,
        level,
        count: Number(count),
        startedAt: new Date().toISOString()
    };
}

function startSession(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const payload = buildSessionPayload(form);

    if (payload.error) {
        window.alert(payload.error);
        return;
    }

    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload));
    window.location.href = "../task/Task.html";
}

const sessionForm = document.getElementById("session-form");
if (sessionForm) {
    sessionForm.addEventListener("submit", startSession);
}
