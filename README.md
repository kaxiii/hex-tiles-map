# Hexagonal Grid Map

## Overview

This project features an interactive hexagonal grid map built with HTML, CSS, and JavaScript (jQuery). The map dynamically generates a staggered pointy-top hexagonal grid with multiple terrain biomes, coordinate labels, smooth pan/zoom controls, and an inspection side panel displaying the selected tile's coordinates and terrain type.

## Features

- **Synchronized Hexagonal Grid Layout**: Dynamic generation of a 20×26 grid of pointy-top hexagons (`row` from `-10` to `9`, `col` from `-13` to `12`) with unified CSS/JS geometry (`--hex-width`, `--hex-height`, and `0.75` vertical row spacing) so tiles fit together without gaps.
- **Procedural Biomes**:
  - **Agua (`water`)**: Base ocean/water tiles.
  - **Costa (`coast`)**: Automatically assigned to land tiles adjacent to any neighboring water hexagon.
  - **Bosque (`forest`)** & **Montaña (`mountain`)**: Distributed across interior land tiles.
- **Hexagon Selection & Side Info Panel**: Click a tile to highlight it and open `#info-panel` on the right side (automatically resizing the map container between `full-width` and `partial-width`), showing the selected hexagon's coordinates and terrain biome. Clicking the selected tile again deselects it and hides the panel.
- **Hover & Selection Visual Feedback**: Subtle brightness feedback on hover, distinct selection color (`#FF5733`) with an inner highlight overlay, and high-contrast coordinate labels with text shadows.
- **Smart Mouse Dragging**: Click and drag to pan across the map while distinguishing drag gestures from tile selection clicks.
- **Keyboard Navigation**: Use the `W`, `A`, `S`, and `D` keys to move the map in all directions.
- **Zoom & Adaptive Labels**: Scroll with the mouse wheel to zoom between `0.125x` and `4x`. Coordinate labels automatically fade out when zoomed out below `0.6x` to prevent visual clutter.
- **Non-selectable Text**: Tile coordinate labels cannot be selected accidentally while dragging or clicking.

## Project Structure

- `hex-map.html`: Main HTML layout containing `#map-container`, `#hex-map`, and `#info-panel` (`#hex-coordinates` and `#hex-terrain`).
- `styles.css`: Hexagonal `clip-path` geometry, CSS custom properties, biome styles, hover/selection states, label visibility rules, and responsive panel layout.
- `script.js`: Grid geometry synchronization, procedural biome generation (including coastal neighbor detection), tile selection logic, drag-vs-click handling, zoom, and `WASD` movement.

## Installation & Usage

1. Clone this repository to your local machine:
   ```bash
   git clone [https://github.com/kaxiii/hexagonal-grid-map.git](https://github.com/kaxiii/hexagonal-grid-map.git)