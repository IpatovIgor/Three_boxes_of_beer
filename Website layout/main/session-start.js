const ALLOWED_COUNTS = new Set(["5", "10", "15", "20"]);

class StatController {
    constructor() {
        this.directionCountMap = new Map();
        this.sessionCount = 0;
        this.resList = [];
        this.loadFromStorage();
    }

    saveToStorage() {
        TBoxesStorage.setStats({
            sessionCount: this.sessionCount,
            resList: this.resList,
            directionCountMap: Array.from(this.directionCountMap.entries())
        });
    }

    loadFromStorage() {
        const data = TBoxesStorage.getStats();
        if (data) {
            this.sessionCount = data.sessionCount || 0;
            this.resList = Array.isArray(data.resList) ? data.resList : [];
            this.directionCountMap = new Map(data.directionCountMap || []);
            if (this.directionCountMap.size === 0) this.initDefaultMap();
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
        for (let i of this.resList) sum += i;
        return (sum / this.resList.length).toFixed(1);
    }

    addSession(direction, rating = null) {
        this.sessionCount++;
        const normalizedDir = direction.toLowerCase();
        const prev = this.directionCountMap.get(normalizedDir) || 0;
        this.directionCountMap.set(normalizedDir, prev + 1);

        if (rating !== null && !isNaN(rating)) this.resList.push(rating);

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
    TBoxesStorage.setCurrentSession(payload);

    window.location.href = "../task/Task.html";
}

function initMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    if (!menuToggle || !sideMenu || !menuOverlay) return;

    function open() {
        sideMenu.classList.add('open');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function close() {
        sideMenu.classList.remove('open');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    menuToggle.addEventListener('click', () => {
        if (sideMenu.classList.contains('open')) close(); else open();
    });
    menuOverlay.addEventListener('click', close);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sideMenu.classList.contains('open')) close();
    });
    sideMenu.querySelectorAll('[data-href]').forEach(item => {
        item.addEventListener('click', () => {
            const href = item.dataset.href;
            if (!href || href.endsWith('MainPage.html')) return;
            window.location.href = href;
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    stat.updateUI();
    initMenu();
});

const sessionForm = document.getElementById("session-form");
if (sessionForm) {
    sessionForm.addEventListener("submit", startSession);
}
