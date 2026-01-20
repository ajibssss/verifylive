"use client";

import { useRef, useState } from "react";
import { CameraFeed, CameraFeedRef } from "@/components/liveness/CameraFeed";
import { verifyLiveness, LivenessResult } from "@/app/actions/verifyLiveness";

export function LivenessContainer() {
  const cameraRef = useRef<CameraFeedRef>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<LivenessResult | null>(null);

  const handleVerify = async () => {
    if (!cameraRef.current) return;

    const frame = cameraRef.current.captureFrame();
    if (!frame) {
        alert("Could not capture frame. Please ensure camera is active.");
        return;
    }

    setIsVerifying(true);
    setResult(null);

    try {
        const data = await verifyLiveness(frame);
        setResult(data);
    } catch (error) {
        console.error(error);
        alert("Verification failed. See console.");
    } finally {
        setIsVerifying(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 pb-40 overflow-y-auto">
      <div className="w-full max-w-2xl text-center space-y-4">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-chart-1">
          VerifyLive Check
        </h1>
        <p className="text-muted-foreground text-sm">
          Position your face in the frame. We process everything locally.
        </p>

        <div className="relative mx-auto border-2 border-border rounded-xl overflow-hidden shadow-2xl shadow-primary/20 bg-card">
             <CameraFeed ref={cameraRef} />
             
             {isVerifying && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-30">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-primary font-mono text-sm animate-pulse">Contacting Gemini 3...</span>
                    </div>
                </div>
             )}

            {result && (
                <div className={`absolute inset-0 flex flex-col items-center justify-center z-30 bg-background/95 p-6 text-center ${result.is_real ? 'text-chart-2' : 'text-destructive'}`}>
                    <div className="text-4xl mb-4">{result.is_real ? '✅' : '🚫'}</div>
                    <h2 className="text-2xl font-bold mb-2">{result.is_real ? 'REAL PERSON' : 'POTENTIAL SPOOF'}</h2>
                    <p className="text-foreground mb-4 text-sm max-w-md">{result.reasoning}</p>
                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                        {result.anomalies.map((a, i) => (
                            <span key={i} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded border border-border">{a}</span>
                        ))}
                    </div>
                     <button
                        onClick={() => setResult(null)}
                        className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-full hover:opacity-90 transition-opacity"
                    >
                        Scan Again
                    </button>
                </div>
             )}
        </div>

        <div className="flex flex-col items-center gap-4 mt-6">
            {!result && (
                <button
                    onClick={handleVerify}
                    disabled={isVerifying}
                    className="group relative px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold text-lg shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="flex items-center gap-2">
                       {isVerifying ? 'Analyzing...' : 'Verify Liveness'}
                    </span>
                    <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all"></div>
                </button>
            )}

            <div className="flex justify-center gap-4 text-xs font-mono text-muted-foreground">
                <div className="flex items-center gap-1">
                    <span className="text-chart-2">●</span> Secure Enclave
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-chart-4">●</span> FaceMesh Active
                </div>
                 <div className="flex items-center gap-1">
                    <span className="text-chart-5">●</span> Gemini 3 Ready
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
