import { getCurrentUser } from "@/lib/get-current-user";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (user == null) {
    return redirect("/sign-in");
  }

  if (user.role !== "ADMIN") {
    return redirect("/");
  }

  return <div>{children}</div>;
}
