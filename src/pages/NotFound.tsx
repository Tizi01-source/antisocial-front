// Página que se muestra cuando el usuario intenta acceder a una ruta que no existe.

import { Link } from 'react-router-dom'

export default function NotFound() {

    return (
        <div className="text-center py-5">
            <h2>404</h2>
            <p>La página que buscás no existe.</p>
            <Link to="/">Volver al inicio</Link>
        </div>
    )
}