"use server";

import { db } from "@/drizzle/db";
import { ShippingAddressTable } from "@/drizzle/schema";
import { getCurrentUser } from "@/lib/get-current-user";
import { shippingAddressSchema } from "@/lib/schemas/shipping-address";
import { redirect } from "next/navigation";
import z from "zod/v3";

export async function saveShippingAddress(
  unsafeData: z.infer<typeof shippingAddressSchema>,
  productId: string
) {
  const { success, data } = shippingAddressSchema.safeParse(unsafeData);

  if (!success) {
    return {
      error: true,
      message: "There was an error saving your data",
    };
  }

  const user = await getCurrentUser();

  if (user == null) {
    redirect("/sign-in");
  }

  await db.insert(ShippingAddressTable).values({
    address: data.address,
    country: data.country,
    province: data.province,
    phoneNumber: data.phoneNumber,
    city: data.city,
    userId: user.id,
  });

  redirect(`/products/${productId}/checkout`);
}
