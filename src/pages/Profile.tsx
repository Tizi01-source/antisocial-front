import { useEffect, useState } from 'react'
import { Alert, Button, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getPostsByUser } from '../api/api'
import PostCard from '../components/PostCard'
import { useAuth } from '../context/AuthContext'
import type { Post } from '../types'
import { sortByNewest } from '../utils/posts'

export default function Profile() {
    const { user, logout } = useAuth()

    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const userId = user?.id

    useEffect(() => {
        if (userId === undefined) return

        getPostsByUser(userId)
            .then((data) => setPosts(sortByNewest(data)))
            .catch((e: unknown) =>
                setError(e instanceof Error ? e.message : 'Error desconocido')
            )
            .finally(() => setLoading(false))
    }, [userId])

    if (!user) return null

    return (
        <div>
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 p-4 mb-4 bg-body-tertiary rounded-3">
                <div>
                    <h1 className="h3 mb-1">@{user.nickName}</h1>
                    <p className="text-muted mb-1">{user.email}</p>
                    {!loading && !error && (
                        <p className="mb-0">
                            {posts.length} {posts.length === 1 ? 'post publicado' : 'posts publicados'}
                        </p>
                    )}
                </div>
                <Button variant="outline-danger" onClick={logout}>
                    Cerrar sesión
                </Button>
            </div>

            <h2 className="h4 mb-3">Mis posts</h2>

            {loading && <Spinner animation="border" />}

            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && posts.length === 0 && (
                <p className="text-muted">
                    Todavía no publicaste nada. <Link to="/crear-post">Creá tu primer post</Link>.
                </p>
            )}

            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    )
}