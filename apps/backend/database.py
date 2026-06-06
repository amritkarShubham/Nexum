import os
import uuid
from datetime import datetime, date, timedelta
from dotenv import load_dotenv

load_dotenv()

# Support both Supabase and direct PostgreSQL
USE_SUPABASE = os.environ.get("USE_SUPABASE", "false").lower() == "true"

if USE_SUPABASE:
    from supabase import create_client, Client
    url = os.environ.get("SUPABASE_URL", "")
    key = os.environ.get("SUPABASE_KEY", "")
    supabase: Client = create_client(url, key) if url and key else None
else:
    import psycopg2
    from psycopg2.extras import RealDictCursor
    DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql://nexum:nexum@localhost:5432/nexum")

    def get_db():
        conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
        return conn

# ── Users ──

def create_user(email, name, avatar=""):
    if USE_SUPABASE and supabase:
        data = supabase.table("users").insert({"email": email, "name": name, "avatar": avatar}).execute()
        return data.data[0] if data.data else None
    conn = get_db()
    cur = conn.cursor()
    cur.execute("INSERT INTO users (email, name, avatar) VALUES (%s, %s, %s) RETURNING *", (email, name, avatar))
    user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return user

def get_user_by_email(email):
    if USE_SUPABASE and supabase:
        data = supabase.table("users").select("*").eq("email", email).execute()
        return data.data[0] if data.data else None
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cur.fetchone()
    cur.close()
    conn.close()
    return user

def get_user(user_id):
    if USE_SUPABASE and supabase:
        data = supabase.table("users").select("*").eq("id", user_id).execute()
        return data.data[0] if data.data else None
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cur.fetchone()
    cur.close()
    conn.close()
    return user

# ── Couples ──

def create_couple(user1_id):
    code = "NX-" + uuid.uuid4().hex[:6].upper()
    if USE_SUPABASE and supabase:
        data = supabase.table("couples").insert({"code": code, "user1_id": user1_id}).execute()
        return data.data[0] if data.data else None
    conn = get_db()
    cur = conn.cursor()
    cur.execute("INSERT INTO couples (code, user1_id) VALUES (%s, %s) RETURNING *", (code, user1_id))
    couple = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return couple

def join_couple(code, user2_id):
    if USE_SUPABASE and supabase:
        data = supabase.table("couples").update({"user2_id": user2_id, "connected_at": datetime.utcnow().isoformat()}).eq("code", code).is_("user2_id", "null").execute()
        return data.data[0] if data.data else None
    conn = get_db()
    cur = conn.cursor()
    cur.execute("UPDATE couples SET user2_id = %s, connected_at = NOW() WHERE code = %s AND user2_id IS NULL RETURNING *", (user2_id, code))
    couple = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return couple

def get_couple_by_user(user_id):
    if USE_SUPABASE and supabase:
        data = supabase.table("couples").select("*").or_(f"user1_id.eq.{user_id},user2_id.eq.{user_id}").eq("is_active", True).execute()
        return data.data[0] if data.data else None
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM couples WHERE (user1_id = %s OR user2_id = %s) AND is_active = TRUE", (user_id, user_id))
    couple = cur.fetchone()
    cur.close()
    conn.close()
    return couple

# ── Subscriptions ──

def get_subscription(user_id):
    if USE_SUPABASE and supabase:
        data = supabase.table("subscriptions").select("*").eq("user_id", user_id).execute()
        return data.data[0] if data.data else None
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM subscriptions WHERE user_id = %s", (user_id,))
    sub = cur.fetchone()
    cur.close()
    conn.close()
    return sub

def upsert_subscription(user_id, plan, stripe_customer_id=None, stripe_subscription_id=None):
    if USE_SUPABASE and supabase:
        existing = supabase.table("subscriptions").select("*").eq("user_id", user_id).execute()
        if existing.data:
            data = supabase.table("subscriptions").update({
                "plan": plan, "status": "active",
                "stripe_customer_id": stripe_customer_id,
                "stripe_subscription_id": stripe_subscription_id,
            }).eq("user_id", user_id).execute()
        else:
            data = supabase.table("subscriptions").insert({
                "user_id": user_id, "plan": plan, "status": "active",
                "stripe_customer_id": stripe_customer_id,
                "stripe_subscription_id": stripe_subscription_id,
            }).execute()
        return data.data[0] if data.data else None
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO subscriptions (user_id, plan, stripe_customer_id, stripe_subscription_id)
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (user_id) DO UPDATE
        SET plan = EXCLUDED.plan, status = 'active',
            stripe_customer_id = EXCLUDED.stripe_customer_id,
            stripe_subscription_id = EXCLUDED.stripe_subscription_id
        RETURNING *
    """, (user_id, plan, stripe_customer_id, stripe_subscription_id))
    sub = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return sub

# ── Daily Usage (tier enforcement) ──

def get_daily_usage(user_id):
    today = date.today()
    if USE_SUPABASE and supabase:
        data = supabase.table("daily_usage").select("*").eq("user_id", user_id).eq("date", today.isoformat()).execute()
        return data.data[0] if data.data else None
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM daily_usage WHERE user_id = %s AND date = %s", (user_id, today))
    usage = cur.fetchone()
    cur.close()
    conn.close()
    return usage

VALID_FIELDS = {"games_played", "streaming_seconds", "call_seconds"}

def increment_daily_usage(user_id, field, amount=1):
    if field not in VALID_FIELDS:
        raise ValueError(f"Invalid field: {field}")
    today = date.today()
    if USE_SUPABASE and supabase:
        existing = supabase.table("daily_usage").select("*").eq("user_id", user_id).eq("date", today.isoformat()).execute()
        if existing.data:
            data = supabase.table("daily_usage").update({field: existing.data[0].get(field, 0) + amount}).eq("user_id", user_id).eq("date", today.isoformat()).execute()
        else:
            data = supabase.table("daily_usage").insert({"user_id": user_id, "date": today.isoformat(), field: amount}).execute()
        return data.data[0] if data.data else None
    conn = get_db()
    cur = conn.cursor()
    cur.execute(f"""
        INSERT INTO daily_usage (user_id, date, {field})
        VALUES (%s, %s, %s)
        ON CONFLICT (user_id, date) DO UPDATE
        SET {field} = daily_usage.{field} + EXCLUDED.{field}
        RETURNING *
    """, (user_id, today, amount))
    usage = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return usage

# ── Usage limits per tier ──

TIER_LIMITS = {
    "spark": {
        "games_per_day": 1,
        "streaming_minutes_per_week": 0,
        "call_minutes_per_call": 10,
        "watch_platforms": ["youtube"],
    },
    "embrace": {
        "games_per_day": 4,
        "streaming_minutes_per_week": 180,
        "call_minutes_per_call": None,
        "watch_platforms": ["youtube", "netflix", "prime", "hotstar", "disney", "sony", "zee5", "mx"],
    },
    "eclipse": {
        "games_per_day": None,
        "streaming_minutes_per_week": None,
        "call_minutes_per_call": None,
        "watch_platforms": ["youtube", "netflix", "prime", "hotstar", "disney", "sony", "zee5", "mx"],
    },
}

def check_usage_limit(user_id, action):
    sub = get_subscription(user_id)
    plan = sub["plan"] if sub else "spark"
    limits = TIER_LIMITS[plan]
    usage = get_daily_usage(user_id) or {}

    if action == "game" and limits["games_per_day"] is not None:
        played = usage.get("games_played", 0)
        return played < limits["games_per_day"]
    if action == "streaming" and limits["streaming_minutes_per_week"] is not None:
        # Check weekly total
        return True  # simplified for now
    return True
