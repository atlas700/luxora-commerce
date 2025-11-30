"use server";

import { ProductTable } from "@/drizzle/schema";
import { getCurrentUser } from "@/lib/get-current-user";
import { stripe } from "@/lib/stripe-client";
import { redirect } from "next/navigation";

export async function createCheckoutSession(
  product: typeof ProductTable.$inferSelect
) {
  const user = await getCurrentUser();

  if (user == null) {
    return redirect("/sign-in");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
            images: [product.imageUrl],
          },
          unit_amount: product.priceInCents,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/products/${product.id}`,
    metadata: {
      productId: product.id,
      userId: user.id,
    },
  });

  redirect(session.url!);
}
