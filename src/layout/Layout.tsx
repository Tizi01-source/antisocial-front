// Barra de navegación y contenedor principal de la aplicación

import { Button, Container, Dropdown, Nav, Navbar } from 'react-bootstrap'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { BoxArrowRight, Moon, Person, Sun } from 'react-bootstrap-icons'
import Avatar from '../components/Avatar'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../hooks/useTheme'

export default function Layout() {

    // Obtener el usuario autenticado y la función de cierre de sesión del contexto de autenticación
    const { user, logout } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()

    // Función para manejar el cierre de sesión del usuario
    function handleLogout() {
        logout()
        navigate('/')
    }

    return (
        <>
            <Navbar expand="md" className="app-navbar sticky-top" data-bs-theme={theme}>
                <Container>

                    {/* Logo y nombre de la aplicación, que redirige a la página de inicio. */}
                    <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center gap-2 fw-bold">
                        <Logo size={36} />
                        <span>Anti-Social Net</span>
                    </Navbar.Brand>

                    {/* Botón de alternancia para mostrar u ocultar el menú de navegación en pantallas pequeñas */}
                    <Navbar.Toggle aria-controls="main-nav" />

                    {/* Contenido del menú de navegación, incluye enlaces, creacion de posts, alternancia de tema y opciones de usuario. */}
                    <Navbar.Collapse id="main-nav">

                        {/* Menú de navegación con enlaces a la página de inicio y, si el usuario está autenticado, al formulario de creación de posts. */}
                        <Nav className="me-auto ms-md-3 gap-1">
                            <Nav.Link as={NavLink} to="/" end>
                                Inicio
                            </Nav.Link>
                            {user && (
                                <Nav.Link as={NavLink} to="/crear-post">
                                    Crear post
                                </Nav.Link>
                            )}
                        </Nav>

                        <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
                            {/* Botón para alternar entre el modo oscuro y el modo claro. */}
                            <Button
                                variant="link"
                                className="icon-button"
                                onClick={toggleTheme}
                                aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                            >
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </Button>

                            {/* Menú desplegable que muestra el avatar y el nombre del usuario autenticado, con opciones para acceder al perfil o cerrar sesión. */}
                            {user ? (
                                <Dropdown align="end">
                                    <Dropdown.Toggle variant="link" className="user-toggle d-flex align-items-center gap-2">
                                        <Avatar nickName={user.nickName} size={32} />
                                        <span>{user.nickName}</span>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => navigate('/perfil')}>
                                            <Person className="me-2" />
                                            Mi perfil
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={handleLogout}>
                                            <BoxArrowRight className="me-2" />
                                            Cerrar sesión
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : (
                                <>
                                    <Link to="/login" className="btn btn-outline-primary btn-sm">
                                        Iniciar sesión
                                    </Link>
                                    <Link to="/register" className="btn btn-primary btn-sm">
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Contenedor principal donde se renderizan las rutas hijas */}
            <Container className="py-4">
                <Outlet />
            </Container>
        </>
    )
}