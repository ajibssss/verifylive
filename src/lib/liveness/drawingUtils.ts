import { FaceLandmarkerResult } from "@mediapipe/tasks-vision";

export const drawFaceMesh = (
  ctx: CanvasRenderingContext2D,
  results: FaceLandmarkerResult,
  videoElement: HTMLVideoElement
) => {
  if (!results.faceLandmarks) return;

  // Get actual video dimensions
  const videoWidth = videoElement.videoWidth;
  const videoHeight = videoElement.videoHeight;
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;

  // Calculate aspect ratios
  const videoAspect = videoWidth / videoHeight;
  const canvasAspect = canvasWidth / canvasHeight;

  let scaleX, scaleY, offsetX, offsetY;

  if (videoAspect > canvasAspect) {
    // Video is wider - will be pillarboxed (black bars on sides)
    scaleY = canvasHeight / videoHeight;
    scaleX = scaleY;
    offsetX = (canvasWidth - videoWidth * scaleX) / 2;
    offsetY = 0;
  } else {
    // Video is taller - will be letterboxed (black bars on top/bottom)
    scaleX = canvasWidth / videoWidth;
    scaleY = scaleX;
    offsetX = 0;
    offsetY = (canvasHeight - videoHeight * scaleY) / 2;
  }

  for (const landmarks of results.faceLandmarks) {
    ctx.fillStyle = "#FF0000";
    
    for (const point of landmarks) {
      // Transform MediaPipe normalized coordinates to canvas pixels
      // accounting for aspect ratio differences
      const x = point.x * videoWidth * scaleX + offsetX;
      const y = point.y * videoHeight * scaleY + offsetY;
      
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
};

