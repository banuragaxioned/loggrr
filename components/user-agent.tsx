"use client"; // Ensure this is client-side

import { useEffect } from "react";

export default function FacebookRedirect() {
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isFacebookApp = /FBAN|FBAV/.test(userAgent);

    if (isFacebookApp) {
      window.open("https://loggrr.com/thanks", "_blank");
    }
  }, []);

  return null;
}
