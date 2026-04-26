import { ShieldCheck } from "lucide-react";

import { saveProductAction } from "@/app/studio/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Product } from "@/content/products";
import { getProductImages } from "@/lib/managed-data";

const inputGridClass = "grid gap-2";
const selectClass =
  "flex h-10 w-full rounded-xl border border-input bg-background/60 px-3 py-2 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

export function ProductForm({
  families,
  product,
  returnTo = "/studio/products",
  submitLabel,
}: {
  families: string[];
  product?: Product;
  returnTo?: string;
  submitLabel?: string;
}) {
  const formId = product?.slug ?? "new";

  return (
    <form action={saveProductAction} className="grid gap-5">
      <input name="previousSlug" type="hidden" value={product?.slug ?? ""} />
      <input name="returnTo" type="hidden" value={returnTo} />
      <div className="grid gap-4 md:grid-cols-2">
        <div className={inputGridClass}>
          <Label htmlFor={`${formId}-name`}>Name</Label>
          <Input id={`${formId}-name`} name="name" defaultValue={product?.name} required />
        </div>
        <div className={inputGridClass}>
          <Label htmlFor={`${formId}-slug`}>Slug</Label>
          <Input id={`${formId}-slug`} name="slug" defaultValue={product?.slug} placeholder="auto-generated if blank" />
        </div>
        <div className={inputGridClass}>
          <Label htmlFor={`${formId}-category`}>Category</Label>
          <Input id={`${formId}-category`} name="category" defaultValue={product?.category} />
        </div>
        <div className={inputGridClass}>
          <Label htmlFor={`${formId}-family`}>Family</Label>
          <Input id={`${formId}-family`} name="family" defaultValue={product?.family} list={`${formId}-families`} />
          <datalist id={`${formId}-families`}>
            {families.map((family) => (
              <option key={family} value={family} />
            ))}
          </datalist>
        </div>
        <div className={inputGridClass}>
          <Label htmlFor={`${formId}-template`}>Template</Label>
          <select className={selectClass} defaultValue={product?.template ?? "hmi"} id={`${formId}-template`} name="template">
            <option value="hmi">HMI</option>
            <option value="data-logger">Data logger</option>
            <option value="module">Module</option>
          </select>
        </div>
        <div className={inputGridClass}>
          <Label htmlFor={`${formId}-enquiry`}>CTA label</Label>
          <Input id={`${formId}-enquiry`} name="enquiryPrompt" defaultValue={product?.enquiryPrompt} />
        </div>
      </div>

      <div className={inputGridClass}>
        <Label htmlFor={`${formId}-summary`}>Summary</Label>
        <Textarea id={`${formId}-summary`} name="summary" defaultValue={product?.summary} required />
      </div>
      <div className={inputGridClass}>
        <Label htmlFor={`${formId}-description`}>Description</Label>
        <Textarea id={`${formId}-description`} name="description" defaultValue={product?.description} />
      </div>

      <div className={inputGridClass}>
        <Label htmlFor={`${formId}-images`}>Images, ordered top to bottom</Label>
        <Textarea
          id={`${formId}-images`}
          name="images"
          defaultValue={imagesToText(product)}
          placeholder="https://example.com/image.jpg | Alt text"
          required
        />
        <p className="text-xs text-muted-foreground">
          Add one image per line as <code>URL | alt text</code>. Move lines up or down to change gallery order.
        </p>
      </div>

      <div className={inputGridClass}>
        <Label htmlFor={`${formId}-source`}>Source URL</Label>
        <Input id={`${formId}-source`} name="sourceUrl" defaultValue={product?.sourceUrl} />
      </div>
      <div className={inputGridClass}>
        <Label htmlFor={`${formId}-highlights`}>Highlights, one per line</Label>
        <Textarea id={`${formId}-highlights`} name="highlights" defaultValue={linesToText(product?.highlights)} />
      </div>
      <div className={inputGridClass}>
        <Label htmlFor={`${formId}-specs`}>Specs, one per line as Label | Value</Label>
        <Textarea
          id={`${formId}-specs`}
          name="specifications"
          defaultValue={specsToText(product?.specifications)}
        />
      </div>
      <div className={inputGridClass}>
        <Label htmlFor={`${formId}-docs`}>Documents, one per line as Label | URL</Label>
        <Textarea id={`${formId}-docs`} name="documents" defaultValue={documentsToText(product?.documents)} />
      </div>
      <div className={inputGridClass}>
        <Label htmlFor={`${formId}-variants`}>Variants, one per line as Name | Details | Article number</Label>
        <Textarea id={`${formId}-variants`} name="variants" defaultValue={variantsToText(product?.variants)} />
      </div>
      <Button type="submit">
        <ShieldCheck className="size-4" />
        {submitLabel ?? (product ? "Save product" : "Create product")}
      </Button>
    </form>
  );
}

function imagesToText(product?: Product) {
  if (!product) {
    return "";
  }

  return getProductImages(product)
    .map((image) => `${image.src} | ${image.alt}`)
    .join("\n");
}

function linesToText(lines?: string[]) {
  return lines?.join("\n") ?? "";
}

function specsToText(specs?: Product["specifications"]) {
  return specs?.map((spec) => `${spec.label} | ${spec.value}`).join("\n") ?? "";
}

function documentsToText(documents?: Product["documents"]) {
  return documents?.map((document) => `${document.label} | ${document.url}`).join("\n") ?? "";
}

function variantsToText(variants?: Product["variants"]) {
  return (
    variants
      ?.map((variant) => `${variant.name} | ${variant.details} | ${variant.articleNumber ?? ""}`)
      .join("\n") ?? ""
  );
}
