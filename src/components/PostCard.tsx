import { useEffect, useState } from 'react'
import { Badge, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getCommentsByPost, getImagesByPost } from '../api/api'
import type { Post, PostImage } from '../types'

type PostCardProps = {
    post: Post
}

export default function PostCard({ post }: PostCardProps) {
    const [images, setImages] = useState<PostImage[]>([])
    const [commentCount, setCommentCount] = useState<number | null>(null)

    useEffect(() => {
        Promise.all([getImagesByPost(post.id), getCommentsByPost(post.id)])
            .then(([postImages, comments]) => {
                setImages(postImages)
                setCommentCount(comments.length)
            })
            .catch(() => {
                // Si falla, la tarjeta se muestra igual, sin imágenes ni contador
            })
    }, [post.id])

    return (
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
                                style={{ maxHeight: 180, maxWidth: '100%' }}
                            />
                        ))}
                    </div>
                )}

                <div className="mb-3">
                    {post.Tags.map((tag) => (
                        <Badge key={tag.id} bg="secondary" className="me-1">
                            #{tag.name}
                        </Badge>
                    ))}
                </div>

                <div className="d-flex justify-content-between align-items-center">
          <span className="text-muted">
            {commentCount ?? '–'} {commentCount === 1 ? 'comentario' : 'comentarios'}
          </span>
                    <Link to={`/post/${post.id}`} className="btn btn-primary btn-sm">
                        Ver más
                    </Link>
                </div>
            </Card.Body>
        </Card>
    )
}