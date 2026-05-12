"use client";

import { useFormFields } from "@payloadcms/ui";
import type { DefaultCellComponentProps } from "payload";
import type { CSSProperties, ReactNode } from "react";

type UnknownRecord = Record<string, unknown>;

type ThemePreviewData = {
  accentColor: string;
  backgroundColor: string;
  description?: string;
  fontFamily: string;
  handle?: string;
  isDefault?: boolean;
  name: string;
  sectionSpacing: string;
  surfaceColor: string;
  surfaceOpacity: number;
  textColor: string;
};

type TemplatePreviewData = {
  builderData?: unknown;
  description?: string;
  handle?: string;
  name: string;
  theme?: ThemePreviewData | null;
};

const defaultTheme: ThemePreviewData = {
  accentColor: "#8bd3ff",
  backgroundColor: "#020617",
  fontFamily: "display",
  name: "Platform Dark",
  sectionSpacing: "normal",
  surfaceColor: "23, 32, 51",
  surfaceOpacity: 0.78,
  textColor: "#f1f5f9",
};

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function asNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function fieldValue(fields: UnknownRecord, path: string) {
  const field = fields[path];

  return isRecord(field) && "value" in field ? field.value : undefined;
}

function parseJson(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function normalizeTheme(value: unknown): ThemePreviewData {
  if (!isRecord(value)) {
    return defaultTheme;
  }

  const colors = isRecord(value.colors) ? value.colors : {};
  const typography = isRecord(value.typography) ? value.typography : {};
  const layout = isRecord(value.layout) ? value.layout : {};
  const rootProps = isRecord(value.rootProps) ? value.rootProps : {};

  return {
    accentColor: asString(colors.accentColor, asString(rootProps.accentColor, defaultTheme.accentColor)),
    backgroundColor: asString(colors.backgroundColor, asString(rootProps.backgroundColor, defaultTheme.backgroundColor)),
    description: asString(value.description),
    fontFamily: asString(typography.fontFamily, asString(rootProps.fontFamily, defaultTheme.fontFamily)),
    handle: asString(value.handle, asString(rootProps.themeHandle)),
    isDefault: Boolean(value.isDefault),
    name: asString(value.name, asString(rootProps.themeName, defaultTheme.name)),
    sectionSpacing: asString(layout.sectionSpacing, asString(rootProps.sectionSpacing, defaultTheme.sectionSpacing)),
    surfaceColor: asString(colors.surfaceColor, asString(rootProps.surfaceColor, defaultTheme.surfaceColor)),
    surfaceOpacity: asNumber(colors.surfaceOpacity, asNumber(rootProps.surfaceOpacity, defaultTheme.surfaceOpacity)),
    textColor: asString(colors.textColor, asString(rootProps.textColor, defaultTheme.textColor)),
  };
}

function useThemeFromCurrentForm(): ThemePreviewData {
  const values = useFormFields(([fields]) => ({
    accentColor: fieldValue(fields, "colors.accentColor"),
    backgroundColor: fieldValue(fields, "colors.backgroundColor"),
    description: fieldValue(fields, "description"),
    fontFamily: fieldValue(fields, "typography.fontFamily"),
    handle: fieldValue(fields, "handle"),
    isDefault: fieldValue(fields, "isDefault"),
    name: fieldValue(fields, "name"),
    sectionSpacing: fieldValue(fields, "layout.sectionSpacing"),
    surfaceColor: fieldValue(fields, "colors.surfaceColor"),
    surfaceOpacity: fieldValue(fields, "colors.surfaceOpacity"),
    textColor: fieldValue(fields, "colors.textColor"),
  }));

  return normalizeTheme({
    colors: {
      accentColor: values.accentColor,
      backgroundColor: values.backgroundColor,
      surfaceColor: values.surfaceColor,
      surfaceOpacity: values.surfaceOpacity,
      textColor: values.textColor,
    },
    description: values.description,
    handle: values.handle,
    isDefault: values.isDefault,
    layout: {
      sectionSpacing: values.sectionSpacing,
    },
    name: values.name,
    typography: {
      fontFamily: values.fontFamily,
    },
  });
}

function useTemplateFromCurrentForm(): TemplatePreviewData {
  const values = useFormFields(([fields]) => ({
    builderData: fieldValue(fields, "builderData"),
    description: fieldValue(fields, "description"),
    handle: fieldValue(fields, "handle"),
    name: fieldValue(fields, "name"),
  }));

  return {
    builderData: parseJson(values.builderData),
    description: asString(values.description),
    handle: asString(values.handle),
    name: asString(values.name, "Website template"),
  };
}

function templateText(builderData: unknown) {
  if (!isRecord(builderData) || !Array.isArray(builderData.content)) {
    return {
      blockCount: 0,
      eyebrow: "Template preview",
      heading: "Start building with reusable sections",
      lede: "This template can be used as the starting point for new Payload pages.",
    };
  }

  const content = builderData.content.filter(isRecord);
  const hero = content.find((block) => block.type === "HeroBlock" && isRecord(block.props));
  const section = content.find((block) => block.type === "SectionBlock" && isRecord(block.props));
  const props = (isRecord(hero?.props) ? hero?.props : isRecord(section?.props) ? section?.props : {}) as UnknownRecord;

  return {
    blockCount: content.length,
    eyebrow: asString(props.eyebrow, "Website template"),
    heading: asString(props.heading, "Reusable website layout"),
    lede: asString(props.lede, asString(props.body, "Create pages from this template, then adjust content in the WYSIWYG editor.")),
  };
}

function rootThemeFromTemplate(template: TemplatePreviewData) {
  const builderData = parseJson(template.builderData);
  const root = isRecord(builderData) && isRecord(builderData.root) ? builderData.root : {};
  const props = isRecord(root.props) ? root.props : {};

  return template.theme ?? normalizeTheme({ rootProps: props });
}

function PreviewShell({
  children,
  compact = false,
  theme,
}: {
  children: ReactNode;
  compact?: boolean;
  theme: ThemePreviewData;
}) {
  return (
    <div
      className={`theme-preview-shell${compact ? " compact" : ""}`}
      style={
        {
          "--theme-preview-accent": theme.accentColor,
          "--theme-preview-bg": theme.backgroundColor,
          "--theme-preview-surface": theme.surfaceColor,
          "--theme-preview-surface-fill": `rgba(${theme.surfaceColor}, ${theme.surfaceOpacity})`,
          "--theme-preview-text": theme.textColor,
        } as CSSProperties
      }
    >
      <div className="theme-preview-browser">
        <span />
        <span />
        <span />
      </div>
      {children}
    </div>
  );
}

function ThemePreviewCard({ compact = false, theme }: { compact?: boolean; theme: ThemePreviewData }) {
  return (
    <PreviewShell compact={compact} theme={theme}>
      <div className="theme-preview-hero">
        <div>
          <p>{theme.handle || "theme"}</p>
          <h3>{theme.name}</h3>
        </div>
        <span>{theme.isDefault ? "Default" : theme.sectionSpacing}</span>
      </div>
      <div className="theme-preview-layout">
        <div className="theme-preview-copy">
          <span />
          <strong />
          <em />
        </div>
        <div className="theme-preview-panel">
          <span />
          <span />
          <span />
        </div>
      </div>
      {!compact ? (
        <div className="theme-preview-swatches">
          {[theme.backgroundColor, theme.textColor, theme.accentColor, `rgb(${theme.surfaceColor})`].map((color) => (
            <span key={color} style={{ background: color }} />
          ))}
        </div>
      ) : null}
    </PreviewShell>
  );
}

function TemplatePreviewCard({ compact = false, template }: { compact?: boolean; template: TemplatePreviewData }) {
  const theme = rootThemeFromTemplate(template);
  const text = templateText(parseJson(template.builderData));

  return (
    <PreviewShell compact={compact} theme={theme}>
      <div className="theme-preview-template">
        <p>{text.eyebrow}</p>
        <h3>{text.heading}</h3>
        <span>{text.lede}</span>
        <div>
          <strong />
          <em />
        </div>
      </div>
      {!compact ? (
        <div className="theme-preview-meta-row">
          <span>{template.handle || "template"}</span>
          <span>{text.blockCount} blocks</span>
        </div>
      ) : null}
    </PreviewShell>
  );
}

export function ThemePreviewCell({ rowData }: DefaultCellComponentProps) {
  return <ThemePreviewCard compact theme={normalizeTheme(rowData)} />;
}

export function ThemePreviewField() {
  const theme = useThemeFromCurrentForm();

  return (
    <div className="theme-preview-field">
      <div className="theme-preview-field-header">
        <p>Theme preview</p>
        <span>Updates as you edit colours, typography and spacing.</span>
      </div>
      <ThemePreviewCard theme={theme} />
    </div>
  );
}

export function TemplatePreviewCell({ rowData }: DefaultCellComponentProps) {
  const template = {
    builderData: rowData?.builderData,
    description: asString(rowData?.description),
    handle: asString(rowData?.handle),
    name: asString(rowData?.name, "Website template"),
    theme: isRecord(rowData?.theme) ? normalizeTheme(rowData.theme) : null,
  };

  return <TemplatePreviewCard compact template={template} />;
}

export function TemplatePreviewField() {
  const template = useTemplateFromCurrentForm();

  return (
    <div className="theme-preview-field">
      <div className="theme-preview-field-header">
        <p>Website template preview</p>
        <span>Uses the template builder data as a miniature page preview.</span>
      </div>
      <TemplatePreviewCard template={template} />
    </div>
  );
}
