"use client";

import { productSchema } from "@/lib/schemas/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod/v3";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { NumberInput } from "../ui/number-input";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { UploadButton } from "../uploadthing/uploadthing";
import { toast } from "sonner";
import { savePost, updateProduct } from "@/actions/products";
import { Loader2Icon } from "lucide-react";
import { ProductTable } from "@/drizzle/schema";

type ProductFormType = z.infer<typeof productSchema>;

export function ProductForm({
  product,
}: {
  product?: typeof ProductTable.$inferSelect;
}) {
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      availableForPurchase: product ? product.availableForPurchase : false,
      description: product ? product.description : "",
      imageUrl: product ? product.imageUrl : "",
      imageKey: "",
      name: product ? product.name : "",
      priceInCents: product ? product.priceInCents : 0,
      stockQty: product ? product.stockQty : 0,
      weight: product ? product.weight : "",
    },
  });

  async function onSubmit(values: ProductFormType) {
    if (product != null) {
      const result = await updateProduct(product.id, values);
      if (result.error) {
        toast.error(result.message);
      }
    } else {
      const result = await savePost(values);

      if (result.error) {
        toast.error(result.message);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 w-full items-center">
          <FormField
            name="priceInCents"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Product Price</FormLabel>
                <FormControl>
                  <NumberInput {...field} />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Please enter the product price in cents 1$ = 100
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            name="stockQty"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Product Quantity</FormLabel>
                <FormControl>
                  <NumberInput {...field} />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Please enter the product stock quantity
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Product Description</FormLabel>
              <FormControl>
                <Textarea {...field} className="min-h-32 resize-none" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4 w-full items-center">
          <FormField
            name="weight"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Product Weight</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="availableForPurchase"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full mt-5">
                <div className="flex gap-2">
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <FormLabel>Is Available for Purchase</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-center items-center my-12 gap-x-12">
          <UploadButton
            endpoint="imageUploader"
            onUploadError={(err) => {
              toast.error(err.message || "Upload failed, try again");
            }}
            onClientUploadComplete={(res) => {
              toast.success("Image uploaded");
              form.setValue("imageUrl", res[0].serverData.imageUrl);
              form.setValue("imageKey", res[0].serverData.imageKey);
            }}
          />
          {form.getValues("imageUrl") ? (
            <img
              src={product ? product.imageUrl : form.getValues("imageUrl")}
              alt="Product Image"
              className="h-32 object-cover rounded-md shadow-2xl"
            />
          ) : null}
        </div>

        <Button disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <Loader2Icon className="animate-spin" />
          ) : null}
          {product ? "Update" : "Save"}
        </Button>
      </form>
    </Form>
  );
}
