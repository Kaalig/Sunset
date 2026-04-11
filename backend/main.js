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


   
function show_tab(tabName){
    document.querySelector("#Dashboard").style.display = "none";
    document.querySelector("#Notes").style.display = "none";
    document.querySelector("#Habits").style.display = "none";
    document.querySelector("#Rendez-vous").style.display = "none";
    document.querySelector(tabName).style.display = "block";
  
}

// Buttons Dashboard
const btnDashboard = document.querySelector('#btn-dashboard');
const btnHabits = document.querySelector('#btn-habits');
const btnNotes = document.querySelector('#btn-notes');
const btnRdv = document.querySelector('#btn-rdv');

btnHabits.addEventListener('click', () => show_tab('Habits'));
btnNotes.addEventListener('click', () => show_tab('Notes'));
btnRdv.addEventListener('click', () => show_tab('Rendez-vous'));


// citations

const citation = [
    "'Without love, the truth cannot be seen'",
    "'Suffering for your own growth is necessary'",
    "'Man cannot remake himself without suffering, for he is both the marble and the sculptor.'"
];

const random = citation[Math.floor(Math.random() * citation.length)];
const quoteElement = document.querySelector('#citation');
quoteElement.textContent = random;

