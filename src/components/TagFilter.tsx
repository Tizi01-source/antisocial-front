import type { Tag } from '../types'

type TagFilterProps = {
    tags: Tag[]
    selectedTagId: number | null
    onSelect: (tagId: number | null) => void
}

export default function TagFilter({ tags, selectedTagId, onSelect }: TagFilterProps) {
    return (
        <div className="d-flex flex-wrap gap-2 mb-4" role="group" aria-label="Filtrar posts por tag">
            <button
                type="button"
                className={`tag-chip ${selectedTagId === null ? 'active' : ''}`}
                aria-pressed={selectedTagId === null}
                onClick={() => onSelect(null)}
            >
                Todos
            </button>

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