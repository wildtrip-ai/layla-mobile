import { motion } from "framer-motion";
import { Plane } from "lucide-react";
import { TransportCard } from "./TransportCard";
import type { Transport } from "@/data/tripData";

interface TransportSectionProps {
  transports: Transport[];
}

export function TransportSection({ transports }: TransportSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <Plane className="h-6 w-6 text-foreground" />
        <div>
          <h2 className="text-2xl font-serif text-foreground">Transport</h2>
          <p className="text-sm text-muted-foreground">1 May, 2026</p>
        </div>
      </div>

      {/* Transport Cards */}
      <div className="space-y-4">
        {transports.map((transport) => (
          <TransportCard key={transport.id} transport={transport} />
        ))}
      </div>
    </motion.div>
  );
}
