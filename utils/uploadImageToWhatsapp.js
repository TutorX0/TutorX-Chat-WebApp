const axios = require("axios");
const path = require("path");
const s3 = require("../utils/s3config");
const FormData = require("form-data");

const getMimeType = (fileName) => {
    const ext = path.extname(fileName).toLowerCase();

    const mimeTypes = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".pdf": "application/pdf",
        ".doc": "application/msword",
        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".txt": "text/plain",
        ".zip": "application/zip",
        ".html": "text/html",
        ".csv": "text/csv",
        ".mp4": "video/mp4",
        ".mp3": "audio/mpeg",
        ".json": "application/json"
    };

    return mimeTypes[ext] || "application/octet-stream"; // Default fallback
};

const uploadImageToWhatsapp = async (fileBuffer, fileName) => {
    const mimeType = getMimeType(fileName); // Always returns something now

    const s3Params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `uploads/${Date.now()}_${fileName}`,
        Body: fileBuffer,
        ContentType: mimeType
    };

    const upload = await s3.upload(s3Params).promise();
    const s3Url = upload.Location;

    const formData = new FormData();
    formData.append("file", fileBuffer, {
        filename: fileName,
        contentType: mimeType
    });
    formData.append("messaging_product", "whatsapp");
    formData.append("type", mimeType);

    const response = await axios.post(
        `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/media`,
        formData,
        {
            headers: {
                ...formData.getHeaders(),
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
            }
        }
    );

    return { mediaId: response.data.id, s3Url };
};

module.exports = uploadImageToWhatsapp;
