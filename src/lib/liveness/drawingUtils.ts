import { FaceLandmarkerResult } from "@mediapipe/tasks-vision";

export const drawFaceMesh = (
  ctx: CanvasRenderingContext2D,
  results: FaceLandmarkerResult
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (results.faceLandmarks) {
    for (const landmarks of results.faceLandmarks) {
      // Draw points
      ctx.fillStyle = "#FF0000";
      for (const point of landmarks) {
        ctx.beginPath();
        ctx.arc(point.x * ctx.canvas.width, point.y * ctx.canvas.height, 1, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }
};
