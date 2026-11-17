// Contexto de autenticación para manejar el estado del usuario y las funciones de inicio/cierre de sesión.

import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types'

// Tipo para el contexto de autenticación
type AuthContextType = {
    user: User | null
    login: (user: User) => void
    logout: () => void
}

// Clave para almacenar el usuario en localStorage
const STORAGE_KEY = 'user'

// Contexto de autenticación
const AuthContext = createContext<AuthContextType | null>(null)

// Función para leer el usuario almacenado en localStorage
function readStoredUser(): User | null {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return null
    try {
        return JSON.parse(saved)
    } catch {
        return null
    }
}

// Componente proveedor de contexto de autenticación
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(readStoredUser)

    function login(newUser: User) {
        setUser(newUser)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
    }

    function logout() {
        setUser(null)
        localStorage.removeItem(STORAGE_KEY)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
    {children}
    </AuthContext.Provider>
)
}

// Hook personalizado para acceder al contexto de autenticación
export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth tiene que usarse dentro de <AuthProvider>')
    }
    return context
}