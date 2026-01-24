import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mic, Send, Undo2, Sparkles } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  chips?: { emoji: string; label: string }[];
}

interface TripSidebarProps {
  onRemoveFlights?: () => void;
  onAddCity?: (cityName: string) => void;
  onApplyBudgetChanges?: () => void;
  onUndo?: () => void;
  canUndo?: boolean;
}

// Chips to show after certain responses
const responseChips: Record<string, { emoji: string; label: string }[]> = {
  "Can you add more cities?": [
    { emoji: "🏛️", label: "Jerash" },
    { emoji: "🌊", label: "Dead Sea" },
    { emoji: "🏰", label: "Madaba" },
  ],
  "Can you make this trip cheaper?": [
    { emoji: "✅", label: "Apply changes" },
    { emoji: "❌", label: "Keep original" },
  ],
  "Can you remove the flights from this trip?": [
    { emoji: "✅", label: "Yes, remove flights" },
    { emoji: "❌", label: "Keep flights" },
  ],
};

// Mock responses for different user queries
const mockResponses: Record<string, string> = {
  "Can you make this trip cheaper?": "Absolutely! I found a few ways to save on your Jordan trip:\n\n• Switch to a 4-star hotel in Amman — saves ~$200/night\n• Book a group desert tour instead of private — saves $150\n• Use local buses between cities — saves $80\n\nWant me to apply these changes?",
  "Can you remove the flights from this trip?": "Sure! I can remove the Berlin to Amman flights. This means you'll need to arrange your own transportation to Jordan.\n\nThe updated trip will start directly at your Amman hotel on May 1st. I'll deduct UAH 20,425 from the total price.\n\nShould I proceed with this change?",
  "Can you add more cities?": "Great idea! Here are some cities I recommend adding to your Jordan trip:\n\n🏛️ **Jerash** — Ancient Roman ruins, 1-2 hours from Amman\n🌊 **Dead Sea** — Float in the saltiest lake on Earth\n🏰 **Madaba** — Famous Byzantine mosaics\n\nWhich city would you like to add?",
  "Jerash": "✅ Done! I've added Jerash to your itinerary.\n\n📍 **New Day Added: Jerash Day Trip**\n• Private car from Amman (1 hour)\n• Guided tour of ancient Roman ruins\n• Lunch at Lebanese House Restaurant\n• Return to Amman\n\nCheck your updated trip below!",
  "Dead Sea": "✅ Done! The Dead Sea has been added.\n\n📍 **New Day Added: Dead Sea Experience**\n• Morning transfer from Amman\n• Float in the mineral-rich waters\n• Mud spa treatment at Kempinski\n• Sunset views\n\nYour trip now includes this unforgettable experience!",
  "Madaba": "✅ Done! Madaba is now on your itinerary.\n\n📍 **New Day Added: Madaba & Mount Nebo**\n• 30-minute drive from Amman\n• St. George's Church famous mosaic map\n• Mount Nebo viewpoint\n\nPerfect half-day trip!",
  "Apply changes": "✅ Budget changes applied!\n\n• Hotel switched to Amman Rotana (4-star)\n• Walking tour changed to group option\n\nYou're saving approximately UAH 8,000 on this trip!",
  "Keep original": "No problem! I'll keep your original luxury selections. Let me know if you'd like to explore other options.",
  "Yes, remove flights": "✅ Flights removed!\n\nYour trip now starts directly at the hotel in Amman on May 1st. You've saved UAH 20,425.\n\nRemember to arrange your own transportation to Jordan.",
  "Keep flights": "Got it! Your flights from Berlin to Amman are kept in the itinerary. Let me know if you need anything else!",
};

const defaultResponse = "I understand! Let me look into that for your Jordan trip. Give me a moment to find the best options for you.";

// Actions that trigger real trip modifications
const actionTriggers: Record<string, { action: string; param?: string }> = {
  "Jerash": { action: "addCity", param: "Jerash" },
  "Dead Sea": { action: "addCity", param: "Dead Sea" },
  "Madaba": { action: "addCity", param: "Madaba" },
  "Apply changes": { action: "applyBudget" },
  "Yes, remove flights": { action: "removeFlights" },
};

