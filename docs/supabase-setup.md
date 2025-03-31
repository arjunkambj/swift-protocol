# Supabase Setup Guide

This document explains how to set up the Supabase database for storing swap transactions in the Swift Protocol application.

## Setting up Supabase

1. Create a Supabase account at [https://supabase.com](https://supabase.com) if you don't have one already.

2. Create a new project with your desired name and password.

3. Once your project is set up, navigate to the SQL Editor in the left sidebar.

4. Create a new query and paste the following SQL to create the `swap_transactions` table:

```sql
-- Create a table for storing swap transactions
CREATE TABLE public.swap_transactions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    from_token text NOT NULL,
    to_token text NOT NULL,
    from_amount numeric(20, 8) NOT NULL,
    to_amount numeric(20, 8) NOT NULL,
    wallet_address text NOT NULL,
    tx_signature text NOT NULL,
    timestamp bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add indexes for faster queries
CREATE INDEX swap_transactions_wallet_idx ON public.swap_transactions (wallet_address);
CREATE INDEX swap_transactions_timestamp_idx ON public.swap_transactions (timestamp);

-- Set up RLS (Row Level Security) to control access
ALTER TABLE public.swap_transactions ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows read access to all authenticated users
CREATE POLICY "Allow read access to authenticated users"
ON public.swap_transactions
FOR SELECT
TO authenticated
USING (true);

-- Create a policy that allows insert access to all authenticated users
CREATE POLICY "Allow insert access to authenticated users"
ON public.swap_transactions
FOR INSERT
TO authenticated
WITH CHECK (true);
```

5. Run the query to create the table and set up the necessary policies.

## Connecting to Supabase

1. Go to the "Project Settings" > "API" in the Supabase dashboard.

2. Find your project URL and anon/public key.

3. Add these values to your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Restart your application if it's already running.

## Testing the Integration

1. Connect your wallet in the application.

2. Perform a swap operation.

3. Check the Supabase Table Editor to verify that the transaction has been recorded in the `swap_transactions` table.

## Querying Transaction History

You can use the following code snippet to query a user's transaction history:

```typescript
import { supabase } from "@/lib/supabase";

async function getUserTransactions(walletAddress: string) {
  const { data, error } = await supabase
    .from("swap_transactions")
    .select("*")
    .eq("wallet_address", walletAddress)
    .order("timestamp", { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }

  return data;
}
```

This function will return all transactions for a specific wallet address, sorted by timestamp in descending order (newest first).
