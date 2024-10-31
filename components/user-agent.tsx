"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function FacebookRedirect() {
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isFacebookApp = /FBAN|FBAV/.test(userAgent);

    if (isFacebookApp) {
      toast.info(
        "Google prohits logging into another app's webview as a security measure. Please click on 'Open in external browser'.",
        {
          duration: Infinity,
        },
      );
    }
  }, []);

  return null;
}
