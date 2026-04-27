# Nexum
All-in-one app for long-distance couples — synced movie watching, built-in games, couple quizzes, and HD video &amp; voice calls. Built with React, Node.js, Agora RTC, and Socket.io.

What is Nexum?
Nexum is a full-stack relationship app built specifically for long-distance couples. The core idea is simple: right now, couples who are miles apart need 5 or more different apps to feel close — Rave for watching movies together, Paired for quizzes, Snapchat or FaceTime for video calls, and some random third-party app for games. None of them talk to each other. None of them were built with the full picture of what a long-distance relationship actually needs day to day.
Nexum changes that. It is one app that brings everything into a single, beautifully designed space — so two people separated by distance can feel like they are genuinely spending time together, not just exchanging messages.

The Problem Nexum Solves
Long-distance relationships are hard. The emotional weight of distance, time zones, and the inability to share small everyday moments takes a real toll. What makes it harder is that the tools available to couples are fragmented and generic. Watch party apps have no video overlay so you cannot see your partner's face. Quiz apps have no games. Games apps have no chat. Video call apps have none of the above.
Couples end up juggling multiple apps simultaneously, constantly switching context, losing the feeling of presence that makes shared experiences feel real. Nexum was built to eliminate that friction entirely.

Core Features
📹 HD Video Call
Full WebRTC-powered video calling using the Agora RTC SDK. Both users connect to a shared channel with real-time audio and video. Supports mute, camera toggle, speaker switching, and a live call duration timer. Designed to stay open across other features so you can always see each other's face no matter what you are doing in the app.
📞 Voice Call
Crystal-clear audio-only calling for when you just want to hear each other's voice — commuting, cooking, winding down before bed. Includes an animated real-time sound wave that reacts to voice activity, plus mute and speaker controls.
🎬 Watch Together
Synchronized movie and TV streaming across any platform. Both users' playback is kept in perfect sync via Socket.io events — when one person plays, pauses, or seeks, the other's player follows automatically. A picture-in-picture video overlay keeps both faces visible in the corner of the screen the entire time. Includes live emoji reactions (❤️ 😂 😱 🔥 👏 😭) that float up on screen in real time so you can share the moment without breaking the immersion.
🧠 Couple Trivia
A two-round quiz game designed for couples. In Round 1, each person answers a set of questions about themselves privately. In Round 2, the questions come back — but now you are guessing what your partner said. Points are awarded every time your answers match, rewarding genuine mutual understanding rather than just being "correct." Comes with two categories: Light & Fun for casual nights and Deep & Real for when you want to learn something new about each other. Results show a compatibility percentage, individual scores, and a breakdown of questions where you diverged — built-in conversation starters.
🎯 Truth or Dare
A couples-specific truth or dare experience with questions and dares written for long-distance relationships. Truths prompt meaningful self-disclosure. Dares are playful and designed for video call — singing a 10-second song, taking a selfie and sending it, doing an impression of your partner. Tap to reveal each card, skip ones that do not land, switch between truth and dare freely.
🤔 Would You Rather
A rapid-fire either/or game where both players pick an option before seeing each other's answer, eliminating the temptation to just agree. After both answers are locked in, the app reveals whether you matched or diverged and prompts you to talk about it. Divergent answers are often the most interesting — they surface differences you did not know existed.
💬 Real-time Chat
A persistent private messaging space between just the two of you. Messages are delivered in real time via Socket.io. Supports typing and instant sending with simulated partner replies in demo mode. Designed as a companion layer to calls and watch parties — a place to drop links, share thoughts mid-movie, or just stay connected throughout the day.
😌 Daily Vibe Check
A simple daily mood selector — Happy, Calm, Missing You, Tired, Excited — that each person sets once a day. Your partner can see your current vibe in real time, creating small moments of emotional awareness even when you are not actively in conversation. No journaling required, no pressure to explain — just a quick check-in that keeps the emotional connection warm.
💡 Ideas for Tonight
A daily rotating set of four suggestions — a date night idea, a staying-connected tip, a fun ritual, and a game suggestion. Refreshes on tap with new ideas drawn from a curated bank. No AI analysis, no scoring your relationship, no unsolicited advice — just human, practical ideas for couples who sometimes just need a prompt to make the evening feel special.
📊 Couple Stats
A shared dashboard showing days connected, quiz compatibility percentage, and movies watched together. Tracks the shared history of the relationship without gamifying it with streaks or scores that create pressure.

