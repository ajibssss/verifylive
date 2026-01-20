import { FaceLandmarkerResult } from "@mediapipe/tasks-vision";

export const drawFaceMesh = (
  ctx: CanvasRenderingContext2D,
  results: FaceLandmarkerResult
) => {
  if (!results.faceLandmarks) return;

  for (const landmarks of results.faceLandmarks) {
    // Draw red points
    ctx.fillStyle = "#FF0000";
    
    for (const point of landmarks) {
      // Direct mapping: MediaPipe coordinates (0-1) → canvas pixels
      const x = point.x * ctx.canvas.width;
      const y = point.y * ctx.canvas.height;
      
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
};
