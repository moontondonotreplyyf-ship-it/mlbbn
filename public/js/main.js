// DOM Elements
const checkBanForm = document.getElementById('checkBanForm');
const historyForm = document.getElementById('historyForm');
const reportForm = document.getElementById('reportForm');
const checkResult = document.getElementById('checkResult');
const historyResult = document.getElementById('historyResult');
const reportResult = document.getElementById('reportResult');
const loadingSpinner = document.getElementById('loadingSpinner');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// API Base URL
const API_BASE_URL = '/api';

// Tab Navigation
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        
        // Remove active class from all tabs
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(tc => tc.classList.remove('active'));
        
        // Add active class to clicked tab
        btn.classList.add('active');
        document.getElementById(tabName).classList.add('active');
    });
});

// Helper Functions
function showLoading() {
    loadingSpinner.classList.add('show');
}

function hideLoading() {
    loadingSpinner.classList.remove('show');
}

function clearResult(container) {
    container.innerHTML = '';
    container.classList.remove('show');
}

function showError(container, message) {
    container.innerHTML = `<div class="error-message">❌ ${message}</div>`;
    container.classList.add('show');
}

function showSuccess(container, message) {
    container.innerHTML = `<div class="success-message">✅ ${message}</div>`;
    container.classList.add('show');
}

// Check Ban Status
checkBanForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('userIdInput').value.trim();
    
    if (!userId) {
        showError(checkResult, 'Masukkan User ID atau Username');
        return;
    }

    showLoading();
    clearResult(checkResult);

    try {
        const response = await fetch(`${API_BASE_URL}/check-ban?user_id=${encodeURIComponent(userId)}`);
        const data = await response.json();
        hideLoading();

        if (data.status === 'success') {
            displayBanStatus(data.data);
        } else {
            showError(checkResult, data.message || 'Gagal mengecek status ban');
        }
    } catch (error) {
        hideLoading();
        showError(checkResult, 'Error: ' + error.message);
    }
});

function displayBanStatus(data) {
    const isBanned = data.is_banned;
    const statusClass = isBanned ? 'danger' : 'success';
    const statusText = isBanned ? '❌ TERBANNED' : '✅ AMAN';
    const banReason = isBanned ? data.ban_reason || 'Tidak diketahui' : '-';
    const banDuration = isBanned ? data.ban_duration || '-' : '-';
    const banEndDate = isBanned && data.ban_end_date ? new Date(data.ban_end_date).toLocaleString('id-ID') : '-';

    const html = `
        <div class="result-status ${statusClass}">
            <div class="status-icon">${isBanned ? '⚠️' : '✨'}</div>
            <div class="status-text">
                <h3>${statusText}</h3>
                <p>${isBanned ? 'Akun ini sedang terbanned' : 'Akun Anda aman, tidak ada ban'}</p>
            </div>
        </div>

        <div class="result-details">
            <div class="detail-row">
                <span class="detail-label">User ID</span>
                <span class="detail-value">${data.user_id || '-'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Username</span>
                <span class="detail-value">${data.username || '-'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Status Ban</span>
                <span class="detail-value">${isBanned ? 'BANNED ⛔' : 'AKTIF ✅'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Alasan Ban</span>
                <span class="detail-value">${banReason}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Durasi Ban</span>
                <span class="detail-value">${banDuration}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Berakhir</span>
                <span class="detail-value">${banEndDate}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Pengecekan Terakhir</span>
                <span class="detail-value">${new Date(data.last_check).toLocaleString('id-ID')}</span>
            </div>
        </div>
    `;

    checkResult.innerHTML = html;
    checkResult.classList.add('show');
}

// Get Ban History
historyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('userIdHistory').value.trim();
    
    if (!userId) {
        showError(historyResult, 'Masukkan User ID');
        return;
    }

    showLoading();
    clearResult(historyResult);

    try {
        const response = await fetch(`${API_BASE_URL}/ban-history?user_id=${encodeURIComponent(userId)}&limit=10`);
        const data = await response.json();
        hideLoading();

        if (data.status === 'success') {
            displayBanHistory(data.data);
        } else {
            showError(historyResult, data.message || 'Gagal mengambil history');
        }
    } catch (error) {
        hideLoading();
        showError(historyResult, 'Error: ' + error.message);
    }
});

function displayBanHistory(data) {
    if (data.history.length === 0) {
        historyResult.innerHTML = '<p style="text-align: center; color: #636e72;">Tidak ada riwayat ban untuk akun ini</p>';
        historyResult.classList.add('show');
        return;
    }

    let html = `
        <div class="result-details">
            <div class="detail-row">
                <span class="detail-label">User ID</span>
                <span class="detail-value">${data.user_id}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Total Ban</span>
                <span class="detail-value">${data.total_bans}x</span>
            </div>
        </div>
        <div class="history-list">
    `;

    data.history.forEach((ban, index) => {
        const banDate = new Date(ban.date).toLocaleString('id-ID');
        const endDate = ban.end_date ? new Date(ban.end_date).toLocaleString('id-ID') : 'Permanen';
        
        html += `
            <div class="history-item">
                <div class="history-info">
                    <h4>Ban ${index + 1}: ${ban.reason || 'Unknown'}</h4>
                    <p>Durasi: ${ban.duration || 'Permanen'} | Berakhir: ${endDate}</p>
                </div>
                <div class="history-date">${banDate}</div>
            </div>
        `;
    });

    html += '</div>';
    historyResult.innerHTML = html;
    historyResult.classList.add('show');
}

// Report Ban
reportForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('reportUserId').value.trim();
    const reason = document.getElementById('reportReason').value;
    const evidence = document.getElementById('reportEvidence').value.trim();

    if (!userId || !reason) {
        showError(reportResult, 'User ID dan Alasan harus diisi');
        return;
    }

    showLoading();
    clearResult(reportResult);

    try {
        const response = await fetch(`${API_BASE_URL}/report-ban`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userId,
                reason: reason,
                evidence: evidence || null
            })
        });

        const data = await response.json();
        hideLoading();

        if (data.status === 'success') {
            showSuccess(reportResult, 'Laporan berhasil dikirim! ID: ' + data.data.id);
            reportForm.reset();
        } else {
            showError(reportResult, data.message || 'Gagal mengirim laporan');
        }
    } catch (error) {
        hideLoading();
        showError(reportResult, 'Error: ' + error.message);
    }
});

// Initialize
console.log('🎮 MLBB Ban Checker loaded successfully');