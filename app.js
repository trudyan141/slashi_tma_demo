var BOT_TOKEN = `7105348596:AAHjeN6oJ-UAyvI4MprXVY-gZgEAhxxgwS8`;
var CHAT_ID = null;
async function getChatId() {
  try {
      const response = await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`);
      const updates = response.data.result;
      console.log("🚀 ~ getChatId ~ response:", response)

      if (updates.length > 0) {
        const chatId = updates[updates.length - 1].message.chat.id;
        console.log('Chat ID:', chatId);
        CHAT_ID = chatId;
      } else {
          console.log('No updates found');
      }
  } catch (error) {
      console.error('Error getting updates:', error);
  }
}
document.addEventListener('DOMContentLoaded', function () {
  console.log("🚀 ~ DOMContentLoaded:")
  getChatId();
})