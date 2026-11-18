// Componente de ruta protegida que verifica si el usuario está autenticado antes de permitir el acceso a ciertas rutas.

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
    const { user } = useAuth()

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}