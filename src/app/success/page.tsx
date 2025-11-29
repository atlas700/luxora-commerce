import Stripe from "stripe";
import { OrderTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { stripe } from "@/lib/stripe-client";
import { db } from "@/drizzle/db";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">❌ Invalid session. No payment found.</p>
      </div>
    );
  }

  // 1️⃣ Fetch session details securely from Stripe
  const session = await stripe.checkout.sessions.retrieve(session_id);

  // 2️⃣ Verify that the payment was successful
  if (session.payment_status !== "paid") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-yellow-600">
          ⚠️ Payment not completed yet. Please wait or contact support.
        </p>
      </div>
    );
  }

  // 3️⃣ (Optional) Check your DB if you stored the order in webhook
  const order = await db.query.OrderTable.findFirst({
    where: eq(OrderTable.paymentIntentId, session.payment_intent as string),
    with: {
      product: { columns: { name: true } },
    },
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold text-green-600">
        ✅ Payment Successful!
      </h1>
      <p className="text-lg">
        Thank you, {session.customer_details?.email ?? "valued customer"}!
      </p>

      <div className="mt-4 p-4 bg-background rounded-md border-card">
        <p>Product Name: {order?.product.name ?? session.metadata?.productId}</p>
        <p>Amount Paid: ${(session.amount_total ?? 0) / 100}</p>
      </div>

      <Button asChild>
        <Link
          href="/"
          className="mt-6 text-blue-600 underline hover:text-blue-800 transition"
        >
          Return to home
        </Link>
      </Button>
    </div>
  );
}
