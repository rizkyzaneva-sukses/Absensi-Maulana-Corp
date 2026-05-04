import { useRef, useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, RotateCcw, Check, X } from 'lucide-react';

interface SelfieCaptureProps {
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
}

export function SelfieCapture({ onCapture, onClose }: SelfieCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [captured, setCaptured] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch {
      setError('Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.');
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Mirror the image (front camera)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCaptured(dataUrl);
  };

  const handleRetake = () => {
    setCaptured(null);
    startCamera();
  };

  const handleConfirm = () => {
    if (captured) {
      onCapture(captured);
    }
  };

  const handleClose = () => {
    stream?.getTracks().forEach((track) => track.stop());
    onClose();
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-red-500 mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={handleClose}>
              Tutup
            </Button>
            <Button onClick={startCamera}>Coba Lagi</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-medium flex items-center gap-2">
            <Camera size={18} /> Ambil Selfie
          </p>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X size={16} />
          </Button>
        </div>

        <div className="relative rounded-lg overflow-hidden bg-black aspect-[4/3]">
          {!captured ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
          ) : (
            <img src={captured} alt="Selfie" className="w-full h-full object-cover" />
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="flex gap-2">
          {!captured ? (
            <Button onClick={handleCapture} className="flex-1 gap-2">
              <Camera size={16} /> Ambil Foto
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleRetake} className="flex-1 gap-2">
                <RotateCcw size={16} /> Ulangi
              </Button>
              <Button onClick={handleConfirm} className="flex-1 gap-2">
                <Check size={16} /> Gunakan Foto
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
