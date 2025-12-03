"use client"

import { useClerk } from "@clerk/nextjs";
import { Button } from "./ui/button";

export function ProfileButton() {
    const { openUserProfile } = useClerk();
  return (
    <Button onClick={() => openUserProfile()}>Profile</Button>
  );
}