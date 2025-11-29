"use client";

import { createCheckoutSession } from "@/actions/payments";
import { Button } from "../ui/button";
import { ProductTable } from "@/drizzle/schema";

export function PaymentButton({product} : {product: typeof ProductTable.$inferSelect}) {
  return (
    <Button size="lg" onClick={async () => createCheckoutSession(product)}>
      Continue to Payment
    </Button>
  );
}
