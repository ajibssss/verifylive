# VerifyLive 🛡️

> **Biometric Liveness Detection & Anti-Deepfake System powered by Gemini 3 Multimodal.**
> _Compliance with LGPD & Lei Felca._

![License](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-15+-black)
![Gemini 3](https://img.shields.io/badge/AI-Gemini%203-4285F4)
![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E)

## 📋 Project Overview

**VerifyLive** is a forensic-grade biometric verification system designed for the **Gemini 3 Hackathon**. It leverages Google's **Gemini 3 Multimodal** API to perform deep semantic analysis of video streams, ensuring liveness and detecting deepfakes with explainable AI reasoning.

The system is architected to be fully compliant with **LGPD** (General Data Protection Law) and **Lei Felca** (Child Protection), ensuring privacy-by-design and rigorous audit trails.

## 🏗️ Technical Stack

### Core AI & Vision

- **Gemini 3 Multimodal**: Primary forensic engine for deepfake detection and logic reasoning.
- **MediaPipe**: Real-time browser-side facial landmark detection (Zero Latency).
- **Google Cloud Vision API**: OCR and face matching verification.

### Frontend

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, Server Actions).
- **Styling**: Tailwind CSS (v4).
- **State/Orchestration**: **Context7 MCP** (Mandatory context orchestration).

### Backend & Infrastructure

- **Database/Auth**: [Supabase](https://supabase.com/).
- **Orchestration Layer**: Supabase Edge Functions.
- **Storage**: Google Cloud Storage (with 24h Auto-Delete TTL).
- **Audit Logs**: Google Cloud Logging (Immutable records).
- **AI Gateway**: Google Cloud Vertex AI.

## 📐 Architecture

The system follows a decoupled security-first architecture:

1.  **Client (Web)**: Captures signed WebRTC streams. Performs initial passive liveness checks via MediaPipe.
2.  **Orchestrator (Edge)**: Receives signed payloads, validates sessions, and routes to AI services.
3.  **Forensic Engine (Gemini 3)**: Analyzes video frames + prompt context to determine liveness (`is_real_person`) and fraud probability.
4.  **Audit Layer**: Every verification attempt is logged immutably for legal compliance (Lei Felca).

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

    _Required Keys:_
    - `NEXT_PUBLIC_GEMINI_API_KEY`
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `GOOGLE_CLOUD_PROJECT_ID`
    - `CONTEXT7_API_KEY`

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## 🤝 Contributing

This project uses **Husky** for git hooks and **Commitlint** for conventional commits.
Please ensure your commit messages follow the standard: `feat: message`, `fix: message`, etc.

## 📝 License

Released under the [MIT License](LICENSE).

---

_Built for Gemini 3 Hackathon by VerifyLive Team._
