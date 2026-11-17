import { useEffect, useState } from 'react'
import { Alert, Badge, Card, Spinner } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { getCommentsByPost, getImagesByPost, getPost } from '../api/api'
import CommentForm from '../components/CommentForm'
import type { Post, PostComment, PostImage } from '../types'

type Params = {
    id: string
}

export default function PostDetail() {
    const { id } = useParams<Params>()

    const [post, setPost] = useState<Post | null>(null)
    const [images, setImages] = useState<PostImage[]>([])
    const [comments, setComments] = useState<PostComment[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

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

    async function reloadComments(postId: number) {
        const updated = await getCommentsByPost(postId)
        setComments(updated)
    }

    if (loading) return <Spinner animation="border" />

    if (error || !post) {
        return (
            <>
                <Alert variant="danger">{error ?? 'No se encontró el post'}</Alert>
                <Link to="/">Volver al inicio</Link>
            </>
        )
    }

    return (
        <div>
            <Link to="/" className="d-inline-block mb-3">
                ← Volver al inicio
            </Link>

            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Card.Subtitle className="mb-2 text-muted">
                        @{post.User.nickName} · {new Date(post.createdAt).toLocaleDateString('es-AR')}
                    </Card.Subtitle>

                    <Card.Text>{post.description}</Card.Text>

                    {images.length > 0 && (
                        <div className="d-flex flex-wrap gap-2 mb-3">
                            {images.map((img) => (
                                <img
                                    key={img.id}
                                    src={img.url}
                                    alt={`Imagen del post ${post.id}`}
                                    className="rounded"
                                    style={{ maxHeight: 300, maxWidth: '100%' }}
                                />
                            ))}
                        </div>
                    )}

                    <div>
                        {post.Tags.map((tag) => (
                            <Badge key={tag.id} bg="secondary" className="me-1">
                                #{tag.name}
                            </Badge>
                        ))}
                    </div>
                </Card.Body>
            </Card>

            <h2 className="h5 mb-3">Comentarios ({comments.length})</h2>

            <CommentForm postId={post.id} onCommentAdded={() => reloadComments(post.id)} />

            {comments.length === 0 && (
                <p className="text-muted">Todavía no hay comentarios. ¡Sé el primero!</p>
            )}

            {comments.map((comment) => (
                <Card key={comment.id} className="mb-2">
                    <Card.Body className="py-2">
                        <Card.Subtitle className="mb-1 text-muted small">
                            @{comment.User.nickName} ·{' '}
                            {new Date(comment.createdAt).toLocaleString('es-AR', {
                                dateStyle: 'short',
                                timeStyle: 'short',
                            })}
                        </Card.Subtitle>
                        <Card.Text>{comment.content}</Card.Text>
                    </Card.Body>
                </Card>
            ))}
        </div>
    )
}