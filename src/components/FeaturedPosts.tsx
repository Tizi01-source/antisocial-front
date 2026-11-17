import { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getCommentsByPost } from '../api/api'
import type { Post } from '../types'

type FeaturedPostsProps = {
    posts: Post[]
}

type PostWithCount = {
    post: Post
    count: number
}

const MAX_FEATURED = 3

export default function FeaturedPosts({ posts }: FeaturedPostsProps) {
    const [featured, setFeatured] = useState<PostWithCount[]>([])

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
                <Card.Title as="h2" className="h5 mb-3">
                    Destacados
                </Card.Title>

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