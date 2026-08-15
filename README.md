Nexum — All-in-One Long-Distance Couple App
An integrated platform designed to eliminate the fragmentation of long-distance relationships by combining video/voice calls, watch parties, couple games, and daily connection tools into a single cohesive ecosystem.

Overview & Problem Statement
Long-distance relationships suffer from tool fragmentation. Couples typically juggle 5+ disjointed apps simultaneously (e.g., Rave for movies, Paired for quizzes, FaceTime for calls, and third-party apps for games) with zero context-sharing or unified presence.

Nexum solves this friction by housing everything in a single, dedicated space optimized for real-time connection.

Core Features
HD Video Call: WebRTC-powered video calling via the Agora RTC SDK. Features a live call duration timer, mute, camera toggle, and speaker switching. Designed as a persistent layer that remains active while navigating other app features.

Voice Call: Low-latency audio-only calling with an animated, real-time sound wave that reacts to voice activity.

Watch Together: Synchronized movie and TV streaming across platforms via Socket.io events (play, pause, seek sync). Includes a picture-in-picture (PiP) video overlay of your partner and floating real-time emoji reactions (❤️, 😂, 😱, 🔥, 👏, 😭).

Couple Trivia: A two-round quiz game. Round 1 involves private self-assessment questions; Round 2 prompts you to guess your partner's answers. Calculates compatibility percentages and highlights divergences as conversation starters.

Truth or Dare: Custom-curated prompts for long-distance relationships, balancing self-disclosure truths with video-call-friendly interactive dares.

Would You Rather: Rapid-fire either/or choices that lock in responses simultaneously before revealing matches or divergences.

Real-time Chat: Persistent messaging space delivered via Socket.io, supporting typing indicators and media/link sharing.

Daily Vibe Check: Low-friction mood selector (Happy, Calm, Missing You, Tired, Excited) updating partners on emotional state in real time.

Ideas for Tonight: Daily rotating bank of practical date night ideas, connection tips, rituals, and game prompts.

Couple Stats: Shared dashboard tracking days connected, quiz compatibility, and watch history without pressure-driven streak mechanics.

Tech Stack & Architecture
Technology Breakdown
Frontend: React 18 + Vite

Styling: Pure CSS with custom properties

Video / Voice: Agora RTC SDK (peer-to-peer media streams routed through Agora cloud for minimal latency)

Real-time State & Chat: Node.js + Express + Socket.io server

Database & Auth: Supabase (PostgreSQL + Auth + Storage)

Mobile Wrapper: Capacitor (iOS & Android targets)

Hosting: Vercel (Frontend) / Railway (Backend)

System Data Flow
[React Client (Web/Mobile)]
  ├── Agora RTC SDK ────► Agora Cloud (P2P Video/Voice Streams)
  ├── Socket.io Client ──► Node/Express/Socket.io Server (Chat, Sync, State)
  └── Supabase Client ───► Supabase Postgres (Auth & Persistent Data)
Project Structure
Plaintext
nexum/
├── src/
│   ├── App.jsx                 # Main router and shell
│   ├── screens/                # UI Views (Onboarding, Home, WatchTogether, VideoCall, etc.)
│   ├── hooks/                  # Custom hooks (useVideoCall, useSocket, useWatchSync)
│   ├── store/                  # Zustand global state
│   └── lib/                    # Agora & Supabase client configurations
├── server/
│   ├── index.js                # Express + Socket.io entry point
│   ├── rooms.js                # Room and session management logic
│   └── sync.js                 # Watch party synchronization handlers
└── README.md
Local Development & Setup
Prerequisites
Node.js 18+

Free Agora Account (App ID)

Free Supabase Project (URL & Anon Key)

Installation Steps
Bash
# Clone repository
git clone https://github.com/yourusername/nexum.gits
cd nexum

# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..
Environment Configuration
Create a .env file in the project root:

Code snippet
VITE_AGORA_APP_ID=your_agora_app_id
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SOCKET_URL=http://localhost:3001
Running Locally
Bash
# Terminal 1: Start Backend Server
cd server && node index.js

# Terminal 2: Start Frontend Dev Server
npm run dev
Access the local app at http://localhost:5173.

Mobile Build & Deployment
Capacitor Setup (iOS & Android)
Bash
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npx cap init nexum com.nexum.app
npm run build
npx cap sync
npx cap open ios      # Opens Xcode
npx cap open android  # Opens Android Studio
Deployment Commands
Frontend (Vercel): Run vercel in the project root.

Backend (Railway): Push the /server directory to a GitHub repo, connect to Railway, configure the root directory to /server, and set VITE_SOCKET_URL in your frontend environment variables.
