"use client";

import { blocksPlugin, outlinePlugin, Puck, type PuckAction } from "@puckeditor/core";
import { ExternalLink, FilePlus2, Plus, X } from "lucide-react";
import { type FormEvent, type ReactNode, useState } from "react";

import { builderConfig } from "@/payload/builder/puck-config";
import type { BuilderData, BuilderMenu, BuilderProduct } from "@/payload/builder/types";

type SaveState = "error" | "idle" | "saved" | "saving";

const ROOT_ZONE = "root:default-zone";

const editorPlugins = [
  {
    ...blocksPlugin(),
    label: "Add blocks",
  },
  {
    ...outlinePlugin(),
    label: "Current page",
  },
];

type VisualBuilderClientProps = {
  builderData: BuilderData;
  featuredProducts: BuilderProduct[];
  menus: BuilderMenu[];
  pageId: string;
  previewUrl: string;
  slug: string;
  title: string;
};

type HeaderActionsProps = {
  children?: ReactNode;
  creatingPage: boolean;
  dispatch: (action: PuckAction) => void;
  message: string;
  onOpenNewPage: () => void;
  previewUrl: string;
  saveState: SaveState;
  state: {
    data?: BuilderData;
    indexes?: {
      zones?: Record<string, { contentIds?: unknown[] }>;
    };
  };
};

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function createStarterBuilderData(title: string): BuilderData {
  return {
    content: [
      {
        props: {
          body: "Use Add blocks to build this page, then select each section to customise its text, spacing, colours and effects.",
          eyebrow: "New page",
          heading: title,
          id: "starter-section",
          primaryLabel: "Add content",
          primaryUrl: "#",
          secondaryLabel: "",
          secondaryUrl: "",
          variant: "panel",
        },
        type: "SectionBlock",
      },
    ],
    root: {
      props: {
        accentColor: "#8bd3ff",
        backgroundColor: "#020617",
        fontFamily: "display",
        pageTitle: title,
        sectionSpacing: "normal",
        surfaceColor: "23, 32, 51",
        surfaceOpacity: 0.78,
        textColor: "#f1f5f9",
        themePreset: "eltronicDark",
      },
    },
    zones: {},
  } as BuilderData;
}

function getCreatedPageId(value: unknown) {
  if (typeof value !== "object" || value === null) {
    return "";
  }

  const record = value as Record<string, unknown>;

  if (typeof record.id === "number" || typeof record.id === "string") {
    return String(record.id);
  }

  if (typeof record.doc === "object" && record.doc !== null) {
    const doc = record.doc as Record<string, unknown>;

    if (typeof doc.id === "number" || typeof doc.id === "string") {
      return String(doc.id);
    }
  }

  return "";
}

function getRootContentLength(state: HeaderActionsProps["state"]) {
  const indexedContent = state.indexes?.zones?.[ROOT_ZONE]?.contentIds;

  if (Array.isArray(indexedContent)) {
    return indexedContent.length;
  }

  return Array.isArray(state.data?.content) ? state.data.content.length : 0;
}

function insertSection(dispatch: (action: PuckAction) => void, state: HeaderActionsProps["state"]) {
  dispatch({
    componentType: "SectionBlock",
    destinationIndex: getRootContentLength(state),
    destinationZone: ROOT_ZONE,
    type: "insert",
  });
}

function renderHeaderActions({ children, creatingPage, dispatch, message, onOpenNewPage, previewUrl, saveState, state }: HeaderActionsProps) {
  return (
    <div className="visual-builder-actions">
      <button className="visual-builder-action" disabled={creatingPage} onClick={onOpenNewPage} type="button">
        <FilePlus2 aria-hidden="true" size={15} />
        <span>New page</span>
      </button>
      <button className="visual-builder-action primary" onClick={() => insertSection(dispatch, state)} type="button">
        <Plus aria-hidden="true" size={15} />
        <span>Add section</span>
      </button>
      <a className="visual-builder-action" href={previewUrl} rel="noreferrer" target="_blank">
        <ExternalLink aria-hidden="true" size={14} />
        <span>Preview</span>
      </a>
      {message ? <span className={`visual-builder-header-status ${saveState}`}>{message}</span> : null}
      {children}
    </div>
  );
}

