import { DeleteProductButton } from "@/components/products/delete-product-button";
import { ProductAvailabilityButton } from "@/components/products/product-availabality-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/drizzle/db";
import { ProductTable } from "@/drizzle/schema";
import { desc } from "drizzle-orm";
import {
  CheckIcon,
  Edit3Icon,
  MoreHorizontalIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import Link from "next/link";

export default async function AdminProductsPage() {
  const products = await db.query.ProductTable.findMany({
    orderBy: desc(ProductTable.createdAt),
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-3xl">All Products</h1>
        <Button asChild>
          <Link href="/dashboard/products/new">Add Product</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead>CreatedAt</TableHead>
            <TableHead>Available For Purchase</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="flex gap-2 ">
                {product.imageUrl != null && product.imageUrl != "" ? (
                  <div className="size-12 relative">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="object-cover rounded-sm"
                    />
                  </div>
                ) : null}
                <span className="font-semibold text-lg">{product.name}</span>
              </TableCell>
              <TableCell>{product.priceInCents / 100}</TableCell>
              <TableCell>{product.description?.slice(0, 30)}</TableCell>
              <TableCell>{product.weight}</TableCell>
              <TableCell>{product.createdAt?.toLocaleDateString()}</TableCell>
              <TableCell>
                {product.availableForPurchase ? (
                  <CheckIcon className="text-green-500" />
                ) : (
                  <XIcon className="text-destructive" />
                )}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreHorizontalIcon />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <DeleteProductButton productId={product.id} />
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        asChild
                      >
                        <Link href={`/dashboard/products/edit/${product.id}`}>
                          <Edit3Icon /> Update
                        </Link>
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ProductAvailabilityButton
                        availableForPurchase={product.availableForPurchase}
                        productId={product.id}
                      />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
