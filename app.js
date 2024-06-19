var BOT_TOKEN = `7105348596:AAHjeN6oJ-UAyvI4MprXVY-gZgEAhxxgwS8`;
var CHAT_ID = null;
var URL = `https://api.telegram.org/bot${BOT_TOKEN}`;
async function getChatId() {
  try {
      const response = await axios.get(`${URL}/getUpdates`);
      const updates = response.data.result;
      console.log("🚀 ~ getChatId ~ response:", response)

      if (updates.length > 0) {
        const chatId = updates[updates.length - 1].message.chat.id;
        console.log('Chat ID:', chatId);
        CHAT_ID = chatId;
        console.log("🚀 ~ getChatId ~ CHAT_ID:", CHAT_ID)
      } else {
          console.log('No updates found');
      }
  } catch (error) {
      console.error('Error getting updates:', error);
  }
}
async function sendInvoice() {
        const send_url = `${URL}/sendInvoice`;

        const invoiceData = {
            chat_id: CHAT_ID,
            title: 'Buy 5 Telegram Stars',
            description: 'Purchase 5 Telegram Stars',
            payload: 'Custom-Payload',
            provider_token: '',
            currency: 'XTR',
            prices: [
                { label: '5 Telegram Stars', amount: 5 }  // 500 = 5.00 USD
            ]
        };

        try {
            const response = await axios.post(send_url, invoiceData);
            console.log('Invoice sent:', response.data);
        } catch (error) {
            console.error('Error sending invoice:', error);
        }
    }
document.addEventListener('DOMContentLoaded', function () {
  console.log("🚀 ~ DOMContentLoaded:")
  getChatId();
  // Thêm sự kiện click cho nút
  document.getElementById('btnBuy5').addEventListener('click', function () {
      sendInvoice(5);
  });
})