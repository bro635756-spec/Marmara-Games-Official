// MARMARA GAME ENGINE - ULTRAMSG WHATSAPP ANALYTICS (FULL LEVEL)

// UltraMsg panelinden ve JSON çıktısından (image_644a1b.png) alınan kesin veriler:
const ULTRA_MSG_INSTANCE_ID = "183105"; 
const ULTRA_MSG_TOKEN = "5oa0s3swsuooez33"; // Buraya panelindeki TAM tokenı yapıştır!
const WP_GROUP_ID = "120363410306912808@g.us"; // usersSign grubunun gerçek sistem ID'si

let sessionLog = {
    email: "Kayıt Bekleniyor",
    ip: "Alınıyor...",
    location: "Alınıyor...",
    time: "",
    clicks: 0,
    mouseTracks: []
};

// 1. IP ve Konum Analiz Motoru
async function trackUserMetadata() {
    try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        sessionLog.ip = data.ip || "Bilinmiyor";
        sessionLog.location = `${data.city} / ${data.country_name}`;
    } catch (e) {
        sessionLog.ip = "Gizli/Bloke";
        sessionLog.location = "Tespit Edilemedi";
    }
}

// 2. Kullanıcı Hareket İzleme Modülü
function initBehaviorTracking() {
    window.addEventListener('click', (e) => {
        sessionLog.clicks++;
        let log = `[${new Date().toLocaleTimeString()}] Tıklandı: ${e.target.tagName}`;
        sessionLog.mouseTracks.push(log);
    });
}

// 3. UltraMsg API Üzerinden usersSign Grubuna Mesaj Fırlatma
async function sendToWhatsAppGroup(payload) {
    if (ULTRA_MSG_TOKEN.includes("BURAYA")) {
        console.log("UltraMsg token ayarı eksik, veri konsola basıldı:", payload);
        return;
    }

    // usersSign grubuna gidecek son seviye rapor şablonu
    const messageText = `🚀 *MGE - YENİ KULLANICI ANALİZİ* 🚀\n\n` +
                        `📧 *E-Posta:* ${payload.email}\n` +
                        `🌐 *IP Adresi:* ${payload.ip}\n` +
                        `📍 *Konum:* ${payload.location}\n` +
                        `⏰ *Zaman:* ${payload.time}\n` +
                        `🖱️ *Klik Sayısı:* ${payload.clicks}\n\n` +
                        `🤖 *Son Hareket Analizleri:*\n${payload.mouseTracks.slice(-3).join("\n") || "Hareket kaydı yok"}`;

    const url = `https://api.ultramsg.com/${ULTRA_MSG_INSTANCE_ID}/messages/chat`;
    
    try {
        await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                "token": ULTRA_MSG_TOKEN,
                "to": WP_GROUP_ID,
                "body": messageText
            })
        });
    } catch (err) {
        console.error("UltraMsg iletim hatası:", err);
    }
}

// 4. Form Yönetimi ve Tetikleyici
document.getElementById('mgeRegisterForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const status = document.getElementById('responseStatus');
    
    btn.disabled = true;
    btn.innerText = "Sisteme İşleniyor...";
    
    sessionLog.email = document.getElementById('userEmail').value;
    sessionLog.time = new Date().toLocaleString('tr-TR');

    // Hem local veritabanına (users.js) yaz hem de WhatsApp grubuna fırlat
    if (typeof MGE_Database !== 'undefined') {
        MGE_Database.saveUserLocal(sessionLog);
    }
    
    await sendToWhatsAppGroup(sessionLog);

    status.className = "status-box success";
    status.innerText = "Erken kayıt başarıyla tamamlandı. Analiz verileri usersSign grubuna iletildi!";
    
    document.getElementById('userEmail').value = "";
    btn.disabled = false;
    btn.innerText = "Erken Erişime Katıl";
});

// Sayfa yüklendiğinde motorları çalıştır
window.onload = () => {
    trackUserMetadata();
    initBehaviorTracking();
};
