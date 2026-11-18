// Componente que representa una imagen segura, mostrando un mensaje de error si la imagen no se puede cargar.

import { useState } from 'react'
import { ImageAlt } from 'react-bootstrap-icons'

// Props del componente SafeImage
type SafeImageProps = {
    src: string
    alt: string
    height?: number
}

export default function SafeImage({ src, alt, height = 220 }: SafeImageProps) {

    // Estado para controlar si la imagen ha fallado al cargar
    const [failed, setFailed] = useState<boolean>(false)

    // Si la imagen ha fallado al cargar, se muestra un mensaje de error con un icono
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