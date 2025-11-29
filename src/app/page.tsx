import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { db } from "@/drizzle/db";
import { ProductTable } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { TagIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function HomePage() {
  const products = await db.query.ProductTable.findMany({
    where: eq(ProductTable.availableForPurchase, true),
    columns: {
      availableForPurchase: false,
      userId: false,
      imageKey: false,
    },
    limit: 6,
    orderBy: desc(ProductTable.createdAt),
  });

  return (
    <>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-8 mt-36 items-center">
          <h1 className="text-3xl font-bold tracking-tight text-balance text-center leading-10 sm:text-4xl sm:leading-20 md:text-5xl lg:text-6xl xl:text-7xl">
            Welcome to <span className="text-cyan-300">Luxora</span> Shop. You
            can find anything in our shop
          </h1>
          <Button asChild size="lg" className="w-fit">
            <Link href="/products">Explore Products</Link>
          </Button>
        </div>
      </div>

      <div className="mt-32 px-8 py-12">
        <div className="flex gap-12 w-full">{products.map((product) => (
          <ProductCard product={product} key={product.id}/>
        ))}</div>
      </div>
    </>
  );
}
