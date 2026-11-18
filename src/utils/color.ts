// Paleta de colores para los avatares y banners (todos permiten leer texto blanco encima)

const COLORS = [
    '#2e7d32',
    '#00798c',
    '#6a1b9a',
    '#c2185b',
    '#b45309',
    '#455a64',
    '#1565c0',
    '#c62828',
]

// Elige un color de la paleta según la primera letra del nombre
export function colorForName(name: string): string {
    return COLORS[name.charCodeAt(0) % COLORS.length]
}