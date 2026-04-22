import { displayHabits } from "./habits.js";
import { displayNotes } from './notes.js';

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

// Buttons Dashboard
const btnDashboard = document.querySelector('#btn-dashboard');
const btnHabits = document.querySelector('#btn-habits');
const btnNotes = document.querySelector('#btn-notes');
const btnRdv = document.querySelector('#btn-rdv');

btnDashboard.addEventListener('click', () => showTab('dashboard'));
btnHabits.addEventListener('click', () => showTab('habits'));
btnNotes.addEventListener('click', () => showTab('notes'));
btnRdv.addEventListener('click', () => showTab('rendez-vous'));

   
// Id TAB
function showTab(tabId) {
    const tabs = document.querySelectorAll('main > section');
    tabs.forEach(function(tab) {
        tab.style.display = 'none';
        if (tabId === 'notes') {
            displayNotes();
        }
    });
    document.querySelector('#' + tabId).style.display = 'block';
    document.querySelector('#page-title').textContent = titles[tabId];
}

// Titre des sections
const titles = {
    'dashboard': "Tableau de Bord / Page d'accueil",
    'habits': 'Habitudes',
    'notes': 'Notes',
    'rendez-vous': 'Rendez-vous'
}

// citations

const citation = [
    "'Without love, the truth cannot be seen'",
    "'Suffering for your own growth is necessary'",
    "'Man cannot remake himself without suffering, for he is both the marble and the sculptor.'"
];

const random = citation[Math.floor(Math.random() * citation.length)];
const quoteElement = document.querySelector('#citation');
quoteElement.textContent = random;
