# VerifyLive 🛡️

![CI Status](https://github.com/AIExxplorer/verifylive/actions/workflows/ci-quality.yml/badge.svg)

> **Competidor do HACKATHON DO GEMINI 3** 🏆
> _Biometric Liveness Detection & Anti-Deepfake System powered by Gemini 3 Multimodal._
> _Compliance with LGPD & Lei Felca._

```text
   █████╗ ██╗███████╗██╗  ██╗██╗  ██╗
   ██╔══██╗██║██╔════╝╚██╗██╔╝╚██╗██╔╝
   ███████║██║█████╗   ╚███╔╝  ╚███╔╝
   ██╔══██║██║██╔══╝   ██╔██╗  ██╔██╗
   ██║  ██║██║███████╗██╔╝ ██╗██╔╝ ██╗
   ╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝
```

![License](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-15+-black)
![Gemini 3](https://img.shields.io/badge/AI-Gemini%203-4285F4)
![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E)

## 🏗️ Project Overview

**VerifyLive** is a forensic-grade biometric verification system built for the **Gemini 3 Hackathon**. It leverages the Action Era capabilities of the **Gemini 3 Multimodal API** to perform deep semantic reasoning on video streams, detecting deepfakes and ensuring liveness in real-time.

### 🎯 Hackathon Theme Alignment

This project aligns with the **Action Era** and **Omni-Agent** themes by:

- **Native Multimodality**: Processing live video/audio streams directly through Gemini 3.
- **Thought Signatures**: Providing explainable forensic reasoning for every liveness decision.
- **Human-AI Synergy**: Empowering compliance auditors with AI-generated forensic reports.

## 🛠️ Technical Stack & Architecture

### Core AI (Gemini 3)

- **Model**: `gemini-2.0-flash-thinking-exp` (or latest Gemini 3 variant).
- **Capabilities**: Vision reasoning, Deepfake detection, Contextual awareness.
- **Orchestration**: **Context7 MCP**.

### Vision & Liveness

- **Client-Side**: MediaPipe (Zero Latency Landmark Detection).
- **Server-Side**: Google Cloud Vision API (OCR & Verification).

### Infrastructure

- **Frontend**: Next.js 15+ (App Router, Server Actions).
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions).
- **Compliance**: Google Cloud Logging (Immutable Audit Trails).

## 🛡️ Compliance & Ethics

### Lei Felca (Child Safety)

- **Automatic Age Detection**: Users under 16 are automatically flagged.
- **Guardian Consensus**: Verification flows for minors are blocked without explicit guardian tokens.
- **Audit Trails**: All age-check decisions are cryptographically signed and logged.

### LGPD (Privacy)

- **Data Minimization**: Only essential biometric features are processed.
- **Auto-TTL**: Raw video data is automatically deleted from Cloud Storage after 24 hours.
- **Encryption**: AES-256 encryption at rest and TLS 1.3 in transit.

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Google Cloud Project with Vertex AI enabled
- Supabase Project

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/AIExxplorer/verifylive.git
    cd verifylive
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Environment Setup**
    Copy `.env.example` to `.env.local` and fill in your keys:

    ```bash
    cp .env.example .env.local
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 🎥 Demo & Submission

- **Video Demo**: [Link to YouTube/Vimeo Demo] (Coming Soon)
- **Live Demo**: [Live on Vercel](https://verifylive-d9wtmei7g-wagnerrafael.vercel.app)
- **Devpost Submission**: [Link to Devpost]

## 🤝 Contributing

This project uses **Husky** for git hooks and **Commitlint** for conventional commits.
Please ensure your commit messages follow the standard: `feat: message`, `fix: message`, etc.

## 📝 License

Released under the [MIT License](LICENSE).

---

_Built for Gemini 3 Hackathon by VerifyLive Team._
