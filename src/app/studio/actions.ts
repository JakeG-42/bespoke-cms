"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { clearAdminSession, isAdminAuthenticated } from "@/lib/admin-auth";
import {
  deleteProduct,
  deleteSubmission,
  productFromFormData,
  updateSubmissionStatus,
  upsertProduct,
  type ContactSubmissionStatus,
} from "@/lib/managed-data";

async function requireAdminAction() {
  if (!(await isAdminAuthenticated())) {
    redirect("/studio/login");
  }
}

function getReturnTo(formData: FormData, fallback = "/studio/products") {
  const returnTo = String(formData.get("returnTo") ?? "").trim();

  return returnTo.startsWith("/studio") ? returnTo : fallback;
}

function redirectWithError(message: string, returnTo = "/studio/products") {
  const separator = returnTo.includes("?") ? "&" : "?";
  redirect(`${returnTo}${separator}error=${encodeURIComponent(message)}`);
}

function revalidateManagedPages() {
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/products/[slug]", "page");
  revalidatePath("/studio");
  revalidatePath("/studio/products");
  revalidatePath("/studio/submissions");
}

export async function saveProductAction(formData: FormData) {
  await requireAdminAction();

  const returnTo = getReturnTo(formData);
  const previousSlug = String(formData.get("previousSlug") ?? "") || undefined;
  const product = productFromFormData(formData);

  if (!product.name || !product.slug || !product.summary) {
    redirectWithError("Product name, slug and summary are required.", returnTo);
  }

  if (!product.image.src) {
    redirectWithError("At least one product image URL is required.", returnTo);
  }

  try {
    await upsertProduct(product, previousSlug);
    revalidateManagedPages();
  } catch (error) {
    redirectWithError(error instanceof Error ? error.message : "Unable to save product.", returnTo);
  }

  redirect(returnTo);
}

export async function deleteProductAction(formData: FormData) {
  await requireAdminAction();
  const returnTo = getReturnTo(formData);

  try {
    const slug = String(formData.get("slug") ?? "");
    await deleteProduct(slug);
    revalidateManagedPages();
  } catch (error) {
    redirectWithError(error instanceof Error ? error.message : "Unable to delete product.", returnTo);
  }

  redirect(returnTo);
}

export async function updateSubmissionStatusAction(formData: FormData) {
  await requireAdminAction();
  const returnTo = getReturnTo(formData, "/studio/submissions");

  try {
    const id = String(formData.get("id") ?? "");
    const status = String(formData.get("status") ?? "new") as ContactSubmissionStatus;
    await updateSubmissionStatus(id, status);
    revalidatePath("/studio/submissions");
  } catch (error) {
    redirectWithError(error instanceof Error ? error.message : "Unable to update submission.", returnTo);
  }

  redirect(returnTo);
}

export async function deleteSubmissionAction(formData: FormData) {
  await requireAdminAction();
  const returnTo = getReturnTo(formData, "/studio/submissions");

  try {
    const id = String(formData.get("id") ?? "");
    await deleteSubmission(id);
    revalidatePath("/studio/submissions");
  } catch (error) {
    redirectWithError(error instanceof Error ? error.message : "Unable to delete submission.", returnTo);
  }

  redirect(returnTo);
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/studio/login");
}
