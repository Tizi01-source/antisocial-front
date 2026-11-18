// Componente que muestra los posts destacados en la barra lateral, basándose en la cantidad de comentarios que tienen. Se muestran hasta 3 posts con más comentarios.

import { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getCommentsByPost } from '../api/api'
import type { Post } from '../types'

// Se define el tipo de las props del componente, que es un array de posts
type FeaturedPostsProps = {
    posts: Post[]
}

// Se define un tipo que combina un post con la cantidad de comentarios que tiene
type PostWithCount = {
    post: Post
    count: number
}

// Constante que define la cantidad máxima de posts destacados a mostrar
const MAX_FEATURED = 3

export default function FeaturedPosts({ posts }: FeaturedPostsProps) {
    const [featured, setFeatured] = useState<PostWithCount[]>([])

    // Se calcula la cantidad de comentarios de cada post y se seleccionan los 3 con más comentarios
    useEffect(() => {
        Promise.all(
            posts.map(async (post): Promise<PostWithCount> => {
                try {
                    const comments = await getCommentsByPost(post.id)
                    return { post, count: comments.length }
                } catch {
                    return { post, count: 0 }
                }
            })
        ).then((withCounts) => {
            const top = withCounts
                .filter((item) => item.count > 0)
                .sort((a, b) => b.count - a.count)
                .slice(0, MAX_FEATURED)
            setFeatured(top)
        })
    }, [posts])

    return (
        <Card className="side-panel">
            <Card.Body>

                {/* Título de la sección de posts destacados */}
                <Card.Title as="h2" className="h5 mb-3">
                    Destacados
                </Card.Title>

                {/* Si no hay posts destacados, se muestra un mensaje. Si los hay, se listan con un enlace a cada post y la cantidad de comentarios que tiene. */}
                {featured.length === 0 ? (
                    <p className="text-muted small mb-0">Todavía no hay posts con comentarios.</p>
                ) : (
                    <ol className="featured-list">
                        {featured.map(({ post, count }) => (
                            <li key={post.id}>
                                <Link to={`/post/${post.id}`} className="featured-item">
                                    <span className="featured-text">{post.description}</span>
                                    <span className="featured-meta">
                    @{post.User.nickName} · {count} {count === 1 ? 'comentario' : 'comentarios'}
                  </span>
                                </Link>
                            </li>
                        ))}
                    </ol>
                )}
            </Card.Body>
        </Card>
    )
}