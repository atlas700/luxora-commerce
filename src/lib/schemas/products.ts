import { z } from "zod/v3";

export const productSchema = z.object({
  name: z.string().min(3),
  description: z.string(),
  imageUrl: z.string(),
  imageKey: z.string(),
  priceInCents: z.number().int().min(1),
  availableForPurchase: z.boolean().default(false),
  weight: z.string().min(1),
  stockQty: z.number().int().min(1),
});
