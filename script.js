$(document).ready(function() {
    const hexMap = $('#hex-map');
    const mapContainer = $('#map-container');
    const infoPanel = $('#info-panel');

    const hexRadius = 50; // Radio del hexágono
    const hexWidth = Math.sqrt(3) * hexRadius; // Ancho (~86.6px)
    const hexHeight = 2 * hexRadius; // Altura (100px)
    const verticalStep = hexHeight * 0.75; // Paso vertical exacto entre filas hexagonales

    let offsetX = 0; // Desplazamiento en X
    let offsetY = 0; // Desplazamiento en Y
    let isDragging = false;
    let hasDragged = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let scale = 1; // Escala inicial

    // Sincronizar variables CSS con la geometría calculada en JS
    document.documentElement.style.setProperty('--hex-width', `${hexWidth}px`);
    document.documentElement.style.setProperty('--hex-height', `${hexHeight}px`);

    function updateMapTransform() {
        hexMap.css({
            transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`
        });
        hexMap.toggleClass('hide-labels', scale < 0.6);
    }

    // Crear una cuadrícula de hexágonos
    for (let row = -10; row < 10; row++) {
        for (let col = -13; col < 13; col++) {
            const x = col * hexWidth + (Math.abs(row) % 2) * (hexWidth / 2);
            const y = row * verticalStep;
            const hexIndex = `${row},${col}`;

            // Generar aleatoriamente agua (20%) o tierra (80%)
            const isWater = Math.random() < 0.2;

            const hex = $('<div class="hex"></div>')
                .addClass(isWater ? 'water' : 'land')
                .attr('title', `Casilla (${hexIndex}) - ${isWater ? 'Agua' : 'Tierra'}`)
                .css({
                    left: `${x}px`,
                    top: `${y}px`
                });

            hex.append(`<span class="hex-number">${hexIndex}</span>`);

            // Seleccionar o deseleccionar solo si no fue un arrastre del mapa
            hex.on('click', function(e) {
                e.stopPropagation();
                if (hasDragged) {
                    return;
                }

                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                    infoPanel.removeClass('show');
                    mapContainer.removeClass('partial-width').addClass('full-width');
                } else {
                    $('.hex.selected').removeClass('selected');
                    $(this).addClass('selected');

                    $('#hex-coordinates').text(`Coordinates: ${hexIndex}`);
                    infoPanel.addClass('show');
                    mapContainer.removeClass('full-width').addClass('partial-width');
                }
            });

            hexMap.append(hex);
        }
    }

    // Manejar el desplazamiento con el mouse distinguiendo clic de arrastre
    mapContainer.on('mousedown', function(e) {
        if (e.button !== 0) return;
        isDragging = true;
        hasDragged = false;
        lastMouseX = e.pageX;
        lastMouseY = e.pageY;
    });

    $(document).on('mousemove', function(e) {
        if (!isDragging) return;

        const dx = e.pageX - lastMouseX;
        const dy = e.pageY - lastMouseY;

        if (Math.hypot(dx, dy) > 4) {
            hasDragged = true;
        }

        offsetX += dx / scale;
        offsetY += dy / scale;
        updateMapTransform();

        lastMouseX = e.pageX;
        lastMouseY = e.pageY;
    });

    $(document).on('mouseup', function() {
        isDragging = false;
        setTimeout(function() {
            hasDragged = false;
        }, 0);
    });

    // Manejar el zoom con la rueda del ratón
    mapContainer.on('wheel', function(e) {
        e.preventDefault();
        const delta = e.originalEvent.deltaY > 0 ? -0.1 : 0.1;
        scale = Math.min(Math.max(0.125, +(scale + delta).toFixed(3)), 4);
        updateMapTransform();
    });

    // Manejar el movimiento del mapa con las teclas WASD
    $(document).on('keydown', function(e) {
        const moveStep = 50;
        switch (e.key.toLowerCase()) {
            case 'w':
                offsetY += moveStep;
                break;
            case 's':
                offsetY -= moveStep;
                break;
            case 'a':
                offsetX += moveStep;
                break;
            case 'd':
                offsetX -= moveStep;
                break;
            default:
                return;
        }
        updateMapTransform();
    });

    updateMapTransform();
});