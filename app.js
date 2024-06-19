var BOT_TOKEN = `7105348596:AAHjeN6oJ-UAyvI4MprXVY-gZgEAhxxgwS8`;
var USER_ID = null;
var stripe = Stripe('pk_test_51PTK07Cu9AgLpE3WCw7Pum7R72lu0ozUCNu9Y2VdboMMtwyibXF87PaMil1l2pMkxYyL1UebeXcczVrM4ZwFIAsf00JLbpjpI9');
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
        CHAT_ID = chatId || '893899818';
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
      chat_id: USER_ID,
      title: `Buy ${amount} Telegram Stars`,
      description: `Purchase  ${amount} Telegram Stars`,
      payload: 'payload-stars',
      provider_token: '',
      currency: 'XTR',
      start_parameter: 'buy_stars_demo', // deep link for open payment 
      photo_url:'https://fptshop.com.vn/uploads/originals/2023/11/22/638362929279006187_game-naruto_.jpg',
      prices: [
          { label: `${amount} Telegram Stars`, amount: amount }  // 500 = 5.00 USD
      ]
  };
  
  try {
      const response = await axios.post(send_url, invoiceData);
      console.log('Invoice sent:', response.data);
  } catch (error) {
      console.error('Error sending invoice:', error);
  }
}
async function createInvoiceLink(amount) {
  const send_url = `${URL}/createInvoiceLink`;

  const invoiceData = {
      chat_id: USER_ID,
      title: `Buy ${amount} Telegram Stars`,
      description: `Purchase  ${amount} Telegram Stars`,
      payload: 'payload-stars',
      provider_token: '',
      currency: 'XTR',
      start_parameter: 'buy_stars_demo', // deep link for open payment 
      photo_url:'https://fptshop.com.vn/uploads/originals/2023/11/22/638362929279006187_game-naruto_.jpg',
      prices: [
          { label: `${amount} Telegram Stars`, amount: amount }  // 500 = 5.00 USD
      ]
  };
  
  try {
      const response = await axios.post(send_url, invoiceData);
      console.log('createInvoiceLink sent:', response.data);
      
    const invoiceLink = response.data.result;
    console.log('Invoice link created:', invoiceLink);
     if (invoiceLink) {
        
          Telegram.WebApp.openInvoice(result.invoice_url, function(status) {
            if (status == 'paid') {
              Telegram.WebApp.close();
            } else if (status == 'failed') {
              Telegram.WebApp.HapticFeedback.notificationOccurred('error');
              Cafe.showStatus('Payment has been failed.');
            } else {
              Telegram.WebApp.HapticFeedback.notificationOccurred('warning');
              Cafe.showStatus('You have cancelled this order.');
            }
          });
      
      }
  } catch (error) {
      console.error('Error createInvoiceLink invoice:', error);
  }
}
async function sendInvoiceUSD(amount) {
    const send_url = `${URL}/sendInvoice`;

    const invoiceData = {
      chat_id: USER_ID,
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
        listItem.textContent = `ID: ${item.id}, Date: ${item.date}, amount: ${item.amount}, source: ${JSON.stringify(item?.source || '')}, receiver: ${JSON.stringify(item?.receiver || '')}`;
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
 async function getUsdPayments() {
   const response = await fetch('https://api.stripe.com/v1/charges?currency=usd', {
        headers: {
            Authorization: 'Bearer sk_test_51PTK07Cu9AgLpE3WqAxlBYnCDwIIT7ptcbMfZzqqlhrmvMC4l9QF4v385GoaMNNSkop5v86K1fSV5XEBsxR5zBTT00lGeY13KG',
        },
    });
    const payments = await response.json();
    console.log("🚀 ~ getUsdPayments ~ payments:", payments)


    const paymentListDiv = document.getElementById('listContent');
    paymentListDiv.innerHTML = '<h2>USD Payments:</h2>';
    
    if (payments.length === 0) {
        paymentListDiv.innerHTML += '<p>No USD payments found.</p>';
    } else {
        const ul = document.createElement('ul');
        payments.forEach(payment => {
            const li = document.createElement('li');
            li.textContent = `Amount: ${(payment.amount / 100).toFixed(2)} ${payment.currency.toUpperCase()}, Description: ${payment.description}`;
            ul.appendChild(li);
        });
        paymentListDiv.appendChild(ul);
    }
}
document.addEventListener('DOMContentLoaded', function () {
  console.log("🚀 ~ DOMContentLoaded:")
  getChatId();
  // Store availavle info
  // Ensure the Telegram Web App SDK is available
  window.Telegram.WebApp.ready(); 

  // Extract the user ID
  const userId = window.Telegram.WebApp.initDataUnsafe.user.id;
  console.log("User ID:", userId);
  USER_ID = userId;
  console.log("🚀 ~ USER_ID:", USER_ID)
  // event listeners
  document.getElementById('btnBuy5').addEventListener('click', function () {
      createInvoiceLink(1);
  });
  document.getElementById('btnBuy5USD').addEventListener('click', function () {
      sendInvoiceUSD(500);  // 500 = 5.00 USD
  });
  document.getElementById('btnGetList').addEventListener('click', function () {
      getTxList(); 
  });
  document.getElementById('btnGetUSDList').addEventListener('click', function () {
      getUsdPayments(); 
  });
})