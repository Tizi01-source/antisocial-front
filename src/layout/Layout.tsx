import { Button, Container, Dropdown, Nav, Navbar } from 'react-bootstrap'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { BoxArrowRight, Moon, Person, Sun } from 'react-bootstrap-icons'
import Avatar from '../components/Avatar'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../hooks/useTheme'

export default function Layout() {
    const { user, logout } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate('/')
    }

    return (
        <>
            <Navbar expand="md" className="app-navbar sticky-top" data-bs-theme={theme}>
                <Container>
                    <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center gap-2 fw-bold">
                        <Logo size={36} />
                        <span>Anti-Social Net</span>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="main-nav" />

                    <Navbar.Collapse id="main-nav">
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
                            <Button
                                variant="link"
                                className="icon-button"
                                onClick={toggleTheme}
                                aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                            >
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </Button>

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

            <Container className="py-4">
                <Outlet />
            </Container>
        </>
    )
}