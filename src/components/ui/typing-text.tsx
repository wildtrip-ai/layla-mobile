import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TypingTextProps {
  text: string;
  speed?: number;
  delay?: number;
  onComplete?: () => void;
  className?: string;
  showCursor?: boolean;
}

export function TypingText({
  text,
  speed = 20,
  delay = 0,
  onComplete,
  className = "",
  showCursor = true,
}: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setHasStarted(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!hasStarted) return;

    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(typeInterval);
  }, [text, speed, hasStarted, onComplete]);

  if (!hasStarted) {
    return null;
  }

  return (
    <span className={className}>
      {displayedText}
      {showCursor && !isComplete && (
        <motion.span
          className="inline-block w-0.5 h-[1em] bg-primary/60 ml-0.5 align-middle"
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
        />
      )}
    </span>
  );
}

interface RevealSequenceProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  initialDelay?: number;
}

export function RevealSequence({
  children,
  staggerDelay = 800,
  initialDelay = 0,
}: RevealSequenceProps) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount >= children.length) return;

    const timeout = setTimeout(
      () => {
        setVisibleCount((prev) => prev + 1);
      },
      visibleCount === 0 ? initialDelay : staggerDelay
    );

    return () => clearTimeout(timeout);
  }, [visibleCount, children.length, staggerDelay, initialDelay]);

  return (
    <>
      {children.slice(0, visibleCount).map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {child}
        </motion.div>
      ))}
    </>
  );
}
