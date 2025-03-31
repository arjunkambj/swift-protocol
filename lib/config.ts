// lib/config.ts
export const SOLANA_NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK as
  | "devnet"
  | "mainnet-beta";
export const JUPITER_API = process.env.NEXT_PUBLIC_JUPITER_API;
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
