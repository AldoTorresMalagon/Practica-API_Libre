// js/api.js
const API_BASE = 'https://api.animechan.io/v1';

async function fetchApi(endpoint, params = {}) {
    const url = new URL(`${API_BASE}${endpoint}`);
    Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        return { success: true, data };
    } catch (err) {
        console.error('Error en Animechan API:', err);
        return { success: false, error: err.message };
    }
}

// Obtener quotes 
export async function getQuotes(anime = 'Overlord') {
    return fetchApi('/quotes', { anime });
}

// Quote random 
export async function getRandomQuote() {
    return fetchApi('/quotes/random');
}