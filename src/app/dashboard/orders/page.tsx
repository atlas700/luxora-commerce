import { ChangeOrderMenu } from "@/components/orders/change-order-menu";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default async function AdminOrdersPage() {
  const user = await getCurrentUser();

  if (user == null) {
    return redirect("/sign-in");
  }

  if (user.role !== "ADMIN") {
    return redirect("/");
  }

  const orders = await db.query.OrderTable.findMany({
    with: {
      product: {
        columns: {
          name: true,
        },
      },
      user: {
        columns: {
          name: true,
          email: true,
        },
      },
      shippingAddress: true,
    },
  });

  if (orders.length === 0) {
    return (
      <div className="pt-12 px-4 max-w-xl mx-auto">
        <Card>
          <CardContent>
            <CardDescription> There was no orders yet </CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-12 px-4 mx-auto">
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Date</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Price Paid</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>User Name</TableHead>
                <TableHead>User Email</TableHead>
                <TableHead>User Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.createdAt?.toLocaleDateString()}</TableCell>
                  <TableCell>{order.product.name}</TableCell>
                  <TableCell>{order.pricePaidInCents / 100}</TableCell>
                  <TableCell>
                   <ChangeOrderMenu orderId={order.id} status={order.status!} />
                  </TableCell>
                  <TableCell>{order.user.name}</TableCell>
                  <TableCell>{order.user.email}</TableCell>
                  <TableCell>
                    {order.shippingAddress.country},
                    {order.shippingAddress.province},
                    {order.shippingAddress.city},{order.shippingAddress.address}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
