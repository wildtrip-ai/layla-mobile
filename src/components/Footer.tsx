const footerLinks = {
  company: {
    title: "Company",
    links: ["Home", "About", "Contact", "FAQ"],
  },
  product: {
    title: "Product",
    links: ["Roam Around"],
  },
  legal: {
    title: "Legal",
    links: ["Privacy", "Terms", "Imprint"],
  },
  countries: {
    title: "Top Countries",
    links: ["Spain", "Italy", "Portugal", "Indonesia", "Germany", "All Countries"],
  },
  plan: {
    title: "Plan",
    links: ["Couple Travel Agent", "Family Travel Agent"],
  },
};

const socialLinks = ["TikTok", "Instagram", "LinkedIn", "YouTube", "Pinterest", "Reddit"];

export function Footer() {
  return (
    <footer className="py-12 md:py-16 bg-background border-t border-border">
      <div className="container mx-auto px-4">
        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-muted-foreground text-sm text-center md:text-left">
            <p>Made with 💙 in Berlin</p>
            <p>© 2026 All rights reserved by Voyager GmbH</p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social}
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
