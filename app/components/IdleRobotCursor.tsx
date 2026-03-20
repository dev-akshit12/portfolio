"use client";

import { useEffect, useRef, useState } from "react";

const IDLE_DELAY_MS = 2000;
const DIALOG_LINES = ["Hey... recruiter", "How's the website?"] as const;
const TYPE_SPEED_MS = 105;
const DELETE_SPEED_MS = 58;
const LINE_HOLD_MS = 1500;
const BETWEEN_LINES_MS = 260;
const MOBILE_REPEAT_DELAY_MS = 10000;

type RobotMode = "pointer" | "fixed" | "disabled";

export default function IdleRobotCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isIdle, setIsIdle] = useState(false);
  const [mode, setMode] = useState<RobotMode>("disabled");
  const [dialogText, setDialogText] = useState("");
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const dialogTimeoutsRef = useRef<number[]>([]);
  const mobileLoopTimeoutRef = useRef<number | null>(null);

  const clearDialogTimers = () => {
    dialogTimeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    dialogTimeoutsRef.current = [];
  };

  const clearMobileLoopTimer = () => {
    if (mobileLoopTimeoutRef.current !== null) {
      window.clearTimeout(mobileLoopTimeoutRef.current);
      mobileLoopTimeoutRef.current = null;
    }
  };

  const resetDialog = () => {
    clearDialogTimers();
    setDialogText("");
    setIsDialogVisible(false);
  };

  const runDialogSequence = () => {
    clearDialogTimers();
    setDialogText("");
    setIsDialogVisible(true);

    let elapsed = 0;

    const schedule = (callback: () => void, delay: number) => {
      const timeoutId = window.setTimeout(callback, delay);
      dialogTimeoutsRef.current.push(timeoutId);
    };

    DIALOG_LINES.forEach((line, lineIndex) => {
      for (let charIndex = 1; charIndex <= line.length; charIndex += 1) {
        elapsed += TYPE_SPEED_MS;
        schedule(() => setDialogText(line.slice(0, charIndex)), elapsed);
      }

      elapsed += LINE_HOLD_MS;

      for (let charIndex = line.length - 1; charIndex >= 0; charIndex -= 1) {
        elapsed += DELETE_SPEED_MS;
        schedule(() => setDialogText(line.slice(0, charIndex)), elapsed);
      }

      if (lineIndex < DIALOG_LINES.length - 1) {
        elapsed += BETWEEN_LINES_MS;
      }
    });

    schedule(() => {
      setDialogText("");
      setIsDialogVisible(false);
    }, elapsed + 120);

    return elapsed + 120;
  };

  useEffect(() => {
    const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const mobileQuery = window.matchMedia("(max-width: 768px)");

    const getMode = (): RobotMode => {
      if (mobileQuery.matches) {
        return "fixed";
      }

      if (finePointerQuery.matches) {
        return "pointer";
      }

      return "disabled";
    };

    const updateMode = () => {
      const nextMode = getMode();
      setMode(nextMode);
      setIsIdle(false);
      clearMobileLoopTimer();
      resetDialog();

      if (nextMode !== "pointer") {
        document.body.classList.remove("robot-cursor-idle");
      }
    };

    updateMode();
    finePointerQuery.addEventListener("change", updateMode);
    mobileQuery.addEventListener("change", updateMode);

    return () => {
      finePointerQuery.removeEventListener("change", updateMode);
      mobileQuery.removeEventListener("change", updateMode);
      document.body.classList.remove("robot-cursor-idle");
      clearMobileLoopTimer();
      resetDialog();
    };
  }, []);

  useEffect(() => {
    if (mode !== "pointer") {
      document.body.classList.remove("robot-cursor-idle");
      return;
    }

    document.body.classList.toggle("robot-cursor-idle", isIdle);
  }, [isIdle, mode]);

  useEffect(() => {
    if (mode !== "pointer") {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }

      return;
    }

    const clearIdleTimeout = () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };

    const armIdleTimer = () => {
      clearIdleTimeout();

      if (document.hidden) {
        return;
      }

      timeoutRef.current = window.setTimeout(() => {
        setIsIdle(true);
      }, IDLE_DELAY_MS);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }

      setPosition({ x: event.clientX, y: event.clientY });
      setIsIdle(false);
      armIdleTimer();
    };

    const handleActivity = () => {
      setIsIdle(false);
      armIdleTimer();
    };

    const handlePointerLeave = () => {
      clearIdleTimeout();
      setIsIdle(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearIdleTimeout();
        setIsIdle(false);
        return;
      }

      armIdleTimer();
    };

    armIdleTimer();
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handleActivity, { passive: true });
    window.addEventListener("wheel", handleActivity, { passive: true });
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("blur", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearIdleTimeout();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handleActivity);
      window.removeEventListener("wheel", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("blur", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [mode]);

  useEffect(() => {
    if (mode !== "pointer") {
      return;
    }

    if (!isIdle) {
      resetDialog();
      return;
    }

    runDialogSequence();

    return () => {
      resetDialog();
    };
  }, [isIdle, mode]);

  useEffect(() => {
    clearMobileLoopTimer();

    if (mode !== "fixed") {
      return;
    }

    let isCancelled = false;

    const loopDialog = () => {
      if (isCancelled) {
        return;
      }

      const sequenceDuration = runDialogSequence();

      mobileLoopTimeoutRef.current = window.setTimeout(() => {
        loopDialog();
      }, sequenceDuration + MOBILE_REPEAT_DELAY_MS);
    };

    loopDialog();

    return () => {
      isCancelled = true;
      clearMobileLoopTimer();
      resetDialog();
    };
  }, [mode]);

  if (mode === "disabled") {
    return null;
  }

  const isFixedMode = mode === "fixed";
  const isVisible = isFixedMode || isIdle;

  return (
    <div
      className={`idle-robot-cursor ${isVisible ? "is-visible" : ""} ${
        isFixedMode ? "is-mobile-fixed" : "is-pointer-mode"
      }`}
      style={isFixedMode ? undefined : { left: position.x, top: position.y }}
      aria-hidden="true"
    >
      <div className={`idle-robot-dialog ${isDialogVisible ? "is-visible" : ""}`}>
        <span className="idle-robot-dialog-text">
          {dialogText}
          <span className="idle-robot-dialog-cursor" />
        </span>
      </div>

      <svg viewBox="0 0 72 72" className="idle-robot-svg">
        <g className="idle-robot-float">
          <rect x="18" y="22" width="30" height="24" rx="8" className="idle-robot-head" />
          <rect x="22" y="26" width="22" height="14" rx="5" className="idle-robot-face" />
          <circle cx="30" cy="33" r="2.4" className="idle-robot-eye" />
          <circle cx="38" cy="33" r="2.4" className="idle-robot-eye" />
          <rect x="31.5" y="15" width="3" height="8" rx="1.5" className="idle-robot-limb" />
          <circle cx="33" cy="14" r="3.2" className="idle-robot-accent" />
          <rect x="24" y="46" width="18" height="16" rx="7" className="idle-robot-body" />
          <rect x="15" y="47" width="8" height="4" rx="2" className="idle-robot-limb" />
          <g className="idle-robot-wave">
            <rect x="45" y="43" width="10" height="4" rx="2" className="idle-robot-limb" />
            <circle cx="56.5" cy="45" r="3.2" className="idle-robot-accent" />
          </g>
          <rect x="27" y="60" width="4" height="8" rx="2" className="idle-robot-limb" />
          <rect x="35" y="60" width="4" height="8" rx="2" className="idle-robot-limb" />
          <circle cx="29" cy="68" r="2.3" className="idle-robot-accent" />
          <circle cx="37" cy="68" r="2.3" className="idle-robot-accent" />
        </g>
      </svg>
    </div>
  );
}
