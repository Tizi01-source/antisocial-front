// Tipos de datos para la aplicación

// Usuario
export type User = {
    id: number
    nickName: string
    email: string
    createdAt: string
    updatedAt: string
}

// Etiqueta
export type Tag = {
    id: number
    name: string
}

// Publicación
export type Post = {
    id: number
    description: string
    createdAt: string
    UserId: number
    User: User
    Tags: Tag[]
}

// Comentario
export type PostComment = {
    id: number
    content: string
    createdAt: string
    PostId: number
    UserId: number
    User: User
}

// Imagen de publicación
export type PostImage = {
    id: number
    url: string
    PostId: number
}