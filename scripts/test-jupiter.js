// Test script to verify Jupiter API integration

// Sample token addresses for testing
const SOL_MINT = "So11111111111111111111111111111111111111112";
const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

// Jupiter API endpoints
const JUPITER_QUOTE_API = "https://quote-api.jup.ag/v6/quote";

async function testJupiterQuote() {
  try {
    // Create query parameters
    const queryParams = new URLSearchParams({
      inputMint: SOL_MINT,
      outputMint: USDC_MINT,
      amount: "100000000", // 0.1 SOL (with 9 decimals)
      slippageBps: "50", // 0.5% slippage
    });

    // Make the API call
    const response = await fetch(`${JUPITER_QUOTE_API}?${queryParams}`);

    if (!response.ok) {
      throw new Error(`Error fetching quote: ${await response.text()}`);
    }

    const quote = await response.json();

    // Print the result
    console.log("Jupiter Quote Test Successful!");
    console.log("----------------------------");
    console.log(`Input: 0.1 SOL`);
    console.log(`Output: ${parseInt(quote.outAmount) / 1000000} USDC`); // USDC has 6 decimals
    console.log(`Price Impact: ${quote.priceImpactPct}%`);
    console.log(`Slippage: ${quote.slippageBps / 100}%`);
    console.log(`Number of routes: ${quote.routePlan.length}`);

    return quote;
  } catch (error) {
    console.error("Jupiter API Test Failed:", error);
    throw error;
  }
}

// Run the test
testJupiterQuote()
  .then(() => {
    console.log("\nTest completed successfully!");
  })
  .catch((error) => {
    console.error("\nTest failed:", error);
    process.exit(1);
  });
