// Pagina para crear un post. Permite ingresar una descripción, seleccionar tags y agregar URLs de imágenes. Valida la entrada y maneja errores del servidor.

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Alert, Button, Card, Form, InputGroup } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { createPost, createPostImage, getTags } from '../api/api'
import Avatar from '../components/Avatar'
import SafeImage from '../components/SafeImage'
import { useAuth } from '../context/AuthContext'
import type { Tag } from '../types'

// Limite de caracteres para la descripción del post
const MAX_DESCRIPTION = 500

// Función para validar si una cadena es una URL válida
function isValidUrl(value: string): boolean {
    try {
        const url = new URL(value)
        return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
        return false
    }
}

// Componente para mostrar una vista previa de la imagen a partir de la URL ingresada
function ImagePreview({ url }: { url: string }) {

    // Estado para almacenar la URL "debounced" que se usará para la vista previa
    const [debouncedUrl, setDebouncedUrl] = useState<string>('')

    // Efecto para actualizar la URL "debounced" después de un retraso de 600ms
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedUrl(url.trim()), 600)
        return () => clearTimeout(timer)
    }, [url])

    // Si la URL está vacía, no es válida o no coincide con la URL "debounced", no se muestra la vista previa
    const current = url.trim()
    if (!current || debouncedUrl !== current || !isValidUrl(current)) return null

    // Renderiza el componente SafeImage para mostrar la imagen con un tamaño de altura de 140px
    return (
        <div className="mt-2">
            <SafeImage key={current} src={current} alt="Vista previa de la imagen" height={140} />
        </div>
    )
}

export default function CreatePost() {

    // Contexto de autenticación para obtener el usuario actual y la función de navegación
    const { user } = useAuth()
    const navigate = useNavigate()

    // Estados para almacenar la descripción, URLs de imágenes, tags disponibles y tags seleccionados
    const [description, setDescription] = useState<string>('')
    const [imageUrls, setImageUrls] = useState<string[]>([''])
    const [tags, setTags] = useState<Tag[]>([])
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])

    // Estados para manejar errores de validación y del servidor, así como el estado de envío y si el post se guardó correctamente
    const [descriptionError, setDescriptionError] = useState<string | null>(null)
    const [imageErrors, setImageErrors] = useState<(string | null)[]>([])
    const [tagsError, setTagsError] = useState<string | null>(null)
    const [serverError, setServerError] = useState<string | null>(null)
    const [sending, setSending] = useState<boolean>(false)
    const [postSaved, setPostSaved] = useState<boolean>(false)

    // Efecto para obtener los tags disponibles al montar el componente
    useEffect(() => {
        getTags()
            .then(setTags)
            .catch((e: unknown) =>
                setTagsError(e instanceof Error ? e.message : 'Error desconocido')
            )
    }, [])

    // Si no hay usuario autenticado, no se renderiza la página
    if (!user) return null

    // Función para alternar la selección de un tag
    function toggleTag(tagId: number) {
        setSelectedTagIds((prev) =>
            prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
        )
    }

    // Función para cambiar la URL de una imagen en un índice específico
    function changeImageUrl(index: number, value: string) {
        setImageUrls((prev) => prev.map((url, i) => (i === index ? value : url)))
        setImageErrors((prev) => prev.map((err, i) => (i === index ? null : err)))
    }

    // Función para agregar un nuevo campo de URL de imagen
    function addImageField() {
        setImageUrls((prev) => [...prev, ''])
        setImageErrors((prev) => [...prev, null])
    }

    // Función para eliminar un campo de URL de imagen en un índice específico
    function removeImageField(index: number) {
        setImageUrls((prev) => prev.filter((_, i) => i !== index))
        setImageErrors((prev) => prev.filter((_, i) => i !== index))
    }

    // Función para validar la descripción y las URLs de imágenes antes de enviar el formulario
    function validate(): boolean {
        // Validación de la descripción: debe estar presente y no exceder el límite de caracteres
        const newDescriptionError = description.trim()
            ? null
            : 'La descripción es obligatoria'

        // Validación de las URLs de imágenes: deben ser URLs válidas si no están vacías
        const newImageErrors = imageUrls.map((url) =>
            url.trim() && !isValidUrl(url.trim())
                ? 'Ingresá una URL válida (empieza con http:// o https://)'
                : null
        )

        setDescriptionError(newDescriptionError)
        setImageErrors(newImageErrors)

        return !newDescriptionError && newImageErrors.every((err) => err === null)
    }

    // Función para manejar el envío del formulario, crear el post y las imágenes asociadas
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        // Evita que el formulario se envíe de manera predeterminada
        e.preventDefault()
        if (!user) return
        setServerError(null)

        // Valida la entrada antes de continuar. Si no es válida, se detiene el envío
        if (!validate()) return

        // Filtra las URLs de imágenes para eliminar espacios y cadenas vacías
        const urls = imageUrls.map((url) => url.trim()).filter((url) => url !== '')

        // Indica que se está enviando el post y maneja la creación del post y las imágenes asociadas
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

                {/* Encabezado con el avatar del usuario y el título de la página */}
                <div className="d-flex align-items-center gap-3 mb-4">
                    <Avatar nickName={user.nickName} size={48} />
                    <div>
                        <h1 className="h4 mb-0">Crear post</h1>
                        <small className="text-muted">Publicás como @{user.nickName}</small>
                    </div>
                </div>

                {/* Muestra un mensaje de error del servidor si existe, con un enlace al perfil si el post se guardó parcialmente */}
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

                {/* Formulario para crear el post. */}
                <Form onSubmit={handleSubmit} noValidate>

                    {/* Grupo de formulario para la descripción del post, con validación y contador de caracteres */}
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

                    {/* Grupo de formulario para la selección de tags, con manejo de errores si no se pudieron cargar los tags */}
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

                    {/* Grupo de formulario para ingresar URLs de imágenes, con validación y vista previa de las imágenes */}
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

                    {/* Botones para cancelar la creación del post o enviar el formulario, con manejo del estado de envío */}
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