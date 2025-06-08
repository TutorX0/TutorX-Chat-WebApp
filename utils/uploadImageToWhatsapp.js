const axios = require("axios");
const path = require("path");
const s3 = require("../utils/s3config");
const FormData = require("form-data");

const uploadImageToWhatsapp = async (fileBuffer, fileName) => {
    const contentType = "application/octet-stream"; // No specific MIME binding

    const s3Params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `uploads/${Date.now()}_${fileName}`,
        Body: fileBuffer,
        ContentType: contentType
    };

    const upload = await s3.upload(s3Params).promise();
    const s3Url = upload.Location;

    const formData = new FormData();
    formData.append("file", fileBuffer, {
        filename: fileName,
        contentType
    });
    formData.append("messaging_product", "whatsapp");
    formData.append("type", contentType); // WhatsApp expects a type, but you’re now using a generic one

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
