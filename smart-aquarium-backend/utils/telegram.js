const axios = require("axios");

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendAlert(message) {
  // If Telegram not configured, just log
  if (!BOT_TOKEN || !CHAT_ID) {
    console.log("Telegram not configured. Alert:", message);
    return;
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: CHAT_ID,
      text: message,
    });
    console.log("✅ Telegram alert sent");
  } catch (err) {
    console.error(
      "❌ Telegram error:",
      err.response?.data || err.message
    );
  }
}

module.exports = { sendAlert };
