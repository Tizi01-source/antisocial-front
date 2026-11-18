// Funciones para interactuar con la API del backend

import type { User, Post, Tag, PostComment, PostImage } from '../types'

const API_URL = 'http://localhost:3001'

// Función para hacer solicitudes a la API
async function request<T>(path: string, options?: RequestInit): Promise<T> {
    let res: Response
    try {
        res = await fetch(API_URL + path, options)
    } catch {
        throw new Error('No se pudo conectar con el servidor')
    }

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.error || 'Error en la solicitud')
    }
    return data
}

// Función para enviar datos en formato JSON
function sendJson<T>(path: string, body: object): Promise<T> {
    return request<T>(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
}

// =================================================================================================
// Funciones para interactuar con los usuarios.
export function getUsers() {
    return request<User[]>('/users')
}

export function createUser(nickName: string, email: string) {
    return sendJson<User>('/users', { nickName, email })
}


// =================================================================================================
// Funciones para interactuar con las publicaciones.
export function getPosts() {
    return request<Post[]>('/posts')
}

export function getPost(id: number | string) {
    return request<Post>(`/posts/${id}`)
}

export function getPostsByUser(userId: number) {
    return request<Post[]>(`/posts?userId=${userId}`)
}

export function createPost(description: string, userId: number, tagIds: number[]) {
    return sendJson<{ id: number }>('/posts', { description, userId, tagIds })
}


// =================================================================================================
// Funciones para interactuar con las etiquetas.
export function getTags() {
    return request<Tag[]>('/tags')
}


// =================================================================================================
// Funciones para interactuar con los comentarios.
export function getCommentsByPost(postId: number | string) {
    return request<PostComment[]>(`/comments/post/${postId}`)
}

export function createComment(content: string, userId: number, postId: number) {
    return sendJson<{ id: number }>('/comments', { content, userId, postId })
}


// =================================================================================================
// Funciones para interactuar con las imágenes de publicaciones.
export function getImagesByPost(postId: number | string) {
    return request<PostImage[]>(`/postimages/post/${postId}`)
}

export function createPostImage(url: string, postId: number) {
    return sendJson<{ id: number }>('/postimages', { url, postId })
}