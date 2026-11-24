# CardioDose — GitHub Pages

Aplikasi web statis untuk menginput data pasien, menampilkan tabel kalkulasi berdasarkan formula spreadsheet sumber, dan mencetak lembar kerja A4.

## File
- `index.html` — struktur aplikasi dan form pasien.
- `style.css` — tampilan responsif dan layout cetak satu lembar A4 portrait.
- `app.js` — kalkulasi sisi browser dan pembuatan tabel cetak.

## Deploy ke GitHub Pages
1. Buat repository baru di GitHub, misalnya `cardiodose`.
2. Unggah `index.html`, `style.css`, dan `app.js` ke root repository.
3. Buka **Settings → Pages**.
4. Pada **Build and deployment**, pilih **Deploy from a branch**.
5. Pilih branch `main` dan folder `/ (root)`, lalu klik **Save**.
6. Tunggu proses publikasi. URL akan berbentuk `https://USERNAME.github.io/cardiodose/`.

Siapa pun yang memiliki URL dapat membuka aplikasi. Tidak ada login, backend, atau database.

## Privasi
- Data pasien diproses di browser pengguna.
- Tidak ada API, analytics, database, atau mekanisme pengiriman data pada kode ini.
- Data tidak disimpan setelah halaman ditutup atau dimuat ulang.
- Repository GitHub Pages bersifat publik; jangan menambahkan data pasien nyata ke file kode atau repository.
- Untuk penggunaan klinis, ikuti kebijakan privasi, keamanan informasi, dan persetujuan rumah sakit. Hindari memasukkan identitas pasien nyata pada perangkat/jaringan yang tidak disetujui.

## Formula workbook yang ditranskripsikan
Formula yang diimplementasikan berasal dari sel pada workbook yang diberikan:
- Dopamin dan Dobutamin: dosis × 60 × BB / 5.000
- Noradrenalin 0,1 mg/cc: dosis × 60 × BB / 100.000
- Noradrenalin 0,05 mg/cc: dosis × 60 × BB / 50.000
- Noradrenalin 0,0125 mg/cc: dosis × 60 × BB / 12.500
- Milrinon 0,2 mg/cc: dosis × 60 × BB / 200
- Nitrocyn 0,5 mg/cc: dosis × 60 / 500
- Adrenalin 0,05 mg/cc: dosis × 60 × BB / 50.000
- Adrenalin 0,0125 mg/cc: dosis × 60 × BB / 12.500
- Heparin: 4 × BB × 100; volume dihitung pada konsentrasi 1.000 unit/mL sebagaimana catatan sumber.
- Milrinon loading: formula sel sumber `BB × 50 × 6 / 200`; label dosis/waktu pada workbook perlu dikonfirmasi.
- Transamin: tahap awal `50 × BB` mg dalam 30 menit; lanjutan `4 × BB` mg/jam, sesuai formula workbook.
- Protamin: `4 × BB` mg.
- Precedex: `BB × angka dosis / 4`; satuan angka dosis perlu dikonfirmasi.

## Batasan dan validasi
Ini adalah implementasi awal atas formula workbook, bukan validasi klinis atau rekomendasi dosis. Beberapa label/satuan pada sumber perlu ditinjau oleh dokter anestesi/perawat anestesi berwenang dan farmasi, terutama:
- Interpretasi formula dan label loading Milrinon.
- Satuan pada kolom Precedex.
- Konsentrasi aktual dan pengenceran tiap sediaan.
- Rumus dan fase pemberian Transamin.
- Konsistensi satuan dosis tabel vasoaktif.
- Rentang dosis, batas maksimum, kontraindikasi, dan penyesuaian fungsi organ yang belum tersedia di workbook.

Sebelum digunakan pada pelayanan pasien, lakukan verifikasi independen terhadap sumber resmi, formularium, label produk, protokol rumah sakit, dan persetujuan tata kelola klinis. Aplikasi ini tidak menggantikan instruksi klinis, penilaian profesional, maupun double-check obat.

## Cetak
Tekan **Cetak / Simpan PDF A4 portrait** di halaman. Pada dialog cetak, pilih kertas A4, orientasi portrait, dan skala default atau sesuaikan bila diperlukan. Browser menyediakan opsi simpan sebagai PDF.
