// Pagina de registro de usuario. Permite a los usuarios crear una cuenta proporcionando un nickName y un email.

import { useState } from 'react'
import type { FormEvent } from 'react'
import { Alert, Button, Card, Form } from 'react-bootstrap'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { createUser } from '../api/api'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'

// Define los posibles errores de validación para el formulario de registro
type RegisterErrors = {
    nickName?: string
    email?: string
}

export default function Register() {

    // Obtiene el usuario actual y la función de inicio de sesión del contexto de autenticación
    const { user, login } = useAuth()
    const navigate = useNavigate()

    // Estado local para manejar los valores del formulario y los errores
    const [nickName, setNickName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [errors, setErrors] = useState<RegisterErrors>({})
    const [serverError, setServerError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    // Si el usuario ya está autenticado, redirige a la página de inicio
    if (user) {
        return <Navigate to="/" replace />
    }

    // Función para validar los campos del formulario
    function validate(): boolean {
        // Reinicia los errores antes de la validación
        const newErrors: RegisterErrors = {}

        // Validación del campo nickName
        if (!nickName.trim()) {
            newErrors.nickName = 'El nickName es obligatorio'
        }

        // Validación del campo email
        if (!email.trim()) {
            newErrors.email = 'El email es obligatorio'
        } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
            newErrors.email = 'El email no tiene un formato válido'
        }

        // Actualiza el estado de errores y devuelve si la validación fue exitosa
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Función para manejar el envío del formulario
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        // Previene el comportamiento por defecto del formulario
        e.preventDefault()
        setServerError(null)

        // Valida los campos del formulario antes de enviar la solicitud
        if (!validate()) return

        // Intenta crear un nuevo usuario y manejar la respuesta
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

    return (
        <Card className="auth-card mx-auto">
            <Card.Body className="p-4">

                {/* Titulo, logo y descripción de la página de registro */}
                <div className="text-center mb-4">
                    <Logo size={56} />
                    <h1 className="h3 mt-3 mb-1">Creá tu cuenta</h1>
                    <p className="text-muted mb-0">Sumate a la comunidad de UnaHur</p>
                </div>

                {/* Muestra un mensaje de error si ocurre un error en el servidor durante el registro */}
                {serverError && <Alert variant="danger">{serverError}</Alert>}

                {/* Formulario de registro con campos para nickName y email, y un botón de envío */}
                <Form onSubmit={handleSubmit} noValidate>

                    <Form.Group className="mb-3" controlId="registerNickName">
                        <Form.Label>NickName</Form.Label>
                        <Form.Control
                            type="text"
                            value={nickName}
                            onChange={(e) => setNickName(e.target.value)}
                            isInvalid={!!errors.nickName}
                            autoComplete="username"
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.nickName}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="registerEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            isInvalid={!!errors.email}
                            autoComplete="email"
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button type="submit" className="w-100" disabled={loading}>
                        {loading ? 'Creando cuenta...' : 'Registrarme'}
                    </Button>

                </Form>

                {/* Enlace para redirigir a la página de inicio de sesión si el usuario ya tiene una cuenta */}
                <p className="mt-4 mb-0 text-center">
                    ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
                </p>
            </Card.Body>
        </Card>
    )
}