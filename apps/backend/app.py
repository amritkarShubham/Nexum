from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'nexum_super_secret_key')
CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/health')
def health_check():
    return jsonify({"status": "ok", "message": "Nexum API is running"})

# -----------------
# WebSocket Events
# -----------------

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
        emit('room_update', {'message': f"A user joined room {room}"}, to=room)

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
    # data: {room: str, action: "play" | "pause" | "seek", time?: float}
    room = data.get('room')
    print(f"Player action in {room}: {data}")
    emit('player_sync', data, to=room, include_self=False)

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)
