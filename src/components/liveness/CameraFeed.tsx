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
    let isActive = true;
    let frameId: number;
    let video: HTMLVideoElement | null = null;

    const startCamera = async () => {
      try {
        // Detect device type
        const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
        
        const constraints: MediaStreamConstraints = {
            video: {
                facingMode: "user",
                width: { ideal: isMobile ? 720 : 1280 },
                height: { ideal: isMobile ? 1280 : 720 }
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
        
        if (!isActive) return;

        const landmarker = service.getLandmarker();

        if (!landmarker || !videoRef.current || !canvasRef.current) return;

        // CRITICAL: Sync canvas dimensions with video
        const syncCanvasDimensions = () => {
             if (videoRef.current && canvasRef.current) {
                 const video = videoRef.current;
                 canvasRef.current.width = video.videoWidth;
                 canvasRef.current.height = video.videoHeight;
             }
        };

        let lastVideoTime = -1;
        const detect = () => {
             if (!isActive) return;

             if (videoRef.current && canvasRef.current && landmarker) {
                 const video = videoRef.current;
                 
                 if (video.readyState >= 2 && video.videoWidth > 0 && !video.paused) {
                      const startTimeMs = performance.now();
                     
                     // Ensure monotonic timestamp
                     if (startTimeMs > lastVideoTime && startTimeMs - lastVideoTime > 33) {
                         lastVideoTime = startTimeMs;
                         
                         // Sync canvas dimensions every frame
                         syncCanvasDimensions();
                         
                         const ctx = canvasRef.current.getContext("2d");
                         if (ctx) {
                             // Clear canvas
                             ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                             try {
                                 const results = landmarker.detectForVideo(video, startTimeMs);
                                 
                                 // Draw face mesh with direct coordinate mapping
                                 drawFaceMesh(ctx, results);
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
      isActive = false;
      clearTimeout(timer);
      cancelAnimationFrame(frameId);
      
      if (video && video.srcObject) {
         const stream = video.srcObject as MediaStream;
         stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  if (!isMounted) {
      return (
        <div className="relative w-full max-w-[min(90vw,640px)] aspect-video bg-black rounded-lg overflow-hidden mx-auto animate-pulse flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Initializing Camera...</span>
        </div>
      );
  }

  return (
    <div className="relative w-full max-w-[min(90vw,640px)] aspect-video bg-black rounded-lg overflow-hidden mx-auto">
        {error && (
            <div className="absolute inset-0 flex items-center justify-center text-red-500 bg-black/80 z-20 text-center p-4">
                {error}
            </div>
        )}
      {/* Hidden video - source for MediaPipe */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-contain opacity-0 pointer-events-none"
        playsInline
        muted
        autoPlay
      />
      {/* Visible canvas - shows detection overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-contain"
      />
    </div>
  );
});

CameraFeed.displayName = "CameraFeed";
