import { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import { ChatDots } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom'
import { getCommentsByPost, getImagesByPost } from '../api/api'
import type { Post, PostImage } from '../types'
import Avatar from './Avatar'
import SafeImage from './SafeImage'

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
        <Card className="post-card mb-4">
            <Card.Body>
                <div className="d-flex align-items-center gap-2 mb-3">
                    <Avatar nickName={post.User.nickName} size={40} />
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
                            <SafeImage key={img.id} src={img.url} alt={`Imagen del post ${post.id}`} />
                        ))}
                    </div>
                )}

                {post.Tags.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mb-3">
                        {post.Tags.map((tag) => (
                            <span key={tag.id} className="tag-pill">
                #{tag.name}
              </span>
                        ))}
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-center">
          <span className="text-muted d-flex align-items-center gap-2">
            <ChatDots aria-hidden="true" />
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