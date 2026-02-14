import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, Sparkles, Undo2, AlertCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TripData } from "@/data/tripData";
import { useChat } from "@/hooks/useChat";
import { useLoginDialog } from "@/contexts/LoginDialogContext";

// ============================================
// TYPES
// ============================================

interface QuickSuggestion {
  emoji: string;
  label: string;
  message?: string;
}

// Base props shared by both modes
interface BaseVoyagerChatProps {
  variant?: "sidebar" | "embedded";
  className?: string;
}

// Create mode props
interface CreateModeProps extends BaseVoyagerChatProps {
  mode: "create";
  initialMessage?: string | null;
  inspireMode?: boolean;
  onTripGenerated?: (trip: TripData) => void;
  onGeneratingChange?: (isGenerating: boolean) => void;
}

// Modify mode props
interface ModifyModeProps extends BaseVoyagerChatProps {
  mode: "modify";
  tripId?: string;
  tripData?: TripData | null;
  onTripGenerated?: (trip: TripData) => void;
  onGeneratingChange?: (isGenerating: boolean) => void;
  onUndo?: () => void;
  canUndo?: boolean;
}

type VoyagerChatProps = CreateModeProps | ModifyModeProps;

// ============================================
// STATIC SUGGESTIONS
// ============================================

const createModeSuggestions: QuickSuggestion[] = [
  { emoji: "🏖️", label: "Beach vacation", message: "I'm looking for a beach vacation" },
  { emoji: "🏛️", label: "Cultural exploration", message: "I'm looking for a cultural exploration" },
  { emoji: "🏔️", label: "Adventure trip", message: "I'm looking for an adventure trip" },
  { emoji: "🍷", label: "Food & wine tour", message: "I'm looking for a food & wine tour" },
];

const modifyModeSuggestions: QuickSuggestion[] = [
  { emoji: "💰", label: "Can you make this trip cheaper?" },
  { emoji: "✈️", label: "Can you remove the flights from this trip?" },
  { emoji: "🏙️", label: "Can you add more cities?" },
];

// ============================================
// COMPONENT
// ============================================

