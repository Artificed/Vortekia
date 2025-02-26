import { useEffect, useRef, useCallback } from "react";

type InactivityTimerOptions = {
  onInactive: () => void;
  inactivityTimeout: number;
  isActive?: boolean;
};

export function useInactivityTimer({
  onInactive,
  inactivityTimeout,
  isActive = true,
}: InactivityTimerOptions) {
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clearInactivityTimeout = useCallback(() => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
      inactivityTimeoutRef.current = null;
    }
  }, []);

  const resetInactivityTimeout = useCallback(() => {
    clearInactivityTimeout();

    if (isActive) {
      inactivityTimeoutRef.current = setTimeout(() => {
        onInactive();
      }, inactivityTimeout);
    }
  }, [onInactive, inactivityTimeout, isActive, clearInactivityTimeout]);

  useEffect(() => {
    if (isActive) {
      const activityEvents = [
        "mousedown",
        "mousemove",
        "keypress",
        "scroll",
        "touchstart",
        "click",
      ];

      const handleActivity = () => {
        resetInactivityTimeout();
      };

      activityEvents.forEach((event) => {
        window.addEventListener(event, handleActivity);
      });

      resetInactivityTimeout();

      return () => {
        activityEvents.forEach((event) => {
          window.removeEventListener(event, handleActivity);
        });
        clearInactivityTimeout();
      };
    } else {
      clearInactivityTimeout();
    }
  }, [resetInactivityTimeout, clearInactivityTimeout, isActive]);

  return {
    resetInactivityTimeout,
    clearInactivityTimeout,
  };
}
