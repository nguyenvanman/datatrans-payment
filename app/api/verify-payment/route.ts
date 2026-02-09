import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionId, refno } = body;

    // Datatrans sandbox credentials
    const merchantId = process.env.DATATRANS_MERCHANT_ID || "1100007006";
    const password = process.env.DATATRANS_PASSWORD || "your-password";

    // Datatrans API endpoint for sandbox
    const apiUrl = `https://api.sandbox.datatrans.com/v1/transactions/${transactionId}`;

    // Make request to Datatrans API to verify transaction
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${merchantId}:${password}`).toString("base64"),
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Datatrans API error: ${response.status}`);
    }

    const transactionData = await response.json();

    // Verify the transaction status
    if (
      transactionData.status === "authorized" ||
      transactionData.status === "settled"
    ) {
      // Payment is valid
      // Here you would:
      // 1. Update your database
      // 2. Mark order as paid
      // 3. Send confirmation email
      // 4. Fulfill the order

      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        transactionData: {
          id: transactionData.transactionId,
          status: transactionData.status,
          amount: transactionData.amount,
          currency: transactionData.currency,
          refno: transactionData.refno,
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Payment verification failed",
          status: transactionData.status,
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error during payment verification",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Handle webhook from Datatrans
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Datatrans webhook payload
    // Contains transaction details when payment status changes
    console.log("Datatrans webhook received:", body);

    // Verify webhook signature if configured
    // const signature = request.headers.get('datatrans-signature');

    // Process the webhook
    // Update your database based on the transaction status

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      {
        error: "Webhook processing failed",
      },
      { status: 500 },
    );
  }
}
