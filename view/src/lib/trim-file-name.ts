export function trimFileName(name: string, limit: number): string {
    if (name.length <= limit) return name;

    const lastDotIndex = name.lastIndexOf(".");
    const hasExtension = lastDotIndex > 0 && lastDotIndex < name.length - 1;

    const extension = hasExtension ? name.slice(lastDotIndex) : "";
    const baseName = hasExtension ? name.slice(0, lastDotIndex) : name;

    const remainingLength = limit - extension.length;

    if (remainingLength <= 3) return name.slice(0, limit - 3) + "..." + extension;

    const dotLength = 3;
    const visibleChars = remainingLength - dotLength;

    const startLength = Math.ceil(visibleChars / 2);
    const endLength = Math.floor(visibleChars / 2);

    const prefix = baseName.slice(0, startLength);
    const suffix = baseName.slice(-endLength);

    return `${prefix}...${suffix}${extension}`;
}
