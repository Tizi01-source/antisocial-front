// Pagina de detalle de un post, mostrando la información del mismo, sus imágenes y comentarios.

import { useEffect, useState } from 'react'
import { Alert, Card, Spinner } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { getCommentsByPost, getImagesByPost, getPost } from '../api/api'
import Avatar from '../components/Avatar'
import CommentForm from '../components/CommentForm'
import SafeImage from '../components/SafeImage'
import type { Post, PostComment, PostImage } from '../types'

// Lee el parámetro de la URL para obtener el ID del post.
type Params = {
    id: string
}

export default function PostDetail() {
    const { id } = useParams<Params>()

    // Estados para almacenar la información del post, sus imágenes y comentarios.
    const [post, setPost] = useState<Post | null>(null)
    const [images, setImages] = useState<PostImage[]>([])
    const [comments, setComments] = useState<PostComment[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    // Efecto para cargar la información del post, sus imágenes y comentarios al montar el componente.
    useEffect(() => {
        if (!id) return

        Promise.all([getPost(id), getImagesByPost(id), getCommentsByPost(id)])
            .then(([postData, postImages, postComments]) => {
                setPost(postData)
                setImages(postImages)
                setComments(postComments)
            })
            .catch((e: unknown) =>
                setError(e instanceof Error ? e.message : 'Error desconocido')
            )
            .finally(() => setLoading(false))
    }, [id])

    // Función para recargar los comentarios después de agregar uno nuevo.
    async function reloadComments(postId: number) {
        const updated = await getCommentsByPost(postId)
        setComments(updated)
    }

    // Renderizado condicional según el estado de carga y errores.
    if (loading) return <Spinner animation="border" />

    // Si hay un error o el post no se encontró, mostrar un mensaje de error.
    if (error || !post) {
        return (
            <>
                <Alert variant="danger">{error ?? 'No se encontró el post'}</Alert>
                <Link to="/">Volver al inicio</Link>
            </>
        )
    }

    return (
        <div className="detail-wrapper mx-auto">

            {/* Botón para volver al inicio. */}
            <Link to="/" className="btn btn-outline-secondary btn-sm mb-3">
                ← Volver al inicio
            </Link>

            <Card className="mb-4">
                <Card.Body>
                    {/* Renderizado del avatar del usuario que publicó el post, su nombre de usuario y la fecha de creación del post. */}
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <Avatar nickName={post.User.nickName} size={44} />
                        <div className="lh-sm">
                            <div className="fw-semibold">@{post.User.nickName}</div>
                            <small className="text-muted">
                                {new Date(post.createdAt).toLocaleDateString('es-AR')}
                            </small>
                        </div>
                    </div>

                    {/* Renderizado del contenido del post. */}
                    <p className="post-text mb-3">{post.description}</p>

                    {/* Renderizado de las imágenes del post, si las hay. */}
                    {images.length > 0 && (
                        <div className="post-images mb-3">
                            {images.map((img) => (
                                <SafeImage
                                    key={img.id}
                                    src={img.url}
                                    alt={`Imagen del post ${post.id}`}
                                    height={300}
                                />
                            ))}
                        </div>
                    )}

                    {/* Renderizado de las etiquetas del post, si las hay. */}
                    {post.Tags.length > 0 && (
                        <div className="d-flex flex-wrap gap-2">
                            {post.Tags.map((tag) => (
                                <span key={tag.id} className="tag-pill">
                  #{tag.name}
                </span>
                            ))}
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Sección de comentarios del post. */}
            <h2 className="h5 mb-3">Comentarios ({comments.length})</h2>

            {/* Formulario para agregar un nuevo comentario. */}
            <CommentForm postId={post.id} onCommentAdded={() => reloadComments(post.id)} />

            {/* Si no hay comentarios, mostrar un mensaje indicando que aún no hay comentarios. */}
            {comments.length === 0 && (
                <p className="text-muted">Todavía no hay comentarios. ¡Sé el primero!</p>
            )}

            {/* Renderizado de cada comentario con avatar, nombre de usuario y fecha. */}
            {comments.map((comment) => (
                <div key={comment.id} className="d-flex gap-2 mb-3">
                    <Avatar nickName={comment.User.nickName} size={36} />
                    <div className="comment-body">
                        <div className="small mb-1">
                            <strong>@{comment.User.nickName}</strong>{' '}
                            <span className="text-muted">
                ·{' '}
                                {new Date(comment.createdAt).toLocaleString('es-AR', {
                                    dateStyle: 'short',
                                    timeStyle: 'short',
                                })}
              </span>
                        </div>
                        <div className="post-text">{comment.content}</div>
                    </div>
                </div>
            ))}
        </div>
    )
}