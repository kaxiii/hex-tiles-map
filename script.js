$(document).ready(function() {
    const hexMap = $('#hex-map');
    const mapContainer = $('#map-container');
    const infoPanel = $('#info-panel');
    const hexCoordinatesEl = $('#hex-coordinates');
    const hexTerrainEl = $('#hex-terrain');

    const hexRadius = 50; // Radio del hexágono
    const hexWidth = Math.sqrt(3) * hexRadius; // Ancho (~86.6px)
    const hexHeight = 2 * hexRadius; // Altura (100px)
    const verticalStep = hexHeight * 0.75; // Paso vertical exacto entre filas hexagonales

    const BIOMES = {
        forest: { id: 'forest', label: 'Bosque', cssClass: 'forest', isLand: true },
        mountain: { id: 'mountain', label: 'Montaña', cssClass: 'mountain', isLand: true },
        coast: { id: 'coast', label: 'Costa', cssClass: 'coast', isLand: true },
        water: { id: 'water', label: 'Agua', cssClass: 'water', isLand: false }
    };

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

    // Paso 1: Generar base de agua y tierra por coordenada
    const rowMin = -10, rowMax = 10;
    const colMin = -13, colMax = 13;
    const baseGrid = {};

    for (let row = rowMin; row < rowMax; row++) {
        for (let col = colMin; col < colMax; col++) {
            const key = `${row},${col}`;
            baseGrid[key] = Math.random() < 0.25 ? 'water' : 'land';
        }
    }

    // Comprobar si una casilla tiene agua en alguna de sus 6 vecinas hexagonales (odd-r / even-r offset)
    function hasAdjacentWater(row, col) {
        const isOddRow = Math.abs(row) % 2 === 1;
        const neighborOffsets = isOddRow
            ? [
                [-1, 0], [-1, 1],
                [0, -1], [0, 1],
                [1, 0], [1, 1]
            ]
            : [
                [-1, -1], [-1, 0],
                [0, -1], [0, 1],
                [1, -1], [1, 0]
            ];

        return neighborOffsets.some(([dRow, dCol]) => {
            const nKey = `${row + dRow},${col + dCol}`;
            return baseGrid[nKey] === 'water';
        });
    }

    // Paso 2: Asignar bioma final (agua, costa si toca agua, o bosque/montaña en interior)
    function resolveBiome(row, col) {
        const key = `${row},${col}`;
        if (baseGrid[key] === 'water') {
            return BIOMES.water;
        }
        if (hasAdjacentWater(row, col)) {
            return BIOMES.coast;
        }
        return Math.random() < 0.28 ? BIOMES.mountain : BIOMES.forest;
    }

    // Crear cuadrícula de hexágonos con su bioma
    for (let row = rowMin; row < rowMax; row++) {
        for (let col = colMin; col < colMax; col++) {
            const x = col * hexWidth + (Math.abs(row) % 2) * (hexWidth / 2);
            const y = row * verticalStep;
            const hexIndex = `${row},${col}`;
            const biome = resolveBiome(row, col);

            const hex = $('<div class="hex"></div>')
                .addClass(biome.isLand ? 'land' : '')
                .addClass(biome.cssClass)
                .attr('title', `Casilla (${hexIndex}) - ${biome.label}`)
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
                    hexCoordinatesEl.text('Coordinates: N/A');
                    hexTerrainEl.text('Terrain: N/A');
                    infoPanel.removeClass('show');
                    mapContainer.removeClass('partial-width').addClass('full-width');
                } else {
                    $('.hex.selected').removeClass('selected');
                    $(this).addClass('selected');

                    hexCoordinatesEl.text(`Coordinates: ${hexIndex}`);
                    hexTerrainEl.text(`Terrain: ${biome.label}`);
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