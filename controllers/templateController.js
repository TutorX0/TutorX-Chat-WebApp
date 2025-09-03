const axios = require("axios");

const WHATSAPP_API_URL = "https://graph.facebook.com/v17.0";
const WABA_ID = process.env.WABA_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
// ✅ Fetch all templates from Meta
exports.getTemplates = async (req, res) => {
  try {
    const response = await axios.get(
      `${WHATSAPP_API_URL}/${WABA_ID}/message_templates`,
      {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      }
    );

    res.status(200).json({
      status: "success",
      templates: response.data.data,
    });
  } catch (err) {
    console.error("❌ Error fetching templates:", err.response?.data || err.message);
    res.status(500).json({
      status: "error",
      error: err.response?.data || err.message,
    });
  }
};

// ✅ Send template to multiple contacts
exports.sendTemplate = async (req, res) => {
  const { templateName, language, contacts, parameters } = req.body;

  if (!templateName || !language || !contacts?.length) {
    return res.status(400).json({
      status: "error",
      message: "templateName, language, and contacts[] are required",
    });
  }

  try {
    const results = [];

    for (let to of contacts) {
      const payload = {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: templateName,
          language: { code: language },
          components: parameters?.length
            ? [{ type: "body", parameters }]
            : [],
        },
      };

      const response = await axios.post(
        `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`,
        payload,
        {
          headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
        }
      );

      results.push({
        to,
        messageId: response.data.messages?.[0]?.id,
      });
    }

    res.status(200).json({
      status: "success",
      sent: results,
    });
  } catch (err) {
    console.error("❌ Error sending template:", err.response?.data || err.message);
    res.status(500).json({
      status: "error",
      error: err.response?.data || err.message,
    });
  }
};
