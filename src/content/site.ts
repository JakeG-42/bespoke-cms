export const serviceModules = [
  {
    slug: "content-management",
    title: "Content management",
    eyebrow: "content.system",
    summary:
      "Pages, posts, media, menus and SEO settings managed from a reusable console that can be branded for each client.",
    bullets: ["Page builder blocks", "Media library", "Draft and published states"],
  },
  {
    slug: "visual-builder",
    title: "Visual page building",
    eyebrow: "builder.canvas",
    summary:
      "Reusable sections, themes and design controls for creating client pages without changing application code for every edit.",
    bullets: ["Theme presets", "Spacing and colour controls", "Reusable CTA sections"],
  },
  {
    slug: "business-workflows",
    title: "Business workflows",
    eyebrow: "ops.workspace",
    summary:
      "A foundation for CRM-style records, internal statuses, enquiries and custom operational modules inside the same product.",
    bullets: ["Enquiry records", "Admin roles", "Workflow-ready data models"],
  },
];

export const softwareServiceModules = [
  {
    title: "CMS and admin panels",
    code: "systems.cms",
    summary:
      "Content models, editor workflows, media libraries and custom admin screens for managing sites and customer-facing content.",
    examples: ["Pages", "Posts", "Media", "Menus"],
  },
  {
    title: "CRM and data workspaces",
    code: "systems.crm",
    summary:
      "Customer records, enquiries, internal statuses and operational views that can be shaped around a specific business process.",
    examples: ["Contacts", "Pipelines", "Tasks", "Dashboards"],
  },
  {
    title: "Commerce and catalogues",
    code: "commerce.catalogue",
    summary:
      "Structured product records, package options, downloadable resources and quote-led journeys for flexible commercial content.",
    examples: ["Products", "Packages", "Variants", "Downloads"],
  },
  {
    title: "Automation and integration",
    code: "workflow.integrate",
    summary:
      "Hooks, notifications, background jobs and integrations that connect the console to the systems a client already uses.",
    examples: ["Notifications", "Webhooks", "APIs", "Scheduled jobs"],
  },
  {
    title: "Theme and template systems",
    code: "theme.template",
    summary:
      "Whole-site themes, reusable templates and editable design settings that make the platform feel flexible without becoming chaotic.",
    examples: ["Theme presets", "Page templates", "Reusable sections", "Custom CSS"],
  },
  {
    title: "Lifecycle support",
    code: "support.iterate",
    summary:
      "Documentation, migrations, monitoring and measured improvements so each installation can grow safely over time.",
    examples: ["Docs", "Migrations", "Monitoring", "Feature updates"],
  },
];

export const softwareWorkflowModules = [
  {
    step: "01",
    title: "Model the workspace",
    summary:
      "Define the pages, records, roles and data relationships the client needs before adding visual complexity.",
    outcome: "A clear content and data model that can be extended without rewrites.",
  },
  {
    step: "02",
    title: "Build reusable controls",
    summary:
      "Create editable blocks, templates and settings that make common updates simple for non-technical users.",
    outcome: "A console that feels practical day to day, not just technically possible.",
  },
  {
    step: "03",
    title: "Connect publishing and preview",
    summary:
      "Wire content, themes and page previews together so changes can be checked before they are promoted.",
    outcome: "Safer editing with clearer handoff from admin screen to public page.",
  },
  {
    step: "04",
    title: "Iterate into product features",
    summary:
      "Add CRM, commerce, reporting and automation modules once the core CMS workflow is stable.",
    outcome: "A white-label product that can grow from site builder into business platform.",
  },
];

export const sectorModules = [
  {
    title: "Client websites",
    code: "usecase.sites",
    summary:
      "Reusable website builds where content, menus, themes and page sections need to be edited by a client team.",
    examples: ["Brochure sites", "Landing pages", "Content hubs", "Service pages"],
  },
  {
    title: "Internal teams",
    code: "usecase.ops",
    summary:
      "Operational workspaces for teams that need structured records, statuses, notes and controlled access.",
    examples: ["CRM views", "Enquiry tracking", "Task boards", "Admin dashboards"],
  },
  {
    title: "Catalogue businesses",
    code: "usecase.catalogue",
    summary:
      "Product or service catalogues where items, packages, documents and lead-generation CTAs need to be managed centrally.",
    examples: ["Product pages", "Package pages", "Quote flows", "Resource libraries"],
  },
  {
    title: "White-label deployments",
    code: "usecase.platform",
    summary:
      "Installations that need their own branding, themes, seed content and admin experience without forking the core product.",
    examples: ["Client portals", "Partner sites", "Vertical templates", "Custom consoles"],
  },
];

export const workflowModules = [
  {
    step: "01",
    title: "Content and data discovery",
    summary:
      "Map the records, pages, users and repeatable workflows that the installation needs to support.",
    outcome: "A practical scope for CMS, CRM and commerce modules.",
  },
  {
    step: "02",
    title: "Theme and template setup",
    summary:
      "Choose the starting theme, create reusable templates and define which parts should be editable in the console.",
    outcome: "A branded starting point that remains reusable across future clients.",
  },
  {
    step: "03",
    title: "Build, preview and publish",
    summary:
      "Create content and page sections in the editor, review the preview and publish when the layout is ready.",
    outcome: "A clear loop from admin changes to public output.",
  },
  {
    step: "04",
    title: "Extend with custom modules",
    summary:
      "Add client-specific records, integrations, automations and dashboards as the product requirements mature.",
    outcome: "A platform that grows around real workflows instead of a one-off website.",
  },
];

export const resourceModules = [
  {
    title: "CMS guide",
    summary: "Short reference notes for creating pages, posts, menus, themes and visual-builder sections.",
  },
  {
    title: "Theme notes",
    summary: "Documentation for choosing, editing and extending whole-site themes and page templates.",
  },
  {
    title: "Module planning",
    summary: "A growing home for CRM, commerce and workflow module planning notes.",
  },
];
