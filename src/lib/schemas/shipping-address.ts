import { z } from "zod/v3";

export const shippingAddressSchema = z.object({
  country: z.string().min(1),
  province: z.string().min(1),
  city: z.string().min(1),
  address: z.string().min(1),
  phoneNumber: z.string().min(9),
});
