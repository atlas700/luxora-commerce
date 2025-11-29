"use client";

import { shippingAddressSchema } from "@/lib/schemas/shipping-address";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod/v3";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "../ui/form";
import { Input } from "../ui/input";
import { saveShippingAddress } from "@/actions/shippings";
import { toast } from "sonner";

type ShippingAddressFormType = z.infer<typeof shippingAddressSchema>;

export function ShippingAddressForm({productId} : {productId: string}) {
  const form = useForm({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      address: "",
      city: "",
      country: "",
      phoneNumber: "",
      province: "",
    },
  });

  async function onSubmit(values: ShippingAddressFormType) {
    const result = await saveShippingAddress(values, productId);
    if (result.error) {
      toast.error(result.message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4 w-full items-center">
          <FormField
            name="country"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="province"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Province</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-4 w-full items-center">
          <FormField
            name="city"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="address"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Home Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
            name="phoneNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        <Button disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <Loader2Icon className="animate-spin" />
          ) : null}
          Save
        </Button>
      </form>
    </Form>
  );
}
