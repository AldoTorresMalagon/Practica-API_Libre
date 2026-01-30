const urlBase = "https://dummyjson.com/products";
const ITEMS_POR_PAGINA = 10;

let paginaActual = 0;
let totalProductos = 0;
let terminoBusqueda = "";

// Carga automática al abrir la página
window.onload = () => {
    cargarProductos(0, "");
};

function cargarProductos(pagina, busqueda = "") {
    paginaActual = pagina;
    terminoBusqueda = busqueda.trim();

    let url = `${urlBase}?limit=${ITEMS_POR_PAGINA}&skip=${pagina * ITEMS_POR_PAGINA}`;

    if (terminoBusqueda !== "") {
        url = `https://dummyjson.com/products/search?q=${encodeURIComponent(terminoBusqueda)}&limit=${ITEMS_POR_PAGINA}&skip=${pagina * ITEMS_POR_PAGINA}`;
    }

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(data => {
            totalProductos = data.total || 0;
            mostrarProductos(data.products || []);

            document.getElementById("paginacion").style.display = "block";
            actualizarInfoPaginacion();

            document.getElementById("btnAnterior").disabled = (paginaActual === 0);
            document.getElementById("btnSiguiente").disabled =
                ((paginaActual + 1) * ITEMS_POR_PAGINA >= totalProductos);
        })
        .catch(error => {
            console.error("Error:", error);
            document.getElementById("contenedor-productos").innerHTML =
                '<p style="color:red; text-align:center; font-size:1.2rem;">Error al cargar los productos 😢</p>';
        });
}

function mostrarProductos(productos) {
    const contenedor = document.getElementById("contenedor-productos");
    contenedor.innerHTML = "";

    if (productos.length === 0) {
        contenedor.innerHTML = '<p style="text-align:center; font-size:1.3rem; color:#555; margin:40px 0;">No se encontraron productos 😔</p>';
        document.getElementById("paginacion").style.display = "none";
        return;
    }

    productos.forEach(producto => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("product-card");
        tarjeta.style.cursor = "pointer";

        const imagen = producto.thumbnail || "img/17003579.png";

        tarjeta.innerHTML = `
            <img 
                src="${imagen}" 
                alt="${producto.title}"
                class="producto-img"
                onerror="this.src='img/17003579.png'"
            >
            <h3 class="practice-title">${producto.title}</h3>
            <p><strong>Precio:</strong> $${producto.price}</p>
            <p><strong>Categoría:</strong> ${producto.category}</p>
            <p><strong>Rating:</strong> ${producto.rating} ⭐</p>
        `;

        tarjeta.onclick = () => {
            window.location.href = `detalles.html?id=${producto.id}`;
        };

        contenedor.appendChild(tarjeta);
    });
}

function cambiarPagina(delta) {
    const nuevaPagina = paginaActual + delta;
    if (nuevaPagina < 0 || nuevaPagina * ITEMS_POR_PAGINA >= totalProductos) return;
    cargarProductos(nuevaPagina, terminoBusqueda);
}

function actualizarInfoPaginacion() {
    const totalPaginas = Math.ceil(totalProductos / ITEMS_POR_PAGINA);
    const texto = terminoBusqueda
        ? `Resultados para "${terminoBusqueda}" - Página ${paginaActual + 1} de ${totalPaginas}`
        : `Página ${paginaActual + 1} de ${totalPaginas} (${totalProductos} productos)`;

    document.getElementById("infoPagina").textContent = texto;
}

// Eventos de búsqueda
document.getElementById("btnBuscar").addEventListener("click", () => {
    const valor = document.getElementById("busqueda").value.trim();
    cargarProductos(0, valor);
});

document.getElementById("btnLimpiar").addEventListener("click", () => {
    document.getElementById("busqueda").value = "";
    cargarProductos(0, "");
});

document.getElementById("busqueda").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const valor = document.getElementById("busqueda").value.trim();
        cargarProductos(0, valor);
    }
});