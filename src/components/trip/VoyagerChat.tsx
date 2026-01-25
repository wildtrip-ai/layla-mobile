import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, Sparkles, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TripData } from "@/data/tripData";
import { sampleTrip } from "@/data/tripData";

// ============================================
// TYPES
// ============================================

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  chips?: { emoji: string; label: string }[];
}

interface QuickSuggestion {
  emoji: string;
  label: string;
  message?: string; // Optional custom message to send
}

// Base props shared by both modes
interface BaseVoyagerChatProps {
  /** Whether to render as a sticky sidebar card or fill container */
  variant?: "sidebar" | "embedded";
  /** Custom class name */
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
  onRemoveFlights?: () => void;
  onAddCity?: (cityName: string) => void;
  onApplyBudgetChanges?: () => void;
  onUndo?: () => void;
  canUndo?: boolean;
}

type VoyagerChatProps = CreateModeProps | ModifyModeProps;

// ============================================
// CREATE MODE LOGIC
// ============================================

const createModeSuggestions: QuickSuggestion[] = [
  { emoji: "🏖️", label: "Beach vacation", message: "I'm looking for a beach vacation" },
  { emoji: "🏛️", label: "Cultural exploration", message: "I'm looking for a cultural exploration" },
  { emoji: "🏔️", label: "Adventure trip", message: "I'm looking for an adventure trip" },
  { emoji: "🍷", label: "Food & wine tour", message: "I'm looking for a food & wine tour" },
];

// Chips that trigger trip generation when clicked
const createModeChipActions: Set<string> = new Set([
  // Beach regions
  "Caribbean",
  "Southeast Asia",
  "Mediterranean",
  "Pacific Islands",
  // Cultural interests
  "Medieval castles and ancient ruins",
  "Art and museums",
  "Food and wine experiences",
  "Vibrant city life",
  // Adventure destinations
  "Nepal - Himalayan treks",
  "New Zealand - Ultimate adventure playground",
  "Iceland - Glaciers and volcanoes",
  "Peru - Machu Picchu and beyond",
]);

interface CreateModeResponseResult {
  response: string;
  generateTrip: boolean;
  chips?: { emoji: string; label: string }[];
}

const getCreateModeResponse = (message: string, inspireMode?: boolean): CreateModeResponseResult => {
  const lowerMessage = message.toLowerCase();
  
  // Check if this is a chip click that should trigger trip generation
  if (createModeChipActions.has(message)) {
    return {
      response: `Excellent choice! I've crafted a personalized ${message} itinerary for you. Explore the highlights, unique experiences, and hidden gems. Take a look at your trip! ✨`,
      generateTrip: true
    };
  }
  
  if (inspireMode) {
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
      response: "A beach getaway sounds perfect! I'm thinking crystal-clear waters and white sand. Let me know your preferred region, or share your budget and dates!",
      generateTrip: false,
      chips: [
        { emoji: "🌴", label: "Caribbean" },
        { emoji: "🏝️", label: "Southeast Asia" },
        { emoji: "🌊", label: "Mediterranean" },
        { emoji: "🐚", label: "Pacific Islands" }
      ]
    };
  }
  
  if (lowerMessage.includes("europe") || lowerMessage.includes("cultural") || lowerMessage.includes("history")) {
    return {
      response: "Europe is a treasure trove of culture and history! What draws you most? Share your interests and I'll curate the perfect adventure!",
      generateTrip: false,
      chips: [
        { emoji: "🏰", label: "Medieval castles and ancient ruins" },
        { emoji: "🎨", label: "Art and museums" },
        { emoji: "🍷", label: "Food and wine experiences" },
        { emoji: "🏙️", label: "Vibrant city life" }
      ]
    };
  }
  
  if (lowerMessage.includes("adventure") || lowerMessage.includes("hiking") || lowerMessage.includes("outdoor")) {
    return {
      response: "Adventure awaits! For outdoor enthusiasts, here are some incredible destinations. What's your fitness level and preferred climate?",
      generateTrip: false,
      chips: [
        { emoji: "🏔️", label: "Nepal - Himalayan treks" },
        { emoji: "🇳🇿", label: "New Zealand - Ultimate adventure playground" },
        { emoji: "🇮🇸", label: "Iceland - Glaciers and volcanoes" },
        { emoji: "🇵🇪", label: "Peru - Machu Picchu and beyond" }
      ]
    };
  }
  
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

// ============================================
// MODIFY MODE LOGIC
// ============================================

const modifyModeSuggestions: QuickSuggestion[] = [
  { emoji: "💰", label: "Can you make this trip cheaper?" },
  { emoji: "✈️", label: "Can you remove the flights from this trip?" },
  { emoji: "🏙️", label: "Can you add more cities?" },
];

