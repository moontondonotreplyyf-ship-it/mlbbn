const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

// Get token dari environment variable
const token = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const bot = new TelegramBot(token, { polling: true });

// Database path
const DB_PATH = path.join(__dirname, '../data/banDatabase.json');

// Initialize database
function initializeDB() {
  if (!fs.existsSync(DB_PATH)) {
    const defaultData = {
      accounts: [],
      ban_history: [],
      reports: []
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2));
  }
}

// Read database
function readDB() {
  initializeDB();
  const data = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(data);
}

// Write database
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Check Ban Status
async function checkBanStatus(userId) {
  const db = readDB();
  let account = db.accounts.find(acc => 
    acc.user_id === userId || acc.username === userId
  );

  if (!account) {
    account = {
      user_id: userId,
      username: userId,
      is_banned: false,
      ban_reason: null,
      ban_duration: null,
      ban_end_date: null,
      last_check: new Date().toISOString(),
      first_seen: new Date().toISOString()
    };
    db.accounts.push(account);
    writeDB(db);
  } else {
    account.last_check = new Date().toISOString();
    writeDB(db);
  }

  return account;
}

// Get Ban History
async function getBanHistory(userId, limit = 5) {
  const db = readDB();
  
  const history = db.ban_history
    .filter(h => h.user_id === userId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);

  return {
    user_id: userId,
    total_bans: history.length,
    history
  };
}

// Report Ban
async function reportBan(userId, reason, evidence) {
  const db = readDB();
  
  const report = {
    id: `report_${Date.now()}`,
    user_id: userId,
    reason: reason,
    evidence: evidence || null,
    reported_at: new Date().toISOString(),
    status: 'pending'
  };

  db.reports.push(report);
  writeDB(db);

  return report;
}

// Format Ban Status untuk Telegram
function formatBanStatus(data) {
  const isBanned = data.is_banned;
  const status = isBanned ? '⛔ TERBANNED' : '✅ AMAN';
  const reason = isBanned ? data.ban_reason || 'Tidak diketahui' : '-';
  const duration = isBanned ? data.ban_duration || '-' : '-';
  const endDate = isBanned && data.ban_end_date ? new Date(data.ban_end_date).toLocaleString('id-ID') : '-';

  return `
🎮 *MLBB Account Ban Checker*

*User ID:* \`${data.user_id}\`
*Username:* ${data.username}

*Status Ban:* ${status}
*Alasan Ban:* ${reason}
*Durasi Ban:* ${duration}
*Berakhir:* ${endDate}

*Pengecekan Terakhir:* ${new Date(data.last_check).toLocaleString('id-ID')}
  `;
}

// Format History untuk Telegram
function formatHistory(data) {
  if (data.history.length === 0) {
    return `📊 *Ban History*\n\nTidak ada riwayat ban untuk akun ini ✨`;
  }

  let text = `📊 *Ban History untuk ${data.user_id}*\n`;
  text += `*Total Ban:* ${data.total_bans}x\n\n`;

  data.history.forEach((ban, index) => {
    const banDate = new Date(ban.date).toLocaleString('id-ID');
    const endDate = ban.end_date ? new Date(ban.end_date).toLocaleString('id-ID') : 'Permanen';
    
    text += `*Ban ${index + 1}*\n`;
    text += `Alasan: ${ban.reason || 'Unknown'}\n`;
    text += `Durasi: ${ban.duration || 'Permanen'}\n`;
    text += `Tanggal: ${banDate}\n`;
    text += `Berakhir: ${endDate}\n\n`;
  });

  return text;
}

// Start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  const welcomeMessage = `
👋 *Selamat Datang di MLBB Ban Checker Bot!*

Saya adalah bot untuk mengecek status ban akun Mobile Legends: Bang Bang Anda.

📋 *Perintah yang tersedia:*

/cekban <user_id> - Cek status ban akun
/history <user_id> - Lihat riwayat ban
/lapor <user_id> <alasan> - Laporkan akun curiga
/help - Tampilkan bantuan

Contoh penggunaan:
/cekban 123456789
/history 123456789
/lapor 123456789 toxic

Selamat mencoba! 🎮
  `;

  bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
});

// Help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  
  const helpMessage = `
