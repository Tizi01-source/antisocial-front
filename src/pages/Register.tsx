// Página de registro que permite a los usuarios crear una cuenta proporcionando un nickName y un email.

import { useState } from 'react'
import type { FormEvent } from 'react'
import { Alert, Button, Card, Form } from 'react-bootstrap'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { createUser } from '../api/api'
import { useAuth } from '../context/AuthContext'

// Definimos un tipo para los errores de validación del formulario de registro
type RegisterErrors = {
    nickName?: string
    email?: string
}

export default function Register() {

    // Obtenemos el usuario y la función de inicio de sesión del contexto de autenticación
    const { user, login } = useAuth()
    const navigate = useNavigate()

    // Estados para manejar el nickName, el email, los errores de validación, el error del servidor y el estado de carga
    const [nickName, setNickName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [errors, setErrors] = useState<RegisterErrors>({})
    const [serverError, setServerError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    // Si el usuario ya está autenticado, redirigimos a la página de inicio
    if (user) {
        return <Navigate to="/" replace />
    }

    // Función para validar los campos del formulario de registro
    function validate(): boolean {
        const newErrors: RegisterErrors = {}

        if (!nickName.trim()) {
            newErrors.nickName = 'El nickName es obligatorio'
        }

        if (!email.trim()) {
            newErrors.email = 'El email es obligatorio'
        } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
            newErrors.email = 'El email no tiene un formato válido'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Función para manejar el envío del formulario de registro
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setServerError(null)

        if (!validate()) return

        setLoading(true)
        try {
            const newUser = await createUser(nickName.trim(), email.trim())
            login(newUser)
            navigate('/')
        } catch (err) {
            setServerError(err instanceof Error ? err.message : 'Error desconocido')
        } finally {
            setLoading(false)
        }
    }

    // Renderizamos el formulario de registro con campos para el nickName y el email, y mostramos mensajes de error si es necesario
    return (
        <Card className="mx-auto" style={{ maxWidth: 420 }}>
            <Card.Body>
                <Card.Title as="h2" className="mb-3">
                    Crear cuenta
                </Card.Title>

                {serverError && <Alert variant="danger">{serverError}</Alert>}

                <Form onSubmit={handleSubmit} noValidate>
                    <Form.Group className="mb-3" controlId="registerNickName">
                        <Form.Label>NickName</Form.Label>
                        <Form.Control
                            type="text"
                            value={nickName}
                            onChange={(e) => setNickName(e.target.value)}
                            isInvalid={!!errors.nickName}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.nickName}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="registerEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button type="submit" className="w-100" disabled={loading}>
                        {loading ? 'Creando cuenta...' : 'Registrarme'}
                    </Button>
                </Form>

                <p className="mt-3 mb-0 text-center">
                    ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
                </p>
            </Card.Body>
        </Card>
    )
}