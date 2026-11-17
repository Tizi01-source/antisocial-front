import { useState } from 'react'
import type { FormEvent } from 'react'
import { Alert, Button, Card, Form } from 'react-bootstrap'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { createUser } from '../api/api'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'

type RegisterErrors = {
    nickName?: string
    email?: string
}

export default function Register() {
    const { user, login } = useAuth()
    const navigate = useNavigate()

    const [nickName, setNickName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [errors, setErrors] = useState<RegisterErrors>({})
    const [serverError, setServerError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    if (user) {
        return <Navigate to="/" replace />
    }

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

    return (
        <Card className="auth-card mx-auto">
            <Card.Body className="p-4">
                <div className="text-center mb-4">
                    <Logo size={56} />
                    <h1 className="h3 mt-3 mb-1">Creá tu cuenta</h1>
                    <p className="text-muted mb-0">Sumate a la comunidad de UnaHur</p>
                </div>

                {serverError && <Alert variant="danger">{serverError}</Alert>}

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

                <p className="mt-4 mb-0 text-center">
                    ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
                </p>
            </Card.Body>
        </Card>
    )
}