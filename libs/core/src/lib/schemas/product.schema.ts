/*
// libs/core/src/lib/schemas/product.schema.ts
export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  price: z.number().positive(),
  // ... other fields
});

export type Product = z.infer<typeof productSchema>;
*/
