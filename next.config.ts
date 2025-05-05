import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["img.pokemondb.net", "projectpokemon.org"],
  },
};

export default nextConfig;
