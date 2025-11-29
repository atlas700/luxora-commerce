import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import Link from "next/link";
import { TagIcon } from "lucide-react";
import { ProductTable } from "@/drizzle/schema";

type PropsType = Omit<typeof ProductTable.$inferSelect, "availableForPurchase" | "userId" | "imageKey">

export function ProductCard({product} : {product: PropsType}){
    return  <Card className="w-full sm:w-1/3 pt-0 pb-1">
    <div className="h-48 relative w-full">
      <Image src={product.imageUrl} alt="asdasd" fill className="rounded-lg" />
    </div>
    <CardHeader>
        <div className="flex justify-between items-center">
    <CardTitle className="text-4xl font-semibold">${product.priceInCents / 100}</CardTitle>
    <CardDescription className="text-xl">{product.name}</CardDescription>
        </div>
    </CardHeader>
    <Separator className="my-0" />
    <CardContent>
      <div className="flex items-start justify-between mb-2">
      <CardDescription className="flex items-center gap-1"><TagIcon className="size-4" /> <span>{product.stockQty} lefts</span></CardDescription>
      <CardDescription>{product.weight}</CardDescription>
      </div>
      {product.description ? <CardDescription>{product.description}</CardDescription> : null}
    </CardContent>
    <CardFooter className="px-1">
      <Button asChild size="lg" className="w-full">
        <Link href={`/products/${product.id}`}>Buy Now</Link>
      </Button>
    </CardFooter>
  </Card>

}