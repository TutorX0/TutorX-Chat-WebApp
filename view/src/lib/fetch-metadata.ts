export async function fetchMetadata(fileUrl: string) {
    const res = await fetch(fileUrl, { method: "HEAD" });
    const contentType = res.headers.get("Content-Type");
    const contentLength = res.headers.get("Content-Length");

    const fileSplit = fileUrl.split("/").pop();

    return {
        type: contentType,
        size: Number(contentLength),
        name: fileSplit ? decodeURIComponent(fileSplit) : ""
    };
}
