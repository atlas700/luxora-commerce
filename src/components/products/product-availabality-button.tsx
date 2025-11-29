"use client";

import { changeProductAvailability } from "@/actions/products";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type PropsType = {
  productId: string;
  availableForPurchase: boolean;
};

export function ProductAvailabilityButton({
  productId,
  availableForPurchase,
}: PropsType) {
  const router = useRouter();

  return (
    <Button
      size="sm"
      className="w-full"
      variant="secondary"
      onClick={async () => {
        const result = await changeProductAvailability(productId);

        if (result != null && result.error) {
          toast.error(result.message);
        }

        router.refresh();
      }}
    >
      {availableForPurchase ? "Unavailable" : "Available"}
    </Button>
  );
}
