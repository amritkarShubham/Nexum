from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_cors import CORS
import os
from dotenv import load_dotenv

from database import (
    create_user, get_user_by_email, get_user,
    create_couple, join_couple, get_couple_by_user,
    get_subscription, upsert_subscription,
    check_usage_limit, increment_daily_usage,
)

# Global reference so SocketIO can emit outside of event handlers
socketio_instance = None

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', os.urandom(32).hex())
CORS(app, resources={r"/*": {"origins": os.environ.get("CORS_ORIGIN", "http://localhost:5173")}})

socketio = SocketIO(app, cors_allowed_origins=os.environ.get("CORS_ORIGIN", "*"))
socketio_instance = socketio  # make accessible outside event handlers

# ── REST API ──

@app.route('/health')
def health_check():
    return jsonify({"status": "ok", "message": "Nexum API is running"})

# Auth / Users
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('name'):
        return jsonify({"error": "email and name required"}), 400
    existing = get_user_by_email(data['email'])
    if existing:
        return jsonify({"error": "user already exists"}), 409
    user = create_user(data['email'], data['name'], data.get('avatar', ''))
    sub = upsert_subscription(user['id'], data.get('plan', 'spark'))
    return jsonify({"user": user, "subscription": sub}), 201

@app.route('/api/users/<user_id>')
def get_user_route(user_id):
    user = get_user(user_id)
    if not user:
        return jsonify({"error": "not found"}), 404
    sub = get_subscription(user_id)
    return jsonify({"user": user, "subscription": sub})

@app.route('/api/users/by-email/<email>')
def get_user_by_email_route(email):
    user = get_user_by_email(email)
    if not user:
        return jsonify({"error": "not found"}), 404
    sub = get_subscription(user['id'])
    return jsonify({"user": user, "subscription": sub})

# Couples
@app.route('/api/couples', methods=['POST'])
def create_couple_route():
    data = request.get_json()
    if not data or not data.get('user_id'):
        return jsonify({"error": "user_id required"}), 400
    couple = create_couple(data['user_id'])
    return jsonify(couple), 201

@app.route('/api/couples/join', methods=['POST'])
def join_couple_route():
    data = request.get_json()
    if not data or not data.get('code') or not data.get('user_id'):
        return jsonify({"error": "code and user_id required"}), 400
    couple = join_couple(data['code'], data['user_id'])
    if not couple:
        return jsonify({"error": "invalid or expired code"}), 404
    if socketio_instance:
        socketio_instance.emit('partner_joined', {
            'coupleId': couple['id'],
            'coupleCode': couple['code'],
            'userId': data['user_id'],
        })
    return jsonify(couple)

@app.route('/api/couples/<user_id>')
def get_couple_route(user_id):
    couple = get_couple_by_user(user_id)
    if not couple:
        return jsonify({"error": "no couple found"}), 404
    return jsonify(couple)

# Subscriptions
@app.route('/api/subscription/<user_id>', methods=['GET'])
def get_subscription_route(user_id):
    sub = get_subscription(user_id)
    if not sub:
        return jsonify({"plan": "spark"}), 200
    return jsonify(sub)

@app.route('/api/subscription/upgrade', methods=['POST'])
def upgrade_subscription():
    data = request.get_json()
    if not data or not data.get('user_id') or not data.get('plan'):
        return jsonify({"error": "user_id and plan required"}), 400
    if data['plan'] not in ('spark', 'embrace', 'eclipse'):
        return jsonify({"error": "invalid plan"}), 400
    sub = upsert_subscription(
        data['user_id'], data['plan'],
        data.get('stripe_customer_id'),
        data.get('stripe_subscription_id'),
    )
    return jsonify(sub)

# Usage tracking
@app.route('/api/usage/check', methods=['POST'])
def check_usage():
    data = request.get_json()
    if not data or not data.get('user_id') or not data.get('action'):
        return jsonify({"error": "user_id and action required"}), 400
    allowed = check_usage_limit(data['user_id'], data['action'])
    return jsonify({"allowed": allowed})

@app.route('/api/usage/track', methods=['POST'])
def track_usage():
    data = request.get_json()
    if not data or not data.get('user_id') or not data.get('field'):
        return jsonify({"error": "user_id and field required"}), 400
    usage = increment_daily_usage(data['user_id'], data['field'], data.get('amount', 1))
    return jsonify(usage)

# ── WebSocket Events ──

@socketio.on('connect')
def handle_connect():
    print('Client connected:', request.sid)
    emit('server_message', {'data': 'Connected to Nexum server'})

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected:', request.sid)

@socketio.on('join_call_room')
def on_join(data):
    room = data.get('room')
    if room:
        join_room(room)
        print(f"User {request.sid} joined room {room}")
        emit('room_update', {'message': f"User joined room {room}"}, to=room)

@socketio.on('leave_call_room')
def on_leave(data):
    room = data.get('room')
    if room:
        leave_room(room)
        print(f"User {request.sid} left room {room}")
        emit('room_update', {'message': f"User left room {room}"}, to=room)

# WebRTC Signaling
@socketio.on('webrtc_offer')
def handle_offer(data):
    room = data.get('room')
    emit('webrtc_offer', data, to=room, include_self=False)

@socketio.on('webrtc_answer')
def handle_answer(data):
    room = data.get('room')
    emit('webrtc_answer', data, to=room, include_self=False)

@socketio.on('webrtc_ice_candidate')
def handle_ice_candidate(data):
    room = data.get('room')
    emit('webrtc_ice_candidate', data, to=room, include_self=False)

# Streaming Sync
@socketio.on('player_action')
def handle_player_action(data):
    room = data.get('room')
    emit('player_sync', data, to=room, include_self=False)

# Chat
@socketio.on('chat_message')
def handle_chat(data):
    room = data.get('room')
    emit('chat_message', data, to=room, include_self=False)

# Partner joined notification
@socketio.on('partner_joined')
def handle_partner_joined(data):
    room = data.get('room')
    emit('partner_joined', data, to=room, include_self=False)

# Mood
@socketio.on('mood_update')
def handle_mood(data):
    room = data.get('room')
    emit('mood_sync', data, to=room, include_self=False)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    socketio.run(app, debug=debug, port=port, host='0.0.0.0', allow_unsafe_werkzeug=debug)
