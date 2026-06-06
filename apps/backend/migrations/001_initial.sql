-- Nexum Database Schema
-- PostgreSQL migration

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW()
);

-- Couple connections
CREATE TABLE couples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  user1_id UUID REFERENCES users(id),
  user2_id UUID REFERENCES users(id),
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) UNIQUE,
  plan TEXT NOT NULL DEFAULT 'spark' CHECK (plan IN ('spark', 'embrace', 'eclipse')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT
);

-- Moods
CREATE TABLE moods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  mood TEXT NOT NULL,
  created_at DATE DEFAULT CURRENT_DATE
);

-- Chat messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id),
  sender_id UUID REFERENCES users(id),
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Game sessions
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id),
  game_type TEXT NOT NULL CHECK (game_type IN ('trivia', 'truth_or_dare', 'would_you_rather')),
  user1_score INT DEFAULT 0,
  user2_score INT DEFAULT 0,
  played_at TIMESTAMPTZ DEFAULT NOW()
);

-- Watch history (for tracking streaming time limits)
CREATE TABLE watch_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  platform TEXT NOT NULL,
  duration_seconds INT DEFAULT 0,
  watched_at DATE DEFAULT CURRENT_DATE
);

-- Daily usage tracking (for free tier limits)
CREATE TABLE daily_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  date DATE DEFAULT CURRENT_DATE,
  games_played INT DEFAULT 0,
  streaming_seconds INT DEFAULT 0,
  call_seconds INT DEFAULT 0,
  UNIQUE(user_id, date)
);

-- Indexes
CREATE INDEX idx_couples_code ON couples(code);
CREATE INDEX idx_couples_user ON couples(user1_id);
CREATE INDEX idx_couples_user2 ON couples(user2_id);
CREATE INDEX idx_messages_couple ON messages(couple_id, created_at);
CREATE INDEX idx_moods_user_date ON moods(user_id, created_at);
CREATE INDEX idx_watch_history_user_date ON watch_history(user_id, watched_at);
CREATE INDEX idx_daily_usage_user_date ON daily_usage(user_id, date);
