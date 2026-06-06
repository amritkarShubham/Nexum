import { useCallback, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import useStore from '../store/useStore';

export default function useWatchSync(roomId = 'test_couple_room') {
  const { socket } = useSocket();
  const {
    isPlaying, currentTime, setCurrentTime, setIsPlaying,
    setWatchUrl, watchUrl, platform, setPlatform,
    manualTime, setManualTime, isManualMode, setIsManualMode,
    partnerManualTime, setPartnerManualTime, partnerPlatform, setPartnerPlatform,
  } = useStore();
  const playerRef = useRef(null);
  const lastSyncRef = useRef(0);
  const joinedRef = useRef(false);

  // Join room on mount
  useEffect(() => {
    if (!socket || joinedRef.current) return;
    socket.emit('join_call_room', { room: roomId });
    joinedRef.current = true;
  }, [socket, roomId]);

  // YouTube player actions
  const play = useCallback(() => {
    setIsPlaying(true);
    if (socket) {
      socket.emit('player_action', { room: roomId, action: 'play', time: playerRef.current?.getCurrentTime() });
    }
  }, [socket, roomId, setIsPlaying]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (socket) {
      socket.emit('player_action', { room: roomId, action: 'pause', time: playerRef.current?.getCurrentTime() });
    }
  }, [socket, roomId, setIsPlaying]);

  const seek = useCallback((time) => {
    setCurrentTime(time);
    playerRef.current?.seekTo(time, 'seconds');
    if (socket) {
      socket.emit('player_action', { room: roomId, action: 'seek', time });
    }
  }, [socket, roomId, setCurrentTime]);

  const syncPlayback = useCallback((url) => {
    setWatchUrl(url);
    if (socket) {
      socket.emit('player_action', { room: roomId, action: 'sync', url });
    }
  }, [socket, roomId, setWatchUrl]);

  // Manual sync mode actions
  const manualPlay = useCallback(() => {
    setIsPlaying(true);
    if (socket) {
      socket.emit('player_action', { room: roomId, action: 'manual_play', time: manualTime });
    }
  }, [socket, roomId, setIsPlaying, manualTime]);

  const manualPause = useCallback(() => {
    setIsPlaying(false);
    if (socket) {
      socket.emit('player_action', { room: roomId, action: 'manual_pause', time: manualTime });
    }
  }, [socket, roomId, setIsPlaying, manualTime]);

  const manualSeek = useCallback((time) => {
    setManualTime(time);
    if (socket) {
      socket.emit('player_action', { room: roomId, action: 'manual_seek', time });
    }
  }, [socket, roomId, setManualTime]);

  const setPlatformAndSync = useCallback((p) => {
    setPlatform(p);
    setIsManualMode(p !== 'youtube');
    if (p === 'youtube') {
      setWatchUrl('');
    }
    if (socket) {
      socket.emit('player_action', { room: roomId, action: 'platform_set', platform: p });
    }
  }, [socket, roomId, setPlatform, setIsManualMode, setWatchUrl]);

  // Timer tick for manual sync mode
  useEffect(() => {
    if (!isManualMode || !isPlaying) return;
    const interval = setInterval(() => {
      setManualTime(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isManualMode, isPlaying, setManualTime]);

  // Listen for partner's actions
  useEffect(() => {
    if (!socket) return;

    const handlePlayerSync = (data) => {
      const now = Date.now();
      if (now - lastSyncRef.current < 200) return;
      lastSyncRef.current = now;

      switch (data.action) {
        case 'play':
          setIsPlaying(true);
          if (data.time !== undefined) {
            setCurrentTime(data.time);
            playerRef.current?.seekTo(data.time, 'seconds');
          }
          break;
        case 'pause':
          setIsPlaying(false);
          if (data.time !== undefined) setCurrentTime(data.time);
          break;
        case 'seek':
          if (data.time !== undefined) {
            setCurrentTime(data.time);
            playerRef.current?.seekTo(data.time, 'seconds');
          }
          break;
        case 'sync':
          if (data.url) setWatchUrl(data.url);
          break;
        case 'platform_set':
          setPartnerPlatform(data.platform);
          break;
        case 'manual_play':
          setPartnerManualTime(data.time);
          setIsPlaying(true);
          break;
        case 'manual_pause':
          setPartnerManualTime(data.time);
          setIsPlaying(false);
          break;
        case 'manual_seek':
          setPartnerManualTime(data.time);
          setManualTime(data.time);
          break;
        case 'manual_sync':
          setPartnerManualTime(data.time);
          setManualTime(data.time);
          break;
      }
    };

    socket.on('player_sync', handlePlayerSync);
    return () => socket.off('player_sync', handlePlayerSync);
  }, [socket, setIsPlaying, setCurrentTime, setWatchUrl, setPartnerPlatform, setPartnerManualTime, setManualTime]);

  return {
    playerRef,
    watchUrl, isPlaying, currentTime,
    play, pause, seek, syncPlayback,
    platform, isManualMode, manualTime, partnerManualTime, partnerPlatform,
    manualPlay, manualPause, manualSeek, setPlatformAndSync,
  };
}
