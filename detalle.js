const urlBase = "https://dummyjson.com/products";

window.onload = () => {
    // Obtener ID de la URL (query param)
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        document.getElementById("contenedor-detalle").innerHTML =
            '<p style="color:red; text-align:center;">Producto no encontrado 😢</p>';
        return;
    }

    fetch(`${urlBase}/${id}`)
        .then(respuesta => respuesta.json())
        .then(producto => {
            mostrarDetalle(producto);
        })
        .catch(error => {
            console.error("Error al cargar detalle:", error);
            document.getElementById("contenedor-detalle").innerHTML =
                '<p style="color:red; text-align:center;">Error al cargar el detalle 😢</p>';
        });
};

function mostrarDetalle(producto) {
    const contenedor = document.getElementById("contenedor-detalle");

    // Imagen principal (usa la primera imagen grande si existe)
    const imagen = producto.images && producto.images.length > 0 ? producto.images[0] : producto.thumbnail || "img/17003579.png";

    contenedor.innerHTML = `
        <img 
            src="${imagen}" 
            alt="${producto.title}"
            class="producto-img"
            style="height: 300px; object-fit: contain;"
            onerror="this.src='img/17003579.png'"
        >
        <h3 class="practice-title">${producto.title}</h3>
        <p>${producto.description}</p>
        <p><strong>Precio:</strong> $${producto.price}</p>
        <p><strong>Categoría:</strong> ${producto.category}</p>
        <p><strong>Rating:</strong> ${producto.rating} ⭐</p>
        <p><strong>Stock:</strong> ${producto.stock}</p>
        <p><strong>Marca:</strong> ${producto.brand || 'N/A'}</p>
        <p><strong>Descuento:</strong> ${producto.discountPercentage}%</p>
    `;
}