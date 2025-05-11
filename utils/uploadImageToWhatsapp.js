const { createReadStream } = require("fs");
const FormData = require("form-data");
const { join } = require("path");
const axios = require("axios");

async function uploadImageToWhatsapp(fileName) {
    const data = new FormData();
    data.append("messaging_product", "whatsapp");

    const filePath = join(__dirname, "../uploads", fileName);
    data.append("file", createReadStream(filePath));

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
