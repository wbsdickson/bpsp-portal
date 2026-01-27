import { useEffect, useRef, useState } from "react";

interface UseCountdownProps {
  countStart: number;
  intervalMs?: number;
  isIncrement?: boolean;
}

interface UseCountdownHelpers {
  startCountdown: () => void;
  stopCountdown: () => void;
  resetCountdown: () => void;
  setCount: (count: number) => void;
}

export function useCountdown({
  countStart,
  intervalMs = 1000,
  isIncrement = false,
}: UseCountdownProps): [number, UseCountdownHelpers] {
  const [count, setCount] = useState(countStart);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCountdown = () => {
    setIsRunning(true);
  };

  const stopCountdown = () => {
    setIsRunning(false);
  };

  const resetCountdown = () => {
    setIsRunning(false);
    setCount(countStart);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setCount((prevCount) => {
          if (isIncrement) {
            return prevCount + 1;
          }
          if (prevCount <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prevCount - 1;
        });
      }, intervalMs);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, intervalMs, isIncrement]);

  useEffect(() => {
    setCount(countStart);
  }, [countStart]);

  return [count, { startCountdown, stopCountdown, resetCountdown, setCount }];
}
