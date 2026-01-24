import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TripData } from "@/data/tripData";
import { sampleTrip } from "@/data/tripData";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface NewTripSidebarProps {
  initialMessage?: string | null;
  mode?: string | null;
  onTripGenerated?: (trip: TripData) => void;
}

// Mock responses based on user input
const getMockResponse = (message: string, mode?: string | null): { response: string; generateTrip: boolean } => {
  const lowerMessage = message.toLowerCase();
  
  if (mode === "inspire") {
    return {
      response: "I'd love to help inspire your next adventure! Based on current travel trends, here are some amazing destinations:\n\n🏛️ **Jordan** - Ancient wonders like Petra and desert landscapes\n🇯🇵 **Japan** - Cherry blossoms and rich culture\n🇵🇹 **Portugal** - Stunning coastlines and historic cities\n🇳🇿 **New Zealand** - Adventure and natural beauty\n\nWhich of these catches your eye? Or tell me what kind of experience you're looking for!",
      generateTrip: false
    };
  }
  
  if (lowerMessage.includes("jordan") || lowerMessage.includes("petra") || lowerMessage.includes("middle east")) {
    return {
      response: "Excellent choice! Jordan is absolutely magical. I've crafted a 7-day itinerary covering Amman, Petra, and Wadi Rum. You'll explore ancient ruins, float in the Dead Sea, and camp under desert stars. Take a look at your personalized trip! ✨",
      generateTrip: true
    };
  }
  
  if (lowerMessage.includes("beach") || lowerMessage.includes("relax") || lowerMessage.includes("tropical")) {
    return {
      response: "A beach getaway sounds perfect! I'm thinking crystal-clear waters and white sand. Let me know your preferred region:\n\n🌴 Caribbean\n🏝️ Southeast Asia\n🌊 Mediterranean\n🐚 Pacific Islands\n\nOr share your budget and dates, and I'll find the ideal spot!",
      generateTrip: false
    };
  }
  
  if (lowerMessage.includes("europe") || lowerMessage.includes("cultural") || lowerMessage.includes("history")) {
    return {
      response: "Europe is a treasure trove of culture and history! Are you drawn to:\n\n🏰 Medieval castles and ancient ruins\n🎨 Art and museums\n🍷 Food and wine experiences\n🏙️ Vibrant city life\n\nShare your interests and I'll curate the perfect European adventure!",
      generateTrip: false
    };
  }
  
  if (lowerMessage.includes("adventure") || lowerMessage.includes("hiking") || lowerMessage.includes("outdoor")) {
    return {
      response: "Adventure awaits! For outdoor enthusiasts, I recommend:\n\n🏔️ Nepal - Himalayan treks\n🇳🇿 New Zealand - Ultimate adventure playground\n🇮🇸 Iceland - Glaciers and volcanoes\n🇵🇪 Peru - Machu Picchu and beyond\n\nWhat's your fitness level and preferred climate?",
      generateTrip: false
    };
  }
  
  // Default response for trip requests
  if (lowerMessage.includes("trip") || lowerMessage.includes("plan") || lowerMessage.includes("travel") || lowerMessage.includes("vacation")) {
    return {
      response: "I'd love to help plan your perfect trip! To create a personalized itinerary, tell me:\n\n📍 Where would you like to go?\n📅 How many days do you have?\n💰 What's your budget range?\n👥 Who's traveling with you?\n\nShare any details and I'll start crafting your adventure!",
      generateTrip: false
    };
  }
  
  return {
    response: "That sounds interesting! Tell me more about what you're looking for in your trip. Are you seeking relaxation, adventure, culture, or a mix of everything?",
    generateTrip: false
  };
};

const quickSuggestions = [
  { emoji: "🏖️", label: "Beach vacation" },
  { emoji: "🏛️", label: "Cultural exploration" },
  { emoji: "🏔️", label: "Adventure trip" },
  { emoji: "🍷", label: "Food & wine tour" },
];

export function NewTripSidebar({ initialMessage, mode, onTripGenerated }: NewTripSidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [displayedResponse, setDisplayedResponse] = useState("");
  const [hasProcessedInitial, setHasProcessedInitial] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedResponse, scrollToBottom]);

  const startTypingAnimation = useCallback((fullResponse: string, shouldGenerateTrip: boolean) => {
    setIsTyping(true);
    setDisplayedResponse("");
    let currentIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (currentIndex < fullResponse.length) {
        setDisplayedResponse(fullResponse.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: fullResponse
        }]);
        setDisplayedResponse("");
        
        if (shouldGenerateTrip && onTripGenerated) {
          setTimeout(() => {
            onTripGenerated(sampleTrip);
          }, 500);
        }
      }
    }, 15);
    
    return () => clearInterval(typeInterval);
  }, [onTripGenerated]);

  const handleSendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    
    // Get mock response
    setTimeout(() => {
      const { response, generateTrip } = getMockResponse(text, mode);
      startTypingAnimation(response, generateTrip);
    }, 500);
  }, [mode, startTypingAnimation]);

  // Handle initial message or mode
  useEffect(() => {
    if (hasProcessedInitial) return;
    
    if (initialMessage) {
      setHasProcessedInitial(true);
      setTimeout(() => {
        handleSendMessage(initialMessage);
      }, 300);
    } else if (mode === "inspire") {
      setHasProcessedInitial(true);
      setTimeout(() => {
        const { response } = getMockResponse("", "inspire");
        startTypingAnimation(response, false);
      }, 500);
    }
  }, [initialMessage, mode, hasProcessedInitial, handleSendMessage, startTypingAnimation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const introText = mode === "inspire" 
    ? "Let me inspire your next adventure!"
    : "Tell me about your dream trip";

  return (
    <motion.div
      className="bg-card rounded-2xl border border-border shadow-lg h-[calc(100vh-180px)] sticky top-24 flex flex-col overflow-hidden"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Voyager</h3>
            <p className="text-xs text-muted-foreground">AI Trip Planner</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Intro Message */}
        {messages.length === 0 && !isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-secondary/50 rounded-2xl rounded-tl-md p-4">
              <p className="text-foreground text-sm leading-relaxed">
                👋 Hi there! {introText}. Whether you're dreaming of ancient ruins, tropical beaches, or mountain adventures – I'm here to help plan your perfect getaway.
              </p>
            </div>
          </motion.div>
        )}

        {/* Message History */}
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-secondary/50 text-foreground rounded-tl-md"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>
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
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                {displayedResponse}
                <span className="inline-block w-1.5 h-4 bg-primary/60 ml-0.5 animate-pulse" />
              </p>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {messages.length === 0 && !isTyping && mode !== "inspire" && (
        <div className="px-4 pb-3">
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion) => (
              <button
                key={suggestion.label}
                onClick={() => handleSuggestionClick(`I'm looking for a ${suggestion.label.toLowerCase()}`)}
                className="text-xs px-3 py-1.5 bg-secondary/70 hover:bg-secondary text-foreground rounded-full transition-colors"
              >
                {suggestion.emoji} {suggestion.label}
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
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Describe your dream trip..."
            className="flex-1 bg-secondary/50 rounded-full px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            disabled={isTyping}
          />
          <Button
            type="submit"
            size="icon"
            variant="hero"
            className="rounded-full h-9 w-9"
            disabled={!inputValue.trim() || isTyping}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
