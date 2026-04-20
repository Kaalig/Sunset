export async function getHabits() {
    const response = await fetch('/api/habits');
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