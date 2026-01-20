import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export class FaceMeshService {
  private static instance: FaceMeshService;
  private faceLandmarker: FaceLandmarker | null = null;
  private isInitializing = false;

  private constructor() {}

  public static getInstance(): FaceMeshService {
    if (!FaceMeshService.instance) {
      FaceMeshService.instance = new FaceMeshService();
    }
    return FaceMeshService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.faceLandmarker || this.isInitializing) return;

    this.isInitializing = true;
    try {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      this.faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: "GPU"
        },
        outputFaceBlendshapes: true,
        runningMode: "VIDEO",
        numFaces: 1,
        minFaceDetectionConfidence: 0.5,
        minFacePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      console.log("FaceMeshService initialized successfully");
    } catch (error) {
       console.error("Failed to initialize FaceMeshService:", error);
       throw error;
    } finally {
        this.isInitializing = false;
    }
  }

  public getLandmarker(): FaceLandmarker | null {
      return this.faceLandmarker;
  }
}
