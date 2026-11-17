import { useState } from 'react'
import type { FormEvent } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { createComment } from '../api/api'
import { useAuth } from '../context/AuthContext'

type CommentFormProps = {
    postId: number
    onCommentAdded: () => Promise<void>
}

export default function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
    const { user } = useAuth()

    const [content, setContent] = useState<string>('')
    const [contentError, setContentError] = useState<string | null>(null)
    const [serverError, setServerError] = useState<string | null>(null)
    const [sending, setSending] = useState<boolean>(false)

    if (!user) {
        return (
            <Alert variant="info">
                Para comentar tenés que <Link to="/login">iniciar sesión</Link>.
            </Alert>
        )
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!user) return
        setServerError(null)

        if (!content.trim()) {
            setContentError('El comentario no puede estar vacío')
            return
        }
        setContentError(null)

        setSending(true)
        try {
            await createComment(content.trim(), user.id, postId)
            setContent('')
            await onCommentAdded()
        } catch (err) {
            setServerError(err instanceof Error ? err.message : 'Error desconocido')
        } finally {
            setSending(false)
        }
    }

    return (
        <Form onSubmit={handleSubmit} noValidate className="mb-4">
            {serverError && <Alert variant="danger">{serverError}</Alert>}

            <Form.Group className="mb-2" controlId="commentContent">
                <Form.Label>Escribí un comentario</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    isInvalid={!!contentError}
                />
                <Form.Control.Feedback type="invalid">{contentError}</Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" disabled={sending}>
                {sending ? 'Enviando...' : 'Comentar'}
            </Button>
        </Form>
    )
}