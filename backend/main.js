// Date - Time 

const date = new Date();
const full_date = date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
const time = date.getHours() + ':' + String(date.getMinutes()).padStart(2, '0');
const display = full_date + ' ' + time;

const dateElement = document.querySelector('#date-display');
dateElement.textContent = display;


   
function showTab(tabId) {
    const tabs = document.querySelectorAll('main > section');
    tabs.forEach(function(tab) {
        tab.style.display = 'none';
    });
    document.querySelector('#' + tabId).style.display = 'block';
}

// Buttons Dashboard
const btnDashboard = document.querySelector('#btn-dashboard');
const btnHabits = document.querySelector('#btn-habits');
const btnNotes = document.querySelector('#btn-notes');
const btnRdv = document.querySelector('#btn-rdv');

btnDashboard.addEventListener('click', () => showTab('dashboard'));
btnHabits.addEventListener('click', () => show_tab('habits'));
btnNotes.addEventListener('click', () => show_tab('notes'));
btnRdv.addEventListener('click', () => show_tab('rendez-vous'));


// citations

const citation = [
    "'Without love, the truth cannot be seen'",
    "'Suffering for your own growth is necessary'",
    "'Man cannot remake himself without suffering, for he is both the marble and the sculptor.'"
];

const random = citation[Math.floor(Math.random() * citation.length)];
const quoteElement = document.querySelector('#citation');
quoteElement.textContent = random;

