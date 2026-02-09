import { Suspense } from "react";
import Link from "next/link";

function ErrorContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-8 text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Failed
            </h1>

            <p className="text-gray-600 mb-6">
              We couldn't process your payment. Please try again or contact
              support.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Common Issues:</p>
              <ul className="text-xs text-gray-500 text-left space-y-1">
                <li>• Insufficient funds</li>
                <li>• Card declined by bank</li>
                <li>• Incorrect card details</li>
                <li>• Payment method not supported</li>
              </ul>
            </div>

            <Link
              href="/payment"
              className="inline-block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
            >
              Try Again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
