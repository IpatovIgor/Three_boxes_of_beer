const revealElements = document.querySelectorAll('.step, .feature, .member');

revealElements.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active'); 
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15
});

revealElements.forEach(el => observer.observe(el));

const toTopBtn = document.createElement('button');
toTopBtn.className = 'to-top-btn';
toTopBtn.innerHTML = '↑';
toTopBtn.setAttribute('aria-label', 'Наверх');

document.body.appendChild(toTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        toTopBtn.classList.add('show');
    } else {
        toTopBtn.classList.remove('show');
    }
});

toTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' 
    });
});