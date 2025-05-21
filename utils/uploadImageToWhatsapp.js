const { createReadStream } = require("fs");
const FormData = require("form-data");
const { join } = require("path");
const axios = require("axios");

async function uploadImageToWhatsapp(fileName, forward = false) {
    const data = new FormData();
    data.append("messaging_product", "whatsapp");

    if (forward) {
        try {
            const response = await axios.get(fileName, { responseType: "stream" });
            const fileStream = response.data;

            const contentType = response.headers["content-type"] ?? "application/octet-stream";
            const fileNameFromUrl = fileName.split("/").pop();

            data.append("file", fileStream, { contentType, filename: fileNameFromUrl });
        } catch (error) {
            console.error("Error fetching file during forwarding", error);
            return null;
        }
    } else {
        const filePath = join(__dirname, "../uploads", fileName);
        data.append("file", createReadStream(filePath));
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
        console.log(error);
        return null;
    }
}

module.exports = uploadImageToWhatsapp;
