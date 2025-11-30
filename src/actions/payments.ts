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

  const productData: any = {
    name: product.name,
  };

  // Only include description if it's not empty
  if (product.description && product.description.trim() !== "") {
    productData.description = product.description;
  }

  // Only include images if valid
  if (product.imageUrl && product.imageUrl.trim() !== "") {
    productData.images = [product.imageUrl];
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: productData,
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
