import { useEffect, useState } from 'react'
import { Alert, Spinner } from 'react-bootstrap'
import { getPosts } from '../api/api'
import PostCard from '../components/PostCard'
import type { Post } from '../types'
import { sortByNewest } from '../utils/posts'

export default function Home() {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        getPosts()
            .then((data) => setPosts(sortByNewest(data)))
            .catch((e: unknown) =>
                setError(e instanceof Error ? e.message : 'Error desconocido')
            )
            .finally(() => setLoading(false))
    }, [])

    return (
        <div>
            <div className="p-4 mb-4 bg-body-tertiary rounded-3">
                <h1 className="display-6">Anti-Social Net</h1>
                <p className="mb-0">Compartí lo que pensás con la comunidad de UnaHur.</p>
            </div>

            <h2 className="h4 mb-3">Últimos posts</h2>

            {loading && <Spinner animation="border" />}

            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && posts.length === 0 && (
                <p className="text-muted">Todavía no hay posts.</p>
            )}

            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    )
}