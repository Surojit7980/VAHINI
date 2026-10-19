# VAHINI // Multi-Domain Tactical C2 & Electronic Warfare Simulator

VAHINI is a dual-interface Command and Control (C2) tactical simulator designed to train field commanders under degraded Electronic Warfare (EW) and AI-driven cognitive warfare conditions.

## Core Architecture & Innovations

1. Dual-Role Real-Time C2 Engine (Socket.io + Leaflet GIS)
   - Instructor Station (God-View): Full authority over unit positioning, EW interference parameters, and automated debriefing.
   - Field Commander Station (Trainee View): Receives real-time tactical telemetry subject to live network degradation and coordinate drift.

2. Electronic Warfare (EW) Chaos Array
   - RF Signal Jamming (0-100%): Dynamically injects realistic communication latency (ms), visual EW jamming zones, and complete packet drop at 100% saturation.
   - GPS Coordinate Spoofing: Simulates satellite lock degradation by injecting stochastic coordinate drift into live unit markers.

3. LLM-Powered AI Adversary (Cognitive Warfare)
   - Integrates Google Gemini (gemini-2.5-flash) with deterministic tactical fallbacks to intercept unencrypted field transmissions and rewrite them into hostile psychological/panic reports in real time.

4. Automated After-Action Review (AAR) & Audit Trail (SQLite3)
   - Logs every EW parameter shift, original transmission (Ground Truth), and AI-mutated payload with millisecond timestamps.
   - Computes an automated Cognitive Resilience Score and supports one-click JSON telemetry export.

## Tech Stack
- Frontend: React (Vite), Tailwind CSS, React-Leaflet (Dark Tactical GIS), Lucide Icons, PWA Manifest
- Backend: Node.js, Express.js, Socket.io (Bi-directional Telemetry)
- Database: SQLite3 (vahini_aar.db)
- AI Engine: @google/genai (Gemini 2.5 Flash) with Zero-Failure Tactical Fallback

## Quick Start (Local Deployment)
1. Backend: Run "cd backend", "npm install", and "node server.js" (runs on Port 3001).
2. Frontend: Run "cd frontend", "npm install", and "npm run dev" (runs on Port 5173).