export function VoyagerChat(props: VoyagerChatProps) {
  const { mode, variant = "sidebar", className } = props;

  const isCreateMode = mode === "create";

  // Extract mode-specific props
  const initialMessage = isCreateMode ? (props as CreateModeProps).initialMessage : null;
  const inspireMode = isCreateMode ? (props as CreateModeProps).inspireMode : false;
  const onTripGenerated = isCreateMode
    ? (props as CreateModeProps).onTripGenerated
    : (props as ModifyModeProps).onTripGenerated;
  const onGeneratingChange = isCreateMode
    ? (props as CreateModeProps).onGeneratingChange
    : (props as ModifyModeProps).onGeneratingChange;
  const tripId = !isCreateMode ? (props as ModifyModeProps).tripId : undefined;
  const tripData = !isCreateMode ? (props as ModifyModeProps).tripData : undefined;
  const onUndo = !isCreateMode ? (props as ModifyModeProps).onUndo : undefined;
  const canUndo = !isCreateMode ? (props as ModifyModeProps).canUndo : false;

  const { openLoginDialog, loginDialogOpen } = useLoginDialog();

  // AI chat hook
  const {
    messages,
    isStreaming,
    streamingContent,
    error,
    requiresAuth,
    sendMessage,
    checkAuth,
  } = useChat({
    mode: isCreateMode ? "create" : "modify",
    tripId,
    tripData: tripData ?? null,
    onTripGenerated,
    onGeneratingChange,
  });

  const [inputValue, setInputValue] = useState("");
  const [hasProcessedInitial, setHasProcessedInitial] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Re-check auth when login dialog closes (user may have just logged in)
  useEffect(() => {
    if (!loginDialogOpen && requiresAuth) {
      checkAuth();
    }
  }, [loginDialogOpen, requiresAuth, checkAuth]);

  const suggestions = isCreateMode ? createModeSuggestions : modifyModeSuggestions;
  const placeholderText = isCreateMode ? "Describe your dream trip..." : "Ask anything...";

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, scrollToBottom]);

  // Handle initial message for create mode (skip if not authenticated)
  useEffect(() => {
    if (!isCreateMode || hasProcessedInitial || requiresAuth) return;

    if (initialMessage) {
      setHasProcessedInitial(true);
      setTimeout(() => {
        sendMessage(initialMessage);
      }, 300);
    } else if (inspireMode) {
      setHasProcessedInitial(true);
      setTimeout(() => {
        sendMessage("Inspire me! What are some amazing destinations I should consider?");
      }, 500);
    }
  }, [isCreateMode, initialMessage, inspireMode, hasProcessedInitial, requiresAuth, sendMessage]);

  const handleUndo = useCallback(() => {
    if (onUndo && canUndo) {
      onUndo();
      // The undo action is handled by the parent - we just send a message for context
      sendMessage("Undo last change");
    }
  }, [onUndo, canUndo, sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isStreaming) {
      sendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleSuggestionClick = (suggestion: QuickSuggestion) => {
    const messageToSend = suggestion.message || suggestion.label;
    sendMessage(messageToSend);
  };

  const hasMessages = messages.length > 0 || isStreaming;

  const introText = isCreateMode
    ? inspireMode
      ? "Let me inspire your next adventure!"
      : "Tell me about your dream trip"
    : "I can help modify your trip — add cities, find cheaper options, remove flights, and more. Just ask!";

  const containerClass = variant === "sidebar"
    ? "bg-card rounded-2xl border border-border shadow-lg h-[calc(100vh-180px)] sticky top-24 flex flex-col overflow-hidden"
    : "flex flex-col h-full";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={`${containerClass} ${className || ""}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Voyager</h3>
            <p className="text-xs text-muted-foreground">AI Trip Planner</p>
          </div>
        </div>
        {!isCreateMode && canUndo && (
          <button
            type="button"
            onClick={handleUndo}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary"
            title="Undo last change"
          >
            <Undo2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Intro Message */}
        {!hasMessages && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-secondary/50 rounded-2xl rounded-tl-md p-4">
              <p className="text-foreground text-sm leading-relaxed">
                👋 Hi there! {introText}
              </p>
            </div>
          </motion.div>
        )}

        {/* Sign-in Prompt */}
        {requiresAuth && !hasMessages && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <div className="bg-primary/5 border border-primary/20 rounded-2xl rounded-tl-md p-4">
              <p className="text-foreground text-sm leading-relaxed mb-3">
                Sign in to start planning your trip with Voyager AI.
              </p>
              <Button
                variant="hero"
                size="sm"
                onClick={openLoginDialog}
                className="gap-2"
              >
                <LogIn className="h-4 w-4" />
                Sign in to start
              </Button>
            </div>
          </motion.div>
        )}

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm"
          >
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <p className="flex-1">{error}</p>
          </motion.div>
        )}

        {/* Message History */}
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-secondary/50 text-foreground rounded-tl-md"
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Streaming Response */}
        {isStreaming && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="max-w-[85%] bg-secondary/50 rounded-2xl rounded-tl-md p-3 text-sm">
              {streamingContent ? (
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {streamingContent}
                  <span className="inline-block w-1.5 h-4 bg-primary/60 ml-0.5 animate-pulse" />
                </p>
              ) : (
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              )}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {!hasMessages && !requiresAuth && !(isCreateMode && inspireMode) && (
        <div className="px-4 pb-3">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.label}
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isStreaming}
                className="text-xs px-3 py-1.5 bg-secondary/70 hover:bg-secondary text-foreground rounded-full transition-colors disabled:opacity-50"
              >
                {suggestion.emoji} {suggestion.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={requiresAuth ? (e) => { e.preventDefault(); openLoginDialog(); } : handleSubmit} className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary"
          >
            <Mic className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={requiresAuth ? "Sign in to start chatting..." : placeholderText}
            className="flex-1 bg-secondary/50 rounded-full px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            disabled={isStreaming || requiresAuth}
            onClick={requiresAuth ? openLoginDialog : undefined}
          />
          <Button
            type="submit"
            size="icon"
            variant="hero"
            className="rounded-full h-9 w-9"
            disabled={requiresAuth || !inputValue.trim() || isStreaming}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
