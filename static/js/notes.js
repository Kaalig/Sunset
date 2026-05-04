
# qsdqsqds

import { getNote, getNotes, createNote, deleteNote, updateNotes } from "./api.js";

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
        noteDelete.addEventListener('click', async(e) => {
            e.stopPropagation();
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
        const temp = document.createElement('div'); // Div invisible dans le but de pas voir les balises dans le preview (HTML interprète la div donc ca reprend pas les balises de style)
        temp.innerHTML = note.content || ''; 
        notePreview.textContent = temp.textContent ? temp.textContent.substring(0, 80) + '...' : '';
    
        noteDiv.appendChild(noteHeader);
        noteDiv.appendChild(notePreview);
        notesList.appendChild(noteDiv);

        noteDiv.addEventListener('click', () => openNote(note.id));
    
    }
}
document.querySelector('#btn-new-note').addEventListener('click', () => {
document.querySelector('#modal-note').style.display = 'flex';
});

document.querySelector('#btn-cancel-note').addEventListener('click', () => {
document.querySelector('#modal-note').style.display = 'none';
document.querySelector('#note-title').value = '';
});
document.querySelector('#btn-create-note').addEventListener('click', async() => {
    const title = document.querySelector('#note-title').value;
    if (!title) return; // Pour régler le pb de la note crée qui est vide.
    const response = await createNote({ title: title});
    document.querySelector('#modal-note').style.display = 'none';
    document.querySelector('#note-title').value = ''; // Vider le champ pour pas que ca soit redondant
    await openNote(response.id);
});
let currentNoteId = null;
export async function openNote(id) {
    const note = await getNote(id);
    currentNoteId = id;
    document.querySelector('#notes-list').style.display = 'none';
    document.querySelector('#notes-toolbar').style.display = 'none';
    document.querySelector('#note-detail').style.display = 'block';
    document.querySelector('#note-detail-title').value = note.title;
    document.querySelector('#note-detail-content').innerHTML = note.content || '';
    document.querySelector('#note-detail-dates').textContent = `Créé le ${note.created_at} · Dernière édition ${note.edited_at}`;
    document.querySelector('#btn-new-note').style.display = 'none';
    document.querySelector('#corbeille').style.display = 'none';
    currentNoteId = id;
}

document.querySelector('#btn-back-notes').addEventListener('click', async () => {
    const title = document.querySelector('#note-detail-title').value;
    const content = document.querySelector('#note-detail-content').innerHTML;
    if (currentNoteId) {
        await updateNotes(currentNoteId, { title: title, content: content });
    }

    currentNoteId = null;
    document.querySelector('#note-detail').style.display = 'none';
    document.querySelector('#notes-toolbar').style.display = 'flex';
    document.querySelector('#notes-list').style.display = 'block';
    document.querySelector('.center').style.display = 'flex';
    document.querySelector('#btn-new-note').style.display = ''; // '' Pour pas forcer un style et utiliser le CSS en priorité
    document.querySelector('#corbeille').style.display = '';
    await displayNotes();
});
document.querySelector('#btn-bold').addEventListener('mousedown', (e) => {
    e.preventDefault();
    document.execCommand('bold');
    updateToolbar();
});

document.querySelector('#btn-italic').addEventListener('mousedown', (e) => {
    e.preventDefault();
    document.execCommand('italic');
    updateToolbar();
});
document.querySelector('#btn-color').addEventListener('input', (e) => {
    document.execCommand('foreColor', false, e.target.value);
});
document.querySelector('#btn-fontsize').addEventListener('change', (e) => {
    document.execCommand('fontSize', false, e.target.value);
});
document.querySelector('#note-detail-content').addEventListener('keyup', updateToolbar);
document.querySelector('#note-detail-content').addEventListener('mouseup', updateToolbar);

function updateToolbar() {
    const bold = document.queryCommandState('bold');
    const italic = document.queryCommandState('italic');
    document.querySelector('#btn-bold').classList.toggle('toolbar-active', bold);
    document.querySelector('#btn-italic').classList.toggle('toolbar-active', italic);
}



document.querySelector('#corbeille').addEventListener('click', async() => {
    const response = await fetch('/api/notes/trash');
    const trashedNotes = await response.json();
    const notesList = document.querySelector('#notes-list');
    notesList.innerHTML = '';

    if (trashedNotes.length === 0) {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note-item'; //TODO : Créer une autre classe parce qu'elle est aussi utilisée pour les preview de note.
        noteDiv.textContent = 'Aucune note dans la corbeille';
        notesList.appendChild(noteDiv);
    }
    else if (trashedNotes.length > 0) {
        const noteEmpty= document.createElement('button');
        noteEmpty.className = 'btn-empty-trash';
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
        const notePreview = document.createElement('p');
        noteRestore.className = 'btn-restore-note';
        notePreview.className = 'note-preview';
        notePreview.textContent = note.content ? note.content.substring(0, 100) + '...' : '';
        noteRestore.textContent = '♻️ Restaurer la note'; // Logo de lopsa à changer
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
