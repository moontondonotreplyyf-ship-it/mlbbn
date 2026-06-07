# MLBB Account Ban Checker 🎮

Tools untuk mengecek status akun Mobile Legends: Bang Bang apakah terbanned atau tidak.

## Fitur
- ✅ Cek status ban akun MLBB
- ✅ Lihat detail akun (jika tersedia)
- ✅ History ban account
- ✅ API REST untuk integrasi
- ✅ Web Interface user-friendly

## Teknologi
- **Backend**: Node.js + Express
- **Frontend**: HTML/CSS/JavaScript (Vanilla)
- **Database**: JSON (dapat diupgrade ke MongoDB/PostgreSQL)
- **API**: RESTful

## Setup & Instalasi

### Prerequisites
- Node.js v14+
- npm atau yarn

### Instalasi
```bash
npm install
```

### Jalankan Server
```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

## Penggunaan

### Via Web Interface
1. Buka `http://localhost:3000`
2. Masukkan User ID atau Username MLBB
3. Klik "Check Ban Status"
4. Lihat hasilnya

### Via API
```bash
# Cek status ban
curl http://localhost:3000/api/check-ban?user_id=123456789

# Lihat history
curl http://localhost:3000/api/ban-history?user_id=123456789
```

## Response API

### Success (200)
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

### Banned (200)
```json
{
  "status": "success",
  "data": {
    "user_id": "123456789",
    "username": "PlayerName",
    "is_banned": true,
    "ban_reason": "Toxic Behavior",
    "ban_duration": "30 days",
    "ban_end_date": "2026-07-07T10:30:00Z",
    "last_check": "2026-06-07T10:30:00Z"
  }
}
```

## Struktur Folder
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
├── .env
├── package.json
└── README.md
```

## License
MIT

## Support
Untuk pertanyaan atau issues, silakan buka issue di GitHub.

---
**Made with ❤️ for MLBB Players**