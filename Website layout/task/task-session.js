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

function initMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');

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
    sideMenu.querySelectorAll('[data-href]').forEach(item => {
        item.addEventListener('click', () => {
            window.location.href = item.dataset.href;
        });
    });
}

class TaskSession {
    constructor() {
        this.info = TBoxesStorage.getCurrentSession();
        if (!this.info) {
            window.location.href = '../main/MainPage.html';
            return;
        }
        this.questions = [];
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
        this.boot();
    }

    async boot() {
        try {
            this.taskTextEl.textContent = 'Загрузка вопросов…';
            this.questions = await TBoxesQuestions.pickQuestions(
                this.info.direction,
                this.info.level,
                this.info.count
            );
            if (this.questions.length === 0) {
                this.taskTextEl.textContent = 'Не удалось загрузить вопросы для этого направления.';
                this.submitBtn.disabled = true;
                return;
            }
            this.renderCurrent();
        } catch (e) {
            console.error(e);
            this.taskTextEl.textContent = 'Ошибка загрузки вопросов: ' + e.message;
            this.submitBtn.disabled = true;
        }
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
        if (window.AnswerEditor) AnswerEditor.sync();
        this.submitBtn.disabled = false;
        this.submitBtn.hidden = false;
        this.submitBtn.classList.remove('is-hidden');
        this.nextBtn.hidden = true;
        this.nextBtn.classList.add('is-hidden');
        this.feedbackBlock.hidden = true;
        this.feedbackBlock.classList.add('is-hidden');

        this.answerField.focus();
    }

    async onSubmit(event) {
        event.preventDefault();
        const answer = this.answerField.value;
        const question = this.questions[this.index];

        this.submitBtn.disabled = true;
        this.feedbackTextEl.textContent = 'Оцениваем ответ…';
        this.feedbackScoreEl.textContent = '…';
        this.feedbackBlock.hidden = false;
        this.feedbackBlock.classList.remove('is-hidden');

        const result = await TBoxesAI.evaluateAnswer(question, answer, this.info.level);

        this.results.push({
            topic: question.topic,
            text: question.text,
            answer,
            score: result.score
        });

        this.feedbackScoreEl.textContent = `${result.score} / 10`;
        this.feedbackTextEl.textContent = result.feedback;

        this.answerField.disabled = true;
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
            startedAt: this.info.startedAt,
            finishedAt: new Date().toISOString()
        };
        TBoxesStorage.setLastResult(payload);
        TBoxesStorage.appendHistory(payload);

        const stats = TBoxesStorage.getStats() || { sessionCount: 0, resList: [], directionCountMap: [] };
        stats.resList = Array.isArray(stats.resList) ? stats.resList : [];
        stats.resList.push(average);
        TBoxesStorage.setStats(stats);

        TBoxesStorage.clearCurrentSession();

        window.location.href = '../result/ResultPage.html';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initMenu();
    new TaskSession();
});
