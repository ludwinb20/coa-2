import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';

interface QRCodeGeneratorProps {
    text: string;
    size?: number;
    darkColor?: string;
    lightColor?: string;
    className?: string;
}

const QRCodeGenerator = ({ 
    text,
    size = 200,
    darkColor = '#000000',
    lightColor = '#ffffff',
    className = ''
}: QRCodeGeneratorProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const generateQR = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const canvas = canvasRef.current;
            if (canvas) {
                await QRCode.toCanvas(canvas, text, {
                    width: size,
                    margin: 2,
                    color: {
                        dark: darkColor,
                        light: lightColor
                    },
                    errorCorrectionLevel: 'H'
                });
            }
        } catch (err) {
            setError('Error al generar el código QR');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const downloadQR = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'qr-code.png';
            link.href = url;
            link.click();
        }
    };

    useEffect(() => {
        generateQR();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text, size, darkColor, lightColor]);

    return (
        <Card className={`p-6 ${className}`}>
            <div className="flex flex-col items-center gap-4">
                {isLoading && (
                    <div className="flex items-center justify-center w-full h-[200px]">
                        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                    </div>
                )}
                
                {error && (
                    <div className="text-red-500 text-center">
                        {error}
                        <Button 
                            variant="outline" 
                            className="mt-2"
                            onClick={generateQR}
                        >
                            Reintentar
                        </Button>
                    </div>
                )}

                <canvas 
                    ref={canvasRef} 
                    className={`rounded-lg ${isLoading ? 'hidden' : 'block'}`}
                />

                {!isLoading && !error && (
                    <Button 
                        onClick={downloadQR}
                        className="mt-2"
                        variant="outline"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Descargar QR
                    </Button>
                )}
            </div>
        </Card>
    );
};

export default QRCodeGenerator;