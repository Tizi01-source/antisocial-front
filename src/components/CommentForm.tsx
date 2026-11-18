// Componente para el formulario de comentarios. Permite a los usuarios autenticados escribir y enviar comentarios en un post específico.

import { useState } from 'react'
import type { FormEvent } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { createComment } from '../api/api'
import { useAuth } from '../context/AuthContext'

// Props del componente CommentForm. Incluye el ID del post y una función de callback que se ejecuta después de agregar un comentario.
type CommentFormProps = {
    postId: number
    onCommentAdded: () => Promise<void>
}

export default function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
    const { user } = useAuth()

    // Estado para el contenido del comentario, errores de validación y estado de envío.
    const [content, setContent] = useState<string>('')
    const [contentError, setContentError] = useState<string | null>(null)
    const [serverError, setServerError] = useState<string | null>(null)
    const [sending, setSending] = useState<boolean>(false)

    // Si el usuario no está autenticado, se muestra un mensaje indicando que debe iniciar sesión para comentar.
    if (!user) {
        return (
            <Alert variant="info">
                Para comentar tenés que <Link to="/login">iniciar sesión</Link>.
            </Alert>
        )
    }

    // Función que maneja el envío del formulario de comentarios. Valida el contenido y llama a la API para crear el comentario.
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        // Evita que el formulario se envíe de manera predeterminada.
        e.preventDefault()
        if (!user) return
        setServerError(null)

        // Validación del contenido del comentario. Si está vacío, se establece un mensaje de error.
        if (!content.trim()) {
            setContentError('El comentario no puede estar vacío')
            return
        }
        setContentError(null)

        // Llama a la API para crear el comentario y maneja los errores del servidor.
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
            {/* Si hay un error del servidor, se muestra un mensaje de alerta. */}
            {serverError && <Alert variant="danger">{serverError}</Alert>}

            {/* Campo de texto para escribir el comentario. Muestra un mensaje de error si el contenido es inválido. */}
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

            {/* Botón para enviar el comentario. Se desactiva mientras se está enviando. */}
            <Button type="submit" disabled={sending}>
                {sending ? 'Enviando...' : 'Comentar'}
            </Button>
        </Form>
    )
}