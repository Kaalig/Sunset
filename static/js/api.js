
// ------------------------ HABITUDES -------------------------------

export async function getHabits() {
    const response = await fetch('/api/habits');
    return await response.json();
}

export async function getHabit(id){
    const response = await fetch(`/api/habits/${id}`);
    return await response.json();
}

export async function checkHabit(id, date, done) {
    const response = await fetch(`/api/habits/${id}/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: date, done: done })
    });
    return await response.json();
}

export async function createHabit(data) {
    const response = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await response.json();
}

export async function updateHabit(id, data) {
    const response = await fetch(`/api/habits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await response.json();
}
export async function deleteHabit(id) {
    const response = await fetch(`/api/habits/${id}`, {
        method: 'DELETE'
    });
    return await response.json();
}

export async function getHabitStats() {
    const response = await fetch('/api/habits/stats');
    return await response.json();
}
// ------------------------ NOTES -------------------------------

export async function createNote(data) {
    const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await response.json();
}

export async function deleteNote(id) {
    const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE'
    });
    return await response.json();
}

export async function getNotes() {
    const response = await fetch('/api/notes');
    return await response.json();
}

export async function getNote(id){
    const response = await fetch(`/api/notes/${id}`);
    return await response.json();
}

export async function updateNotes(id, data) {
    const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await response.json();
}   
// ------------------------ Rendez-vous -------------------------------
export async function getRdvs() {
    const response = await fetch('/api/rdv');
    return await response.json();
}

export async function getRdv(id){
    const response = await fetch(`/api/rdv/${id}`);
    return await response.json();
}

export async function createRdv(data) {
    const response = await fetch('/api/rdv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await response.json();
}

export async function updateRdv(id, data) {
    const response = await fetch(`/api/rdv/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await response.json();
}

export async function deleteRdv(id) {
    const response = await fetch(`/api/rdv/${id}`, {
        method: 'DELETE'
    });
    return await response.json();
}


// ------------------------ CITATIONS -------------------------------
export async function getQuotes() {
    const response = await fetch('/api/quotes');
    return await response.json();
}

export async function createQuote(data) {
    const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await response.json();
}

export async function deleteQuote(id) {
    const response = await fetch(`/api/quotes/${id}`, {
        method: 'DELETE'
    });
    return await response.json();
}