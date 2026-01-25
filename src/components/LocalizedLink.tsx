import { Link, LinkProps } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { forwardRef } from "react";

interface LocalizedLinkProps extends Omit<LinkProps, "to"> {
  to: string;
}

export const LocalizedLink = forwardRef<HTMLAnchorElement, LocalizedLinkProps>(
  ({ to, children, ...props }, ref) => {
    const { localizedPath } = useLanguage();
    
    // Don't localize external links or hash links
    if (to.startsWith("http") || to.startsWith("#") || to.startsWith("mailto:")) {
      return (
        <Link ref={ref} to={to} {...props}>
          {children}
        </Link>
      );
    }

    return (
      <Link ref={ref} to={localizedPath(to)} {...props}>
        {children}
      </Link>
    );
  }
);

LocalizedLink.displayName = "LocalizedLink";
