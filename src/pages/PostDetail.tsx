import { useEffect, useState } from 'react'
import { Alert, Card, Spinner } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { getCommentsByPost, getImagesByPost, getPost } from '../api/api'
import Avatar from '../components/Avatar'
import CommentForm from '../components/CommentForm'
import SafeImage from '../components/SafeImage'
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
        <div className="detail-wrapper mx-auto">
            <Link to="/" className="d-inline-block mb-3">
                ← Volver al inicio
            </Link>

            <Card className="mb-4">
                <Card.Body>
                    <div className="d-flex align-items-center gap-2 mb-3">
                        <Avatar nickName={post.User.nickName} size={44} />
                        <div className="lh-sm">
                            <div className="fw-semibold">@{post.User.nickName}</div>
                            <small className="text-muted">
                                {new Date(post.createdAt).toLocaleDateString('es-AR')}
                            </small>
                        </div>
                    </div>

                    <p className="post-text mb-3">{post.description}</p>

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

            <h2 className="h5 mb-3">Comentarios ({comments.length})</h2>

            <CommentForm postId={post.id} onCommentAdded={() => reloadComments(post.id)} />

            {comments.length === 0 && (
                <p className="text-muted">Todavía no hay comentarios. ¡Sé el primero!</p>
            )}

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