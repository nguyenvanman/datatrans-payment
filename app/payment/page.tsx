"use client";

import { useState } from "react";

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Call our backend to create a transaction
      const response = await fetch("/api/create-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 1000, // 10.00 CHF in cents
          currency: "CHF",
          refno: "ORDER-" + Date.now(),
        }),
      });

      const data = await response.json();

      if (data.success && data.transactionId) {
        // Redirect to Datatrans hosted payment page
        window.location.href = `https://pay.sandbox.datatrans.com/v1/start/${data.transactionId}`;
      } else {
        alert(
          "Failed to initialize payment: " + (data.message || "Unknown error"),
        );
        setLoading(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initialize payment");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your Purchase
            </h1>
            <p className="text-gray-600 mb-8">
              Secure payment powered by Datatrans
            </p>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Product</span>
                <span className="font-semibold">Sample Item</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Quantity</span>
                <span className="font-semibold">1</span>
              </div>
              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-indigo-600">
                    CHF 10.00
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className={`w-full py-4 px-4 rounded-lg font-semibold text-white transition-colors ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800"
              }`}
            >
              {loading
                ? "Initializing payment..."
                : "Pay with Apple Pay | TWINT"}
            </button>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900 font-semibold mb-2">
                📱 Payment Method:
              </p>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>✓ Apple Pay (on Safari with configured device)</li>
                <li>✓ Credit/Debit Cards</li>
                <li>✓ Other payment methods</li>
              </ul>
              <p className="text-xs text-blue-600 mt-2">
                Sandbox mode - No real charges
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