const modifyModeChips: Record<string, { emoji: string; label: string }[]> = {
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

const modifyModeResponses: Record<string, string> = {
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

const modifyModeActions: Record<string, { action: string; param?: string }> = {
  "Jerash": { action: "addCity", param: "Jerash" },
  "Dead Sea": { action: "addCity", param: "Dead Sea" },
  "Madaba": { action: "addCity", param: "Madaba" },
  "Apply changes": { action: "applyBudget" },
  "Yes, remove flights": { action: "removeFlights" },
};

const defaultModifyResponse = "I understand! Let me look into that for your Jordan trip. Give me a moment to find the best options for you.";

// ============================================
// COMPONENT
// ============================================

export function VoyagerChat(props: VoyagerChatProps) {
  const { mode, variant = "sidebar", className } = props;
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [displayedResponse, setDisplayedResponse] = useState("");
  const [hasProcessedInitial, setHasProcessedInitial] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mode-specific values
  const isCreateMode = mode === "create";
  const suggestions = isCreateMode ? createModeSuggestions : modifyModeSuggestions;
  const placeholderText = isCreateMode ? "Describe your dream trip..." : "Ask anything...";
  
  // Create mode specific props
  const inspireMode = isCreateMode ? (props as CreateModeProps).inspireMode : false;
  const initialMessage = isCreateMode ? (props as CreateModeProps).initialMessage : null;
  const onTripGenerated = isCreateMode ? (props as CreateModeProps).onTripGenerated : undefined;
  const onGeneratingChange = isCreateMode ? (props as CreateModeProps).onGeneratingChange : undefined;
  
  // Modify mode specific props
  const onRemoveFlights = !isCreateMode ? (props as ModifyModeProps).onRemoveFlights : undefined;
  const onAddCity = !isCreateMode ? (props as ModifyModeProps).onAddCity : undefined;
  const onApplyBudgetChanges = !isCreateMode ? (props as ModifyModeProps).onApplyBudgetChanges : undefined;
  const onUndo = !isCreateMode ? (props as ModifyModeProps).onUndo : undefined;
  const canUndo = !isCreateMode ? (props as ModifyModeProps).canUndo : false;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedResponse, scrollToBottom]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  const startTypingAnimation = useCallback((fullResponse: string, options?: { 
    generateTrip?: boolean; 
    chips?: { emoji: string; label: string }[] 
  }) => {
    setIsTyping(true);
    setDisplayedResponse("");
    
    if (options?.generateTrip && onGeneratingChange) {
      onGeneratingChange(true);
    }
    
    let currentIndex = 0;
    
    typingIntervalRef.current = setInterval(() => {
      if (currentIndex < fullResponse.length) {
        setDisplayedResponse(fullResponse.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
        }
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: fullResponse,
          chips: options?.chips
        }]);
        setDisplayedResponse("");
        
        if (options?.generateTrip && onTripGenerated) {
          setTimeout(() => {
            onGeneratingChange?.(false);
            onTripGenerated(sampleTrip);
          }, 1500);
        }
      }
    }, 15);
  }, [onTripGenerated, onGeneratingChange]);

  const handleSendMessage = useCallback((text: string) => {
    if (!text.trim() || isTyping) return;
    
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    
    setTimeout(() => {
      if (isCreateMode) {
        const { response, generateTrip, chips } = getCreateModeResponse(text, inspireMode);
        startTypingAnimation(response, { generateTrip, chips });
      } else {
        const response = modifyModeResponses[text] || defaultModifyResponse;
        const chips = modifyModeChips[text];
        
        // Check if this triggers an action
        const trigger = modifyModeActions[text];
        if (trigger) {
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
        
        startTypingAnimation(response, { chips });
      }
    }, 500);
  }, [isTyping, isCreateMode, inspireMode, startTypingAnimation, onAddCity, onApplyBudgetChanges, onRemoveFlights]);

  // Handle initial message for create mode
  useEffect(() => {
    if (!isCreateMode || hasProcessedInitial) return;
    
    if (initialMessage) {
      setHasProcessedInitial(true);
      setTimeout(() => {
        handleSendMessage(initialMessage);
      }, 300);
    } else if (inspireMode) {
      setHasProcessedInitial(true);
      setTimeout(() => {
        const { response } = getCreateModeResponse("", true);
        startTypingAnimation(response, { generateTrip: false });
      }, 500);
    }
  }, [isCreateMode, initialMessage, inspireMode, hasProcessedInitial, handleSendMessage, startTypingAnimation]);

  const handleUndo = useCallback(() => {
    if (onUndo && canUndo) {
      onUndo();
      setMessages(prev => [
        ...prev,
        { id: `user-undo-${Date.now()}`, role: "user", content: "Undo last change" },
        { id: `assistant-undo-${Date.now()}`, role: "assistant", content: "✅ Done! I've reverted your last change. Your trip is back to its previous state." }
      ]);
    }
  }, [onUndo, canUndo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleSuggestionClick = (suggestion: QuickSuggestion) => {
    const messageToSend = suggestion.message || suggestion.label;
    handleSendMessage(messageToSend);
  };

  const hasMessages = messages.length > 0 || isTyping;

  // Intro text based on mode
  const introText = isCreateMode
    ? inspireMode
      ? "Let me inspire your next adventure!"
      : "Tell me about your dream trip"
    : "I can help modify your trip — add cities, find cheaper options, remove flights, and more. Just ask!";

  // Container styling
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
              
              {/* Chips - show after last assistant message (works in both modes) */}
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
      {!hasMessages && !(isCreateMode && inspireMode) && (
        <div className="px-4 pb-3">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.label}
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isTyping}
                className="text-xs px-3 py-1.5 bg-secondary/70 hover:bg-secondary text-foreground rounded-full transition-colors disabled:opacity-50"
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
            placeholder={placeholderText}
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
