// Componente que representa un filtro de tags, permitiendo al usuario seleccionar un tag específico o ver todos los posts.

import type { Tag } from '../types'

// Props del componente TagFilter
type TagFilterProps = {
    tags: Tag[]
    selectedTagId: number | null
    onSelect: (tagId: number | null) => void
}

export default function TagFilter({ tags, selectedTagId, onSelect }: TagFilterProps) {
    return (
        <div className="d-flex flex-wrap gap-2 mb-4" role="group" aria-label="Filtrar posts por tag">

            {/* Botón para seleccionar todos los posts, sin filtrar por tag */}
            <button
                type="button"
                className={`tag-chip ${selectedTagId === null ? 'active' : ''}`}
                aria-pressed={selectedTagId === null}
                onClick={() => onSelect(null)}
            >
                Todos
            </button>

            {/* Botones para cada tag disponible, permitiendo al usuario filtrar los posts por el tag seleccionado */}
            {tags.map((tag) => (
                <button
                    key={tag.id}
                    type="button"
                    className={`tag-chip ${selectedTagId === tag.id ? 'active' : ''}`}
                    aria-pressed={selectedTagId === tag.id}
                    onClick={() => onSelect(tag.id)}
                >
                    #{tag.name}
                </button>
            ))}
        </div>
    )
}