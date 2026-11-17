// Página que se muestra cuando el usuario intenta acceder a una ruta que no existe (404 Not Found).

import { Link } from 'react-router-dom'

export default function NotFound() {

    // Renderizamos un mensaje de error indicando que la página no existe y un enlace para volver al inicio
    return (
        <div className="text-center py-5">
            <h2>404</h2>
            <p>La página que buscás no existe.</p>
            <Link to="/">Volver al inicio</Link>
        </div>
    )
}