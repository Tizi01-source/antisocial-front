import { useState } from 'react'
import { ImageAlt } from 'react-bootstrap-icons'

type SafeImageProps = {
    src: string
    alt: string
    height?: number
}

export default function SafeImage({ src, alt, height = 220 }: SafeImageProps) {
    const [failed, setFailed] = useState<boolean>(false)

    if (failed) {
        return (
            <div
                className="image-fallback"
                style={{ height }}
                role="img"
                aria-label={`${alt} (no se pudo cargar)`}
            >
                <ImageAlt size={24} />
                <span>No se pudo cargar la imagen</span>
            </div>
        )
    }

    return (
        <img
            src={src}
            alt={alt}
            className="post-image"
            style={{ height }}
            loading="lazy"
            onError={() => setFailed(true)}
        />
    )
}