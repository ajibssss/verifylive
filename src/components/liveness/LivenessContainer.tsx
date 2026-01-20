"use client";

import { useRef, useState } from "react";
import { CameraFeed, CameraFeedRef } from "@/components/liveness/CameraFeed";
import { verifyLiveness } from "@/app/actions/verifyLiveness";
import type { LivenessResult } from "@/app/actions/verifyLiveness";

export function LivenessContainer() {
  const cameraRef = useRef<CameraFeedRef>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<LivenessResult | null>(null);
  const [step, setStep] = useState(0);
  const [frames, setFrames] = useState<string[]>([]);

  const CHALLENGES = [
      { title: "Neutral Face", instruction: "Look directly at the camera with a neutral expression." },
      { title: "Turn Right", instruction: "Turn your face slightly to the right." },
      { title: "Smile", instruction: "Smile widely showing your teeth." },
      { title: "Zoom In", instruction: "Move your face closer to the camera." },
      { title: "Proof of Possession", instruction: "Hold a document or hand next to your face." }
  ];

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    const frame = cameraRef.current.captureFrame();
    if (!frame) {
        alert("Could not capture frame. Ensure camera is active.");
        return;
    }

    const newFrames = [...frames, frame];
    setFrames(newFrames);

    if (step < CHALLENGES.length - 1) {
        // Move to next challenge
        setStep(prev => prev + 1);
    } else {
        // All challenges completed, verify
        await executeVerification(newFrames);
    }
  };

  const executeVerification = async (capturedFrames: string[]) => {
    setIsVerifying(true);
    setResult(null);

    try {
        const data = await verifyLiveness(capturedFrames);
        setResult(data);
    } catch (error) {
        console.error(error);
        alert("Verification failed. See console.");
    } finally {
        setIsVerifying(false);
    }
  };

  const resetFlow = () => {
    setResult(null);
    setStep(0);
    setFrames([]);
  };

  const currentChallenge = CHALLENGES[step];
  const progress = ((step + 1) / CHALLENGES.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 pb-40 overflow-y-auto">
      <div className="w-full max-w-2xl text-center space-y-4">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-chart-1">
          VerifyLive Check
        </h1>
        
        {!result && (
             <div className="space-y-1">
                <h2 className="text-xl font-semibold text-primary">{currentChallenge.title}</h2>
                <p className="text-muted-foreground text-sm">{currentChallenge.instruction}</p>
                <div className="w-full bg-secondary h-2 rounded-full mt-2 overflow-hidden">
                    <div className="bg-primary h-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-xs text-muted-foreground pt-1">Step {step + 1} of {CHALLENGES.length}</p>
            </div>
        )}

        <div className="relative mx-auto border-2 border-border rounded-xl overflow-hidden shadow-2xl shadow-primary/20 bg-card">
             <CameraFeed ref={cameraRef} />
             
             {isVerifying && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-30">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-primary font-mono text-sm animate-pulse">Forensic Analysis in Progress...</span>
                    </div>
                </div>
             )}

            {result && (
                <div className={`absolute inset-0 flex flex-col items-center justify-center z-30 bg-background/95 p-6 text-center ${result.is_real ? 'text-chart-2' : 'text-destructive'}`}>
                    <div className="text-4xl mb-4">{result.is_real ? '✅' : '🚫'}</div>
                    <h2 className="text-2xl font-bold mb-2">{result.is_real ? 'REAL PERSON' : 'POTENTIAL SPOOF'}</h2>
                    <p className="text-foreground mb-4 text-sm max-w-md">{result.reasoning}</p>
                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                        {result.anomalies.map((a: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded border border-border">{a}</span>
                        ))}
                    </div>
                     <button
                        onClick={resetFlow}
                        className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-full hover:opacity-90 transition-opacity"
                    >
                        New Verification
                    </button>
                </div>
             )}
        </div>

        <div className="flex flex-col items-center gap-4 mt-6">
            {!result && (
                <button
                    onClick={handleCapture}
                    disabled={isVerifying}
                    className="group relative px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold text-lg shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="flex items-center gap-2">
                       {isVerifying ? 'Processing...' : (step === CHALLENGES.length - 1 ? 'Finish & Verify' : 'Capture & Next')}
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
