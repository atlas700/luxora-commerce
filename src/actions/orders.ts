"use server";

import { db } from "@/drizzle/db";
import { OrderStatusType, OrderTable } from "@/drizzle/schema";
import { getCurrentUser } from "@/lib/get-current-user";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function changeOrderStatus(
  orderId: string,
  status: OrderStatusType
) {
  const user = await getCurrentUser();

  if (user == null) {
    redirect("/sign-in");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  await db
    .update(OrderTable)
    .set({ status: status })
    .where(eq(OrderTable.id, orderId));
}
