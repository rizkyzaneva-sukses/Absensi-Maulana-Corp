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
