"use client";

import type { DefaultCellComponentProps } from "payload";
import { Paintbrush } from "lucide-react";

export function WysiwygCell({ rowData }: DefaultCellComponentProps) {
  const id = rowData?.id;

  if (!id) {
    return null;
  }

  const isHelpArticle = Boolean(rowData?.category);
  const label = isHelpArticle ? "article" : "page";
  const href = isHelpArticle ? `/console/wysiwyg/help-articles/${id}` : `/console/wysiwyg/${id}`;

  return (
    <a
      aria-label={`Open WYSIWYG builder for ${rowData.title ?? label}`}
      className="wysiwyg-cell-button"
      href={href}
      onClick={(event) => event.stopPropagation()}
      rel="noreferrer"
      target="_blank"
      title="Open WYSIWYG builder"
    >
      <Paintbrush aria-hidden="true" size={15} strokeWidth={2.2} />
      <span>WYSIWYG</span>
    </a>
  );
}
