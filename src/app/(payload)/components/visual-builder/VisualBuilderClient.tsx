"use client";

import { Puck } from "@puckeditor/core";
import { useState } from "react";

import { builderConfig } from "@/payload/builder/puck-config";
import type { BuilderData, BuilderProduct } from "@/payload/builder/types";

type SaveState = "error" | "idle" | "saved" | "saving";

type VisualBuilderClientProps = {
  builderData: BuilderData;
  featuredProducts: BuilderProduct[];
  pageId: string;
  previewUrl: string;
  slug: string;
  title: string;
};

export function VisualBuilderClient({
  builderData,
  featuredProducts,
  pageId,
  previewUrl,
  slug,
  title,
}: VisualBuilderClientProps) {
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [message, setMessage] = useState("");

  async function save(data: BuilderData) {
    setSaveState("saving");
    setMessage("Saving visual builder data...");

    const response = await fetch(`/console-api/pages/${pageId}`, {
      body: JSON.stringify({ builderData: data }),
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
    });

    if (!response.ok) {
      setSaveState("error");
      setMessage(`Save failed: ${await response.text()}`);
      return;
    }

    setSaveState("saved");
    setMessage("Saved to Payload. Refresh the preview tab to see the published page update.");
  }

  return (
    <div className="visual-builder-view">
      <div className="visual-builder-toolbar">
        <div>
          <p className="visual-builder-kicker">Eltronic WYSIWYG</p>
          <h1>{title}</h1>
          <a href={previewUrl} rel="noreferrer" target="_blank">
            {previewUrl}
          </a>
        </div>
        {message ? <p className={`visual-builder-status ${saveState}`}>{message}</p> : null}
      </div>

      <Puck
        config={builderConfig}
        data={builderData}
        headerPath={slug === "home" ? "/" : `/${slug}`}
        headerTitle={title}
        height="calc(100vh - 11rem)"
        iframe={{
          enabled: true,
          waitForStyles: true,
        }}
        metadata={{ featuredProducts }}
        onPublish={save}
        viewports={[
          {
            height: "auto",
            label: "Desktop",
            width: 1440,
          },
          {
            height: "auto",
            label: "Tablet",
            width: 820,
          },
          {
            height: "auto",
            label: "Mobile",
            width: 390,
          },
        ]}
      />
    </div>
  );
}
