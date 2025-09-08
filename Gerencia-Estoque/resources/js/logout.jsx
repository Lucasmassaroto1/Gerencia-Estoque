import { useEffect } from "react";
import { createRoot } from "react-dom/client";

function Logout(){
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": document
              .querySelector('meta[name="csrf-token"]')
              .getAttribute("content"),
            Accept: "application/json",
          },
        });

        const data = await res.json().catch(() => ({}));
        window.location.href = data?.redirect || "/login";
      } catch {
        window.location.href = "/login";
      }
    })();
  }, []);

  return null;
}

createRoot(document.getElementById("app")).render(<Logout />);