const SESSION_STORAGE_KEY = 'interviewSession';
const RESULTS_STORAGE_KEY = 'interviewResults';

const QUESTION_BANK = {
    frontend: [
        {
            topic: 'JavaScript',
            text: 'Объясните разницу между Event Loop, Call Stack и Callback Queue в JavaScript. Как они взаимодействуют при обработке асинхронного кода?',
            keywords: ['event loop', 'call stack', 'callback', 'queue', 'асинхрон', 'микротаск', 'макротаск', 'promise']
        },
        {
            topic: 'JavaScript',
            text: 'Что такое замыкание (closure) в JavaScript? Приведите практический пример использования.',
            keywords: ['замыкан', 'closure', 'область видимости', 'scope', 'функция', 'переменная', 'лексическ']
        },
        {
            topic: 'JavaScript',
            text: 'Чем отличаются var, let и const? В каких случаях следует использовать каждое из них?',
            keywords: ['var', 'let', 'const', 'hoisting', 'блок', 'область', 'переопределен', 'temporal dead zone']
        },
        {
            topic: 'JavaScript',
            text: 'Объясните прототипное наследование в JavaScript. Чем оно отличается от классического наследования?',
            keywords: ['прототип', 'prototype', '__proto__', 'наследован', 'цепочка', 'object.create', 'class']
        },
        {
            topic: 'React',
            text: 'Что такое виртуальный DOM и как React использует его для оптимизации обновлений интерфейса?',
            keywords: ['виртуальный dom', 'virtual dom', 'reconciliation', 'diff', 'рендер', 'оптимизац', 'update']
        },
        {
            topic: 'React',
            text: 'Объясните, как работает хук useEffect. Какие есть подводные камни при работе с зависимостями?',
            keywords: ['useeffect', 'зависимост', 'dependency', 'монтирован', 'cleanup', 'unmount', 'побочн']
        },
        {
            topic: 'CSS',
            text: 'В чём разница между Flexbox и Grid? Когда лучше использовать каждый из них?',
            keywords: ['flex', 'grid', 'layout', 'ось', 'row', 'column', 'сетка', 'выравнивание']
        },
        {
            topic: 'CSS',
            text: 'Как работает каскад, специфичность и наследование в CSS? Что такое !important и почему его стоит избегать?',
            keywords: ['каскад', 'специфичн', 'important', 'наследован', 'селектор', 'правило']
        },
        {
            topic: 'HTML',
            text: 'Что такое семантическая вёрстка? Какие преимущества она даёт для SEO и доступности?',
            keywords: ['семантик', 'тег', 'header', 'article', 'section', 'seo', 'доступн', 'a11y', 'screen reader']
        },
        {
            topic: 'Производительность',
            text: 'Какие метрики Core Web Vitals вы знаете? Как улучшить LCP и CLS на существующем сайте?',
            keywords: ['lcp', 'cls', 'fid', 'inp', 'core web vitals', 'метрик', 'оптимизац', 'изображен', 'layout shift']
        },
        {
            topic: 'TypeScript',
            text: 'Чем generics отличаются от any в TypeScript? Приведите пример, когда generics необходимы.',
            keywords: ['generic', 'дженерик', 'any', 'тип', 'параметр', 'typescript', 'безопасн']
        },
        {
            topic: 'Сеть',
            text: 'Объясните, как работает CORS. Какие заголовки участвуют в preflight-запросе?',
            keywords: ['cors', 'origin', 'preflight', 'options', 'access-control', 'заголовок', 'браузер']
        }
    ],
    backend: [
        {
            topic: 'Базы данных',
            text: 'В чём разница между реляционными и NoSQL базами данных? В каких случаях выбирать каждый тип?',
            keywords: ['реляционн', 'nosql', 'sql', 'схема', 'транзакц', 'acid', 'масштаб', 'json', 'документ']
        },
        {
            topic: 'Базы данных',
            text: 'Что такое индекс в базе данных? Почему избыточные индексы могут замедлить запись?',
            keywords: ['индекс', 'index', 'b-tree', 'hash', 'запрос', 'select', 'insert', 'update', 'план']
        },
        {
            topic: 'Архитектура',
            text: 'Чем отличается монолитная архитектура от микросервисной? Какие проблемы решают микросервисы?',
            keywords: ['монолит', 'микросервис', 'масштаб', 'деплой', 'межсервисн', 'независим', 'граница']
        },
        {
            topic: 'API',
            text: 'Чем отличается REST от GraphQL? Какие плюсы и минусы у каждого подхода?',
            keywords: ['rest', 'graphql', 'ресурс', 'запрос', 'over-fetching', 'under-fetching', 'схема', 'resolver']
        },
        {
            topic: 'Конкурентность',
            text: 'Объясните, что такое race condition и deadlock. Как предотвращать эти проблемы?',
            keywords: ['race', 'гонка', 'deadlock', 'блокировк', 'mutex', 'lock', 'синхронизац', 'поток']
        },
        {
            topic: 'Кэширование',
            text: 'Какие стратегии кэширования вы знаете? Что такое cache invalidation и почему это сложно?',
            keywords: ['кэш', 'cache', 'ttl', 'lru', 'инвалидац', 'redis', 'memcached', 'hit', 'miss']
        },
        {
            topic: 'Безопасность',
            text: 'Как защититься от SQL-инъекций? Приведите несколько подходов в современных фреймворках.',
            keywords: ['sql', 'инъекц', 'параметризован', 'prepared', 'orm', 'экраниров', 'валидац']
        },
        {
            topic: 'HTTP',
            text: 'В чём разница между статусами 401 и 403? Когда сервер должен возвращать каждый из них?',
            keywords: ['401', '403', 'unauthorized', 'forbidden', 'аутентификац', 'авторизац', 'токен']
        },
        {
            topic: 'Очереди',
            text: 'Зачем нужны брокеры сообщений (RabbitMQ, Kafka)? Когда использовать очередь вместо синхронного вызова?',
            keywords: ['очеред', 'брокер', 'kafka', 'rabbitmq', 'асинхрон', 'producer', 'consumer', 'message']
        },
        {
            topic: 'Транзакции',
            text: 'Что такое ACID? Объясните уровни изоляции транзакций и их компромиссы.',
            keywords: ['acid', 'атомарн', 'consistency', 'изоляц', 'durability', 'read committed', 'repeatable', 'serializable']
        },
        {
            topic: 'Тестирование',
            text: 'Чем отличаются unit, integration и e2e тесты? Какая пирамида тестирования и зачем она нужна?',
            keywords: ['unit', 'integration', 'e2e', 'пирамида', 'мок', 'mock', 'покрытие', 'стаб']
        }
    ],
    fullstack: [
        {
            topic: 'Архитектура',
            text: 'Как вы организуете взаимодействие фронтенда и бэкенда в современном приложении? Где проходит граница ответственности?',
            keywords: ['api', 'rest', 'graphql', 'контракт', 'валидац', 'фронт', 'бэк', 'граница']
        },
        {
            topic: 'Аутентификация',
            text: 'Объясните разницу между сессиями и JWT. Где вы бы хранили токен на клиенте и почему?',
            keywords: ['сессия', 'jwt', 'токен', 'cookie', 'httponly', 'refresh', 'xss', 'csrf']
        },
        {
            topic: 'Производительность',
            text: 'Что такое SSR, CSR и ISR? В каких сценариях каждый подход оправдан?',
            keywords: ['ssr', 'csr', 'isr', 'рендер', 'seo', 'гидратац', 'статик', 'next']
        },
        {
            topic: 'Базы данных',
            text: 'Когда стоит денормализовать данные? Какие компромиссы это влечёт?',
            keywords: ['денормализац', 'нормализац', 'избыточн', 'производительн', 'join', 'консистентн']
        },
        {
            topic: 'DevOps',
            text: 'Что должно входить в CI-пайплайн фулстек-проекта? Какие шаги вы бы автоматизировали в первую очередь?',
            keywords: ['ci', 'cd', 'пайплайн', 'линтер', 'тест', 'сборк', 'деплой', 'docker']
        },
        {
            topic: 'Безопасность',
            text: 'Какие основные уязвимости из OWASP Top 10 вы учитываете при разработке веб-приложений?',
            keywords: ['owasp', 'xss', 'csrf', 'sql', 'инъекц', 'brute', 'санитизац', 'валидац']
        },
        {
            topic: 'Реалтайм',
            text: 'Когда использовать WebSocket, а когда Server-Sent Events или long polling? Какие у них ограничения?',
            keywords: ['websocket', 'sse', 'polling', 'двунаправлен', 'реалтайм', 'соединен', 'http']
        },
        {
            topic: 'Тестирование',
            text: 'Как тестировать интеграцию фронтенда с бэкендом? Когда мок-сервер оправдан, а когда нужен реальный бэкенд?',
            keywords: ['мок', 'mock', 'интеграц', 'contract', 'e2e', 'cypress', 'playwright', 'реальн']
        },
        {
            topic: 'Состояние',
            text: 'Как вы выбираете между локальным и глобальным состоянием на фронтенде? Какие библиотеки используете и почему?',
            keywords: ['состоян', 'state', 'redux', 'zustand', 'context', 'локальн', 'глобальн']
        }
    ],
    'data-science': [
        {
            topic: 'Машинное обучение',
            text: 'В чём разница между bias и variance? Как диагностировать переобучение модели?',
            keywords: ['bias', 'variance', 'переобуч', 'overfit', 'underfit', 'валидац', 'регуляризац', 'кросс']
        },
        {
            topic: 'Машинное обучение',
            text: 'Объясните, как работает градиентный бустинг. Чем XGBoost отличается от случайного леса?',
            keywords: ['градиент', 'бустинг', 'xgboost', 'случайный лес', 'random forest', 'ансамбль', 'дерев']
        },
        {
            topic: 'Статистика',
            text: 'Что такое p-value? Какие распространённые ошибки при его интерпретации?',
            keywords: ['p-value', 'гипотез', 'значимост', 'распределен', 'null', 'тест', 'стат']
        },
        {
            topic: 'Feature Engineering',
            text: 'Какие способы обработки категориальных признаков вы знаете? Когда использовать one-hot vs target encoding?',
            keywords: ['one-hot', 'target encoding', 'категор', 'признак', 'feature', 'кодирован', 'embedding']
        },
        {
            topic: 'Данные',
            text: 'Как вы подходите к работе с дисбалансом классов? Какие метрики использовать вместо accuracy?',
            keywords: ['дисбаланс', 'smote', 'precision', 'recall', 'f1', 'roc', 'auc', 'взвешен']
        },
        {
            topic: 'Deep Learning',
            text: 'Что такое batch normalization и зачем она нужна? Чем отличается от layer normalization?',
            keywords: ['batch norm', 'layer norm', 'нормализац', 'нейронн', 'активац', 'обучен', 'градиент']
        },
        {
            topic: 'NLP',
            text: 'Как устроена архитектура Transformer? Что такое self-attention и зачем нужна позиционная кодировка?',
            keywords: ['transformer', 'attention', 'self-attention', 'позиционн', 'encoder', 'decoder', 'токен']
        },
        {
            topic: 'MLOps',
            text: 'Что такое data drift и concept drift? Как организовать мониторинг модели в продакшене?',
            keywords: ['drift', 'мониторинг', 'продакшен', 'метрик', 'переобуч', 'distribution', 'алерт']
        }
    ],
    devops: [
        {
            topic: 'Контейнеры',
            text: 'В чём разница между образом и контейнером? Как устроены слои в Docker и зачем они нужны?',
            keywords: ['docker', 'образ', 'контейнер', 'слой', 'layer', 'cache', 'dockerfile', 'union']
        },
        {
            topic: 'Kubernetes',
            text: 'Объясните разницу между Deployment, StatefulSet и DaemonSet. В каких случаях использовать каждый из них?',
            keywords: ['deployment', 'statefulset', 'daemonset', 'pod', 'реплик', 'состоян', 'узел', 'node']
        },
        {
            topic: 'CI/CD',
            text: 'Чем отличается blue-green от canary деплоя? Какие метрики важны для отката?',
            keywords: ['blue-green', 'canary', 'rollout', 'откат', 'rollback', 'деплой', 'трафик']
        },
        {
            topic: 'IaC',
            text: 'Зачем нужен Terraform? Что такое state-файл и почему его нельзя хранить в репозитории?',
            keywords: ['terraform', 'iac', 'state', 'backend', 'lock', 'plan', 'apply', 'провайдер']
        },
        {
            topic: 'Мониторинг',
            text: 'В чём разница между метриками, логами и трейсами? Какие инструменты вы используете для каждого?',
            keywords: ['метрик', 'лог', 'трейс', 'prometheus', 'grafana', 'loki', 'jaeger', 'opentelemetry']
        },
        {
            topic: 'Безопасность',
            text: 'Как управлять секретами в Kubernetes? Чем Vault отличается от встроенных Secret-ов?',
            keywords: ['secret', 'vault', 'kubernetes', 'шифрован', 'rbac', 'rotation', 'kms']
        },
        {
            topic: 'Сеть',
            text: 'Что такое service mesh? Какие задачи решают Istio или Linkerd?',
            keywords: ['service mesh', 'istio', 'linkerd', 'sidecar', 'трафик', 'mtls', 'policy']
        },
        {
            topic: 'Надёжность',
            text: 'Что такое SLO, SLA и SLI? Как error budget влияет на релизы?',
            keywords: ['slo', 'sla', 'sli', 'error budget', 'надёжн', 'метрик', 'reliability']
        }
    ]
};

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

