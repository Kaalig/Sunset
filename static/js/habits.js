import { getHabit, getHabits, checkHabit, createHabit, deleteHabit, updateHabit } from "./api.js";

function getWeekDates() {
    const today = new Date();
    const day = today.getDay();
    const monday = new Date(today); // Copie today
    monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1)); // If/else sur une ligne

    const dates = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const dateStr = d.toISOString().split('T')[0]; // On s'arrete à T du ISO avec split
        dates.push(dateStr);
    }
    return dates;
}
export async function displayHabits() {
    const habits = await getHabits();
    const tbody = document.querySelector('#habits-body');
    tbody.innerHTML = '';
    const weekDates = getWeekDates();

    for (const habit of habits) {
        const tr = document.createElement('tr');
        const tdName = document.createElement('td');
        const tdGoaldays = document.createElement('td');

        tdName.textContent = habit.name;
        tdName.addEventListener('click', async() => {
            await openHabit(habit.id);
        })
        tdGoaldays.textContent = habit.goal_days;
        tr.appendChild(tdName);
        tr.appendChild(tdGoaldays);

        for (const date of weekDates){
            const tdDay = document.createElement('td');
            if (habit.logs.includes(date)){
                tdDay.innerHTML = '<span class="circle check">o</span>';
            } else {
                tdDay.innerHTML = '<span class="circle uncheck">x</span>';
            }
            tdDay.addEventListener('click', async() => {
                if (tdDay.innerHTML === '<span class="circle check">o</span>'){
                    await checkHabit(habit.id, date, false);
                    tdDay.innerHTML = '<span class="circle uncheck">x</span>';
                } else {
                    await checkHabit(habit.id, date, true);
                    tdDay.innerHTML = '<span class="circle check">o</span>';
                }
            })
            tr.appendChild(tdDay);
        }
        const checked = weekDates.filter(date => habit.logs.includes(date)).length;
        const ratio = checked / habit.goal_days;

        const tdTotal = document.createElement('td');
        tdTotal.textContent = checked + '/' + habit.goal_days;

        if (ratio >= 1) {
            tdTotal.style.color = '#3498db';
        } else if (ratio >= 0.7) {
            tdTotal.style.color = '#2ecc71';
        } else if (ratio >= 0.4) {
            tdTotal.style.color = '#f1c40f';
        } else {
            tdTotal.style.color = '#e74c3c';
        }
        tr.appendChild(tdTotal);
        tbody.appendChild(tr);
    }
   
}
document.querySelector('#btn-new-habits').addEventListener('click', () => {
    document.querySelector('#modal-habit').style.display = 'flex';
});

document.querySelector('#btn-cancel-habit').addEventListener('click', () => {
    document.querySelector('#modal-habit').style.display = 'none';
});


document.querySelector('#btn-create-habit').addEventListener('click', async() => {
    const name = document.querySelector('#habit-name').value;
    const goal = document.querySelector('#habit-goal').value;
    const description = document.querySelector('#habit-description').value;
    if (!name) return;
    await createHabit({ name: name, goal_days: goal, description: description });
    document.querySelector('#modal-habit').style.display = 'none';
    document.querySelector('#habit-name').value = '';
    document.querySelector('#habit-goal').value = '7';
    document.querySelector('#habit-description').value = '';
    await displayHabits();
});

let currentHabitId = null;
async function openHabit(id) {
    const habit = await getHabit(id);
    currentHabitId = id;
    document.querySelector('#modal-habit-detail').style.display = 'flex';
    document.querySelector('#habit-detail-name').value = habit.name;
    document.querySelector('#habit-detail-goal').value = habit.goal_days;
    document.querySelector('#habit-detail-description').value = habit.description;
}
document.querySelector('#btn-close-habit-detail').addEventListener('click', async() => {
    document.querySelector('#modal-habit-detail').style.display = 'none';
    if (currentHabitId) {
        await updateHabit(currentHabitId, {
            name: document.querySelector('#habit-detail-name').value,
            goal_days: document.querySelector('#habit-detail-goal').value,
            description: document.querySelector('#habit-detail-description').value
        })
    };
    currentHabitId = null;
    await displayHabits();
});

displayHabits();

