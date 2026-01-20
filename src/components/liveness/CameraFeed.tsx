"use client";

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import { FaceMeshService } from "@/lib/liveness/FaceMeshService";
import { drawFaceMesh } from "@/lib/liveness/drawingUtils";

export interface CameraFeedRef {
    captureFrame: () => string | null;
}

export const CameraFeed = forwardRef<CameraFeedRef>((props, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef<number>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Fix: We don't need to track mounting for this specific hydration fix if we just rely on client-side loading
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []); // Run once on mount

  // ... rest of component


  useImperativeHandle(ref, () => ({
    captureFrame: () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                return canvas.toDataURL("image/jpeg", 0.9);
            }
        }
        return null;
    }
  }));

  useEffect(() => {
    let video: HTMLVideoElement | null = null;

    const startCamera = async () => {
      try {
        const constraints: MediaStreamConstraints = {
            video: {
                facingMode: "user",
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (videoRef.current) {
            video = videoRef.current;
            video.srcObject = stream;
            video.onloadedmetadata = () => {
                video?.play();
                startDetection();
            };
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Camera access denied. Please verify permissions.");
      }
    };

    const startDetection = async () => {
        const service = FaceMeshService.getInstance();
        await service.initialize();
        const landmarker = service.getLandmarker();

        if (!landmarker || !videoRef.current || !canvasRef.current) return;

        // Ensure canvas matches video internal resolution for drawing, but css handles display
    // Ensure canvas matches video internal resolution for drawing
        const syncCanvas = () => {
             if (videoRef.current && canvasRef.current) {
                 canvasRef.current.width = videoRef.current.videoWidth;
                 canvasRef.current.height = videoRef.current.videoHeight;
             }
        }
        videoRef.current.addEventListener('loadeddata', syncCanvas);

        const detect = () => {
             if (videoRef.current && canvasRef.current && landmarker) {
                 const startTimeMs = performance.now();
                 if(videoRef.current.videoWidth > 0) {
                     // Ensure canvas dimensions match video for correct mapping
                     if (canvasRef.current.width !== videoRef.current.videoWidth || 
                         canvasRef.current.height !== videoRef.current.videoHeight) {
                         syncCanvas();
                     }
                     
                     const results = landmarker.detectForVideo(videoRef.current, startTimeMs);
                     const ctx = canvasRef.current.getContext("2d");
                     if (ctx) {
                         ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                         drawFaceMesh(ctx, results);
                     }
                 }
             }
             requestRef.current = requestAnimationFrame(detect);
        };
        detect();
    };

    startCamera();

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      if (video && video.srcObject) {
         const stream = video.srcObject as MediaStream;
         stream.getTracks().forEach(track => track.stop());
      }
      if (video) {
        video.removeEventListener('loadeddata', () => {});
      }
    };
  }, []);

  if (!isMounted) {
      return (
        <div className="relative w-full max-w-[640px] aspect-[4/3] bg-black rounded-lg overflow-hidden mx-auto animate-pulse flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Initializing Camera...</span>
        </div>
      );
  }

  return (
    <div className="relative w-full max-w-[640px] aspect-[4/3] bg-black rounded-lg overflow-hidden mx-auto">
        {error && (
            <div className="absolute inset-0 flex items-center justify-center text-red-500 bg-black/80 z-20 text-center p-4">
                {error}
            </div>
        )}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover transform scale-x-[-1]" 
        playsInline
        muted
        autoPlay
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 transform scale-x-[-1]"
      />
    </div>
  );
});

CameraFeed.displayName = "CameraFeed";
