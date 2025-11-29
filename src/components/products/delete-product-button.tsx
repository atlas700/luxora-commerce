"use client";

import { deleteProduct } from "@/actions/products";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";

export function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  return (
    <Button
      variant="destructive"
      className="w-full"
      size="sm"
      onClick={async () => {
        const result = await deleteProduct(productId);

        if (result != null && result.error) {
          toast.error(result.message);
        }

        router.refresh();
      }}
    >
      <Trash2Icon className="text-primary" /> Delete
    </Button>
  );
}
