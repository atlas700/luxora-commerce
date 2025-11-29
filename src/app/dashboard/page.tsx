import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-3xl">Dashboard</h1>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/dashboard/products">Products</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/orders">Orders</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
