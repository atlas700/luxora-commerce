import { ShippingAddressForm } from "@/components/addresses/address-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { notFound } from "next/navigation";

export default async function ShippingAddressPage(
  props: PageProps<"/products/[productId]/shipping-address">
) {
  const { productId } = await props.params;

  if (productId == null) {
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Shipping Address</CardTitle>
          <CardDescription>
            Enter your shipping address information to send the product the
            exact location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ShippingAddressForm productId={productId} />
        </CardContent>
      </Card>
    </div>
  );
}