const LEVEL_DIFFICULTY = { junior: 1, middle: 1.15, senior: 1.3 };

function initMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const homeMenuItem = document.querySelector('.menu-item');

    function openMenu() {
        sideMenu.classList.add('open');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
        sideMenu.classList.remove('open');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    function toggleMenu() {
        if (sideMenu.classList.contains('open')) closeMenu(); else openMenu();
    }

    menuToggle.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sideMenu.classList.contains('open')) closeMenu();
    });
    if (homeMenuItem) {
        homeMenuItem.addEventListener('click', () => {
            window.location.href = '../main/MainPage.html';
        });
    }
}

function shuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function pickQuestions(direction, count) {
    const pool = QUESTION_BANK[direction] || QUESTION_BANK.frontend;
    const shuffled = shuffle(pool);
    const picked = [];
    for (let i = 0; i < count; i++) {
        picked.push(shuffled[i % shuffled.length]);
    }
    return picked;
}

function scoreAnswer(answer, question, level) {
    const text = answer.toLowerCase();
    if (text.trim().length < 10) return { score: 0, matched: 0, total: question.keywords.length };

    const matched = question.keywords.filter(kw => text.includes(kw)).length;
    const ratio = matched / question.keywords.length;
    const lengthBonus = Math.min(text.length / 400, 1) * 2;
    const difficulty = LEVEL_DIFFICULTY[level] || 1;

    let score = Math.round((ratio * 8 + lengthBonus) / difficulty);
    if (matched > 0) score = Math.max(score, 3);
    score = Math.max(0, Math.min(10, score));
    return { score, matched, total: question.keywords.length };
}

