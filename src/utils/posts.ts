import type { Post } from '../types'

export function sortByNewest(posts: Post[]): Post[] {
    return [...posts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
}