import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.66"],
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
