// MARMARA GAME ENGINE - LOCAL DATABASE SCHEMA
// Bu dosya gelen verilerin tarayıcı tarafındaki veri şemasını kontrol eder.

const MGE_Database = {
    getUsers: function() {
        return JSON.parse(localStorage.getItem('mge_users')) || [];
    },
    saveUserLocal: function(userInstance) {
        let currentUsers = this.getUsers();
        currentUsers.push(userInstance);
        localStorage.setItem('mge_users', JSON.stringify(currentUsers));
        console.log("Local Veritabanı Güncellendi. Güncel Kayıt Sayısı: " + currentUsers.length);
    }
};