Tech Stack
LayerTechnologyFrontendReact 18 + ViteStylingPure CSS with custom propertiesVideo & VoiceAgora RTC SDKReal-timeSocket.ioBackendNode.js + ExpressDatabaseSupabase (PostgreSQL)AuthSupabase AuthMobileCapacitor (iOS & Android)Frontend DeployVercelBackend DeployRailway

Architecture Overview
┌─────────────────────────────────────────────────────┐
│                   Nexum Client                       │
│  React App (Web / iOS / Android via Capacitor)      │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │ Video /  │  │ Socket   │  │   Supabase Client  │ │
│  │ Voice    │  │ .io      │  │   (Auth + DB)      │ │
│  │ (Agora)  │  │ Client   │  │                    │ │
│  └────┬─────┘  └────┬─────┘  └─────────┬──────────┘ │
└───────┼─────────────┼────────────────  ┼────────────┘
        │             │                  │
        ▼             ▼                  ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────────┐
│  Agora RTC   │ │  Node.js +   │ │   Supabase       │
│  Cloud       │ │  Express +   │ │   (Postgres +    │
│  (Video/     │ │  Socket.io   │ │   Auth +         │
│   Voice)     │ │  Server      │ │   Storage)       │
└──────────────┘ └──────────────┘ └──────────────────┘
The Agora RTC cloud handles all peer-to-peer video and audio — no media passes through your own server, keeping latency low and quality high. The Socket.io server handles everything else: chat messages, watch party sync events, game state sync, reactions, and vibe updates. Supabase stores persistent data — user profiles, couple pairings, message history, quiz results, and watch history.

Project Structure
nexum/
├── src/
│   ├── App.jsx                   # Main router and shell
│   ├── screens/
│   │   ├── Onboarding.jsx        # First-run experience
│   │   ├── Home.jsx              # Dashboard
│   │   ├── WatchTogether.jsx     # Synced streaming + PiP
│   │   ├── VideoCall.jsx         # WebRTC video
│   │   ├── VoiceCall.jsx         # WebRTC audio
│   │   ├── Games.jsx             # Game selection
│   │   ├── Trivia.jsx            # Two-round quiz game
│   │   ├── TruthOrDare.jsx       # Truth or dare
│   │   ├── WouldYouRather.jsx    # WYR game
│   │   └── Connect.jsx           # Chat + calls hub
│   ├── hooks/
│   │   ├── useVideoCall.js       # Agora video hook
│   │   ├── useVoiceCall.js       # Agora audio hook
│   │   ├── useSocket.js          # Socket.io hook
│   │   └── useWatchSync.js       # Watch party sync
│   ├── store/
│   │   └── useStore.js           # Zustand global state
│   └── lib/
│       ├── agora.js              # Agora client config
│       └── supabase.js           # Supabase client
├── server/
│   ├── index.js                  # Express + Socket.io
│   ├── rooms.js                  # Room/session logic
│   └── sync.js                   # Watch sync handlers
└── README.md

Getting Started
Prerequisites

Node.js 18+
A free Agora account for video/voice
A free Supabase project for auth and database

Installation
bash# Clone the repo
git clone https://github.com/yourusername/nexum.git
cd nexum

# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..
Environment variables
Create a .env file in the project root:
envVITE_AGORA_APP_ID=your_agora_app_id
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SOCKET_URL=http://localhost:3001
Run locally
bash# Terminal 1 — start the backend
cd server && node index.js

# Terminal 2 — start the frontend
npm run dev
Open http://localhost:5173 in your browser.

Mobile Builds (iOS & Android)
bashnpm run build
npx cap sync
npx cap open ios      # Opens Xcode
npx cap open android  # Opens Android Studio
Requires Capacitor:
bashnpm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npx cap init nexum com.nexum.app

Deployment
Frontend (Vercel):
bashvercel
Backend (Railway):
Push the /server folder to a GitHub repo, connect to Railway, set root directory to /server, and deploy. Copy the live URL into your .env as VITE_SOCKET_URL.

Roadmap

 Video call (Agora RTC)
 Voice call (Agora RTC)
 Watch together with sync
 Real-time chat
 Couple trivia (two-round)
 Truth or dare
 Would you rather
 Vibe check
 Daily suggestions
 Draw & guess (canvas + socket sync)
 Word battle (real-time multiplayer)
 Push notifications (Firebase FCM)
 Netflix / Disney+ browser extension for deeper sync
 AI relationship coach (optional premium feature)
 Shared couple journal
 Anniversary & countdown features
 10+ language support


Contributing
Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

License
MIT — free to use, modify, and distribute.

Acknowledgements
Built with Agora RTC · Socket.io · Supabase · Capacitor · Vite

Because love doesn't stop at the border.
