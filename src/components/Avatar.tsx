// Componente Avatar que muestra la inicial del nombre de usuario con un color de fondo basado en el nombre.

import { colorForName } from '../utils/color'

type AvatarProps = {
    nickName: string
    size?: number
}

export default function Avatar({ nickName, size = 40 }: AvatarProps) {
    return (
        <span
            className="avatar"
            aria-hidden="true"
            style={{
                width: size,
                height: size,
                fontSize: size * 0.42,
                background: colorForName(nickName),
            }}
        >
      {nickName.charAt(0).toUpperCase()}
    </span>
    )
}