// Página de inicio de sesión que permite a los usuarios ingresar con su nickName y una contraseña fija.

import { useState } from 'react'
import type { FormEvent } from 'react'
import { Alert, Button, Card, Form } from 'react-bootstrap'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { getUsers } from '../api/api'
import { useAuth } from '../context/AuthContext'

// Contraseña fija para todos los usuarios (solo para fines de demostración)
const FIXED_PASSWORD = '123456'

export default function Login() {

    //  Obtenemos el usuario y la función de inicio de sesión del contexto de autenticación
    const { user, login } = useAuth()
    const navigate = useNavigate()

    // Estados para manejar el nickName, la contraseña, el error y el estado de carga
    const [nickName, setNickName] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    // Si el usuario ya está autenticado, redirigimos a la página de inicio
    if (user) {
        return <Navigate to="/" replace />
    }

    // Función para manejar el envío del formulario de inicio de sesión
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)

        if (!nickName.trim() || !password) {
            setError('Completá el nickName y la contraseña')
            return
        }

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

    // Renderizamos el formulario de inicio de sesión con campos para el nickName y la contraseña, y mostramos mensajes de error si es necesario
    return (
        <Card className="mx-auto" style={{ maxWidth: 420 }}>
            <Card.Body>
                <Card.Title as="h2" className="mb-3">
                    Iniciar sesión
                </Card.Title>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit} noValidate>
                    <Form.Group className="mb-3" controlId="loginNickName">
                        <Form.Label>NickName</Form.Label>
                        <Form.Control
                            type="text"
                            value={nickName}
                            onChange={(e) => setNickName(e.target.value)}
                            placeholder="luna"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="loginPassword">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Button type="submit" className="w-100" disabled={loading}>
                        {loading ? 'Ingresando...' : 'Ingresar'}
                    </Button>
                </Form>

                <p className="mt-3 mb-0 text-center">
                    ¿No tenés cuenta? <Link to="/register">Registrate</Link>
                </p>
            </Card.Body>
        </Card>
    )
}