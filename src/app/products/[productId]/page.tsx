import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import { ProductTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProductPage(props: PageProps<"/products/[productId]">) {
  const { productId } = await props.params;

  if (productId == null) {
    return notFound();
  }

  const product = await db.query.ProductTable.findFirst({
    where: eq(ProductTable.id, productId),
  });

  if (product == null) {
    return notFound();
  }

  return (
    <div className="my-4 px-4 min-h-[80vh]">
      <div className="flex pt-12 gap-x-12">
        {product.imageUrl != null ? (
          <div>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="object-cover rounded-lg w-full h-[400px]"
            />
          </div>
        ) : null}
        <div className="flex flex-col gap-4 w-1/2">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          {product.description ? <p className="text-muted-foreground">{product.description}</p> : null}
          <p className="text-xl font-semibold">{product.priceInCents / 100}</p>
          <p>{product.stockQty} Lefts</p>
          <Button asChild size="lg">
            <Link href={`/products/${productId}/shipping-address`}>
              Continue <ArrowRightIcon />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
