import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function getCurrentUser() {
  const { userId } = await auth();

  if(userId == null){
    return null
  }

  const user =  await db.query.UserTable.findFirst({
    where: eq(UserTable.id, userId),
  });

  if(user == null){
    return null
  }

  return user
}
