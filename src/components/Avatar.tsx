import { hueFromText } from '../utils/color'

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
                background: `hsl(${hueFromText(nickName)} 45% 36%)`,
            }}
        >
      {nickName.charAt(0).toUpperCase()}
    </span>
    )
}