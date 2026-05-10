import { getQuotes, createQuote, deleteQuote } from "./api.js";

export async function loadRandomQuote() {
    const quotes = await getQuotes();
    const quoteElement = document.querySelector('#citation');
    if (quotes.length === 0) {
        quoteElement.textContent = 'Cliquez ici pour ajouter une citation';
        return;
    }
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    quoteElement.textContent = '"' + random.quote + '"';
}

async function openQuotesModal() {
    const quotes = await getQuotes();
    const list = document.querySelector('#quotes-list');
    list.innerHTML = '';

    for (const quote of quotes) {
        const div = document.createElement('div');
        div.className = 'quote-item';

        const p = document.createElement('p');
        p.textContent = '"' + quote.quote + '"';

        const btn = document.createElement('button');
        btn.textContent = 'x';
        btn.addEventListener('click', async () => {
            await deleteQuote(quote.id);
            await openQuotesModal();
            await loadRandomQuote();
        });

        div.appendChild(p);
        div.appendChild(btn);
        list.appendChild(div);
    }

    document.querySelector('#modal-quotes').style.display = 'flex';
}

document.querySelector('#citation').addEventListener('click', () => {
    openQuotesModal();
});

document.querySelector('#btn-add-quote').addEventListener('click', async () => {
    const input = document.querySelector('#quote-input');
    if (!input.value) return;
    await createQuote({ quote: input.value });
    input.value = '';
    await openQuotesModal();
    await loadRandomQuote();
});

document.querySelector('#btn-close-quotes').addEventListener('click', () => {
    document.querySelector('#modal-quotes').style.display = 'none';
});