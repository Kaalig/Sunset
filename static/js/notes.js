import { getNotes, createNote, deleteNote } from "./api.js";

export async function displayNotes() {
    const notes = await getNotes();
    console.log(notes);
    const notesList = document.querySelector('#notes-list');
    notesList.innerHTML = '';

    for (const note of notes) {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note-item';

        const noteHeader = document.createElement('div');
        noteHeader.className = 'note-header';

        const noteTitle = document.createElement('h3');
        noteTitle.className = 'note-title';
        noteTitle.textContent = note.title;

        const noteDate = document.createElement('span');
        noteDate.className = 'note-date';
        noteDate.textContent= note.created_at;

        noteHeader.appendChild(noteTitle);
        noteHeader.appendChild(noteDate);

        const notePreview = document.createElement('p');
        notePreview.className = 'note-preview';
        notePreview.textContent = note.content ? note.content.substring(0, 80) + '...' : ''; // If/else sur une ligne

        noteDiv.appendChild(noteHeader);
        noteDiv.appendChild(notePreview);
        notesList.appendChild(noteDiv);

    
    }

}

displayNotes();
