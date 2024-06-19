var BOT_TOKEN = `7105348596:AAHjeN6oJ-UAyvI4MprXVY-gZgEAhxxgwS8`;
var CHAT_ID = null;
var URL = `https://api.telegram.org/bot${BOT_TOKEN}`;
var txList = [];
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
async function sendInvoice(amount) {
  const send_url = `${URL}/sendInvoice`;

  const invoiceData = {
      chat_id: CHAT_ID,
      title: 'Buy 5 Telegram Stars',
      description: 'Purchase 5 Telegram Stars',
      payload: 'payload-stars',
      provider_token: '',
      currency: 'XTR',
      start_parameter: 'test',
      photo_url:'https://fptshop.com.vn/uploads/originals/2023/11/22/638362929279006187_game-naruto_.jpg',
      prices: [
          { label: '5 Telegram Stars', amount: amount }  // 500 = 5.00 USD
      ]
  };
  
  try {
      const response = await axios.post(send_url, invoiceData);
      console.log('Invoice sent:', response.data);
  } catch (error) {
      console.error('Error sending invoice:', error);
  }
}
async function sendInvoiceUSD(amount) {
    const send_url = `${URL}/sendInvoice`;

    const invoiceData = {
      chat_id: CHAT_ID,
      title: 'Buy item with 5$',
      description: 'Purchase Buy item with 5$',
      payload: 'payload-usd',
      provider_token: '284685063:TEST:NWZhM2JlM2EwNzhl',
      currency: 'USD',
      start_parameter: 'test',
      photo_url:'https://fptshop.com.vn/uploads/originals/2023/11/22/638362929279006187_game-naruto_.jpg',
      prices: [
          { label: 'Buy item with 5$', amount: amount }  
      ]
  };
    try {
        const response = await axios.post(send_url, invoiceData);
        console.log('Invoice sent:', response.data);
    } catch (error) {
        console.error('Error sending invoice:', error);
    }
}
function renderList(list) {
  const listContent = document.getElementById('listContent');
  // Clear existing content
  listContent.innerHTML = '';

  // Check if list has data
  if (list.length > 0) {
      list.forEach(item => {
          const listItem = document.createElement('div');
          listItem.textContent = `ID: ${item.id}, Name: ${item.name}`;
          listContent.appendChild(listItem);
      });
    
  } 
}
async function getTxList() {
  const get_url = `${URL}/getStarTransactions`;
    try {
      const response = await axios.get(get_url);
      console.log('getTxList:', response.data);
      txList = response.data?.result?.transactions || [];
      console.log("🚀 ~ getTxList ~ txList:", txList)
      if (txList.length > 0) {
        renderList(txList);
      } else { 
        const listContent = document.getElementById('listContent');
        listContent.textContent = `No data`;
      }
    } catch (error) {
        console.error('Error getTxList:', error);
    }
}
document.addEventListener('DOMContentLoaded', function () {
  console.log("🚀 ~ DOMContentLoaded:")
  getChatId();

  // event listeners
  document.getElementById('btnBuy5').addEventListener('click', function () {
      sendInvoice(5);
  });
  document.getElementById('btnBuy5USD').addEventListener('click', function () {
      sendInvoiceUSD(500);  // 500 = 5.00 USD
  });
   document.getElementById('btnGetList').addEventListener('click', function () {
      getTxList(); 
  });
})