function buildFeedbackText(result, question) {
    const { score, matched, total } = result;
    if (score === 0) {
        return 'Ответ слишком короткий. Постарайтесь раскрыть тему подробнее и привести конкретные понятия.';
    }
    if (score >= 9) {
        return `Отличный ответ! Вы затронули ${matched} из ${total} ключевых понятий темы «${question.topic}» и изложили мысль развёрнуто.`;
    }
    if (score >= 7) {
        return `Хороший ответ. Упомянуто ${matched} из ${total} ключевых понятий по теме «${question.topic}». Для максимального балла стоит углубить детали и привести пример.`;
    }
    if (score >= 4) {
        return `Ответ по сути верный, но поверхностный: отражено ${matched} из ${total} ключевых понятий темы «${question.topic}». Добавьте больше деталей и терминологии.`;
    }
    return `Ответ слабо раскрывает тему «${question.topic}»: совпало ${matched} из ${total} ключевых понятий. Повторите основы и приведите примеры.`;
}

class TaskSession {
    constructor() {
        this.info = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEY));
        if (!this.info) {
            window.location.href = '../main/MainPage.html';
            return;
        }
        this.questions = pickQuestions(this.info.direction, this.info.count);
        this.index = 0;
        this.results = [];
        this.startedAt = Date.now();

        this.form = document.getElementById('answer-form');
        this.answerField = document.getElementById('answer');
        this.submitBtn = document.getElementById('answer-submit');
        this.nextBtn = document.getElementById('next-task-btn');
        this.feedbackBlock = document.getElementById('feedback-block');
        this.feedbackScoreEl = this.feedbackBlock.querySelector('.feedback-score');
        this.feedbackTextEl = this.feedbackBlock.querySelector('.feedback-text');
        this.taskTextEl = document.querySelector('.task-text');
        this.taskTypeEl = document.querySelector('.task-type');
        this.taskNumberEl = document.getElementById('task-number');
        this.headerTitleEl = document.getElementById('session-progress-title');
        this.headerTrackEl = document.getElementById('session-track');

        this.form.addEventListener('submit', (e) => this.onSubmit(e));
        this.nextBtn.addEventListener('click', () => this.onNext());

        this.renderHeader();
        this.renderCurrent();
    }

    renderHeader() {
        const dir = DIRECTION_LABELS[this.info.direction] || this.info.direction;
        const level = LEVEL_LABELS[this.info.level] || this.info.level;
        this.headerTrackEl.textContent = `${dir} · ${level} · ${this.info.count} вопросов`;
    }

    renderCurrent() {
        const q = this.questions[this.index];
        const human = `Вопрос ${this.index + 1} из ${this.info.count}`;
        this.headerTitleEl.textContent = human;
        this.taskNumberEl.textContent = human;
        this.taskTypeEl.textContent = q.topic;
        this.taskTextEl.textContent = q.text;

        this.answerField.value = '';
        this.answerField.disabled = false;
        this.submitBtn.disabled = false;
        this.submitBtn.hidden = false;
        this.submitBtn.classList.remove('is-hidden');
        this.nextBtn.hidden = true;
        this.nextBtn.classList.add('is-hidden');
        this.feedbackBlock.hidden = true;
        this.feedbackBlock.classList.add('is-hidden');

        this.answerField.focus();
    }

    onSubmit(event) {
        event.preventDefault();
        const answer = this.answerField.value;
        const question = this.questions[this.index];
        const result = scoreAnswer(answer, question, this.info.level);

        this.results.push({
            topic: question.topic,
            text: question.text,
            answer,
            score: result.score
        });

        this.feedbackScoreEl.textContent = `${result.score} / 10`;
        this.feedbackTextEl.textContent = buildFeedbackText(result, question);
        this.feedbackBlock.hidden = false;
        this.feedbackBlock.classList.remove('is-hidden');

        this.answerField.disabled = true;
        this.submitBtn.disabled = true;
        this.submitBtn.hidden = true;
        this.submitBtn.classList.add('is-hidden');

        const isLast = this.index === this.questions.length - 1;
        this.nextBtn.textContent = isLast ? 'Завершить сессию' : 'Следующее задание';
        this.nextBtn.hidden = false;
        this.nextBtn.classList.remove('is-hidden');
    }

    onNext() {
        if (this.index < this.questions.length - 1) {
            this.index += 1;
            this.renderCurrent();
            return;
        }
        this.finish();
    }

    finish() {
        const totalScore = this.results.reduce((sum, r) => sum + r.score, 0);
        const average = this.results.length
            ? +(totalScore / this.results.length).toFixed(1)
            : 0;

        const topicAgg = new Map();
        for (const r of this.results) {
            const prev = topicAgg.get(r.topic) || { sum: 0, count: 0 };
            prev.sum += r.score;
            prev.count += 1;
            topicAgg.set(r.topic, prev);
        }
        const weakTopics = Array.from(topicAgg.entries())
            .map(([topic, v]) => ({ topic, score: +(v.sum / v.count).toFixed(1) }))
            .sort((a, b) => a.score - b.score)
            .slice(0, 3);

        const durationMin = Math.max(1, Math.round((Date.now() - this.startedAt) / 60000));

        const payload = {
            direction: this.info.direction,
            level: this.info.level,
            count: this.info.count,
            average,
            durationMin,
            results: this.results,
            weakTopics,
            finishedAt: new Date().toISOString()
        };
        sessionStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(payload));

        try {
            const stored = JSON.parse(sessionStorage.getItem('interviewStatistics')) || {};
            const list = stored.resList || [];
            list.push(average);
            stored.resList = list;
            sessionStorage.setItem('interviewStatistics', JSON.stringify(stored));
        } catch (_) { /* ignore stats errors */ }

        window.location.href = '../result/ResultPage.html';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initMenu();
    new TaskSession();
});
