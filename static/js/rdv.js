import { getRdv, getRdvs, createRdv, deleteRdv, updateRdv } from "./api.js";
import { getWeekDates } from "./habits.js";

let weekOffset = 0;
export async function displayRdv() {
    const rdvs = await getRdvs();
    const grid = document.querySelector('#calendar-grid');
    grid.innerHTML = '';
    const weekDates = getWeekDates(weekOffset);
    const firstDay = new Date(weekDates[0]);
    document.querySelector('#calendar-month-title').textContent = firstDay.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    const dayHeaders = document.querySelectorAll('.calendar-day');
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    for (let i = 0; i < 7; i++) {
        const day = weekDates[i].split('-')[2];
        dayHeaders[i].textContent = days[i] + '\n' + day;
    }

    const hourColumn = document.createElement('div');
    hourColumn.className = 'calendar-hour-column';
    for (let i = 0; i < 24; i++) {
        const hourLabel = document.createElement('div');
        hourLabel.className = 'calendar-hour';
        hourLabel.textContent = String(i).padStart(2, '0') + ':00';
        hourColumn.appendChild(hourLabel);
    }
        
    grid.appendChild(hourColumn);
        const dayColumns = [];
        for (let j = 0; j < 7; j++) {
            const dayColumn = document.createElement('div');
            dayColumn.className = 'calendar-day-column';
            grid.appendChild(dayColumn);
            dayColumns.push(dayColumn)
        }

        // LA PARTIE LA PLUS DUR ET TECHNIQUE DANS LA CREATION DU PROJET : 
    for (const rdv of rdvs) {
        const rdvDate = rdv.start_date.split(' ')[0]; // YYYY-MM-DD
        const dayIndex = weekDates.indexOf(rdvDate);
        if (dayIndex === -1) continue; // pas cette semaine
        if (!rdv.start_date.includes(' ') || !rdv.end_date.includes(' ')) continue;

        const startHour = parseInt(rdv.start_date.split(' ')[1].split(':')[0]);
        const startMin = parseInt(rdv.start_date.split(' ')[1].split(':')[1]);
        const endHour = parseInt(rdv.end_date.split(' ')[1].split(':')[0]);
        const endMin = parseInt(rdv.end_date.split(' ')[1].split(':')[1]);

        const top = (startHour * 60 + startMin);  // en pixel 
        const height = (endHour * 60 + endMin) - top;

        const rdvDiv = document.createElement('div');
        rdvDiv.className = 'calendar-rdv';
        rdvDiv.style.top = top + 'px';
        rdvDiv.style.height = height + 'px';
        rdvDiv.style.backgroundColor = rdv.color;
        rdvDiv.innerHTML = '<strong>' + rdv.title + '</strong><br>' + '<em>' + String(startHour).padStart(2, '0') + ':' + String(startMin).padStart(2, '0') + ' - ' + String(endHour).padStart(2, '0') + ':' + String(endMin).padStart(2, '0') + '</em><br>' + '<em>' + (rdv.description || '') + '</em>';
        

        dayColumns[dayIndex].appendChild(rdvDiv);
        rdvDiv.addEventListener('click', async() => {
            await openRdv(rdv.id);
        })

}
}

document.querySelector('#btn-prev-week').addEventListener('click', async () => {
    weekOffset--;
    await displayRdv();
});

document.querySelector('#btn-next-week').addEventListener('click', async () => {
    weekOffset++;
    await displayRdv();
});

document.querySelector('#btn-new-rdv').addEventListener('click', () => {
    const today = new Date().toISOString().split('T')[0];
    document.querySelector('#rdv-start-date').value = today;
    document.querySelector('#rdv-end-date').value = today;
    document.querySelector('#modal-rdv').style.display = 'flex';
});
document.querySelector('#btn-cancel-rdv').addEventListener('click', () => {
document.querySelector('#modal-rdv').style.display = 'none';
});

document.querySelector('#btn-create-rdv').addEventListener('click', async() => {
    const title = document.querySelector('#rdv-title').value;
    const startDate = document.querySelector('#rdv-start-date').value;
    const startTime = document.querySelector('#rdv-start-time').value;
    const endDate = document.querySelector('#rdv-end-date').value;
    const endTime = document.querySelector('#rdv-end-time').value;
    const location = document.querySelector('#rdv-location').value;
    const description = document.querySelector('#rdv-description').value;
    const color = document.querySelector('#rdv-color').value;
    if (!title || !startDate || !endDate) return;
    await createRdv({ title: title, start_date:startDate + ' ' + startTime, end_date: endDate + ' ' + endTime,location: location, description: description, color:color});
    document.querySelector('#modal-rdv').style.display = 'none';
    document.querySelector('#rdv-title').value = '';
    document.querySelector('#rdv-start-date').value = '';
    document.querySelector('#rdv-start-time').value = '';
    document.querySelector('#rdv-end-date').value = '';
    document.querySelector('#rdv-end-time').value = '';
    document.querySelector('#rdv-location').value = '';
    document.querySelector('#rdv-description').value = '';
    await displayRdv();
});

let currentRdvId = null;
export async function openRdv(id){
    const rdv = await getRdv(id);
    currentRdvId = id;
    document.querySelector('#modal-rdv-detail').style.display = 'flex';
    document.querySelector('#rdv-detail-title').value = rdv.title;
    document.querySelector('#rdv-detail-start-date').value = rdv.start_date.split(' ')[0];
    document.querySelector('#rdv-detail-start-time').value = rdv.start_date.split(' ')[1];
    document.querySelector('#rdv-detail-end-date').value = rdv.end_date.split(' ')[0];
    document.querySelector('#rdv-detail-end-time').value = rdv.end_date.split(' ')[1];
    document.querySelector('#rdv-detail-location').value = rdv.location;
    document.querySelector('#rdv-detail-description').value = rdv.description;
    document.querySelector('#rdv-detail-color').value = rdv.color;
    await displayRdv();
};

document.querySelector('#btn-close-rdv-detail').addEventListener('click', async() => {
    document.querySelector('#modal-rdv-detail').style.display = 'none';
    if (currentRdvId) {
        await updateRdv(currentRdvId, {
            title: document.querySelector('#rdv-detail-title').value,
            start_date: document.querySelector('#rdv-detail-start-date').value + ' ' + document.querySelector('#rdv-detail-start-time').value,
            end_date: document.querySelector('#rdv-detail-end-date').value + ' ' + document.querySelector('#rdv-detail-end-time').value,
            location: document.querySelector('#rdv-detail-location').value,
            description: document.querySelector('#rdv-detail-description').value,
            color: document.querySelector('#rdv-detail-color').value
        })
    };
    currentRdvId = null;
    await displayRdv();
});

document.querySelector('#btn-delete-rdv').addEventListener('click', async() => {
    await deleteRdv(currentRdvId);
    document.querySelector('#modal-rdv-detail').style.display = 'none';
    currentRdvId = null;
    await displayRdv();
});