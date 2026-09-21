import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  webpack(config, { webpack }) {
    // The existing Sites build uses Cloudflare's native environment module.
    // Vercel's Node runtime reads the same values from process.env instead.
    config.plugins.push(new webpack.NormalModuleReplacementPlugin(
      /^cloudflare:workers$/,
      path.resolve(process.cwd(), 'lib/vercel-cloudflare-env.ts'),
    ));
    config.module.rules.push({ test: /\.md$/, type: 'asset/source' });
    return config;
  },
};

export default nextConfig;
