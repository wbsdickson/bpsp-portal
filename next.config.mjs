import nextIntl from "next-intl/plugin";
import bundleAnalyzer from "@next/bundle-analyzer";

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactCompiler: true,
  turbopack: {
    resolveAlias: {
      "next-intl/config": "./i18n.ts",
    },
    resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  experimental: {
    optimizePackageImports: ["@/components/icons"],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    domains: ["utfs.io", "cdn.dev.pg.at-dev.io"],
  },
  reactStrictMode: false,
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  output: "standalone",
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withNextIntl = nextIntl(
  // This is the default (also the `src` folder is supported out of the box)
  "./i18n.ts"
);

export default withBundleAnalyzer(withNextIntl(nextConfig));
