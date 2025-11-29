import { Card, CardContent, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/drizzle/db";
import { OrderTable } from "@/drizzle/schema";
import { getCurrentUser } from "@/lib/get-current-user";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const user = await getCurrentUser();

  if (user == null) {
    return redirect("/sign-in");
  }

  const orders = await db.query.OrderTable.findMany({
    where: eq(OrderTable.userId, user.id),
    with: {
        product: {
            columns: {
                name: true,
            }
        }
    }
  });

  if (orders.length === 0) {
    return (
      <div className="pt-12 px-4 max-w-xl mx-auto">
        <Card>
          <CardContent>
            <CardDescription> There was no orders of you </CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-12 px-4 max-w-xl mx-auto">
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Date</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Price Paid</TableHead>
                <TableHead>Order Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.createdAt?.toLocaleDateString()}</TableCell>
                  <TableCell>{order.product.name}</TableCell>
                  <TableCell>{order.pricePaidInCents / 100}</TableCell>
                  <TableCell>{order.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
