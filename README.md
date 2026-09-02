# Undangan Pernikahan — Fatoni & Lia

## Cara pakai
Buka `index.html` di browser (butuh koneksi internet, karena font Google
dan library GSAP/Lenis dimuat dari CDN). Untuk mengirim ke tamu, unggah
seluruh folder ini ke hosting statis (Netlify, Vercel, GitHub Pages, dsb),
lalu bagikan link dengan parameter nama tamu, contoh:

```
https://domainkamu.com/?to=Ahmad
```

## Yang perlu kamu lengkapi sendiri

1. **Musik latar** — taruh file `music.mp3` (instrumental bebas royalti)
   di `assets/audio/music.mp3`. Belum disertakan karena musik berhak
   cipta tidak bisa disediakan otomatis.
2. **Font "Birds of Paradise"** — sudah dibundel di `fonts/BirdsOfParadise.ttf`
   dan dipakai lewat `@font-face` di `style.css` untuk semua teks
   bergaya kaligrafi (nama pengantin, judul section, dsb). Google Fonts
   "Beau Rivage" tetap dimuat sebagai fallback kalau font lokal gagal
   dimuat.
3. **Rekening Wedding Gift** — ganti nama bank & nomor rekening
   placeholder di bagian `.gift__card` pada `index.html` (cari teks
   `(Nama Bank)` dan `0000 0000 0000`), serta atribut `data-account`
   pada tombol "Salin Nomor Rekening".
4. **Link tombol "Kirim Hadiah"** — saat ini `href="#"`, ganti dengan
   link e-wallet/transfer digital pilihanmu.

## Struktur file

```
index.html            struktur semua section
css/style.css          seluruh styling (token warna & tipografi di baris atas)
js/main.js              loader, smooth scroll, animasi, countdown, copy rekening, musik
assets/images/          7 foto yang kamu unggah (sudah dikompres untuk web)
assets/audio/           taruh music.mp3 di sini
```

## Warna & tipografi
Semua token warna (white/ivory/beige/champagne/gold/brown) ada di bagian
`:root` paling atas `css/style.css` — ubah di satu tempat untuk mengganti
seluruh nuansa website.

## Struktur section (urutan sesuai permintaan)
Loading → Cover (foto pasangan duduk) → Nama & Save the Date (foto
bingkai ornamen) → Hero (Bismillah) → QS. Ar-Rum 21 (foto pasangan
berdiri) → Bride & Groom (foto solo) → Countdown → Detail Acara →
Lokasi (Google Maps) → Love Story → Wedding Gift → Penutup → tombol
musik mengambang.

Tidak ada section Gallery, Timeline/Susunan Acara, RSVP, atau Buku Tamu,
sesuai instruksi awal.
