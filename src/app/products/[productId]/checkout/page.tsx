import { PaymentButton } from "@/components/products/payment-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { ProductTable, ShippingAddressTable } from "@/drizzle/schema";
import { getCurrentUser } from "@/lib/get-current-user";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function CheckoutPage(
  props: PageProps<"/products/[productId]/checkout">
) {
  const { productId } = await props.params;

  const product = await db.query.ProductTable.findFirst({
    where: eq(ProductTable.id, productId),
  });

  if (product == null) {
    return redirect("/");
  }

  const user = await getCurrentUser();

  if (user == null) {
    return redirect("/sign-in");
  }

  const shippingAddressInfo = await db.query.ShippingAddressTable.findFirst({
    where: eq(ShippingAddressTable.userId, user.id),
  });

  if (shippingAddressInfo == null) {
    return redirect(`/products/${productId}/shipping-address`);
  }

  return (
    <div className="max-w-4xl mx-auto pt-12">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-center gap-6">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="object-cover h-32 w-32 "
            />
            <div>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription className="text-xl">
                {product.priceInCents / 100}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Shipping Address information</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>{shippingAddressInfo.country}</CardDescription>
          <CardDescription>{shippingAddressInfo.province}</CardDescription>
          <CardDescription>{shippingAddressInfo.city}</CardDescription>
          <CardDescription>{shippingAddressInfo.address}</CardDescription>
          <CardDescription>{shippingAddressInfo.phoneNumber}</CardDescription>
        </CardContent>
      </Card>

      <PaymentButton product={product}/>
    </div>
  );
}
