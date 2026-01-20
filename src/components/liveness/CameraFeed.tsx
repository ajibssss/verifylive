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
  const [isMounted, setIsMounted] = useState(false);

  // Removed standalone effect as it's merged into the main one to coordinate cleanup
  // useEffect(() => {
  //   const timer = setTimeout(() => setIsMounted(true), 0);
  //   return () => clearTimeout(timer);
  // }, []);

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
    let isActive = true; // Flag to prevent orphaned loops
    let frameId: number;
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
        
        if (!isActive) {
            stream.getTracks().forEach(track => track.stop());
            return;
        }

        if (videoRef.current) {
            video = videoRef.current;
            video.srcObject = stream;
            video.onloadedmetadata = () => {
                if (isActive) {
                    video?.play();
                    startDetection();
                }
            };
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        if (isActive) setError("Camera access denied. Please verify permissions.");
      }
    };

    const startDetection = async () => {
        const service = FaceMeshService.getInstance();
        await service.initialize();
        
        if (!isActive) return; // Stop if unmounted during await

        const landmarker = service.getLandmarker();

        if (!landmarker || !videoRef.current || !canvasRef.current) return;

        // Ensure canvas matches video internal resolution for drawing
        const syncCanvas = () => {
             if (videoRef.current && canvasRef.current) {
                 canvasRef.current.width = videoRef.current.videoWidth;
                 canvasRef.current.height = videoRef.current.videoHeight;
             }
        }
        
        // CRITICAL: Sync canvas immediately before starting detection loop
        syncCanvas();
        videoRef.current.addEventListener('loadeddata', syncCanvas);

        let lastVideoTime = -1;
        const detect = () => {
             if (!isActive) return; // Stop loop if unmounted

             if (videoRef.current && canvasRef.current && landmarker) {
                 const video = videoRef.current;
                 // standard check for video readiness
                 if (video.readyState >= 2 && video.videoWidth > 0 && !video.paused) {
                      const startTimeMs = performance.now();
                     
                     // Ensure monotonic timestamp increase to prevent WASM crash
                     if (startTimeMs > lastVideoTime && startTimeMs - lastVideoTime > 33) {
                         lastVideoTime = startTimeMs;
                         
                         // Ensure canvas dimensions match video for correct mapping
                         if (canvasRef.current.width !== video.videoWidth || 
                             canvasRef.current.height !== video.videoHeight) {
                             syncCanvas();
                         }
                         
                         const ctx = canvasRef.current.getContext("2d");
                         if (ctx) {
                             // Draw mirrored video frame 
                             ctx.save();
                             ctx.scale(-1, 1);
                             ctx.drawImage(video, -canvasRef.current.width, 0, canvasRef.current.width, canvasRef.current.height);
                             ctx.restore();

                             try {
                                 const results = landmarker.detectForVideo(video, startTimeMs);
                                 // Draw mirrored face mesh points
                                 drawFaceMesh(ctx, results, true);
                             } catch (err) {
                                 console.warn("Frame processing skipped:", err);
                             }
                         }
                     }
                 }
             }
             frameId = requestAnimationFrame(detect);
        };
        detect();
    };

    const timer = setTimeout(() => setIsMounted(true), 0);
    startCamera();

    return () => {
      isActive = false; // Kill any pending async assignments or loops
      clearTimeout(timer);
      cancelAnimationFrame(frameId); // Kill the loop
      
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
        <div className="relative w-full max-w-[640px] aspect-video bg-black rounded-lg overflow-hidden mx-auto animate-pulse flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Initializing Camera...</span>
        </div>
      );
  }

  return (
    <div className="relative w-full max-w-[640px] aspect-video bg-black rounded-lg overflow-hidden mx-auto">
        {error && (
            <div className="absolute inset-0 flex items-center justify-center text-red-500 bg-black/80 z-20 text-center p-4">
                {error}
            </div>
        )}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-contain opacity-0" 
        playsInline
        muted
        autoPlay
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none z-10"
      />
    </div>
  );
});

CameraFeed.displayName = "CameraFeed";
