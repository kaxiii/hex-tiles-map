$(document).ready(function() {
    const hexMap = $('#hex-map');
    const hexRadius = 50; // Radio del hexágono
    const hexWidth = Math.sqrt(3) * hexRadius; // Ancho del hexágono
    const hexHeight = 2 * hexRadius; // Altura del hexágono
    const horizontalSpacing = 0; // Espacio horizontal entre hexágonos

    let offsetX = 0; // Desplazamiento en X
    let offsetY = 0; // Desplazamiento en Y
    let isDragging = false;
    let lastMouseX, lastMouseY;
    let scale = 1; // Inicializa la escala

    // Crear una cuadrícula de hexágonos
    for (let row = -10; row < 10; row++) {
        for (let col = -13; col < 13; col++) {
            const x = col * (hexWidth + horizontalSpacing) + (row % 2) * (hexWidth / 2);
            const y = row * (hexHeight * 0.47); // El 0.75 es el factor de separación vertical
            const hexIndex = `${row},${col}`; // Crear un índice para el hexágono
            const hex = $('<div class="hex"></div>').css({
                left: `${x}px`,
                top: `${y}px`
            });

            // Agregar un número dentro del hexágono
            hex.append(`<span class="hex-number">${hexIndex}</span>`);

            // Manejar el clic en el hexágono para seleccionar/deseleccionar
            hex.on('click', function() {
                if ($(this).hasClass('selected')) {
                    // Si ya está seleccionado, deseleccionarlo
                    $(this).removeClass('selected');
                } else {
                    // Deseleccionar cualquier hexágono seleccionado previamente
                    $('.hex.selected').removeClass('selected');
                    
                    // Seleccionar el hexágono actual
                    $(this).addClass('selected');
                }
            });

            hexMap.append(hex);
        }
    }

    // Manejar el desplazamiento con el mouse
    $('#map-container').on('mousedown', function(e) {
        isDragging = true;
        lastMouseX = e.pageX;
        lastMouseY = e.pageY;
    });

    $(document).on('mousemove', function(e) {
        if (isDragging) {
            const deltaX = (e.pageX - lastMouseX) / scale; // Divide por la escala
            const deltaY = (e.pageY - lastMouseY) / scale; // Divide por la escala
            offsetX += deltaX;
            offsetY += deltaY;
            hexMap.css({
                transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`
            });
            lastMouseX = e.pageX;
            lastMouseY = e.pageY;
        }
    });

    $(document).on('mouseup', function() {
        isDragging = false;
    });

    // Manejar el zoom
    $(document).on('wheel', function(e) {
        e.preventDefault();
        scale += e.originalEvent.deltaY > 0 ? -0.1 : 0.1; // Ajustar la escala
        scale = Math.min(Math.max(.125, scale), 4); // Limitar la escala entre 0.125 y 4
        hexMap.css({
            transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`
        });
    });

    // Manejar el movimiento del mapa con las teclas WASD
    $(document).on('keydown', function(e) {
        const moveStep = 50; // Cuánto mover el mapa por cada tecla presionada
        switch (e.key) {
            case 'w': // Mover hacia arriba
                offsetY += moveStep;
                break;
            case 's': // Mover hacia abajo
                offsetY -= moveStep;
                break;
            case 'a': // Mover hacia la izquierda
                offsetX += moveStep;
                break;
            case 'd': // Mover hacia la derecha
                offsetX -= moveStep;
                break;
        }
        // Actualizar la posición del mapa
        hexMap.css({
            transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`
        });
    });
});
