
import { renderAnimeDetails, showLoading, showError } from './ui.js';

const contenedor = document.getElementById('facts-container');

async function initDetalle() {
    if (!contenedor) {
        console.error('No se encontró el contenedor #facts-container en detalles.html');
        showError(document.body, 'Error: contenedor no encontrado.');
        return;
    }

    // Mostrar loading inicial
    showLoading(contenedor, 'Cargando quote seleccionada...');

    // Leer parámetros de la URL
    const params = new URLSearchParams(window.location.search);

    const quoteData = {
        quote: decodeURIComponent(params.get('quote') || ''),
        character: decodeURIComponent(params.get('character') || ''),
        anime: decodeURIComponent(params.get('anime') || '')
    };

    // Validar que al menos haya una quote
    if (!quoteData.quote) {
        showError(contenedor, 'No se encontró la quote seleccionada. Regresa a la lista y elige una.');
        return;
    }

    // Renderizar directamente
    renderAnimeDetails(contenedor, quoteData);
}

// Ejecutar cuando la página esté lista
document.addEventListener('DOMContentLoaded', initDetalle);