📚 *Panduan Penggunaan Bot*

*1. Cek Status Ban* (/cekban)
   Gunakan: /cekban <user_id>
   Contoh: /cekban 123456789
   
   Fitur: Mengecek apakah akun terbanned atau tidak

*2. Lihat Riwayat Ban* (/history)
   Gunakan: /history <user_id>
   Contoh: /history 123456789
   
   Fitur: Melihat history ban account

*3. Laporkan Akun Curiga* (/lapor)
   Gunakan: /lapor <user_id> <alasan> [bukti]
   Contoh: /lapor 123456789 toxic pembuat masalah dalam team
   
   Alasan yang tersedia:
   - toxic
   - afk
   - feeding
   - cheating
   - lainnya

Contoh laporan lengkap:
/lapor 123456789 toxic sering main toxic dan harassment

*Bantuan Tambahan:*
Jika ada pertanyaan, hubungi admin atau support team kami.

Semoga membantu! 🎮✨
  `;

  bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
});

// Cek Ban Command
bot.onText(/\/cekban\s+(.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = match[1].trim();

  try {
    // Show loading message
    const loadingMsg = await bot.sendMessage(chatId, '⏳ Mengecek status ban...');

    // Check ban status
    const result = await checkBanStatus(userId);
    
    // Delete loading message
    await bot.deleteMessage(chatId, loadingMsg.message_id);

    // Send result
    const formattedResult = formatBanStatus(result);
    await bot.sendMessage(chatId, formattedResult, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error in cekban command:', error);
    await bot.sendMessage(chatId, `❌ Error: ${error.message}`, { parse_mode: 'Markdown' });
  }
});

// History Command
bot.onText(/\/history\s+(.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = match[1].trim();

  try {
    // Show loading message
    const loadingMsg = await bot.sendMessage(chatId, '⏳ Mengambil history...');

    // Get history
    const result = await getBanHistory(userId, 5);
    
    // Delete loading message
    await bot.deleteMessage(chatId, loadingMsg.message_id);

    // Send result
    const formattedResult = formatHistory(result);
    await bot.sendMessage(chatId, formattedResult, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error in history command:', error);
    await bot.sendMessage(chatId, `❌ Error: ${error.message}`, { parse_mode: 'Markdown' });
  }
});

// Lapor Command
bot.onText(/\/lapor\s+(.+)\s+(.+)(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = match[1].trim();
  const reason = match[2].trim();
  const evidence = match[3] ? match[3].trim() : null;

  try {
    // Show loading message
    const loadingMsg = await bot.sendMessage(chatId, '📝 Mengirim laporan...');

    // Submit report
    const report = await reportBan(userId, reason, evidence);
    
    // Delete loading message
    await bot.deleteMessage(chatId, loadingMsg.message_id);

    // Send success message
    const successMessage = `
✅ *Laporan Berhasil Dikirim!*

*ID Laporan:* \`${report.id}\`
*User ID Tersangka:* \`${userId}\`
*Alasan:* ${reason}
*Bukti:* ${evidence || 'Tidak ada'}
*Waktu:* ${new Date(report.reported_at).toLocaleString('id-ID')}
*Status:* Pending (Dalam Review)

Terima kasih telah membantu membuat komunitas MLBB lebih baik! 🙏
    `;

    await bot.sendMessage(chatId, successMessage, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error in lapor command:', error);
    await bot.sendMessage(chatId, `❌ Error: ${error.message}`, { parse_mode: 'Markdown' });
  }
});

// Handle any other message
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Ignore command messages
  if (text && text.startsWith('/')) {
    return;
  }

  // For non-command messages
  const response = `
🤔 Perintah tidak dikenali.

Gunakan /help untuk melihat daftar perintah yang tersedia.

Atau pilih salah satu:
/cekban <user_id> - Cek status ban
/history <user_id> - Lihat history
/lapor <user_id> <alasan> - Laporkan ban
/start - Mulai ulang
  `;

  bot.sendMessage(chatId, response, { parse_mode: 'Markdown' });
});

// Error handler
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

console.log('🤖 MLBB Ban Checker Telegram Bot Started!');
console.log('Bot adalah ready untuk menerima perintah...\n');

module.exports = bot;
