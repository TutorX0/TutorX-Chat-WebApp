export function getExtensionFromMimeType(mimeType: string) {
    const map: Record<string, string> = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
        "image/gif": ".gif",
        "image/svg+xml": ".svg"
    };
    return map[mimeType] || "";
}
