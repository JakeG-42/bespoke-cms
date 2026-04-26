import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductForm } from "@/components/studio/product-form";
import { getProductFamilies } from "@/lib/managed-data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "New Product | Eltronic Studio",
};

export default async function NewProductPage() {
  const families = await getProductFamilies();

  return (
    <div className="grid gap-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="studio-eyebrow">catalogue.create</p>
          <h1 className="mb-2 text-4xl font-black">Add product</h1>
          <p className="text-muted-foreground">Create a product record, choose its template and order its gallery images.</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/studio/products">Back to products</Link>
        </Button>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Product details</CardTitle>
          <CardDescription>Images are entered one per line, and their line order controls gallery order.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm families={families} returnTo="/studio/products" />
        </CardContent>
      </Card>
    </div>
  );
}
