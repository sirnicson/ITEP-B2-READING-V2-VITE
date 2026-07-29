import { useEffect, useRef, useState } from 'react';

export function useCountdown(initialSeconds: number, running: boolean, onExpire: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const expireCallback = useRef(onExpire);

  useEffect(() => {
    expireCallback.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!running || secondsLeft <= 0) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running, secondsLeft]);

  useEffect(() => {
    if (running && secondsLeft === 0) expireCallback.current();
  }, [running, secondsLeft]);

  return {
    secondsLeft,
    reset: () => setSecondsLeft(initialSeconds),
  };
}
