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

function formatDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    const date = d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const time = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    return `${date} ${time}`;
}

function initMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');

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
            window.location.href = item.dataset.href;
        });
    });
}

function renderSummary(history) {
    const summaryEl = document.getElementById('sessions-summary');
    summaryEl.innerHTML = '';
    if (history.length === 0) return;

    const total = history.length;
    const avg = (history.reduce((s, h) => s + (h.average || 0), 0) / total).toFixed(1);
    const totalQuestions = history.reduce((s, h) => s + (h.count || 0), 0);
    const totalMin = history.reduce((s, h) => s + (h.durationMin || 0), 0);

    const cards = [
        { num: total, str: 'Сессий пройдено' },
        { num: avg, str: 'Средний балл' },
        { num: totalQuestions, str: 'Всего вопросов' },
        { num: `${totalMin} мин`, str: 'Времени потрачено' }
    ];
    for (const c of cards) {
        const el = document.createElement('div');
        el.className = 'summary-card';
        el.innerHTML = `<p class="num"></p><p class="str"></p>`;
        el.querySelector('.num').textContent = c.num;
        el.querySelector('.str').textContent = c.str;
        summaryEl.appendChild(el);
    }
}

function renderList(history) {
    const list = document.getElementById('sessions-list');
    list.innerHTML = '';

    if (history.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'sessions-empty';
        empty.textContent = 'Ещё нет завершённых сессий.';
        list.appendChild(empty);
        return;
    }

    const sorted = history.slice().sort((a, b) => {
        const ta = new Date(a.finishedAt || 0).getTime();
        const tb = new Date(b.finishedAt || 0).getTime();
        return tb - ta;
    });

    for (const s of sorted) {
        const row = document.createElement('article');
        row.className = 'session-row';

        const title = document.createElement('p');
        title.className = 'session-row__title';
        const dir = DIRECTION_LABELS[s.direction] || s.direction;
        const lvl = LEVEL_LABELS[s.level] || s.level;
        title.textContent = `${dir} · ${lvl}`;

        const meta = document.createElement('p');
        meta.className = 'session-row__meta';
        meta.textContent = `${formatDate(s.finishedAt)} · ${s.count} вопросов · ${s.durationMin} мин`;

        const score = document.createElement('span');
        score.className = 'session-row__score';
        score.textContent = `${s.average} / 10`;

        row.appendChild(title);
        row.appendChild(score);
        row.appendChild(meta);

        if (Array.isArray(s.weakTopics) && s.weakTopics.length > 0) {
            const topics = document.createElement('div');
            topics.className = 'session-row__topics';
            for (const t of s.weakTopics) {
                const chip = document.createElement('span');
                chip.className = 'session-row__topic';
                chip.textContent = `${t.topic} · ${t.score}/10`;
                topics.appendChild(chip);
            }
            row.appendChild(topics);
        }

        list.appendChild(row);
    }
}

function render() {
    document.getElementById('device-id').textContent = TBoxesStorage.getDeviceId();
    const history = TBoxesStorage.getHistory();
    renderSummary(history);
    renderList(history);
}

document.addEventListener('DOMContentLoaded', () => {
    initMenu();
    render();

    document.getElementById('clear-history').addEventListener('click', () => {
        if (!confirm('Удалить всю историю сессий с этого устройства?')) return;
        TBoxesStorage.set('history', []);
        render();
    });
});
