import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to store swap transaction in Supabase
export async function storeSwapTransaction(transaction: {
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  walletAddress: string;
  txSignature: string;
  timestamp: number;
}) {
  try {
    const { data, error } = await supabase
      .from("swap_transactions")
      .insert(transaction);

    if (error) {
      console.error("Error storing transaction:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error storing transaction:", error);
    return { success: false, error };
  }
}
