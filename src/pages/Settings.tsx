import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

export default function Settings() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  useEffect(() => {
    // Redirect to profile page when accessing /settings directly
    navigate(`/${lang}/settings/profile`);
  }, [navigate, lang]);

  return null;
}
