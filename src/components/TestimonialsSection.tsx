const testimonials = [
  {
    id: 1,
    quote: "Voyager is hands down the best AI travel agent I've ever used; the smart trip planner built a custom itinerary for our family vacation in minutes.",
    name: "Scott",
    age: 54,
    avatar: "👨‍💼",
  },
  {
    id: 2,
    quote: "We booked our dream honeymoon through Voyager's online trip planner, and it handled flights, hotels and activities better than any traditional travel agent.",
    name: "Yesenia",
    age: 32,
    avatar: "👩",
  },
  {
    id: 3,
    quote: "As a busy parent, I love that Voyager's family trip planner acted like a personal travel agent. It saved hours of research and delivered amazing experiences.",
    name: "Neil",
    age: 60,
    avatar: "👴",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-8 md:mb-12">
          What travellers say about me
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-card rounded-2xl p-6 border border-border"
            >
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg">
                  {testimonial.avatar}
                </div>
                <span className="font-semibold text-foreground">
                  {testimonial.name}, {testimonial.age}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
