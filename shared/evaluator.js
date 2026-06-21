(function (global) {
    'use strict';

    const LEVEL_DIFFICULTY = { junior: 1, middle: 1.15, senior: 1.3 };
    const CONFIG_KEY = 'tboxes:aiConfig';

    function getConfig() {
        try {
            const raw = localStorage.getItem(CONFIG_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    function setConfig(cfg) {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
    }

    function tokenize(text) {
        return text
            .toLowerCase()
            .replace(/[^\p{L}\p{N}\s-]+/gu, ' ')
            .split(/\s+/)
            .filter(w => w.length >= 4);
    }

    const STOP = new Set([
        'который', 'которая', 'которые', 'этот', 'эта', 'это', 'эти',
        'быть', 'есть', 'были', 'была', 'было',
        'когда', 'почему', 'каким', 'какие', 'какой', 'какая', 'какое',
        'между', 'через', 'после', 'перед', 'около',
        'может', 'можно', 'нужно', 'нужен', 'нужна', 'надо',
        'если', 'или', 'либо', 'тогда', 'также', 'ещё', 'еще',
        'что', 'как', 'где', 'там', 'тут', 'себя', 'свой', 'своя',
        'ваше', 'ваши', 'ваша', 'наше', 'наши', 'наша',
        'про', 'для', 'без', 'над', 'под', 'при', 'под', 'из-за', 'изза',
        'вашем', 'вашей', 'нашем', 'нашей',
        'objet', 'objects', 'object',
        'their', 'there', 'these', 'those', 'with', 'from', 'into', 'about',
        'have', 'been', 'being', 'were', 'than', 'then', 'this', 'that',
        'will', 'would', 'should', 'could'
    ]);

    function deriveKeywords(question) {
        const tokens = tokenize(`${question.text} ${question.hr_focus || ''}`);
        const seen = new Set();
        const out = [];
        for (const t of tokens) {
            if (STOP.has(t)) continue;
            const stem = t.length > 6 ? t.slice(0, Math.max(5, t.length - 2)) : t;
            if (seen.has(stem)) continue;
            seen.add(stem);
            out.push(stem);
        }
        return out.slice(0, 12);
    }

    function heuristicEvaluate(question, answer, level) {
        const text = answer.toLowerCase();
        if (text.trim().length < 10) {
            return {
                score: 0,
                feedback: 'Ответ слишком короткий. Раскройте тему подробнее и приведите конкретные понятия.',
                source: 'heuristic'
            };
        }

        const keywords = deriveKeywords(question);
        const matched = keywords.filter(kw => text.includes(kw)).length;
        const total = Math.max(1, keywords.length);
        const ratio = matched / total;
        const lengthBonus = Math.min(text.length / 400, 1) * 2;
        const difficulty = LEVEL_DIFFICULTY[level] || 1;

        let score = Math.round((ratio * 8 + lengthBonus) / difficulty);
        if (matched > 0) score = Math.max(score, 3);
        score = Math.max(0, Math.min(10, score));

        const feedback = buildFeedback(score, matched, total, question.topic);
        return { score, feedback, matched, total, source: 'heuristic' };
    }

    function buildFeedback(score, matched, total, topic) {
        if (score >= 9) {
            return `Отличный ответ! Вы затронули ${matched} из ${total} ключевых понятий темы «${topic}» и изложили мысль развёрнуто.`;
        }
        if (score >= 7) {
            return `Хороший ответ. Упомянуто ${matched} из ${total} ключевых понятий по теме «${topic}». Для максимального балла стоит углубить детали и привести пример.`;
        }
        if (score >= 4) {
            return `Ответ по сути верный, но поверхностный: отражено ${matched} из ${total} ключевых понятий темы «${topic}». Добавьте больше деталей и терминологии.`;
        }
        return `Ответ слабо раскрывает тему «${topic}»: совпало ${matched} из ${total} ключевых понятий. Повторите основы и приведите примеры.`;
    }

    async function remoteEvaluate(cfg, question, answer, level) {
        const body = {
            level,
            question: question.text,
            topic: question.topic,
            hr_focus: question.hr_focus,
            answer
        };
        const res = await fetch(cfg.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(cfg.apiKey ? { 'Authorization': `Bearer ${cfg.apiKey}` } : {})
            },
            body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error(`AI endpoint returned ${res.status}`);
        const data = await res.json();
        return {
            score: Math.max(0, Math.min(10, Number(data.score) || 0)),
            feedback: String(data.feedback || ''),
            source: 'ai'
        };
    }

    async function evaluateAnswer(question, answer, level) {
        const cfg = getConfig();
        if (cfg && cfg.endpoint) {
            try {
                return await remoteEvaluate(cfg, question, answer, level);
            } catch (e) {
                console.warn('AI evaluator failed, falling back to heuristic:', e);
            }
        }
        return heuristicEvaluate(question, answer, level);
    }

    global.TBoxesAI = {
        evaluateAnswer,
        getConfig,
        setConfig
    };
})(window);
