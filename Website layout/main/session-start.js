const SESSION_STORAGE_KEY = "interviewSession";
const STAT_STORAGE_KEY = "interviewStatistics";
const ALLOWED_COUNTS = new Set(["5", "10", "15", "20"]);

class StatController {
    constructor() {
        this.directionCountMap = new Map();
        this.sessionCount = 0;
        this.resList = [];
        this.loadFromStorage();
    }

    saveToStorage() {
        const data = {
            sessionCount: this.sessionCount,
            resList: this.resList,
            directionCountMap: Array.from(this.directionCountMap.entries()) // Map в массив
        };
        sessionStorage.setItem(STAT_STORAGE_KEY, JSON.stringify(data));
    }

    loadFromStorage() {
        const saved = sessionStorage.getItem(STAT_STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.sessionCount = data.sessionCount || 0;
                this.resList = data.resList || [];
                this.directionCountMap = new Map(data.directionCountMap || [
                    ["FrontEnd", 0], ["BackEnd", 0], ["FullStack", 0], ["DevOps", 0]
                ]);
            } catch (e) {
                console.error("Ошибка загрузки статистики:", e);
                this.initDefaultMap();
            }
        } else {
            this.initDefaultMap();
        }
    }

    initDefaultMap() {
        this.directionCountMap = new Map([
            ["frontend", 0], ["backend", 0], ["fullstack", 0],
            ["data-science", 0], ["devops", 0]
        ]);
    }

    getAverage() {
        if (this.resList.length === 0) return 0;
        let sum = 0;
        for (let i of this.resList) {
            sum += i;
        }
        return (sum / this.resList.length).toFixed(1);
    }

    addSession(direction, rating = null) {
        this.sessionCount++;

        const normalizedDir = direction.toLowerCase();
        if (this.directionCountMap.has(normalizedDir)) {
            this.directionCountMap.set(
                normalizedDir,
                (this.directionCountMap.get(normalizedDir) || 0) + 1
            );
        } else {
            this.directionCountMap.set(normalizedDir, 1);
        }

        if (rating !== null && !isNaN(rating)) {
            this.resList.push(rating);
        }

        this.saveToStorage();
        this.updateUI();
    }

    getMostFrequentDirection() {
        let maxDir = "Нет данных";
        let maxCount = 0;

        for (let [dir, count] of this.directionCountMap) {
            if (count > maxCount) {
                maxCount = count;
                maxDir = dir.charAt(0).toUpperCase() + dir.slice(1);
            }
        }

        return maxCount > 0 ? maxDir : "Frontend";
    }

    updateUI() {
        const sessionCountElem = document.querySelector('.session-count-stat .num');
        const averageElem = document.querySelector('.session-assessment-stat .num');
        const frequentElem = document.querySelector('.frequent-stat .num');

        if (sessionCountElem) sessionCountElem.textContent = this.sessionCount;
        if (averageElem) averageElem.textContent = this.getAverage();
        if (frequentElem) frequentElem.textContent = this.getMostFrequentDirection();
    }
}

let stat = new StatController();

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

    stat.addSession(payload.direction, null);

    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload));

    window.location.href = "../task/Task.html";
}

document.addEventListener('DOMContentLoaded', () => {
    stat.updateUI();
});

const sessionForm = document.getElementById("session-form");
if (sessionForm) {
    sessionForm.addEventListener("submit", startSession);
}