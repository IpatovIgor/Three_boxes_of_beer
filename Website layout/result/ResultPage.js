const MENU_STATE_KEY = "menuState";

function getMenuState() {
    const saved = localStorage.getItem(MENU_STATE_KEY);
    return saved === "open";
}

function saveMenuState(isOpen) {
    localStorage.setItem(MENU_STATE_KEY, isOpen ? "open" : "closed");
}

function openMenu(menu, overlay) {
    menu.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    saveMenuState(true);
}

function closeMenu(menu, overlay) {
    menu.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    saveMenuState(false);
}

function toggleMenu(menu, overlay) {
    if (menu.classList.contains('open')) {
        closeMenu(menu, overlay);
    } else {
        openMenu(menu, overlay);
    }
}

function handleEscapeKey(event, menu, overlay) {
    if (event.key === 'Escape' && menu.classList.contains('open')) {
        closeMenu(menu, overlay);
    }
}

function handleHomeClick(event) {
    window.location.href = "../main/MainPage.html";
}

function initMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const homeMenuItem = document.querySelector('.menu-item');

    if (!menuToggle || !sideMenu || !menuOverlay) {
        console.error("Menu elements not found");
        return;
    }

    // Восстанавливаем состояние меню
    if (getMenuState()) {
        openMenu(sideMenu, menuOverlay);
    }

    menuToggle.addEventListener('click', function() {
        toggleMenu(sideMenu, menuOverlay);
    });

    menuOverlay.addEventListener('click', function() {
        closeMenu(sideMenu, menuOverlay);
    });

    document.addEventListener('keydown', function(event) {
        handleEscapeKey(event, sideMenu, menuOverlay);
    });

    if (homeMenuItem) {
        homeMenuItem.addEventListener('click', handleHomeClick);
    }
}

const DIRECTION_LABELS = {
    'frontend': 'Frontend',
    'backend': 'Backend',
    'fullstack': 'Fullstack',
    'data-science': 'Data Science',
    'devops': 'DevOps'
};

const LEVEL_LABELS = {
    'junior': 'Junior',
    'middle': 'Middle',
    'senior': 'Senior'
};

function FindAndUpdate(selector, value) {
    const el = document.querySelector(selector);
    if (el) el.innerText = value;
}

function renderWeakTopics(weakTopics) {
    const panel = document.querySelector('.wrang-panel');
    if (!panel) return;

    const heading = panel.querySelector('h3');
    panel.innerHTML = '';
    if (heading) panel.appendChild(heading);

    if (!weakTopics || weakTopics.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'topek';
        empty.textContent = 'Слабых тем нет — отличная работа!';
        panel.appendChild(empty);
        return;
    }

    for (const t of weakTopics) {
        const row = document.createElement('div');
        row.className = 'wrang';

        const topic = document.createElement('p');
        topic.className = 'topek';
        topic.textContent = t.topic;

        const points = document.createElement('p');
        points.className = 'points';
        points.textContent = `${t.score}/10`;

        row.appendChild(topic);
        row.appendChild(points);
        panel.appendChild(row);
    }
}

function InsertSessionInfo() {
    const results = JSON.parse(sessionStorage.getItem('interviewResults'));
    const info = JSON.parse(sessionStorage.getItem('interviewSession'));
    if (!results || !info) return;

    const dir = DIRECTION_LABELS[info.direction] || info.direction;
    const level = LEVEL_LABELS[info.level] || info.level;
    FindAndUpdate('.feedback-header', `${dir} ${level} завершено`);

    const stats = document.querySelectorAll('.stat-panel .stat .num');
    if (stats.length >= 3) {
        stats[0].textContent = results.average;
        stats[1].textContent = results.count;
        stats[2].textContent = `${results.durationMin} мин`;
    }

    renderWeakTopics(results.weakTopics);
}

document.addEventListener('DOMContentLoaded', () => {
    initMenu();
    InsertSessionInfo();
});