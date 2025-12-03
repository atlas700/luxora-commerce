import { ProductForm } from "@/components/products/product-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { ProductTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function ProductEditPage(
  props: PageProps<"/dashboard/products/edit/[productId]">
) {
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
    <div className="space-y-6">
      <div className="max-w-3xl mx-auto pt-6">
        <Card>
          <CardHeader>
            <CardTitle>Update Product</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductForm product={product} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
