import { getNotes, getHabitStats } from "./api.js";
import { openNote } from "./notes.js";
import { getRdvs } from "./api.js";
import { getWeekDates } from "./habits.js";
import { openRdv } from "./rdv.js";

export async function displayDashboard() {
    await displayHabitStats();
    await displayFutureRdvs();
    await displayLastNotes();
}

async function displayHabitStats() {
    const stats = await getHabitStats();
    const sign_com = stats.completion > 0 ? '+' : '';
    const sign_ev = stats.evolution > 0 ? '+' : '';
    document.querySelector('#dashboard-habit-active-count').textContent = stats.active_count;
    document.querySelector('#dashboard-habit-completion').textContent = sign_com + stats.completion + '%';
    // Todo : Le calcul de la completion devrait  se faire sur le total de checks en cours possiblement atteignable et non le total de cheks de la semaine
    document.querySelector('#dashboard-habit-completion').style.color = stats.completion >= 50 ? '#2ecc71' : '#e74c3c';
    document.querySelector('#dashboard-habit-evolution').textContent = sign_ev + stats.evolution + '%';
    document.querySelector('#dashboard-habit-evolution').style.color = stats.evolution >= 0 ? '#2ecc71' : '#e74c3c';
}


async function displayFutureRdvs () {
    const container = document.querySelector('#dashboard-rdv-grid');
    container.innerHTML = '';
    const rdvs = await getRdvs();
    const weekDates = getWeekDates();
    const dayColumns = [];
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    for (let j = 0; j < 7; j++) {
        const dayColumn = document.createElement('div');
        dayColumn.className = 'dashboard-rdv-day';
        const dayLabel = document.createElement('div');
        dayLabel.textContent = days[j] + '\n' + weekDates[j].split('-')[2];
        dayColumn.appendChild(dayLabel);
        container.appendChild(dayColumn);
        dayColumns.push(dayColumn);
    }
    for (const rdv of rdvs) {
        const rdvDate = rdv.start_date.split(' ')[0];
        const dayIndex = weekDates.indexOf(rdvDate);
        if (dayIndex === -1) continue;

        const rdvDiv = document.createElement('div');
        rdvDiv.className = 'dashboard-rdv-item';
        rdvDiv.textContent = rdv.title;
        const startTime = rdv.start_date.split(' ')[1] || '';
        rdvDiv.innerHTML = '<strong>' + rdv.title + '</strong><br>' + startTime;

        rdvDiv.addEventListener('click', async() => {
            document.querySelector('#btn-rdv').click();
            openRdv(rdv.id);
        });

        dayColumns[dayIndex].appendChild(rdvDiv);

    }
    // si la colonne n'a que le label (pas de RDV ajouté)
        for (let j = 0; j < 7; j++) {
            if (dayColumns[j].children.length === 1) {
                const empty = document.createElement('div');
                empty.textContent = '–';
                empty.style.color = '#3a3a4a';
                empty.style.marginTop = '10px';
                dayColumns[j].appendChild(empty);
        }
    }
}

async function displayLastNotes() {
    const notes = await getNotes();
    const container = document.querySelector('#dashboard-notes-list');
    container.innerHTML = '';
    const three = notes.slice(0, 3);

    if (three.length === 0) {
        container.textContent = 'Aucune note';
        return;
    }

    for (const note of three) {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'dashboard-note-item';

        const noteTitle = document.createElement('h4');
        noteTitle.textContent = note.title;
        noteTitle.style.color = '#0d94d3';

        const notePreview = document.createElement('p');
        notePreview.style.color = '#d0d0db';
        const temp = document.createElement('div');
        temp.innerHTML = note.content || '';
        notePreview.textContent = temp.textContent ? temp.textContent.substring(0, 80) + '...' : '';

        noteDiv.appendChild(noteTitle);
        noteDiv.appendChild(notePreview);

        noteDiv.addEventListener('click', () => {
            document.querySelector('#btn-notes').click();
            openNote(note.id);
        });
        container.appendChild(noteDiv);
    }
}