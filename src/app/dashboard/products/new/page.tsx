import { ProductForm } from "@/components/products/product-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminNewProductPage() {
  return (
    <div className="space-y-6">
        <div className="max-w-3xl mx-auto pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm />
        </CardContent>
      </Card>
        </div>
    </div>
  );
}
