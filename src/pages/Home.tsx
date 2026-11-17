import { useEffect, useState } from 'react'
import { Alert, Col, Row, Spinner } from 'react-bootstrap'
import { getPosts, getTags } from '../api/api'
import FeaturedPosts from '../components/FeaturedPosts'
import PostCard from '../components/PostCard'
import TagFilter from '../components/TagFilter'
import UserPanel from '../components/UserPanel'
import { sortByNewest } from '../utils/posts'
import type { Post, Tag } from '../types'

export default function Home() {
    const [posts, setPosts] = useState<Post[]>([])
    const [tags, setTags] = useState<Tag[]>([])
    const [selectedTagId, setSelectedTagId] = useState<number | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        Promise.all([getPosts(), getTags()])
            .then(([postsData, tagsData]) => {
                setPosts(sortByNewest(postsData))
                setTags(tagsData)
            })
            .catch((e: unknown) =>
                setError(e instanceof Error ? e.message : 'Error desconocido')
            )
            .finally(() => setLoading(false))
    }, [])

    const visiblePosts =
        selectedTagId === null
            ? posts
            : posts.filter((post) => post.Tags.some((tag) => tag.id === selectedTagId))

    return (
        <Row className="g-4">
            <Col lg={3} className="d-none d-lg-block">
                <UserPanel />
            </Col>

            <Col lg={6}>
                <h1 className="h3 mb-3">Últimos posts</h1>

                {tags.length > 0 && (
                    <TagFilter tags={tags} selectedTagId={selectedTagId} onSelect={setSelectedTagId} />
                )}

                {loading && <Spinner animation="border" />}

                {error && <Alert variant="danger">{error}</Alert>}

                {!loading && !error && visiblePosts.length === 0 && (
                    <p className="text-muted">
                        {selectedTagId === null
                            ? 'Todavía no hay posts.'
                            : 'No hay posts con ese tag.'}
                    </p>
                )}

                {visiblePosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </Col>

            <Col lg={3} className="d-none d-lg-block">
                <FeaturedPosts posts={posts} />
            </Col>
        </Row>
    )
}