# Web Warehouse Inventory API

Aplikasi backend untuk sistem manajemen gudang (Warehouse Inventory). Proyek ini dibangun menggunakan Node.js dan Sequelize ORM dengan struktur relasi database yang ketat untuk entitas seperti Product, Supplier, Customer, StockMovement, dan StockRequest. Sistem ini juga memanfaatkan optimasi composite indexing untuk memastikan performa pengambilan data tetap cepat pada tabel berskala besar.

---

## Tautan Proyek
* **API Server (Backend):** https://inventory-management-api-xsv4.onrender.com

---

## Hak Akses Pengguna (RBAC)
Sistem ini menggunakan Role-Based Access Control (RBAC) dengan tiga peran utama:
* **Super Admin:** Memiliki kontrol penuh atas master data, transaksi inbound/outbound, persetujuan request, laporan, dan manajemen pengguna (CRUD user & role).
* **Admin:** Dapat mengelola operasional gudang dan menyetujui request, tetapi tidak memiliki akses ke fitur manajemen pengguna.
* **User:** Dapat melihat produk, membuat request barang keluar, dan melihat laporan stok serta laporan request milik sendiri.

---

## Teknologi Utama
* **Runtime:** Node.js (Express.js)
* **Database:** PostgreSQL
* **ORM:** Sequelize (Model Define)
* **Autentikasi:** JWT dan bcrypt
* **Penyimpanan File:** Cloudinary dan Multer

---

## Cara Menjalankan Proyek

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek backend di lingkungan lokal Anda:

### 1. Clone Repositori
```bash
git clone https://github.com/nicholas1507/inventory-management-api
cd inventory-management-api
```

### 2. Instal Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment
1. Buat file baru bernama `.env` di root folder proyek.
2. Salin variabel dari file `.env.example` dan sesuaikan nilainya dengan kredensial database lokal Anda.

### 4. Pembuatan Akun & Role Default (Seeding Data)
*Pendaftaran (Register) melalui endpoint API hanya diperuntukkan bagi level **User**. Akun **Super Admin** dan **Admin** wajib dibuat melalui langkah inisialisasi di bawah ini:*

1. Buka file `app.js`.
2. Cari bagian `sequelize.sync()` di paling bawah kode, lalu **hapus tanda komentar (uncomment)** pada kedua fungsi pembuat data awal sekaligus:
   ```javascript
   // Ubah ini:
   // seedRoles();
   // seedUsersAndRoles();
   
   // Menjadi ini:
   seedRoles();
   seedUsersAndRoles();
   ```
3. Jalankan aplikasi di terminal dengan perintah:
   ```bash
   npm run dev
   ```
4. Perhatikan log terminal. Pastikan muncul pesan sukses dari kedua fungsi tersebut (`"Default Role successfully created!"` dan `"Default users and their roles created successfully!"`). 
5. *Catatan:* Jika akun admin gagal mendapatkan *role* pada percobaan pertama karena database lambat, cukup biarkan server melakukan *auto-restart* (Nodemon) atau jalankan ulang perintah `npm run dev` sekali lagi. Kondisi `if` pada fungsi akan otomatis mengamankan datanya agar tidak duplikat.
6. Setelah semua data sukses terbuat, matikan server (`Ctrl + C`) dan **kembalikan kode di `app.js` menjadi komentar (`//`) kembali** agar tidak membebani performa server saat dijalankan di kemudian hari.

### 5. Menjalankan Aplikasi Utama
Setelah data awal berhasil dibuat, Anda bisa menjalankan aplikasi secara normal seperti biasa:
* **Mode Pengembangan (Development):**
  ```bash
  npm run dev
  ```
* **Mode Produksi (Production):**
  ```bash
  npm start
  ```

Aplikasi akan berjalan secara default di `http://localhost:3000`.
