// Componente de diseño principal que incluye la barra de navegación y el contenedor para las rutas hijas.

import { Button, Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout() {

    // Obtenemos el usuario y la función de cierre de sesión del contexto de autenticación
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    // Función para manejar el cierre de sesión del usuario
    function handleLogout() {
        logout()
        navigate('/')
    }

    // Renderizamos la barra de navegación y el contenedor para las rutas hijas
    return (
        <>
            <Navbar bg="dark" variant="dark" expand="md">
                <Container>
                    <Navbar.Brand as={NavLink} to="/">
                        Anti-Social Net
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="main-nav" />
                    <Navbar.Collapse id="main-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={NavLink} to="/" end>
                                Inicio
                            </Nav.Link>
                            {user && (
                                <>
                                    <Nav.Link as={NavLink} to="/crear-post">
                                        Crear post
                                    </Nav.Link>
                                    <Nav.Link as={NavLink} to="/perfil">
                                        Mi perfil
                                    </Nav.Link>
                                </>
                            )}
                        </Nav>
                        <Nav className="align-items-md-center">
                            {user ? (
                                <>
                                    <Navbar.Text className="me-md-3">Hola, {user.nickName}</Navbar.Text>
                                    <Button variant="outline-light" size="sm" onClick={handleLogout}>
                                        Cerrar sesión
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Nav.Link as={NavLink} to="/login">
                                        Iniciar sesión
                                    </Nav.Link>
                                    <Nav.Link as={NavLink} to="/register">
                                        Registrarse
                                    </Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="py-4">
                <Outlet />
            </Container>
        </>
    )
}