import { useCallback, useEffect, useRef } from 'react';
import useStore from '../store/useStore';
import { useSocket } from '../context/SocketContext';

const ICE_SERVERS = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

export default function useVoiceCall(roomId = 'test_couple_room') {
  const { socket } = useSocket();
  const localAudioRef = useRef(null);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);
  const localStreamRef = useRef(null);

  const {
    setCallState, setCallType, setLocalStream, setRemoteStream,
    setPeerConnection, setIsMuted, setCallDuration,
    resetCall, callState, isMuted,
  } = useStore();

  const startCall = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      localStreamRef.current = stream;
      setLocalStream(stream);
      setCallType('voice');
      setCallState('calling');

      // Audio analyser for waveform
      const ctx = new AudioContext();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      src.connect(analyser);
      analyserRef.current = analyser;
      audioContextRef.current = ctx;

      const pc = new RTCPeerConnection(ICE_SERVERS);
      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.onicecandidate = (e) => {
        if (e.candidate && socket) {
          socket.emit('webrtc_ice_candidate', { room: roomId, candidate: e.candidate });
        }
      };

      pc.ontrack = (e) => {
        setRemoteStream(e.streams[0]);
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      if (socket) socket.emit('webrtc_offer', { room: roomId, sdp: offer });
      setPeerConnection(pc);
    } catch (err) {
      console.error('Failed to start voice call:', err);
      resetCall();
    }
  }, [socket, roomId, setCallState, setCallType, setLocalStream, setRemoteStream, setPeerConnection, resetCall]);

  const answerCall = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      localStreamRef.current = stream;
      setLocalStream(stream);
      setCallState('connected');
    } catch (err) {
      console.error('Failed to answer voice call:', err);
    }
  }, [setLocalStream, setCallState]);

  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(t => {
        t.enabled = !isMuted;
      });
      setIsMuted(!isMuted);
    }
  }, [isMuted, setIsMuted]);

  const endCall = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    localStreamRef.current = null;
    analyserRef.current = null;
    audioContextRef.current = null;
    resetCall();
  }, [resetCall]);

  // Handle incoming signaling
  useEffect(() => {
    if (!socket) return;

    const handleOffer = async (data) => {
      const pc = new RTCPeerConnection(ICE_SERVERS);
      const stream = localStreamRef.current;
      if (stream) stream.getTracks().forEach(track => pc.addTrack(track, stream));

      pc.onicecandidate = (e) => {
        if (e.candidate && socket) {
          socket.emit('webrtc_ice_candidate', { room: roomId, candidate: e.candidate });
        }
      };

      pc.ontrack = (e) => {
        setRemoteStream(e.streams[0]);
      };

      await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('webrtc_answer', { room: roomId, sdp: answer });
      setPeerConnection(pc);
      setCallState('connected');
    };

    const handleAnswer = async (data) => {
      const pc = useStore.getState().peerConnection;
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        setCallState('connected');
      }
    };

    const handleIce = async (data) => {
      const pc = useStore.getState().peerConnection;
      if (pc && data.candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (e) { /* ignore */ }
      }
    };

    socket.on('webrtc_offer', handleOffer);
    socket.on('webrtc_answer', handleAnswer);
    socket.on('webrtc_ice_candidate', handleIce);

    return () => {
      socket.off('webrtc_offer', handleOffer);
      socket.off('webrtc_answer', handleAnswer);
      socket.off('webrtc_ice_candidate', handleIce);
    };
  }, [socket, roomId, setPeerConnection, setCallState, setRemoteStream]);

  useEffect(() => {
    if (callState !== 'connected') return;
    const interval = setInterval(() => {
      setCallDuration(d => d + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callState, setCallDuration]);

  return {
    analyserRef,
    startCall, answerCall, endCall,
    toggleMute,
    isMuted, callState,
  };
}
