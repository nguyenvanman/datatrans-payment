import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verify the webhook signature (important for security)
    const signature = request.headers.get("datatrans-signature");

    // Log the webhook event
    console.log("Datatrans webhook received:", {
      transactionId: body.transactionId,
      status: body.status,
      refno: body.refno,
    });

    // Handle different payment statuses
    switch (body.status) {
      case "authorized":
        // Payment authorized - you may want to capture it later
        console.log("Payment authorized:", body.transactionId);
        // TODO: Update your database
        break;

      case "settled":
        // Payment completed successfully
        console.log("Payment settled:", body.transactionId);
        // TODO: Fulfill the order, update database, send confirmation email
        break;

      case "canceled":
        // Payment was canceled
        console.log("Payment canceled:", body.transactionId);
        // TODO: Update order status
        break;

      case "failed":
        // Payment failed
        console.log("Payment failed:", body.transactionId);
        // TODO: Update order status, notify user
        break;

      default:
        console.log("Unknown payment status:", body.status);
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    // Still return 200 to prevent Datatrans from retrying
    return NextResponse.json({ error: "Processing error" }, { status: 200 });
  }
}
