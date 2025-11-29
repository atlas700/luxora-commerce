"use client";

import { changeOrderStatus } from "@/actions/orders";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { OrderStatusType } from "@/drizzle/schema";
import { useRouter } from "next/navigation";

export function ChangeOrderMenu({
  status,
  orderId,
}: {
  status: OrderStatusType;
  orderId: string;
}) {
  const router = useRouter();

  return (
    <Select
      defaultValue={status}
      onValueChange={async (value) => {
        await changeOrderStatus(orderId, value as OrderStatusType);
        router.refresh();
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Change Order Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="PROCESSING">Processing</SelectItem>
        <SelectItem value="SHIPPING">Shipping</SelectItem>
        <SelectItem value="DELIVERED">Delivered</SelectItem>
      </SelectContent>
    </Select>
  );
}
