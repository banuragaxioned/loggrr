import { useEffect, useState } from "react";

const useLocale = (): string => {
  const [locale, setLocale] = useState("en-US");

  useEffect(() => {
    const getLocale = (): string => {
      if (typeof window !== "undefined") {
        return window.navigator.language;
      }
      return "en-US";
    };

    setLocale(getLocale());
  }, []);

  return locale;
};

export default useLocale;
