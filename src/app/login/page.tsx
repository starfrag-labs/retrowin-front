"use client";

import { useEffect } from "react";
import { initiateLogin } from "@/api/generated";

export default function LoginPage() {
  useEffect(() => {
    initiateLogin({ credentials: "include" }).then((response) => {
      if (response.status === 200 && response.data.authorizationUrl) {
        window.location.href = response.data.authorizationUrl;
      }
    });
  }, []);

  return (
    <div className="flex-center full-size">
      <p>Redirecting to login...</p>
    </div>
  );
}
