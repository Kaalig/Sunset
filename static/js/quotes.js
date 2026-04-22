import { getQuotes, createQuote, deleteQuote } from "./api.js";

export async function displayQuotes(id) {
    const quotes = await getQuotes();

    for (const quote of quotes){
        
    }

}