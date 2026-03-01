// ============================================
// BAGIAN 1: Cookie Helper Functions
// ============================================

/**
 * Membuat cookie baru
 * @param {string} name - Nama cookie
 * @param {string} value - Nilai cookie
 * @param {object} options - Opsi tambahan (maxAge, path, secure)
 */
function setCookie(name, value, options = {}) {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    // Tambahkan Max-Age jika disediakan
    if (options.maxAge) {
        cookieString += `; max-age=${options.maxAge}`;
    }

    // Tambahkan Path (default: /)
    cookieString += `; path=${options.path || '/'}`;

    // Tambahkan Secure jika diminta (hanya bekerja di HTTPS)
    if (options.secure) {
        cookieString += '; secure';
    }

    // Set cookie
    document.cookie = cookieString;

    console.log('Cookie dibuat:', cookieString);
}

/**
 * Mengambil nilai cookie berdasarkan nama
 * @param {string} name - Nama cookie yang dicari
 * @returns {string|null} - Nilai cookie atau null jika tidak ditemukan
 */
function getCookie(name) {
    // document.cookie returns: "name1=value1; name2=value2; name3=value3"
    const cookies = document.cookie.split('; ');

    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (decodeURIComponent(cookieName) === name) {
            return decodeURIComponent(cookieValue);
        }
    }

    return null;
}

/**
 * Menghapus cookie dengan set Max-Age = 0
 * @param {string} name - Nama cookie yang akan dihapus
 */
function deleteCookie(name) {
    document.cookie = `${encodeURIComponent(name)}=; max-age=0; path=/`;
    console.log('Cookie dihapus:', name);
}

/**
 * Mengambil semua cookies sebagai object
 * @returns {object} - Object berisi semua cookies
 */
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

// ============================================
// BAGIAN 2: Visit Counter Logic
// ============================================

function initVisitCounter() {
    // Ambil nilai counter dari cookie
    let visitCount = getCookie('visitCount');

    if (visitCount === null) {
        // Pertama kali mengunjungi
        visitCount = 1;
    } else {
        // Sudah pernah mengunjungi, increment
        visitCount = parseInt(visitCount) + 1;
    }

    // Simpan ke cookie (berlaku 7 hari)
    setCookie('visitCount', visitCount, {
        maxAge: 604800  // 7 hari dalam detik
    });

    // Update display
    updateCounterDisplay(visitCount);
}

function updateCounterDisplay(count) {
    document.getElementById('visitCount').textContent = count;
    document.getElementById('visitText').textContent = count;
}

function resetCounter() {
    deleteCookie('visitCount');
    updateCounterDisplay(0);
    updateCookieInspector();
    alert('Counter telah direset! Refresh halaman untuk melihat counter mulai dari 1.');
}

// ============================================
// BAGIAN 3: Cookie Inspector
// ============================================

function updateCookieInspector() {
    const cookieList = document.getElementById('cookieList');
    const cookies = getAllCookies();
    const cookieNames = Object.keys(cookies);

    if (cookieNames.length === 0) {
        cookieList.innerHTML = '<p class="placeholder">Belum ada cookie...</p>';
        return;
    }

    let html = '';
    cookieNames.forEach(name => {
        html += `
            <div class="cookie-item">
                <span class="cookie-name">${name}</span>:
                <span class="cookie-value">${cookies[name]}</span>
                <button onclick="removeCookie('${name}')" style="float:right; padding:2px 8px; cursor:pointer;">x</button>
            </div>
        `;
    });

    cookieList.innerHTML = html;
}

function removeCookie(name) {
    deleteCookie(name);
    updateCookieInspector();
}

// ============================================
// BAGIAN 4: Cookie Creator Form
// ============================================

function handleCookieForm(event) {
    event.preventDefault();

    const name = document.getElementById('cookieName').value;
    const value = document.getElementById('cookieValue').value;
    const maxAge = document.getElementById('maxAge').value;
    const path = document.getElementById('path').value;
    const secure = document.getElementById('secureFlag').checked;

    const options = { path };

    if (maxAge) {
        options.maxAge = parseInt(maxAge);
    }

    if (secure) {
        options.secure = true;
    }

    setCookie(name, value, options);
    updateCookieInspector();

    // Reset form
    event.target.reset();
    document.getElementById('path').value = '/';

    // Feedback
    alert(`Cookie "${name}" berhasil dibuat!`);
}

// ============================================
// BAGIAN 5: Initialize
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize visit counter
    initVisitCounter();

    // Update cookie inspector
    updateCookieInspector();

    // Setup event listeners
    document.getElementById('resetBtn').addEventListener('click', resetCounter);
    document.getElementById('cookieForm').addEventListener('submit', handleCookieForm);

    // Update inspector setiap 2 detik (untuk melihat perubahan)
    setInterval(updateCookieInspector, 2000);
});