import { useState } from 'react'
import type { FormEvent } from 'react'
import { Alert, Button, Card, Form } from 'react-bootstrap'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { getUsers } from '../api/api'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'

const FIXED_PASSWORD = '123456'

export default function Login() {
    const { user, login } = useAuth()
    const navigate = useNavigate()

    const [nickName, setNickName] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    if (user) {
        return <Navigate to="/" replace />
    }

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

    return (
        <Card className="auth-card mx-auto">
            <Card.Body className="p-4">
                <div className="text-center mb-4">
                    <Logo size={56} />
                    <h1 className="h3 mt-3 mb-1">Bienvenido de vuelta</h1>
                    <p className="text-muted mb-0">Iniciá sesión para publicar y comentar</p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit} noValidate>
                    <Form.Group className="mb-3" controlId="loginNickName">
                        <Form.Label>NickName</Form.Label>
                        <Form.Control
                            type="text"
                            value={nickName}
                            onChange={(e) => setNickName(e.target.value)}
                            placeholder="luna"
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

                <p className="mt-4 mb-0 text-center">
                    ¿No tenés cuenta? <Link to="/register">Registrate</Link>
                </p>
            </Card.Body>
        </Card>
    )
}