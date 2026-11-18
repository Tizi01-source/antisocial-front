// Pagina de perfil del usuario. Muestra la información del usuario y sus posts.

import { useEffect, useState } from 'react'
import { Alert, Button, Card, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getPostsByUser } from '../api/api'
import Avatar from '../components/Avatar'
import PostCard from '../components/PostCard'
import { useAuth } from '../context/AuthContext'
import type { Post } from '../types'
import { colorForName } from '../utils/color'
import { sortByNewest } from '../utils/posts'

export default function Profile() {

    // Obtener el usuario autenticado y la función de logout del contexto de autenticación
    const { user, logout } = useAuth()

    // Estado para almacenar los posts del usuario, el estado de carga y el estado de error
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const userId = user?.id

    // Efecto para obtener los posts del usuario cuando el componente se monta o cuando cambia el userId
    useEffect(() => {
        if (userId === undefined) return

        getPostsByUser(userId)
            .then((data) => setPosts(sortByNewest(data)))
            .catch((e: unknown) =>
                setError(e instanceof Error ? e.message : 'Error desconocido')
            )
            .finally(() => setLoading(false))
    }, [userId])

    // Si no hay usuario autenticado, no mostrar nada
    if (!user) return null

    // Generar un gradiente de color para el banner del perfil basado en el nickName del usuario
    const bannerBackground = `linear-gradient(135deg, ${colorForName(user.nickName)}, var(--accent))`
    const memberSince = new Date(user.createdAt).toLocaleDateString('es-AR', {
        month: 'long',
        year: 'numeric',
    })

    return (
        <div className="profile-wrapper mx-auto">

            {/* Tarjeta de perfil del usuario. */}
            <Card className="profile-card mb-4">

                {/* Banner del perfil con un gradiente de color basado en el nickName del usuario. */}
                <div className="profile-banner" style={{ background: bannerBackground }} />

                <Card.Body className="pt-0">

                    {/* Mostrar el avatar del usuario y un botón de logout. */}
                    <div className="d-flex justify-content-between align-items-end flex-wrap gap-2">
                        <div className="profile-avatar">
                            <Avatar nickName={user.nickName} size={96} />
                        </div>
                        <Button variant="outline-danger" size="sm" onClick={logout}>
                            Cerrar sesión
                        </Button>
                    </div>

                    {/* Mostrar el nickName y el email del usuario. */}
                    <h1 className="h3 mt-3 mb-0">@{user.nickName}</h1>
                    <p className="text-muted mb-3 text-break">{user.email}</p>

                    {/* Mostrar la cantidad de posts del usuario y la fecha de creación del usuario. */}
                    <div className="d-flex flex-wrap column-gap-4 row-gap-1">
                        <div>
                            <strong>{loading || error ? '–' : posts.length}</strong>{' '}
                            <span className="text-muted">{posts.length === 1 ? 'post' : 'posts'}</span>
                        </div>
                        <div className="text-muted">Miembro desde {memberSince}</div>
                    </div>
                </Card.Body>
            </Card>

            {/* Mostrar los posts del usuario, un spinner mientras se cargan, un mensaje de error si ocurre un error y un mensaje si no hay posts. */}
            <h2 className="h4 mb-3">Mis posts</h2>
            {loading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}
            {!loading && !error && posts.length === 0 && (
                <p className="text-muted">
                    Todavía no publicaste nada. <Link to="/crear-post">Creá tu primer post</Link>.
                </p>
            )}

            {/* Mostrar los posts del usuario en tarjetas de post. */}
            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    )
}