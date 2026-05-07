(function (global) {
    'use strict';

    const PREFS_KEY = 'editorPrefs';

    const KEYWORDS = new Set([
        'function','return','var','let','const','if','else','for','while','do',
        'switch','case','break','continue','default','class','extends','super',
        'this','new','typeof','instanceof','in','of','try','catch','finally',
        'throw','async','await','yield','import','export','from','as','static',
        'true','false','null','undefined','void',
        'def','elif','lambda','pass','None','True','False','self','print',
        'public','private','protected','interface','implements','abstract','final',
        'package','enum','int','long','float','double','string','bool','boolean','char',
        'struct','func','go','select','chan','map','range',
        'fn','impl','trait','mut','pub','use','mod','crate','match','where','let'
    ]);

    let editor, textarea, overlay, codeEl, container;
    let highlightOn = true;

    function loadPrefs() {
        try {
            const raw = localStorage.getItem('tboxes:' + (window.TBoxesStorage ? TBoxesStorage.getDeviceId() : 'anon') + ':' + PREFS_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) { return null; }
    }
    function savePrefs(p) {
        try {
            const id = window.TBoxesStorage ? TBoxesStorage.getDeviceId() : 'anon';
            localStorage.setItem('tboxes:' + id + ':' + PREFS_KEY, JSON.stringify(p));
        } catch (e) {}
    }

    function escapeHTML(s) {
        return s.replace(/[&<>]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;' }[c]));
    }

    function tokenize(text) {
        // Returns HTML string with spans for Latin/code tokens; Cyrillic & rest plain.
        const out = [];
        let i = 0;
        const n = text.length;

        function isLatinLetter(c) { return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_' || c === '$'; }
        function isDigit(c) { return c >= '0' && c <= '9'; }
        function isIdentChar(c) { return isLatinLetter(c) || isDigit(c); }

        while (i < n) {
            const c = text[i];
            const c2 = text[i + 1];

            // line comment //
            if (c === '/' && c2 === '/') {
                let j = i;
                while (j < n && text[j] !== '\n') j++;
                out.push(`<span class="tok-com">${escapeHTML(text.slice(i, j))}</span>`);
                i = j;
                continue;
            }
            // block comment /* */
            if (c === '/' && c2 === '*') {
                let j = i + 2;
                while (j < n && !(text[j] === '*' && text[j + 1] === '/')) j++;
                j = Math.min(n, j + 2);
                out.push(`<span class="tok-com">${escapeHTML(text.slice(i, j))}</span>`);
                i = j;
                continue;
            }
            // # comment (python/shell)
            if (c === '#') {
                let j = i;
                while (j < n && text[j] !== '\n') j++;
                out.push(`<span class="tok-com">${escapeHTML(text.slice(i, j))}</span>`);
                i = j;
                continue;
            }
            // strings
            if (c === '"' || c === '\'' || c === '`') {
                const quote = c;
                let j = i + 1;
                while (j < n) {
                    if (text[j] === '\\') { j += 2; continue; }
                    if (text[j] === quote) { j++; break; }
                    if (quote !== '`' && text[j] === '\n') break;
                    j++;
                }
                out.push(`<span class="tok-str">${escapeHTML(text.slice(i, j))}</span>`);
                i = j;
                continue;
            }
            // numbers
            if (isDigit(c)) {
                let j = i;
                while (j < n && (isDigit(text[j]) || text[j] === '.')) j++;
                out.push(`<span class="tok-num">${escapeHTML(text.slice(i, j))}</span>`);
                i = j;
                continue;
            }
            // Latin identifier / keyword
            if (isLatinLetter(c)) {
                let j = i + 1;
                while (j < n && isIdentChar(text[j])) j++;
                const word = text.slice(i, j);
                const cls = KEYWORDS.has(word) ? 'tok-kw' : 'tok-id';
                out.push(`<span class="${cls}">${escapeHTML(word)}</span>`);
                i = j;
                continue;
            }
            // operators
            if ('+-*/%=<>!&|^~?'.includes(c)) {
                let j = i;
                while (j < n && '+-*/%=<>!&|^~?'.includes(text[j])) j++;
                out.push(`<span class="tok-op">${escapeHTML(text.slice(i, j))}</span>`);
                i = j;
                continue;
            }
            // punctuation
            if ('(){}[];,.:'.includes(c)) {
                out.push(`<span class="tok-punct">${escapeHTML(c)}</span>`);
                i++;
                continue;
            }
            // anything else (Cyrillic letters, whitespace, etc.) — pass through as plain text
            let j = i;
            while (j < n) {
                const ch = text[j];
                if (
                    isLatinLetter(ch) || isDigit(ch) ||
                    ch === '"' || ch === '\'' || ch === '`' || ch === '#' ||
                    (ch === '/' && (text[j + 1] === '/' || text[j + 1] === '*')) ||
                    '+-*/%=<>!&|^~?(){}[];,.:'.includes(ch)
                ) break;
                j++;
            }
            out.push(escapeHTML(text.slice(i, j)));
            i = j;
        }
        return out.join('');
    }

    function render() {
        if (!highlightOn) return;
        const text = textarea.value;
        // ensure trailing newline so the last line is rendered with height
        const padded = text.endsWith('\n') ? text + ' ' : text;
        codeEl.innerHTML = tokenize(padded);
    }

    function syncScroll() {
        overlay.scrollTop = textarea.scrollTop;
        overlay.scrollLeft = textarea.scrollLeft;
    }

    function applyPrefs(prefs) {
        if (!prefs) return;
        if (prefs.font) {
            container.dataset.font = prefs.font;
            document.getElementById('font-select').value = prefs.font;
        }
        if (prefs.bg) {
            container.dataset.bg = prefs.bg;
            document.getElementById('bg-select').value = prefs.bg;
        }
        if (typeof prefs.highlight === 'boolean') {
            highlightOn = prefs.highlight;
            document.getElementById('highlight-toggle').checked = prefs.highlight;
            container.classList.toggle('no-highlight', !prefs.highlight);
        }
    }

    function persistPrefs() {
        savePrefs({
            font: container.dataset.font,
            bg: container.dataset.bg,
            highlight: highlightOn
        });
    }

    function init() {
        container = document.getElementById('answer-editor');
        textarea = document.getElementById('answer');
        overlay = document.getElementById('answer-overlay');
        codeEl = overlay.querySelector('code');
        if (!container || !textarea || !overlay || !codeEl) return;

        applyPrefs(loadPrefs());

        textarea.addEventListener('input', render);
        textarea.addEventListener('scroll', syncScroll);

        document.getElementById('font-select').addEventListener('change', (e) => {
            container.dataset.font = e.target.value;
            persistPrefs();
        });
        document.getElementById('bg-select').addEventListener('change', (e) => {
            container.dataset.bg = e.target.value;
            persistPrefs();
        });
        document.getElementById('highlight-toggle').addEventListener('change', (e) => {
            highlightOn = e.target.checked;
            container.classList.toggle('no-highlight', !highlightOn);
            if (highlightOn) render();
            persistPrefs();
        });

        if (typeof ResizeObserver !== 'undefined') {
            const ro = new ResizeObserver(() => {
                overlay.style.height = textarea.offsetHeight + 'px';
            });
            ro.observe(textarea);
        }

        render();
    }

    global.AnswerEditor = {
        init,
        sync: render
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(window);
