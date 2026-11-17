import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Alert, Button, Card, Form, InputGroup } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { createPost, createPostImage, getTags } from '../api/api'
import Avatar from '../components/Avatar'
import SafeImage from '../components/SafeImage'
import { useAuth } from '../context/AuthContext'
import type { Tag } from '../types'

const MAX_DESCRIPTION = 500

function isValidUrl(value: string): boolean {
    try {
        const url = new URL(value)
        return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
        return false
    }
}

function ImagePreview({ url }: { url: string }) {
    const [debouncedUrl, setDebouncedUrl] = useState<string>('')

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedUrl(url.trim()), 600)
        return () => clearTimeout(timer)
    }, [url])

    const current = url.trim()
    if (!current || debouncedUrl !== current || !isValidUrl(current)) return null

    return (
        <div className="mt-2">
            <SafeImage key={current} src={current} alt="Vista previa de la imagen" height={140} />
        </div>
    )
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
        setImageErrors((prev) => prev.map((err, i) => (i === index ? null : err)))
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
        <Card className="form-card mx-auto">
            <Card.Body className="p-4">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <Avatar nickName={user.nickName} size={48} />
                    <div>
                        <h1 className="h4 mb-0">Crear post</h1>
                        <small className="text-muted">Publicás como @{user.nickName}</small>
                    </div>
                </div>

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
                    <Form.Group className="mb-4" controlId="postDescription">
                        <Form.Label>¿Qué querés compartir?</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            maxLength={MAX_DESCRIPTION}
                            placeholder="Escribí tu post..."
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value)
                                setDescriptionError(null)
                            }}
                            isInvalid={!!descriptionError}
                        />
                        <Form.Control.Feedback type="invalid">
                            {descriptionError}
                        </Form.Control.Feedback>
                        <div className="text-end small text-muted mt-1">
                            {description.length}/{MAX_DESCRIPTION}
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Tags</Form.Label>
                        {tagsError && <Alert variant="warning">No se pudieron cargar los tags: {tagsError}</Alert>}
                        <div className="d-flex flex-wrap gap-2" role="group" aria-label="Elegir tags">
                            {tags.map((tag) => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    className={`tag-chip ${selectedTagIds.includes(tag.id) ? 'active' : ''}`}
                                    aria-pressed={selectedTagIds.includes(tag.id)}
                                    onClick={() => toggleTag(tag.id)}
                                >
                                    #{tag.name}
                                </button>
                            ))}
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Imágenes (opcional)</Form.Label>
                        {imageUrls.map((url, index) => (
                            <div key={index} className="mb-3">
                                <InputGroup hasValidation>
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
                                <ImagePreview url={url} />
                            </div>
                        ))}
                        <Button variant="outline-secondary" size="sm" onClick={addImageField}>
                            + Agregar otra imagen
                        </Button>
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2">
                        <Link to="/" className="btn btn-outline-secondary">
                            Cancelar
                        </Link>
                        <Button type="submit" disabled={sending || postSaved}>
                            {sending ? 'Publicando...' : 'Publicar'}
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    )
}