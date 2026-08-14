import { useCallback, useEffect, useState } from 'react';
import { apiHeaders } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import {
  Bell,
  CheckCircle2,
  Copy,
  Loader2,
  Send,
  Unplug,
} from 'lucide-react';

interface ChannelStatus {
  ok: boolean;
  connected: boolean;
  token: string | null;
  chat_id: string | null;
  chat_title: string;
  company_name: string;
  bot_username: string | null;
  bot_configured: boolean;
  connected_at: string | null;
}

interface TelegramChannelCardProps {
  companyId: string;
  companyName: string;
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { ...apiHeaders(), ...init?.headers },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || `Server mengembalikan status ${response.status}.`);
  }
  return data as T;
}

export function TelegramChannelCard({ companyId, companyName }: TelegramChannelCardProps) {
  const [status, setStatus] = useState<ChannelStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [copied, setCopied] = useState(false);
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);

  const loadStatus = useCallback(async () => {
    const data = await requestJson<ChannelStatus>(
      `/api/telegram/channel/status?company_id=${encodeURIComponent(companyId)}`,
    );
    setStatus(data);
    return data;
  }, [companyId]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    loadStatus()
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Gagal memuat status channel.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [loadStatus]);

  useEffect(() => {
    if (!polling || status?.connected) return;
    const interval = setInterval(() => {
      loadStatus()
        .then((data) => {
          if (data.connected) {
            setPolling(false);
            setInfo('Channel berhasil terhubung.');
          }
        })
        .catch(() => {
          // biarkan polling lanjut
        });
    }, 2500);
    return () => clearInterval(interval);
  }, [polling, status?.connected, loadStatus]);

  const handleConnect = async () => {
    setWorking(true);
    setError('');
    setInfo('');
    try {
      const data = await requestJson<ChannelStatus>('/api/telegram/channel/connect', {
        method: 'POST',
        body: JSON.stringify({ company_id: companyId, company_name: companyName }),
      });
      setStatus(data);
      setPolling(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal membuat kode channel.');
    } finally {
      setWorking(false);
    }
  };

  const handleCopy = async () => {
    if (!status?.token) return;
    try {
      await navigator.clipboard.writeText(status.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError('Tidak bisa menyalin kode. Salin manual saja.');
    }
  };

  const handleTest = async () => {
    setWorking(true);
    setError('');
    setInfo('');
    try {
      await requestJson('/api/telegram/channel/test', {
        method: 'POST',
        body: JSON.stringify({ company_id: companyId }),
      });
      setInfo('Pesan tes terkirim ke channel.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengirim pesan tes.');
    } finally {
      setWorking(false);
    }
  };

  const handleReportNow = async () => {
    setWorking(true);
    setError('');
    setInfo('');
    try {
      const report = await requestJson<{ allPresent: boolean; sent: boolean; absences: Array<{ name: string }> }>(
        '/api/telegram/channel/report',
        {
          method: 'POST',
          body: JSON.stringify({ company_id: companyId, company_name: companyName }),
        },
      );
      if (report.allPresent) {
        setInfo('Semua karyawan tercatat masuk. Tidak ada notifikasi yang dikirim.');
      } else if (report.sent) {
        setInfo(`Laporan terkirim: ${report.absences.length} orang tidak masuk / belum absen.`);
      } else {
        setInfo('Laporan sudah dihitung, tapi channel belum bisa dikirimi pesan.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengirim laporan.');
    } finally {
      setWorking(false);
    }
  };

  const handleDisconnect = async () => {
    setWorking(true);
    setError('');
    setInfo('');
    try {
      const data = await requestJson<ChannelStatus>(
        `/api/telegram/channel?company_id=${encodeURIComponent(companyId)}`,
        { method: 'DELETE' },
      );
      setStatus(data);
      setPolling(false);
      setInfo('Channel diputus. Notifikasi otomatis berhenti sampai dihubungkan lagi.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memutus channel.');
    } finally {
      setWorking(false);
    }
  };

  const botMention = status?.bot_username ? `@${status.bot_username}` : 'bot absensi';

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell size={18} /> Channel Telegram Perusahaan
          </CardTitle>
          <CardDescription>
            Satu perusahaan, satu channel. Laporan ketidakhadiran hanya jam 08.30 WIB.
            Kalau tidak ada pesan pagi, artinya semua masuk.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 size={14} className="animate-spin" />
              Memuat status channel...
            </div>
          ) : status?.connected ? (
            <div className="space-y-4">
              <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-sm">Terhubung ke {status.chat_title || 'channel Telegram'}</p>
                  <p className="text-xs mt-1 opacity-80">
                    Setiap hari kerja jam 08.30 WIB bot mengirim siapa yang tidak masuk beserta alasannya.
                    Pengajuan cuti/izin juga masuk ke channel ini.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={handleTest} disabled={working}>
                  {working ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  <span className="ml-1">Kirim tes</span>
                </Button>
                <Button type="button" variant="outline" onClick={handleReportNow} disabled={working}>
                  Kirim laporan sekarang
                </Button>
                <Button type="button" variant="destructive" onClick={() => setConfirmDisconnect(true)} disabled={working}>
                  <Unplug size={14} className="mr-1" />
                  Putuskan
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Buat channel Telegram baru, misalnya “Absensi {companyName}”.</li>
                <li>Tambahkan {botMention} sebagai administrator (boleh posting).</li>
                <li>Klik tombol di bawah untuk mendapat kode.</li>
                <li>Kirim kode itu di channel, lalu tunggu centang hijau.</li>
              </ol>

              {status?.token ? (
                <div className="space-y-3">
                  <div className="rounded-lg border bg-muted/40 p-3">
                    <p className="text-xs text-muted-foreground mb-1">Kirim kode ini di channel</p>
                    <div className="flex items-center gap-2">
                      <code className="text-lg font-semibold tracking-wide">{status.token}</code>
                      <Button type="button" size="sm" variant="outline" onClick={handleCopy}>
                        <Copy size={14} className="mr-1" />
                        {copied ? 'Tersalin' : 'Salin'}
                      </Button>
                    </div>
                  </div>
                  {polling && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 size={14} className="animate-spin" />
                      Menunggu kode dikirim di channel...
                    </div>
                  )}
                  <Button type="button" variant="outline" onClick={handleConnect} disabled={working}>
                    Buat kode baru
                  </Button>
                </div>
              ) : (
                <Button type="button" onClick={handleConnect} disabled={working || status?.bot_configured === false}>
                  {working ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" />
                      Membuat kode...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={14} />
                      Hubungkan Channel
                    </span>
                  )}
                </Button>
              )}

              {status && status.bot_configured === false && (
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  TELEGRAM_BOT_TOKEN belum diatur di server. Channel belum bisa dihubungkan.
                </p>
              )}
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
          {info && <p className="text-sm text-emerald-700 dark:text-emerald-400">{info}</p>}
        </CardContent>
      </Card>

      <ConfirmModal
        open={confirmDisconnect}
        onOpenChange={setConfirmDisconnect}
        title="Putuskan channel Telegram?"
        description="Laporan pagi dan notifikasi cuti/izin berhenti masuk ke channel ini sampai dihubungkan lagi."
        confirmLabel="Putuskan"
        variant="destructive"
        onConfirm={() => {
          void handleDisconnect();
        }}
      />
    </>
  );
}
