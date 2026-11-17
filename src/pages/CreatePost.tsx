import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Alert, Button, Card, Form, InputGroup } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { createPost, createPostImage, getTags } from '../api/api'
import { useAuth } from '../context/AuthContext'
import type { Tag } from '../types'

function isValidUrl(value: string): boolean {
    try {
        const url = new URL(value)
        return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
        return false
    }
}

export default function CreatePost() {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [description, setDescription] = useState<string>('')
    const [imageUrls, setImageUrls] = useState<string[]>([''])
    const [tags, setTags] = useState<Tag[]>([])
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])

    const [descriptionError, setDescriptionError] = useState<string | null>(null)
    const [imageErrors, setImageErrors] = useState<(string | null)[]>([])
    const [tagsError, setTagsError] = useState<string | null>(null)
    const [serverError, setServerError] = useState<string | null>(null)
    const [sending, setSending] = useState<boolean>(false)
    const [postSaved, setPostSaved] = useState<boolean>(false)

    useEffect(() => {
        getTags()
            .then(setTags)
            .catch((e: unknown) =>
                setTagsError(e instanceof Error ? e.message : 'Error desconocido')
            )
    }, [])

    if (!user) return null

    function toggleTag(tagId: number) {
        setSelectedTagIds((prev) =>
            prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
        )
    }

    function changeImageUrl(index: number, value: string) {
        setImageUrls((prev) => prev.map((url, i) => (i === index ? value : url)))
    }

    function addImageField() {
        setImageUrls((prev) => [...prev, ''])
        setImageErrors((prev) => [...prev, null])
    }

    function removeImageField(index: number) {
        setImageUrls((prev) => prev.filter((_, i) => i !== index))
        setImageErrors((prev) => prev.filter((_, i) => i !== index))
    }

    function validate(): boolean {
        const newDescriptionError = description.trim()
            ? null
            : 'La descripción es obligatoria'

        const newImageErrors = imageUrls.map((url) =>
            url.trim() && !isValidUrl(url.trim())
                ? 'Ingresá una URL válida (empieza con http:// o https://)'
                : null
        )

        setDescriptionError(newDescriptionError)
        setImageErrors(newImageErrors)

        return !newDescriptionError && newImageErrors.every((err) => err === null)
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!user) return
        setServerError(null)

        if (!validate()) return

        const urls = imageUrls.map((url) => url.trim()).filter((url) => url !== '')

        setSending(true)
        let postCreated = false
        try {
            const created = await createPost(description.trim(), user.id, selectedTagIds)
            postCreated = true

            for (const url of urls) {
                await createPostImage(url, created.id)
            }

            navigate('/perfil')
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido'
            if (postCreated) {
                setPostSaved(true)
                setServerError(`El post se publicó, pero no se pudieron guardar las imágenes: ${message}`)
            } else {
                setServerError(message)
            }
        } finally {
            setSending(false)
        }
    }

    return (
        <Card className="mx-auto" style={{ maxWidth: 640 }}>
            <Card.Body>
                <Card.Title as="h2" className="mb-3">
                    Crear post
                </Card.Title>

                {serverError && (
                    <Alert variant={postSaved ? 'warning' : 'danger'}>
                        {serverError}
                        {postSaved && (
                            <>
                                {' '}
                                <Link to="/perfil">Ir a mi perfil</Link>
                            </>
                        )}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit} noValidate>
                    <Form.Group className="mb-3" controlId="postDescription">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            isInvalid={!!descriptionError}
                        />
                        <Form.Control.Feedback type="invalid">
                            {descriptionError}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Tags</Form.Label>
                        {tagsError && <Alert variant="warning">No se pudieron cargar los tags: {tagsError}</Alert>}
                        <div>
                            {tags.map((tag) => (
                                <Form.Check
                                    key={tag.id}
                                    inline
                                    type="checkbox"
                                    id={`tag-${tag.id}`}
                                    label={`#${tag.name}`}
                                    checked={selectedTagIds.includes(tag.id)}
                                    onChange={() => toggleTag(tag.id)}
                                />
                            ))}
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Imágenes (opcional)</Form.Label>
                        {imageUrls.map((url, index) => (
                            <InputGroup key={index} className="mb-2" hasValidation>
                                <Form.Control
                                    type="text"
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                    value={url}
                                    onChange={(e) => changeImageUrl(index, e.target.value)}
                                    isInvalid={!!imageErrors[index]}
                                    aria-label={`URL de la imagen ${index + 1}`}
                                />
                                {imageUrls.length > 1 && (
                                    <Button variant="outline-danger" onClick={() => removeImageField(index)}>
                                        Quitar
                                    </Button>
                                )}
                                <Form.Control.Feedback type="invalid">
                                    {imageErrors[index]}
                                </Form.Control.Feedback>
                            </InputGroup>
                        ))}
                        <Button variant="outline-secondary" size="sm" onClick={addImageField}>
                            + Agregar otra imagen
                        </Button>
                    </Form.Group>

                    <Button type="submit" disabled={sending || postSaved}>
                        {sending ? 'Publicando...' : 'Publicar'}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    )
}