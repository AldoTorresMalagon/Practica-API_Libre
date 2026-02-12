
// Función auxiliar para formatear nombres 
function formatName(name) {
    if (!name) return 'Desconocido';
    return name.trim();
}

// Crea una tarjeta para una quote en la lista principal
export function createAnimeCard(quoteObj) {
    const card = document.createElement('div');
    card.classList.add('producto-card'); 

    // Limitamos la quote a 100-150 chars para que quepa bien en tarjeta
    const shortQuote = quoteObj.quote.length > 150
        ? quoteObj.quote.substring(0, 150) + '...'
        : quoteObj.quote;

    card.innerHTML = `
    <div class="quote-content">
      <p class="quote-text">"${shortQuote}"</p>
      <p class="quote-author">- ${formatName(quoteObj.character)}</p>
      <p class="quote-anime">De: ${formatName(quoteObj.anime)}</p>
    </div>
  `;

    // Evento clic: pasa los datos por query string
    card.addEventListener('click', () => {
        const params = new URLSearchParams({
            quote: encodeURIComponent(quoteObj.quote),
            character: encodeURIComponent(quoteObj.character),
            anime: encodeURIComponent(quoteObj.anime)
        });
        window.location.href = `detalles.html?${params.toString()}`;
    });

    return card;
}

// Renderiza la lista de quotes en el contenedor
export function renderAnimeList(container, quotesArray) {
    if (!container) {
        console.error('Contenedor no encontrado');
        return;
    }

    container.innerHTML = ''; 

    if (!quotesArray || quotesArray.length === 0) {
        container.innerHTML = '<p class="no-results">No se encontraron quotes. Prueba con otro anime o recarga.</p>';
        return;
    }

    quotesArray.forEach(quote => {
        const card = createAnimeCard(quote);
        container.appendChild(card);
    });
}

// Renderiza la quote detallada en detalles.html
export function renderAnimeDetails(container, quoteData) {
    if (!container) {
        console.error('Contenedor no encontrado para detalles');
        return;
    }

    container.innerHTML = ''; 

    if (!quoteData || !quoteData.quote) {
        container.innerHTML = '<p class="error">No se pudo cargar la quote seleccionada.</p>';
        return;
    }

    // Actualiza elementos específicos
    const titleEl = document.getElementById('titulo');
    if (titleEl) {
        titleEl.textContent = `Quote de ${formatName(quoteData.character)}`;
    }

    // Imagen: como no hay imagen en la API
    const imgEl = document.getElementById('imagen');
    if (imgEl) {
        imgEl.src = 'https://via.placeholder.com/400x300?text=Anime+Quote+' + encodeURIComponent(quoteData.anime);
        imgEl.alt = `Quote de ${quoteData.anime}`;
    }

    // Info básica
    const infoEl = document.getElementById('info');
    if (infoEl) {
        infoEl.innerHTML = `
      <p><strong>Anime:</strong> ${formatName(quoteData.anime)}</p>
      <p><strong>Personaje:</strong> ${formatName(quoteData.character)}</p>
    `;
    }

    // Quote completa
    const quoteDiv = document.createElement('div');
    quoteDiv.classList.add('quote-detail');
    quoteDiv.innerHTML = `
    <h2>Quote completa:</h2>
    <p class="quote-full">"${quoteData.quote}"</p>
  `;
    container.appendChild(quoteDiv);
}

// Helpers para loading y error
export function showLoading(container, message = 'Cargando quotes... (puede tardar un poco)') {
    if (container) container.innerHTML = `<p class="loading">${message}</p>`;
}

export function showError(container, message = 'Ocurrió un error. Intenta recargar o buscar otro anime.') {
    if (container) container.innerHTML = `<p class="error">${message}</p>`;
}