import React from "react";
import { useTheme } from "next-themes";

import { Eglise } from "@/app/lib/config/interface";

export default function FooterSite({}: { eglise: Eglise }) {
  const { theme } = useTheme();

  return (
    <div
      className="flex"
      style={{
        position: "relative",
        background: theme == "dark" ? "white" : "black",
        height: 70,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <p style={{ fontSize: 20, color: theme != "dark" ? "white" : "black" }}>
        @ Copyright EcclesiaBook - 2025
      </p>
    </div>
  );
}
