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

function FindAndUpdate(className, date){
    let numText = document.querySelector(className);
    numText.innerText = date;
}

//Вот сюда вот сувайте всё, что надо
function InsertSessionInfo(){
    let inf = JSON.parse(sessionStorage.getItem('interviewSession'));
    let headerText = `${inf.direction} ${inf.level} завершено`;
    FindAndUpdate('.feedback-header', headerText);
}

InsertSessionInfo();
document.addEventListener('DOMContentLoaded', initMenu);