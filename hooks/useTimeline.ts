'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  register as registerPlaybackLock,
  claim as claimPlaybackLock,
  release as releasePlaybackLock,
} from '@/lib/playbackLock';

export interface UseTimelineOptions {
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  duration?: number;
  lockId?: string;
}

export interface UseTimelineReturn {
  currentTime: number;
  duration: number;
  playing: boolean;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  togglePlay: () => void;
}

export function useTimeline({
  videoRef,
  duration = 15,
  lockId = 'breakdown-timeline',
}: UseTimelineOptions = {}): UseTimelineReturn {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const [actualDuration, setActualDuration] = useState<number>(duration);

  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const currentTimeRef = useRef<number>(0);

  // Keep ref synchronized outside of render
  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  // Pause helper
  const pause = useCallback(() => {
    setPlaying(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastTimeRef.current = null;

    if (videoRef?.current) {
      videoRef.current.pause();
    }
    releasePlaybackLock(lockId);
  }, [videoRef, lockId]);

  // Play helper
  const play = useCallback(() => {
    claimPlaybackLock(lockId);
    setPlaying(true);

    if (videoRef?.current && videoRef.current.src) {
      videoRef.current.play().catch(() => {
        setPlaying(false);
      });
    }
  }, [videoRef, lockId]);

  const togglePlay = useCallback(() => {
    if (playing) {
      pause();
    } else {
      play();
    }
  }, [playing, play, pause]);

  // Seek helper
  const seek = useCallback(
    (targetTime: number) => {
      const clamped = Math.max(0, Math.min(targetTime, actualDuration));
      setCurrentTime(clamped);
      currentTimeRef.current = clamped;

      if (videoRef?.current && videoRef.current.src) {
        videoRef.current.currentTime = clamped;
      }
    },
    [actualDuration, videoRef]
  );

  // Register in playback lock
  useEffect(() => {
    const unregister = registerPlaybackLock(lockId, () => {
      pause();
    });
    return () => {
      unregister();
      releasePlaybackLock(lockId);
    };
  }, [lockId, pause]);

  // Real video event binding
  useEffect(() => {
    const video = videoRef?.current;
    if (!video || !video.src) return;

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      currentTimeRef.current = video.currentTime;
    };

    const onDurationChange = () => {
      if (video.duration && !isNaN(video.duration)) {
        setActualDuration(video.duration);
      }
    };

    const onPlay = () => {
      setPlaying(true);
      claimPlaybackLock(lockId);
    };

    const onPause = () => {
      setPlaying(false);
    };

    const onEnded = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('durationchange', onDurationChange);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnded);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('durationchange', onDurationChange);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnded);
    };
  }, [videoRef, lockId]);

  // Simulated clock loop (used when no real video src is playing)
  useEffect(() => {
    const video = videoRef?.current;
    const isRealVideoActive = Boolean(video && video.src);

    if (isRealVideoActive || !playing) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimeRef.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      const nextTime = (currentTimeRef.current + delta) % actualDuration;
      setCurrentTime(nextTime);
      currentTimeRef.current = nextTime;

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimeRef.current = null;
    };
  }, [playing, actualDuration, videoRef]);

  return {
    currentTime,
    duration: actualDuration,
    playing,
    play,
    pause,
    seek,
    togglePlay,
  };
}
