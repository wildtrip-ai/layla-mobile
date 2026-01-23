import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is Voyager?",
    answer: "Voyager is an AI-powered travel planning assistant that helps you create personalized itineraries in minutes. Simply describe your dream trip, and we'll handle the research, recommendations, and planning for you.",
  },
  {
    question: "How does Voyager work?",
    answer: "Just tell Voyager about your travel preferences, budget, dates, and interests. Our AI analyzes millions of data points to create a customized itinerary with flights, accommodations, activities, and local tips tailored just for you.",
  },
  {
    question: "Can Voyager save me money on trips?",
    answer: "Absolutely! Voyager finds the best deals across flights, hotels, and activities. Our AI compares prices from hundreds of sources and suggests budget-friendly alternatives without compromising on quality.",
  },
  {
    question: "Is Voyager free to use?",
    answer: "Voyager offers a free tier that includes basic trip planning features. For advanced features like real-time price tracking, premium recommendations, and unlimited itinerary saves, we offer affordable subscription plans.",
  },
  {
    question: "Can I edit my itinerary after it's created?",
    answer: "Yes! Your itinerary is fully customizable. You can add, remove, or modify any part of your trip. Voyager will automatically adjust recommendations and timing based on your changes.",
  },
];

export function FAQSection() {
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-8 md:mb-12">
          Frequently asked questions
        </h2>

        <Accordion type="single" collapsible className="max-w-3xl">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-border">
              <AccordionTrigger className="text-left text-lg font-semibold text-foreground py-6 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
