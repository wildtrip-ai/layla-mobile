import { motion } from "framer-motion";
import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActivityItem } from "./ActivityItem";
import type { DayPlan } from "@/data/tripData";

interface DayPlanSectionProps {
  dayPlans: DayPlan[];
  dates: string;
  onAddClick?: () => void;
}

export function DayPlanSection({ dayPlans, dates, onAddClick }: DayPlanSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <Calendar className="h-6 w-6 text-foreground" />
        <div>
          <h2 className="text-2xl font-serif text-foreground">Day-by-Day Plan</h2>
          <p className="text-sm text-muted-foreground">{dates}</p>
        </div>
      </div>

      {/* Day Cards */}
      {dayPlans.map((day) => (
        <motion.div
          key={day.day}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4 }}
          className="relative pl-8 md:pl-12"
        >
          {/* Day Number Circle */}
          <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
            {day.day}
          </div>

          {/* Timeline Line */}
          <div className="absolute left-4 top-8 bottom-0 w-px bg-border" />

          {/* Day Content */}
          <div className="pb-8">
            {/* Day Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-muted-foreground">
                {day.date}, {day.dayOfWeek}
              </span>
              <span className="text-muted-foreground">•</span>
              <span>{day.weather}</span>
              <span className="text-muted-foreground">{day.temperature}°C</span>
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-1">
              {day.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {day.items.length} items
            </p>

            {/* Activities */}
            <div className="space-y-2">
              {day.items.map((item, index) => (
                <ActivityItem key={item.id} activity={item} index={index} />
              ))}
            </div>

            {/* Add Button */}
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 mt-4"
              onClick={onAddClick}
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </motion.div>
      ))}

      {/* Next City Button */}
      <div className="flex justify-center pt-4">
        <Button variant="outline" size="lg" className="w-full max-w-md">
          Next City
        </Button>
      </div>
    </motion.div>
  );
}
