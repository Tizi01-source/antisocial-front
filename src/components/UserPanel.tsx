// Componente que representa el panel de usuario en la barra lateral.

import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Avatar from './Avatar'

export default function UserPanel() {

    // Obtiene el usuario autenticado desde el contexto de autenticación
    const { user } = useAuth()

    // Si no hay un usuario autenticado, muestra un panel invitando a registrarse o iniciar sesión
    if (!user) {
        return (
            <Card className="side-panel">
                <Card.Body>

                    <Card.Title as="h2" className="h5">
                        Sumate a la comunidad
                    </Card.Title>


                    <Card.Text className="text-muted">
                        Creá una cuenta para publicar, comentar y seguir lo que pasa en UnaHur.
                    </Card.Text>

                    <div className="d-grid gap-2">
                        <Link to="/register" className="btn btn-primary">
                            Registrarse
                        </Link>
                        <Link to="/login" className="btn btn-outline-primary">
                            Iniciar sesión
                        </Link>

                    </div>
                </Card.Body>
            </Card>
        )
    }

    // Si hay un usuario autenticado, muestra su información y opciones de navegación
    return (
        <Card className="side-panel">
            <Card.Body className="text-center">

                <Avatar nickName={user.nickName} size={64} />
                <Card.Title as="h2" className="h5 mt-3 mb-0">
                    @{user.nickName}
                </Card.Title>

                <Card.Text className="text-muted small text-break">{user.email}</Card.Text>

                <div className="d-grid gap-2">
                    <Link to="/crear-post" className="btn btn-primary">
                        Crear post
                    </Link>
                    <Link to="/perfil" className="btn btn-outline-primary">
                        Mi perfil
                    </Link>
                </div>

            </Card.Body>
        </Card>
    )
}