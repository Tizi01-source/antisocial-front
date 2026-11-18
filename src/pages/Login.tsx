// Pagina de login, donde el usuario puede iniciar sesión con su nickName y una contraseña fija.

import { useState } from 'react'
import type { FormEvent } from 'react'
import { Alert, Button, Card, Form } from 'react-bootstrap'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { getUsers } from '../api/api'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'

// Contraseña fija para todos los usuarios.
const FIXED_PASSWORD = '123456'

export default function Login() {
    // Contexto de autenticación y navegación
    const { user, login } = useAuth()
    const navigate = useNavigate()

    // Estados locales para el formulario de login
    const [nickName, setNickName] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    // Si el usuario ya está logueado, redirigir a la página principal
    if (user) {
        return <Navigate to="/" replace />
    }

    // Validación del formulario de login y manejo del envío
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        // Evitar el comportamiento por defecto del formulario
        e.preventDefault()
        setError(null)

        // Validar que el nickName y la contraseña no estén vacíos
        if (!nickName.trim() || !password) {
            setError('Completá el nickName y la contraseña')
            return
        }

        // Establecer el estado de carga y buscar el usuario en la API
        setLoading(true)
        try {
            const users = await getUsers()
            const found = users.find((u) => u.nickName === nickName.trim())

            if (!found || password !== FIXED_PASSWORD) {
                setError('Usuario o contraseña incorrectos')
                return
            }

            login(found)
            navigate('/')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="auth-card mx-auto">
            <Card.Body className="p-4">

                {/* Logo y título de la página de login */}
                <div className="text-center mb-4">
                    <Logo size={56} />
                    <h1 className="h3 mt-3 mb-1">Bienvenido de vuelta</h1>
                    <p className="text-muted mb-0">Iniciá sesión para publicar y comentar</p>
                </div>

                {/* Mostrar un mensaje de error si existe */}
                {error && <Alert variant="danger">{error}</Alert>}

                {/* Formulario de login con campos para nickName y contraseña */}
                <Form onSubmit={handleSubmit} noValidate>
                    <Form.Group className="mb-3" controlId="loginNickName">
                        <Form.Label>NickName</Form.Label>
                        <Form.Control
                            type="text"
                            value={nickName}
                            onChange={(e) => setNickName(e.target.value)}
                            autoComplete="username"
                        />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="loginPassword">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </Form.Group>

                    <Button type="submit" className="w-100" disabled={loading}>
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </Button>
                </Form>

                {/* Enlace para registrarse si no se tiene una cuenta */}
                <p className="mt-4 mb-0 text-center">
                    ¿No tenés cuenta? <Link to="/register">Registrate</Link>
                </p>
            </Card.Body>
        </Card>
    )
}