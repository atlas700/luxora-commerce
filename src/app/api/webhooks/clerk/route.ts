import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { WebhookEvent } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req: Request) {
  // 1️⃣ Read the Clerk-Svix headers
  const headerPayload = headers();
  const svix_id = (await headerPayload).get("svix-id");
  const svix_timestamp = (await headerPayload).get("svix-timestamp");
  const svix_signature = (await headerPayload).get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  // 2️⃣ Get the request body
  const payload = await req.text(); // must be raw text for signature verification
  const secret = process.env.CLERK_WEBHOOK_SECRET!;
  const wh = new Webhook(secret);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  // 3️⃣ Handle the event
  const { type, data } = evt;

  switch (type) {
    case "user.created":
      await db.insert(UserTable).values({
        id: data.id,
        name: `${data.first_name} ${data.last_name}`,
        email: data.email_addresses[0].email_address,
        imageUrl: data.image_url,
        role: "USER",
      });
      break;

    case "user.updated":
      await db
        .update(UserTable)
        .set({
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        })
        .where(eq(UserTable.id, data.id));
      break;

    case "user.deleted":
      if (data.id) {
        await db.delete(UserTable).where(eq(UserTable.id, data.id));
      }
      break;

    default:
      console.log("Unhandled event type:", type);
  }

  return new Response("Webhook processed", { status: 200 });
}