export function TripSidebar({ onRemoveFlights, onAddCity, onApplyBudgetChanges, onUndo, canUndo }: TripSidebarProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedResponse, setDisplayedResponse] = useState("");
  const [pendingChips, setPendingChips] = useState<{ emoji: string; label: string }[] | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const suggestions = [
    { emoji: "💰", text: "Can you make this trip cheaper?" },
    { emoji: "✈️", text: "Can you remove the flights from this trip?" },
    { emoji: "🏙️", text: "Can you add more cities?" },
  ];

  // Handle undo with chat feedback
  const handleUndo = useCallback(() => {
    if (onUndo && canUndo) {
      onUndo();
      // Add undo feedback to chat
      setMessages(prev => [
        ...prev,
        { id: `user-undo-${Date.now()}`, role: "user", content: "Undo last change" },
        { id: `assistant-undo-${Date.now()}`, role: "assistant", content: "✅ Done! I've reverted your last change. Your trip is back to its previous state." }
      ]);
    }
  }, [onUndo, canUndo]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, displayedResponse]);

  // Typing animation effect
  const startTypingAnimation = useCallback((fullResponse: string, chips?: { emoji: string; label: string }[]) => {
    setIsTyping(true);
    setDisplayedResponse("");
    setPendingChips(null);

    let index = 0;
    typingIntervalRef.current = setInterval(() => {
      if (index < fullResponse.length) {
        setDisplayedResponse(fullResponse.slice(0, index + 1));
        index++;
      } else {
        // Typing complete
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
        }
        setIsTyping(false);
        // Add the complete message to chat history with chips
        setMessages(prev => [...prev, {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: fullResponse,
          chips: chips
        }]);
        setDisplayedResponse("");
        setPendingChips(chips || null);
      }
    }, 15); // Speed of typing
  }, []);

  const handleSendMessage = useCallback((text: string) => {
    if (!text.trim() || isTyping) return;

    // Clear pending chips when user sends a new message
    setPendingChips(null);

    // Add user message
    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      role: "user",
      content: text
    }]);

    // Clear input
    setMessage("");

    // Get mock response or default
    const response = mockResponses[text] || defaultResponse;
    const chips = responseChips[text];

    // Check if this message triggers a real action
    const trigger = actionTriggers[text];
    if (trigger) {
      // Execute action after a brief delay to show the response first
      setTimeout(() => {
        if (trigger.action === "addCity" && trigger.param && onAddCity) {
          onAddCity(trigger.param);
        } else if (trigger.action === "applyBudget" && onApplyBudgetChanges) {
          onApplyBudgetChanges();
        } else if (trigger.action === "removeFlights" && onRemoveFlights) {
          onRemoveFlights();
        }
      }, 800);
    }

    // Start typing animation after a short delay
    setTimeout(() => {
      startTypingAnimation(response, chips);
    }, 500);
  }, [isTyping, startTypingAnimation, onAddCity, onApplyBudgetChanges, onRemoveFlights]);

  const handleSuggestionClick = (suggestionText: string) => {
    handleSendMessage(suggestionText);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(message);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  const hasMessages = messages.length > 0 || isTyping;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-2xl border border-border shadow-lg h-[calc(100vh-180px)] sticky top-24 flex flex-col overflow-hidden"
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
        {canUndo && (
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
                👋 Hi there! I can help modify your trip — add cities, find cheaper options, remove flights, and more. Just ask!
              </p>
            </div>
          </motion.div>
        )}

        {/* Message History */}
        <AnimatePresence mode="popLayout">
          {messages.map((msg, msgIndex) => (
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
              
              {/* Show chips after assistant message if it's the last message */}
              {msg.role === "assistant" && msg.chips && msgIndex === messages.length - 1 && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="flex flex-wrap gap-2 pl-1"
                >
                  {msg.chips.map((chip, chipIndex) => (
                    <motion.button
                      key={chipIndex}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: 0.3 + chipIndex * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSendMessage(chip.label)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-background hover:bg-secondary hover:border-primary/30 transition-colors text-sm"
                    >
                      <span>{chip.emoji}</span>
                      <span className="text-foreground">{chip.label}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="max-w-[85%] bg-secondary/50 rounded-2xl rounded-tl-md p-3 text-sm">
              {displayedResponse ? (
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {displayedResponse}
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
      {!hasMessages && (
        <div className="px-4 pb-3">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion.text)}
                disabled={isTyping}
                className="text-xs px-3 py-1.5 bg-secondary/70 hover:bg-secondary text-foreground rounded-full transition-colors disabled:opacity-50"
              >
                {suggestion.emoji} {suggestion.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary"
          >
            <Mic className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 bg-secondary/50 rounded-full px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            disabled={isTyping}
          />
          <Button
            type="submit"
            size="icon"
            variant="hero"
            className="rounded-full h-9 w-9"
            disabled={!message.trim() || isTyping}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
