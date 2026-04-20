import { getNote, getNotes, createNote, deleteNote, updateNote } from "./api.js";

export async function displayNotes() {
    const notes = await getNotes();
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

        // Bloc à droite (btn supprimer + date)

        const noteRight = document.createElement('div');
        noteRight.className = 'note-right';

        const noteDelete = document.createElement('button');
        noteDelete.className = 'btn-delete-note';
        noteDelete.textContent = '🗑';
        noteDelete.addEventListener('click', async() => {
            await deleteNote(note.id);
            await displayNotes();
        });

        const noteDate = document.createElement('span');
        noteDate.className = 'note-date';
        noteDate.textContent= note.created_at;

        noteRight.appendChild(noteDelete);
        noteRight.appendChild(noteDate);
        noteHeader.appendChild(noteTitle);
        noteHeader.appendChild(noteRight);

        const notePreview = document.createElement('p');
        notePreview.className = 'note-preview';
        notePreview.textContent = note.content ? note.content.substring(0, 128) + '...' : ''; // If/else sur une ligne

        noteDiv.appendChild(noteHeader);
        noteDiv.appendChild(notePreview);
        notesList.appendChild(noteDiv);


    
    }
}
document.querySelector('#btn-new-note').addEventListener('click', () => {
document.querySelector('#modal-note').style.display = 'flex';
});

document.querySelector('#btn-cancel-note').addEventListener('click', () => {
document.querySelector('#modal-note').style.display = 'none';
});
document.querySelector('#btn-create-note').addEventListener('click', async() => {
    const title = document.querySelector('#note-title').value;
    if (!title) return; // Pour régler le pb de la note crée qui est vide.
    await createNote({ title: title});
    document.querySelector('#modal-note').style.display = 'none';
    await displayNotes();
});
document.querySelector('#corbeille').addEventListener('click', async() => {
    const response = await fetch('/api/notes/trash');
    const trashedNotes = await response.json();
    const notesList = document.querySelector('#notes-list');
    notesList.innerHTML = '';

    if (trashedNotes.length === 0) {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note-item';
        noteDiv.textContent = 'Aucune note dans la corbeille';
        notesList.appendChild(noteDiv);
    }
    else if (trashedNotes.length > 0) {
        const noteEmpty= document.createElement('button');
        noteEmpty.textContent = '🗑 Vider la corbeille';
        noteEmpty.addEventListener('click', async() => {
            await fetch('/api/notes/trash', { method: 'DELETE' });
            document.querySelector('#corbeille').click(); // Refresh la corbeille
        })

        notesList.appendChild(noteEmpty);
    };

    for (const note of trashedNotes) {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note-item';

        const noteHeader = document.createElement('div');
        noteHeader.className = 'note-header';

        const noteTitle = document.createElement('h3');
        noteTitle.className = 'note-title';
        noteTitle.textContent = note.title;

        const noteRestore = document.createElement('button');
        noteRestore.className = 'btn-restore-note';
        noteRestore.textContent = '♻️'; // Logo de lopsa à changer
        noteRestore.addEventListener('click', async() => {
            await fetch(`/api/notes/${note.id}/restore`, { method: 'POST' });
            document.querySelector('#corbeille').click(); // Refresh la corbeille
        });
        noteHeader.appendChild(noteTitle);
        noteHeader.appendChild(noteRestore);
        noteDiv.appendChild(noteHeader);
        notesList.appendChild(noteDiv);

    }

});
displayNotes();
