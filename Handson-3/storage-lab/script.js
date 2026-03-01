// ============================================
// BAGIAN 1: Storage Operations
// ============================================

function saveToAll() {
    const key = document.getElementById('storageKey').value.trim();
    const value = document.getElementById('storageValue').value.trim();

    if (!key || !value) {
        alert('Mohon isi Key dan Value!');
        return;
    }

    // Save to Cookies (7 days)
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; max-age=604800; path=/`;

    // Save to LocalStorage
    localStorage.setItem(key, value);

    // Save to SessionStorage
    sessionStorage.setItem(key, value);

    // Update displays
    updateAllDisplays();

    // Clear inputs
    document.getElementById('storageKey').value = '';
    document.getElementById('storageValue').value = '';

    alert(`"${key}" disimpan ke semua storage!`);
}

function clearAll() {
    if (confirm('Hapus semua data dari semua storage?')) {
        clearCookies();
        clearLocalStorage();
        clearSessionStorage();
        alert('Semua storage telah dibersihkan!');
    }
}

// ============================================
// BAGIAN 2: Cookie Operations
// ============================================

function getAllCookies() {
    const cookies = {};
    if (document.cookie) {
        document.cookie.split('; ').forEach(cookie => {
            const [name, value] = cookie.split('=');
            cookies[decodeURIComponent(name)] = decodeURIComponent(value);
        });
    }
    return cookies;
}

function clearCookies() {
    const cookies = getAllCookies();
    Object.keys(cookies).forEach(name => {
        document.cookie = `${encodeURIComponent(name)}=; max-age=0; path=/`;
    });
    updateAllDisplays();
}

function updateCookiesDisplay() {
    const container = document.getElementById('cookiesContent');
    const cookies = getAllCookies();
    const keys = Object.keys(cookies);

    if (keys.length === 0) {
        container.innerHTML = '<p class="empty">Tidak ada data</p>';
        return;
    }

    container.innerHTML = keys.map(key => `
        <div class="storage-item">
            <span class="key">${key}</span>
            <span class="value">${cookies[key]}</span>
        </div>
    `).join('');
}

// ============================================
// BAGIAN 3: LocalStorage Operations
// ============================================

function clearLocalStorage() {
    localStorage.clear();
    updateAllDisplays();
}

function updateLocalStorageDisplay() {
    const container = document.getElementById('localStorageContent');

    if (localStorage.length === 0) {
        container.innerHTML = '<p class="empty">Tidak ada data</p>';
        return;
    }

    let html = '';
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        html += `
            <div class="storage-item">
                <span class="key">${key}</span>
                <span class="value">${value}</span>
            </div>
        `;
    }
    container.innerHTML = html;
}

// ============================================
// BAGIAN 4: SessionStorage Operations
// ============================================

function clearSessionStorage() {
    // Preserve tab counter for demo
    const tabCounter = sessionStorage.getItem('tabCounter');
    sessionStorage.clear();
    if (tabCounter) {
        sessionStorage.setItem('tabCounter', tabCounter);
    }
    updateAllDisplays();
}

function updateSessionStorageDisplay() {
    const container = document.getElementById('sessionStorageContent');

    if (sessionStorage.length === 0) {
        container.innerHTML = '<p class="empty">Tidak ada data</p>';
        return;
    }

    let html = '';
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        const value = sessionStorage.getItem(key);
        html += `
            <div class="storage-item">
                <span class="key">${key}</span>
                <span class="value">${value}</span>
            </div>
        `;
    }
    container.innerHTML = html;
}

// ============================================
// BAGIAN 5: Tab Isolation Demo
// ============================================

function initTabCounter() {
    let counter = sessionStorage.getItem('tabCounter');
    if (counter === null) {
        counter = 0;
        sessionStorage.setItem('tabCounter', counter);
    }
    document.getElementById('tabCounter').textContent = counter;
}

function incrementTabCounter() {
    let counter = parseInt(sessionStorage.getItem('tabCounter') || 0);
    counter++;
    sessionStorage.setItem('tabCounter', counter);
    document.getElementById('tabCounter').textContent = counter;
    updateAllDisplays();
}

// ============================================
// BAGIAN 6: Decision Helper
// ============================================

const correctAnswers = {
    1: 'localStorage',
    2: 'sessionStorage',
    3: 'cookies',
    4: 'localStorage'
};

const explanations = {
    1: {
        correct: 'Benar! LocalStorage cocok untuk preferensi yang harus persist dan tidak perlu dikirim ke server.',
        wrong: 'Kurang tepat. LocalStorage lebih cocok karena preferensi theme harus persist dan tidak perlu dikirim ke server setiap request.'
    },
    2: {
        correct: 'Benar! SessionStorage perfect untuk data form sementara yang harus hilang saat tab ditutup.',
        wrong: 'Kurang tepat. SessionStorage lebih cocok karena data form wizard sebaiknya hilang jika user menutup tab (privacy & fresh start).'
    },
    3: {
        correct: 'Benar! Cookies dengan HttpOnly adalah satu-satunya yang bisa melindungi token dari XSS dan dikirim ke server.',
        wrong: 'Kurang tepat. Hanya Cookies dengan HttpOnly yang bisa melindungi token dari JavaScript (XSS) dan otomatis dikirim ke server.'
    },
    4: {
        correct: 'Benar! LocalStorage cocok untuk shopping cart yang persist tanpa perlu ke server.',
        wrong: 'Kurang tepat. LocalStorage lebih cocok karena cart harus persist (tidak hilang jika browser tutup) dan data cart tidak perlu dikirim setiap request.'
    }
};

function checkAnswer(questionNum, answer) {
    const answerEl = document.getElementById(`answer${questionNum}`);
    const isCorrect = answer === correctAnswers[questionNum];

    answerEl.className = 'answer ' + (isCorrect ? 'correct' : 'incorrect');
    answerEl.textContent = isCorrect
        ? explanations[questionNum].correct
        : explanations[questionNum].wrong;
}

// ============================================
// BAGIAN 7: Notes
// ============================================

function saveNotes() {
    const notes = document.getElementById('learningNotes').value;
    localStorage.setItem('storageLabNotes', notes);
    alert('Catatan disimpan ke LocalStorage!');
    updateAllDisplays();
}

function loadNotes() {
    const notes = localStorage.getItem('storageLabNotes');
    if (notes) {
        document.getElementById('learningNotes').value = notes;
    }
}

// ============================================
// BAGIAN 8: Initialize
// ============================================

function updateAllDisplays() {
    updateCookiesDisplay();
    updateLocalStorageDisplay();
    updateSessionStorageDisplay();
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize displays
    updateAllDisplays();

    // Initialize tab counter
    initTabCounter();

    // Load saved notes
    loadNotes();

    // Update displays periodically
    setInterval(updateAllDisplays, 2000);
});