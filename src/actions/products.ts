"use server";

import { db } from "@/drizzle/db";
import { ProductTable } from "@/drizzle/schema";
import { getCurrentUser } from "@/lib/get-current-user";
import { productSchema } from "@/lib/schemas/products";
import { utapi } from "@/lib/uploadthing-client";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import z from "zod/v3";

type ProductType = z.infer<typeof productSchema>;

export async function savePost(unsafeData: ProductType) {
  const { data, success } = productSchema.safeParse(unsafeData);

  if (!success) {
    return {
      error: true,
      message: "Unable to create your product, try again",
    };
  }

  const user = await getCurrentUser();

  if (user == null) {
    redirect("/sign-in");
  }

  if (user.role === "USER") {
    redirect("/sign-in");
  }

  await db.insert(ProductTable).values({
    name: data.name,
    priceInCents: data.priceInCents,
    userId: user.id,
    imageUrl: data.imageUrl,
    imageKey: data.imageKey,
    weight: data.weight,
    availableForPurchase: data.availableForPurchase,
    description: data.description,
    stockQty: data.stockQty,
  });

  redirect("/dashboard/products");
}

export async function changeProductAvailability(productId: string) {
  const user = await getCurrentUser();

  if (user == null) {
    redirect("/sign-in");
  }

  if (user.role !== "ADMIN") {
    redirect("/sign-in");
  }

  const product = await db.query.ProductTable.findFirst({
    where: eq(ProductTable.id, productId),
  });

  if (product == null) {
    return {
      error: true,
      message: "Cannot find the product by this id",
    };
  }

  await db
    .update(ProductTable)
    .set({ availableForPurchase: product.availableForPurchase ? false : true })
    .where(eq(ProductTable.id, productId));
}

export async function deleteProduct(productId: string) {
  const user = await getCurrentUser();

  if (user == null) {
    redirect("/sign-in");
  }

  if (user.role !== "ADMIN") {
    redirect("/sign-in");
  }

  const product = await db.query.ProductTable.findFirst({
    where: eq(ProductTable.id, productId),
  });

  if (product == null) {
    return {
      error: true,
      message: "Cannot find the product by this id",
    };
  }

  if(product.imageUrl){
    await utapi.deleteFiles([product.imageKey])
  }

  const result = await db
    .delete(ProductTable)
    .where(eq(ProductTable.id, productId));

  if (result == null) {
    return {
      error: true,
      message: "You cannot delete this product, it has on going orders",
    };
  }


}
