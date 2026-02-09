import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency, refno } = body;

    const merchantId = process.env.DATATRANS_MERCHANT_ID || "1100007006";
    const password = process.env.DATATRANS_PASSWORD || "";

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          message: "DATATRANS_PASSWORD not set in environment variables",
        },
        { status: 400 },
      );
    }

    // Minimal transaction data - let Datatrans show all available payment methods
    const transactionData = {
      currency: currency,
      refno: refno,
      amount: amount,
      redirect: {
        successUrl: `${process.env.NEXT_PUBLIC_BASE_URL || request.headers.get("origin")}/payment/success`,
        cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL || request.headers.get("origin")}/payment/cancel`,
        errorUrl: `${process.env.NEXT_PUBLIC_BASE_URL || request.headers.get("origin")}/payment/error`,
      },
    };

    console.log("Creating transaction with minimal config...");

    const response = await fetch(
      "https://api.sandbox.datatrans.com/v1/transactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(`${merchantId}:${password}`).toString("base64"),
        },
        body: JSON.stringify(transactionData),
      },
    );

    const responseText = await response.text();
    console.log("Response:", response.status, responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: responseText };
      }

      return NextResponse.json(
        {
          success: false,
          message: "Datatrans API error",
          error: errorData,
        },
        { status: response.status },
      );
    }

    const responseData = JSON.parse(responseText);

    return NextResponse.json({
      success: true,
      transactionId: responseData.transactionId,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 },
    );
  }
}
