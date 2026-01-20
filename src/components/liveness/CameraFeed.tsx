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
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        });

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
        setError("Could not access camera. Please allow permission.");
      }
    };

    const startDetection = async () => {
        const service = FaceMeshService.getInstance();
        await service.initialize();
        const landmarker = service.getLandmarker();

        if (!landmarker || !videoRef.current || !canvasRef.current) return;

        const detect = () => {
             if (videoRef.current && canvasRef.current && landmarker) {
                 const startTimeMs = performance.now();
                 // Only detect if video has enough data
                 if(videoRef.current.videoWidth > 0) {
                     const results = landmarker.detectForVideo(videoRef.current, startTimeMs);
                     const ctx = canvasRef.current.getContext("2d");
                     if (ctx) {
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
    };
  }, []);

  return (
    <div className="relative w-[640px] h-[480px] bg-black rounded-lg overflow-hidden">
        {error && (
            <div className="absolute inset-0 flex items-center justify-center text-red-500 bg-black/80 z-20">
                {error}
            </div>
        )}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        playsInline
        muted
        autoPlay
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
        width={640}
        height={480}
      />
    </div>
  );
});

CameraFeed.displayName = "CameraFeed";
