import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const baseConfig: NextConfig = {
  /* config options here */
};

export default (phase: string): NextConfig => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      ...baseConfig,
      allowedDevOrigins: ["*.trycloudflare.com", "*.ngrok-free.dev"],
    };
  }

  return baseConfig;
};