export function VisualBuilderClient({
  builderData,
  featuredProducts,
  menus,
  pageId,
  previewUrl,
  slug,
  title,
}: VisualBuilderClientProps) {
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [message, setMessage] = useState("");
  const [creatingPage, setCreatingPage] = useState(false);
  const [isNewPageOpen, setIsNewPageOpen] = useState(false);
  const [newPageSlug, setNewPageSlug] = useState("new-page");
  const [newPageTitle, setNewPageTitle] = useState("New page");
  const [slugWasEdited, setSlugWasEdited] = useState(false);

  function updateNewPageTitle(value: string) {
    setNewPageTitle(value);

    if (!slugWasEdited) {
      setNewPageSlug(normalizeSlug(value) || "new-page");
    }
  }

  async function createPage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextTitle = newPageTitle.trim() || "New page";
    const nextSlug = normalizeSlug(newPageSlug || nextTitle) || "new-page";

    setCreatingPage(true);
    setSaveState("saving");
    setMessage("Creating new draft page...");

    const response = await fetch("/console-api/pages", {
      body: JSON.stringify({
        builderData: createStarterBuilderData(nextTitle),
        layout: [
          {
            blockType: "hero",
            eyebrow: "New page",
            heading: nextTitle,
            lede: "Start building this page in the WYSIWYG editor.",
            primaryLink: {
              label: "",
              url: "",
            },
            secondaryLink: {
              label: "",
              url: "",
            },
          },
        ],
        slug: nextSlug,
        status: "draft",
        summary: "",
        title: nextTitle,
      }),
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      setCreatingPage(false);
      setSaveState("error");
      setMessage(`New page failed: ${await response.text()}`);
      return;
    }

    const createdPage = (await response.json().catch(() => null)) as unknown;
    const createdPageId = getCreatedPageId(createdPage);

    if (!createdPageId) {
      setCreatingPage(false);
      setSaveState("error");
      setMessage("New page was created, but the editor could not find its ID. Open Pages in Console to locate it.");
      return;
    }

    setMessage("New page created. Opening the visual editor...");
    window.location.assign(`/console/wysiwyg/${createdPageId}`);
  }

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
      <Puck
        config={builderConfig}
        data={builderData}
        headerPath={slug === "home" ? "/" : `/${slug}`}
        headerTitle={title}
        height="calc(100vh - 2rem)"
        iframe={{
          enabled: true,
          waitForStyles: true,
        }}
        metadata={{ featuredProducts, menus }}
        onPublish={save}
        plugins={editorPlugins}
        renderHeaderActions={(props) =>
          renderHeaderActions({
            ...props,
            creatingPage,
            message,
            onOpenNewPage: () => setIsNewPageOpen(true),
            previewUrl,
            saveState,
          })
        }
        ui={{ plugin: { current: "outline" } }}
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
      {isNewPageOpen ? (
        <div aria-labelledby="visual-builder-new-page-title" aria-modal="true" className="visual-builder-dialog" role="dialog">
          <form className="visual-builder-dialog-panel" onSubmit={createPage}>
            <div className="visual-builder-dialog-header">
              <div>
                <p>New page</p>
                <h2 id="visual-builder-new-page-title">Create a draft page</h2>
              </div>
              <button aria-label="Close new page dialog" onClick={() => setIsNewPageOpen(false)} type="button">
                <X aria-hidden="true" size={18} />
              </button>
            </div>
            <label>
              <span>Page title</span>
              <input autoFocus onChange={(event) => updateNewPageTitle(event.currentTarget.value)} required type="text" value={newPageTitle} />
            </label>
            <label>
              <span>Slug</span>
              <input
                onChange={(event) => {
                  setSlugWasEdited(true);
                  setNewPageSlug(normalizeSlug(event.currentTarget.value));
                }}
                required
                type="text"
                value={newPageSlug}
              />
            </label>
            <div className="visual-builder-dialog-actions">
              <button disabled={creatingPage} onClick={() => setIsNewPageOpen(false)} type="button">
                Cancel
              </button>
              <button disabled={creatingPage} type="submit">
                {creatingPage ? "Creating..." : "Create page"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
