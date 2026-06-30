// MARMARA GAME ENGINE - LOCAL DATABASE SCHEMA
// Gelen mailleri ve logları senin de tarayıcı konsolundan "MGE_Database.getUsers()" yazarak görebileceğin alan.

const MGE_Database = {
    getUsers: function() {
        return JSON.parse(localStorage.getItem('mge_users')) || [];
    },
    saveUserLocal: function(userInstance) {
        let currentUsers = this.getUsers();
        // Sadece mail adresini değil tüm hareket logunu veritabanına ekler
        currentUsers.push({
            email: userInstance.email,
            ip: userInstance.ip,
            location: userInstance.location,
            time: userInstance.time,
            totalClicks: userInstance.clicks
        });
        localStorage.setItem('mge_users', JSON.stringify(currentUsers));
        console.log("Local Veritabanı Güncellendi. Toplam Kayıt Sayısı: " + currentUsers.length);
    }
};
