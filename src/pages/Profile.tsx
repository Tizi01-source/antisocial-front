import { useEffect, useState } from 'react'
import { Alert, Button, Card, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getPostsByUser } from '../api/api'
import Avatar from '../components/Avatar'
import PostCard from '../components/PostCard'
import { useAuth } from '../context/AuthContext'
import type { Post } from '../types'
import { hueFromText } from '../utils/color'
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

    const hue = hueFromText(user.nickName)
    const bannerBackground = `linear-gradient(135deg, hsl(${hue} 50% 40%), hsl(${(hue + 50) % 360} 55% 30%))`
    const memberSince = new Date(user.createdAt).toLocaleDateString('es-AR', {
        month: 'long',
        year: 'numeric',
    })

    return (
        <div className="profile-wrapper mx-auto">
            <Card className="profile-card mb-4">
                <div className="profile-banner" style={{ background: bannerBackground }} />

                <Card.Body className="pt-0">
                    <div className="d-flex justify-content-between align-items-end flex-wrap gap-2">
                        <div className="profile-avatar">
                            <Avatar nickName={user.nickName} size={96} />
                        </div>
                        <Button variant="outline-danger" size="sm" onClick={logout}>
                            Cerrar sesión
                        </Button>
                    </div>

                    <h1 className="h3 mt-3 mb-0">@{user.nickName}</h1>
                    <p className="text-muted mb-3 text-break">{user.email}</p>

                    <div className="d-flex flex-wrap column-gap-4 row-gap-1">
                        <div>
                            <strong>{loading || error ? '–' : posts.length}</strong>{' '}
                            <span className="text-muted">{posts.length === 1 ? 'post' : 'posts'}</span>
                        </div>
                        <div className="text-muted">Miembro desde {memberSince}</div>
                    </div>
                </Card.Body>
            </Card>

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