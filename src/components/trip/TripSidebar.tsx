import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mic, Send, Calendar } from "lucide-react";
import { useState } from "react";

export function TripSidebar() {
  const [message, setMessage] = useState("");

  const suggestions = [
    { emoji: "💰", text: "Can you make this trip cheaper?" },
    { emoji: "✈️", text: "Can you remove the flights from this trip?" },
    { emoji: "🏙️", text: "Can you add more cities?" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-2xl border border-border p-6 h-fit sticky top-24"
    >
      {/* AI Avatar & Intro */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🌍</span>
          <h2 className="text-xl font-serif text-foreground">
            Hey, I'm Voyager, your AI trip planner.
          </h2>
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          This is a sample trip — I can add cities, find flights, activities, and local tips.
        </p>
      </div>

      <div className="mb-6">
        <p className="text-muted-foreground text-sm leading-relaxed">
          Tell me your style and budget, and I'll design a trip just for you.
        </p>
      </div>

      {/* Quick Suggestions */}
      <div className="space-y-2 mb-6">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full text-left px-4 py-3 rounded-lg border border-border bg-background hover:bg-secondary transition-colors text-sm"
          >
            <span className="mr-2">{suggestion.emoji}</span>
            {suggestion.text}
          </motion.button>
        ))}
      </div>

      {/* Chat Input */}
      <div className="border-t border-border pt-4">
        <div className="bg-background rounded-xl border border-border p-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask anything..."
            className="w-full bg-transparent border-none focus:outline-none text-sm text-foreground placeholder:text-muted-foreground"
          />
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary">
                <Calendar className="h-4 w-4" />
              </button>
              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary">
                <Mic className="h-4 w-4" />
              </button>
            </div>
            <Button size="icon" className="h-8 w-8 rounded-lg">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-3">
          Instant replies, no wait time ⚡
        </p>
      </div>
    </motion.div>
  );
}
