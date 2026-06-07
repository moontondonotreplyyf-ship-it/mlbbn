const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data/banDatabase.json');

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
exports.checkBanStatus = async (identifier) => {
  return new Promise((resolve, reject) => {
    try {
      const db = readDB();
      
      // Find account in database
      let account = db.accounts.find(acc => 
        acc.user_id === identifier || acc.username === identifier
      );

      // If not found, create new entry
      if (!account) {
        account = {
          user_id: identifier,
          username: identifier,
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
        // Update last check time
        account.last_check = new Date().toISOString();
        writeDB(db);
      }

      resolve(account);
    } catch (error) {
      reject(error);
    }
  });
};

// Get Ban History
exports.getBanHistory = async (user_id, limit = 10) => {
  return new Promise((resolve, reject) => {
    try {
      const db = readDB();
      
      const history = db.ban_history
        .filter(h => h.user_id === user_id)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);

      resolve({
        user_id,
        total_bans: history.length,
        history
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Get Account Info
exports.getAccountInfo = async (user_id) => {
  return new Promise((resolve, reject) => {
    try {
      const db = readDB();
      
      const account = db.accounts.find(acc => acc.user_id === user_id);

      if (!account) {
        throw new Error('Account not found');
      }

      const banHistory = db.ban_history.filter(h => h.user_id === user_id);

      resolve({
        user_id: account.user_id,
        username: account.username,
        is_banned: account.is_banned,
        ban_reason: account.ban_reason,
        ban_duration: account.ban_duration,
        ban_end_date: account.ban_end_date,
        total_bans: banHistory.length,
        first_seen: account.first_seen,
        last_check: account.last_check
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Report Ban
exports.reportBan = async (reportData) => {
  return new Promise((resolve, reject) => {
    try {
      const db = readDB();
      
      const report = {
        id: `report_${Date.now()}`,
        user_id: reportData.user_id,
        reason: reportData.reason,
        evidence: reportData.evidence || null,
        reported_at: reportData.reported_at,
        status: 'pending'
      };

      db.reports.push(report);
      writeDB(db);

      resolve(report);
    } catch (error) {
      reject(error);
    }
  });
};

// Add Ban Record (for admin use)
exports.addBanRecord = async (banData) => {
  return new Promise((resolve, reject) => {
    try {
      const db = readDB();
      
      // Find and update account
      const account = db.accounts.find(acc => acc.user_id === banData.user_id);
      
      if (account) {
        account.is_banned = true;
        account.ban_reason = banData.reason;
        account.ban_duration = banData.duration;
        account.ban_end_date = banData.end_date;
      }

      // Add to history
      const historyRecord = {
        id: `ban_${Date.now()}`,
        user_id: banData.user_id,
        reason: banData.reason,
        duration: banData.duration,
        date: new Date().toISOString(),
        end_date: banData.end_date
      };

      db.ban_history.push(historyRecord);
      writeDB(db);

      resolve(historyRecord);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = exports;