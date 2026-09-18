# Deployment realtime

Service aplikasi sekarang menjalankan frontend React dan API Node dalam satu container.

## Environment variable wajib

Tambahkan environment variable berikut pada **service aplikasi** di Easypanel, bukan pada
service PostgreSQL saja:

```env
DATABASE_URL=<Internal Connection URL dari service PostgreSQL>
PORT=3000
API_KEY=<random string untuk melindungi API endpoint>

# Wajib agar fitur "Connect Telegram" & "Lupa Password" (kode dikirim via Telegram) berfungsi
TELEGRAM_BOT_TOKEN=<token dari @BotFather>
```

Setelah `TELEGRAM_BOT_TOKEN` diisi dan service di-redeploy, daftarkan webhook sekali (ganti
`<TOKEN>` dan `<DOMAIN>`):

```
curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<DOMAIN>/api/telegram/webhook"
```

**Penting: webhook hanya boleh didaftarkan pada domain yang benar-benar terdaftar di Traefik
untuk service aplikasi ini.** Kalau domain tujuan tidak terdaftar, Telegram tetap dapat balasan
HTTP 200 (dari proxy/Cloudflare di depan), sehingga `setWebhook` terlihat sukses padahal event
tidak pernah sampai ke aplikasi. Gejalanya: menekan tombol cepat dibalas "Data aksi tidak valid".

Verifikasi domain target sebelum mendaftarkan webhook:

```bash
# Harus menjawab {"ok":true} — balasan asli server aplikasi.
# Kalau menjawab teks "OK" atau HTML, berarti request belum sampai ke aplikasi.
curl -s -X POST https://<DOMAIN>/api/telegram/webhook \
  -H "Content-Type: application/json" -d '{}'
```

Cek domain yang terdaftar pada service:

```bash
grep -n "PathPrefix" /etc/easypanel/traefik/config/main.yaml | grep <nama-service>
```

Jangan batasi `allowed_updates`. Bot perlu menerima `message`, `channel_post`, `my_chat_member`,
dan `callback_query` agar ikat channel, notifikasi, dan tombol ACC cepat jalan.

## Channel Telegram per perusahaan

Satu perusahaan memakai satu channel. Setelah webhook aktif:

1. Buat channel Telegram baru (contoh: `Absensi ELYASR`).
2. Tambahkan bot sebagai administrator dengan izin posting.
3. Di aplikasi buka **Pengaturan → Notifikasi**, klik **Hubungkan Channel**.
4. Kirim kode `ABSEN-XXXXXXXX` di channel itu.

Bot mengirim dua jenis pesan ke channel:

- **Jam 08.30 WIB** (hari kerja, Senin–Sabtu): siapa yang tidak masuk beserta alasan cuti/izin/sakit, atau "belum absen". Jika semua masuk, **tidak ada pesan**.
- **Saat ada pengajuan cuti/izin**, plus saat pengajuan disetujui atau ditolak.

Minggu dilewati. Restart server antara 08.30–08.34 WIB masih mengejar laporan hari itu.

Gunakan internal URL karena kedua service berada dalam project/environment Easypanel yang
sama. Jangan menaruh URL tersebut di source code atau variable Vite (`VITE_*`), karena itu
akan membocorkan password ke browser.

Setelah environment variable disimpan, redeploy service aplikasi. Startup pertama otomatis
membuat tabel dan index. Saat browser pertama kali membuka versi baru, cache localStorage
yang lama diimpor dengan `ON CONFLICT DO NOTHING`; sesudah itu semua perubahan dikirim ke
PostgreSQL dan disebarkan ke perangkat aktif melalui Server-Sent Events.

Tabel sinkronisasi memakai awalan `app_sync_` agar aman berdampingan dengan tabel lama yang
mungkin sudah ada di database.

Container aplikasi sekarang membuka port `3000`. Bila domain/proxy service sebelumnya diatur
manual ke port Nginx `80`, ubah target port-nya menjadi `3000` sebelum redeploy.

Endpoint pemeriksaan setelah deploy:

```text
GET /api/health
```

Respons sehat berbentuk `{"ok":true,"instanceId":"..."}`.
