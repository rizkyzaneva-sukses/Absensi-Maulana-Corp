import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Loader2, Check, X, AlertTriangle } from 'lucide-react';
import { getCurrentPosition, validateLocation, type GeoValidationResult } from '@/lib/geo';
import type { Location as AppLocation } from '@/types';

interface LocationValidatorProps {
  locations: AppLocation[];
  isDinasLuar?: boolean;
  onValidated: (result: GeoValidationResult) => void;
}

export function LocationValidator({ locations, isDinasLuar, onValidated }: LocationValidatorProps) {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<GeoValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    setChecking(true);
    setError(null);

    try {
      const position = await getCurrentPosition();
      const validationResult = validateLocation(
        position.coords.latitude,
        position.coords.longitude,
        locations
      );
      setResult(validationResult);
      onValidated(validationResult);
    } catch (err: unknown) {
      const geoError = err as GeolocationPositionError;
      let status: GeoValidationResult['status'] = 'GPS_ERROR';
      let errorMsg = 'Gagal mendapatkan lokasi GPS';

      if (geoError.code === 1) {
        status = 'GPS_DISABLED';
        errorMsg = 'Akses GPS ditolak. Silakan aktifkan GPS di pengaturan browser.';
      } else if (geoError.code === 2) {
        errorMsg = 'Posisi tidak tersedia. Pastikan GPS aktif.';
      } else if (geoError.code === 3) {
        errorMsg = 'Waktu permintaan GPS habis. Coba lagi.';
      }

      setError(errorMsg);
      const failResult: GeoValidationResult = {
        status,
        location: null,
        distance: null,
        nearestLocation: null,
      };
      setResult(failResult);
      onValidated(failResult);
    } finally {
      setChecking(false);
    }
  };

  // Auto-validate for dinas luar
  useEffect(() => {
    if (isDinasLuar) {
      const bypassResult: GeoValidationResult = {
        status: 'VALID_RADIUS',
        location: null,
        distance: null,
        nearestLocation: null,
      };
      setResult(bypassResult);
      onValidated(bypassResult);
    }
  }, [isDinasLuar]);

  if (isDinasLuar) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
            <MapPin size={20} />
            <div>
              <p className="font-medium">Dinas Luar</p>
              <p className="text-sm text-muted-foreground">Validasi lokasi dilewati untuk dinas luar</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-primary" />
          <div>
            <p className="font-medium">Validasi Lokasi</p>
            <p className="text-sm text-muted-foreground">
              {locations.length} lokasi terdaftar
            </p>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="w-full h-40 rounded-lg bg-muted flex items-center justify-center">
          {checking ? (
            <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
          ) : result ? (
            <div className="text-center">
              {result.status === 'VALID_RADIUS' ? (
                <Check className="w-12 h-12 text-emerald-500 mx-auto" />
              ) : (
                <X className="w-12 h-12 text-red-500 mx-auto" />
              )}
              {result.distance !== null && (
                <p className="text-sm text-muted-foreground mt-1">
                  Jarak: {result.distance}m dari {result.nearestLocation?.name}
                </p>
              )}
            </div>
          ) : (
            <div className="text-center">
              <MapPin className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Klik tombol untuk cek lokasi</p>
            </div>
          )}
        </div>

        {/* Status */}
        {result && (
          <div
            className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium ${
              result.status === 'VALID_RADIUS'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                : result.status === 'OUT_OF_RADIUS'
                ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
            }`}
          >
            {result.status === 'VALID_RADIUS' ? (
              <>
                <Check size={16} />
                Dalam radius {result.nearestLocation?.name} ({result.distance}m)
              </>
            ) : result.status === 'OUT_OF_RADIUS' ? (
              <>
                <AlertTriangle size={16} />
                Di luar radius ({result.distance}m dari {result.nearestLocation?.name})
              </>
            ) : (
              <>
                <X size={16} />
                {error || 'GPS tidak tersedia'}
              </>
            )}
          </div>
        )}

        {!result && (
          <Button onClick={handleCheck} disabled={checking} className="w-full">
            {checking ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Mengecek lokasi...
              </>
            ) : (
              'Cek Lokasi Saya'
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
