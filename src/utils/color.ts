export function hueFromText(text: string): number {
    let hash = 0
    for (const char of text) {
        hash = (hash * 31 + char.charCodeAt(0)) % 360
    }
    return hash
}