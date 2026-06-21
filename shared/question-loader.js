(function (global) {
    'use strict';

    const DATA_BASE = '../data/';
    const INDEX_PATH = DATA_BASE + 'index.json';

    let indexCache = null;
    const fileCache = new Map();

    async function fetchJSON(url) {
        const res = await fetch(url, { cache: 'no-cache' });
        if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
        return res.json();
    }

    async function loadIndex() {
        if (!indexCache) indexCache = await fetchJSON(INDEX_PATH);
        return indexCache;
    }

    async function loadFile(name) {
        if (!fileCache.has(name)) {
            fileCache.set(name, fetchJSON(DATA_BASE + name));
        }
        return fileCache.get(name);
    }

    function flatten(rawFile) {
        const out = [];
        const examLevel = rawFile.level || '';
        for (const cat of rawFile.content || []) {
            for (const q of cat.questions || []) {
                out.push({
                    id: q.id,
                    topic: cat.category || rawFile.exam_title || 'Тема',
                    text: q.question,
                    hr_focus: q.hr_focus || '',
                    examTitle: rawFile.exam_title || '',
                    examLevel
                });
            }
        }
        return out;
    }

    function shuffle(arr) {
        const copy = arr.slice();
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    async function loadQuestions(direction, level) {
        const index = await loadIndex();
        const key = `${direction}|${level}`;
        const files = (index.sources && index.sources[key]) || index.fallback || [];
        if (files.length === 0) return [];

        const datasets = await Promise.all(files.map(loadFile));
        const all = [];
        for (const ds of datasets) {
            for (const q of flatten(ds)) all.push(q);
        }
        return all;
    }

    async function pickQuestions(direction, level, count) {
        const all = await loadQuestions(direction, level);
        if (all.length === 0) return [];
        const pool = shuffle(all);
        const picked = [];
        for (let i = 0; i < count; i++) {
            picked.push(pool[i % pool.length]);
        }
        return picked;
    }

    global.TBoxesQuestions = {
        loadQuestions,
        pickQuestions
    };
})(window);
