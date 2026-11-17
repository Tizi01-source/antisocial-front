type AvatarProps = {
    nickName: string
    size?: number
}

function hueFromText(text: string): number {
    let hash = 0
    for (const char of text) {
        hash = (hash * 31 + char.charCodeAt(0)) % 360
    }
    return hash
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