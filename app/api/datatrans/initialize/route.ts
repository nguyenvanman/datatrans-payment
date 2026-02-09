import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency, refno } = body;

    // Your Datatrans credentials (use environment variables in production)
    const merchantId = process.env.DATATRANS_MERCHANT_ID || "1100007006";
    const password = process.env.DATATRANS_PASSWORD;

    if (!merchantId) {
      throw new Error("Datatrans merchant ID not configured");
    }

    // Use sandbox endpoint
    const apiEndpoint = "https://api.sandbox.datatrans.com/v1/transactions";

    // Initialize transaction with Datatrans API
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: password
          ? "Basic " +
            Buffer.from(`${merchantId}:${password}`).toString("base64")
          : `Basic ${Buffer.from(`${merchantId}:`).toString("base64")}`,
      },
      body: JSON.stringify({
        currency: currency,
        refno: refno,
        amount: amount,
        paymentMethods: ["APL"], // Apple Pay
        option: {
          createAlias: false,
        },
        redirect: {
          successUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/payment/success`,
          cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/payment/cancel`,
          errorUrl: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/payment/error`,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Datatrans API error:", errorText);

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        throw new Error("Failed to initialize transaction: " + errorText);
      }

      throw new Error(
        errorData.error?.message || "Failed to initialize transaction",
      );
    }

    const data = await response.json();

    return NextResponse.json({
      transactionId: data.transactionId,
    });
  } catch (error) {
    console.error("Payment initialization error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
