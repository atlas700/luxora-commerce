import { getCurrentUser } from "@/lib/get-current-user";
import { SignedOut, UserButton } from "@clerk/nextjs";
import { BaggageClaimIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { ProfileButton } from "./profile-button";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export async function Header() {
  const user = await getCurrentUser();
  let isAdminUser: boolean;

  if (user == null) {
    isAdminUser = false;
  } else {
    isAdminUser = user.role === "ADMIN";
  }

  return (
    <header className="h-12 fixed top-0 right-0 left-0">
      <div className="h-full flex justify-between border-b-2 bg-background backdrop-blur-2xl items-center px-4">
        <Link href="/" className="flex gap-1">
          <BaggageClaimIcon /> <span>Luxora</span>
        </Link>
        <nav className="hidden md:flex">
          <Button asChild variant="link" size="lg">
            <Link href="/orders">Orders</Link>
          </Button>
          <Button asChild variant="link" size="lg">
            <Link href="/products">Products</Link>
          </Button>
          {isAdminUser ? (
            <Button asChild variant="link" size="lg">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : null}
          <UserButton />
          <SignedOut>
            <Button asChild variant="link" size="lg">
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
        </nav>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger>
              <MenuIcon />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu Links</SheetTitle>
              </SheetHeader>
              <Separator />

              <div className="w-full flex flex-col">
                <Button asChild variant="ghost" size="lg">
                  <Link href="/orders">Orders</Link>
                </Button>
                <Button asChild variant="ghost" size="lg">
                  <Link href="/products">Products</Link>
                </Button>
                {isAdminUser ? (
                  <Button asChild variant="ghost" size="lg">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                ) : null}
                <ProfileButton />
                <SignedOut>
                  <Button asChild variant="ghost" size="lg">
                    <Link href="/sign-in">Login</Link>
                  </Button>
                </SignedOut>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
