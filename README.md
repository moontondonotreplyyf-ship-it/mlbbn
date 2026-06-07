# MLBB Account Ban Checker Bot 🎮🤖

Tools untuk mengecek status akun Mobile Legends: Bang Bang apakah terbanned atau tidak.
Sekarang hadir dalam 2 format: **Web Interface** dan **Telegram Bot**!

## ✨ Fitur

### Web Interface
- ✅ Cek status ban akun MLBB
- ✅ Lihat detail akun (jika tersedia)
- ✅ History ban account
- ✅ API REST untuk integrasi
- ✅ Web Interface user-friendly

### Telegram Bot
- ✅ Bot Telegram untuk cek ban real-time
- ✅ Perintah mudah: /cekban, /history, /lapor
- ✅ Laporkan akun mencurigakan
- ✅ Response yang cepat dan akurat
- ✅ Database JSON terintegrasi

## 🛠 Teknologi
- **Backend**: Node.js + Express
- **Telegram API**: node-telegram-bot-api
- **Frontend**: HTML/CSS/JavaScript (Vanilla)
- **Database**: JSON
- **API**: RESTful

## 📋 Setup & Instalasi

### Prerequisites
- Node.js v14+
- npm atau yarn
- Telegram Bot Token (dari BotFather)

### Step 1: Clone Repository
```bash
git clone https://github.com/moontondonotreplyyf-ship-it/mlbbn.git
cd mlbbn
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup Environment Variable
Buat file `.env` atau edit yang sudah ada:

```bash
# Untuk Web Server
PORT=3000
NODE_ENV=development

# Untuk Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

**Cara mendapatkan Bot Token:**
1. Buka Telegram dan cari `@BotFather`
2. Gunakan `/newbot` untuk membuat bot baru
3. Copy token yang diberikan

## 🚀 Menjalankan Project

### Option 1: Web Server (Port 3000)
```bash
npm start
```
Akses: `http://localhost:3000` 🌐

### Option 2: Telegram Bot
```bash
npm run bot
```
Bot akan siap menerima perintah di Telegram 🤖

### Option 3: Development Mode dengan Auto-Reload
```bash
# Web Server
npm run dev

# Telegram Bot
npm run dev:bot
```

## 📱 Penggunaan Telegram Bot

### Commands yang Tersedia

#### 1. `/start`
Menampilkan welcome message dan daftar perintah

```
/start
```

#### 2. `/help`
Menampilkan panduan lengkap penggunaan bot

```
/help
```

#### 3. `/cekban <user_id>`
Mengecek status ban akun MLBB

```
/cekban 123456789
```

**Response:**
```
🎮 MLBB Account Ban Checker

User ID: `123456789`
Username: PlayerName
Status Ban: ✅ AMAN
Alasan Ban: -
Durasi Ban: -
Berakhir: -
Pengecekan Terakhir: 07/06/2026, 14:30:00
```

#### 4. `/history <user_id>`
Melihat riwayat ban account

```
/history 123456789
```

**Response:**
```
📊 Ban History untuk 123456789
Total Ban: 2x

Ban 1
Alasan: Toxic Behavior
Durasi: 7 days
Tanggal: 05/06/2026, 10:00:00
Berakhir: 12/06/2026, 10:00:00

Ban 2
Alasan: AFK Frequent
Durasi: 3 days
Tanggal: 25/05/2026, 15:30:00
Berakhir: 28/05/2026, 15:30:00
```

#### 5. `/lapor <user_id> <alasan> [bukti]`
Melaporkan akun yang curiga

```
/lapor 123456789 toxic sering harassment dan toxic chat
```

**Alasan yang Tersedia:**
- `toxic` - Perilaku toxic
- `afk` - Sering AFK
- `feeding` - Feeding
- `cheating` - Cheating/Hacking
- `lainnya` - Alasan lainnya

**Response:**
```
✅ Laporan Berhasil Dikirim!

ID Laporan: `report_1717759800000`
User ID Tersangka: `123456789`
Alasan: toxic
Bukti: sering harassment dan toxic chat
Waktu: 07/06/2026, 14:30:00
Status: Pending (Dalam Review)

Terima kasih telah membantu membuat komunitas MLBB lebih baik! 🙏
```

## 🌐 Web Interface Usage

Buka `http://localhost:3000` dan gunakan tab berikut:

### Tab 1: Cek Ban
- Input User ID atau Username
- Lihat status ban real-time
- Detail akun lengkap

### Tab 2: History
- Lihat riwayat ban account
- Total ban
- Tanggal dan durasi ban

### Tab 3: Report
- Laporkan akun curiga
- Pilih alasan ban
- Berikan bukti/deskripsi

## 📡 API Endpoints (Web)

```bash
# Cek status ban
GET /api/check-ban?user_id=123456789

# Lihat history
GET /api/ban-history?user_id=123456789&limit=10

# Info akun
GET /api/account-info?user_id=123456789

# Laporkan ban
POST /api/report-ban
Content-Type: application/json

{
  "user_id": "123456789",
  "reason": "toxic",
  "evidence": "pembuat masalah dalam team"
}
```

## 📁 Struktur Folder

```
mlbbn/
├── server/
│   ├── app.js
│   ├── routes/
│   │   └── api.js
│   ├── controllers/
│   │   └── banController.js
│   ├── services/
│   │   └── mlbbService.js
│   └── middleware/
│       └── errorHandler.js
├── public/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
├── data/
│   └── banDatabase.json
├── bot.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## 📊 Response Format

### Success Response
```json
{
  "status": "success",
  "data": {
    "user_id": "123456789",
    "username": "PlayerName",
    "is_banned": false,
    "ban_reason": null,
    "ban_duration": null,
    "last_check": "2026-06-07T10:30:00Z"
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "User ID atau username harus diisi"
}
```

## 🔧 Troubleshooting

### Bot tidak connect ke Telegram
- Pastikan token sudah benar di `.env`
- Cek koneksi internet
- Restart bot dengan `npm run bot`

### Database error
- Pastikan folder `data/` ada
- Cek permissions file
- Recreate `banDatabase.json` jika corrupt

### Port 3000 sudah digunakan
```bash
# Ganti port di .env
PORT=3001

npm start
```

## 📝 License
MIT

## 👨‍💻 Author
moontondonotreplyyf-ship-it

---

**Made with ❤️ for MLBB Players** 🎮✨
