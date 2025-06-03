const FormData = require("form-data");
const axios = require("axios");

async function forwardDocumentToWhatsapp(fileName) {
    const data = new FormData();
    data.append("messaging_product", "whatsapp");

    try {
        const response = await axios.get(fileName, { responseType: "stream" });
        const fileStream = response.data;

        const contentType = response.headers["content-type"] ?? "application/octet-stream";
        const fileNameFromUrl = fileName.split("/").pop();

        data.append("file", fileStream, { contentType, filename: fileNameFromUrl });
    } catch (error) {
        return null;
    }

    try {
        const response = await axios({
            url: `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/media`,
            method: "post",
            headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` },
            data
        });

        return response.data.id;
    } catch (error) {
        return null;
    }
}

module.exports = forwardDocumentToWhatsapp;
