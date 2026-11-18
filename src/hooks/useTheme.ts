// Hook que permite alternar entre el modo oscuro y el modo claro, y guarda la preferencia del usuario en el almacenamiento local.

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

// Función que obtiene el tema inicial del almacenamiento local o del sistema operativo.
function getInitialTheme(): Theme {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(getInitialTheme)

    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', theme)
        localStorage.setItem(STORAGE_KEY, theme)
    }, [theme])

    function toggleTheme() {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
    }

    return { theme, toggleTheme }
}