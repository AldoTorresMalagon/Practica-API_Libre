
import { getQuotes } from './api.js';
import { renderAnimeList, showLoading, showError } from './ui.js';

const contenedor = document.getElementById('contenedor-productos');
const searchInput = document.getElementById('busqueda');
const btnBuscar = document.getElementById('btnBuscar');
const btnLimpiar = document.getElementById('btnLimpiar');
const ordenCampo = document.getElementById('ordenCampo');
const ordenTipo = document.getElementById('ordenTipo');
const btnOrdenar = document.getElementById('btnOrdenar');
const btnAnterior = document.getElementById('btnAnterior');
const btnSiguiente = document.getElementById('btnSiguiente');
const infoPagina = document.getElementById('infoPagina');

let allQuotes = [];         
let displayedQuotes = [];    
let currentPage = 1;
const itemsPerPage = 20;    

async function loadQuotes() {
    if (!contenedor) {
        console.error('Contenedor no encontrado');
        return;
    }

    showLoading(contenedor, 'Cargando quotes de Overlord... (puede tardar unos segundos)');

    const result = await getQuotes('Overlord');  

    if (result.success) {
        allQuotes = result.data || [];
        displayedQuotes = [...allQuotes];
        applyFiltersAndRender();
    } else {
        showError(contenedor, result.error || 'No se pudieron cargar quotes. Intenta buscar otro anime.');
    }
}

function applyFiltersAndRender() {
    let filtered = [...allQuotes];

    // Búsqueda (por anime o personaje)
    const query = searchInput.value.trim().toLowerCase();
    if (query) {
        filtered = filtered.filter(quote => {
            const animeLower = quote.anime.toLowerCase();
            const charLower = quote.character.toLowerCase();
            return animeLower.includes(query) || charLower.includes(query);
        });
    }

    // Ordenamiento
    const campo = ordenCampo.value;
    const tipo = ordenTipo.value;

    if (campo) {
        filtered.sort((a, b) => {
            let valA, valB;
            if (campo === 'name') {  
                valA = a.anime.toLowerCase();
                valB = b.anime.toLowerCase();
            } else if (campo === 'id') {
                valA = a.character.toLowerCase();  
                valB = b.character.toLowerCase();
            }

            if (tipo === 'asc') {
                return valA > valB ? 1 : valA < valB ? -1 : 0;
            } else {
                return valA < valB ? 1 : valA > valB ? -1 : 0;
            }
        });
    }

    displayedQuotes = filtered;
    currentPage = 1; 
    renderPage();
}

function renderPage() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = displayedQuotes.slice(start, end);

    renderAnimeList(contenedor, pageItems);

    // Actualizar info de paginación
    const totalPages = Math.ceil(displayedQuotes.length / itemsPerPage);
    infoPagina.textContent = `Página ${currentPage} de ${totalPages || 1} (${displayedQuotes.length} quotes)`;

    btnAnterior.disabled = currentPage <= 1;
    btnSiguiente.disabled = currentPage >= totalPages || totalPages === 0;
}

// Eventos de interacción
btnBuscar.addEventListener('click', applyFiltersAndRender);
searchInput.addEventListener('input', applyFiltersAndRender);  

btnLimpiar.addEventListener('click', () => {
    searchInput.value = '';
    applyFiltersAndRender();
});

btnOrdenar.addEventListener('click', applyFiltersAndRender);

btnAnterior.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderPage();
    }
});

btnSiguiente.addEventListener('click', () => {
    const totalPages = Math.ceil(displayedQuotes.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderPage();
    }
});

// Inicio de la app
document.addEventListener('DOMContentLoaded', loadQuotes);