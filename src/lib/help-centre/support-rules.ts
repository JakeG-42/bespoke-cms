import type { ChatMessage, Complexity, IssueCategory, Priority, TicketDraft } from "./types";

export const HELP_CENTRE_SYSTEM_PROMPT = `You are an EV charger customer support assistant for a premium EV charger company.

Your job is to help customers solve common issues before they speak to a human agent.

You must:
- Be professional, friendly, clear, and calm.
- Ask focused questions one or two at a time.
- Use the company knowledge base when available.
- Never invent product details, policies, warranty terms, or technical procedures.
- Never give unsafe electrical advice.
- Escalate any issue involving wiring, internal charger components, consumer units, RCDs, PEN faults, CT clamp wiring, electrical testing, burning smell, overheating, exposed wiring, or repeated tripping.
- Help with safe customer-level troubleshooting only.
- If the issue cannot be solved within a few steps, offer to create a support ticket.
- Before creating a ticket, collect the customer's name, email, postcode, charger model, serial number, issue description, when the issue started, and any visible error/app message.
- Categorise the ticket.
- Suggest priority and complexity.
- Produce a concise ticket summary for the support team.
- Include troubleshooting steps already tried.
- Do not make promises about replacement, warranty approval, refunds, or engineer visits unless the policy/tool confirms it.

When creating a ticket summary, use this format:

Title:
[Short issue title]

Category:
[Issue category]

Priority:
[Low / Medium / High]

Complexity:
[Simple / Medium / Complex]

Customer Details:
[Known customer details]

Issue Summary:
[Plain English summary]

Troubleshooting Tried:
[List steps already attempted]

Escalation Reason:
[Why this needs human support]

Recommended Next Action:
[What the support team should do next]`;

const unsafeElectricalTerms = [
  "burning smell",
  "consumer unit",
  "ct clamp",
  "electrician",
  "exposed wiring",
  "fuse board",
  "hot to touch",
  "internal component",
  "overheating",
  "pen fault",
  "rcd",
  "smells hot",
  "sparking",
  "tripping",
  "wire",
  "wiring",
];

function text(messages: ChatMessage[]) {
  return messages
    .filter((message) => message.role === "user")
    .map((message) => message.content)
    .join("\n")
    .toLowerCase();
}

export function isUnsafeElectricalIssue(messages: ChatMessage[]) {
  const conversation = text(messages);

  return unsafeElectricalTerms.some((term) => conversation.includes(term));
}

export function inferIssueCategory(messages: ChatMessage[]): IssueCategory {
  const conversation = text(messages);

  if (/(wi-?fi|wifi|network|router|connect|offline|internet)/i.test(conversation)) {
    return "wifi_connectivity";
  }

  if (/(app|login|account|phone|ios|android|version)/i.test(conversation)) {
    return "app_issue";
  }

  if (/(not charging|won't charge|wont charge|charging not starting|start charging|no charge)/i.test(conversation)) {
    return "charging_not_starting";
  }

  if (/(slow|speed|load|load management|amps|current)/i.test(conversation)) {
    return "charging_speed_load_management";
  }

  if (/(solar|ct clamp|energy reading|readings|export|import)/i.test(conversation)) {
    return "solar_ct_energy_readings";
  }

  if (/(cable|plug|socket|connector|tethered)/i.test(conversation)) {
    return "cable_plug_issue";
  }

  if (/(install|installer|installation|consumer unit|rcd|pen fault|wiring|wire)/i.test(conversation)) {
    return "installation_issue";
  }

  if (/(warranty|hardware|fault|replacement|broken|damage)/i.test(conversation)) {
    return "warranty_hardware_fault";
  }

  if (/(order|delivery|sales|quote|price|invoice|promotion|grant|payment|paypal|easy pay|allstar|rightcharge)/i.test(conversation)) {
    return "order_delivery_sales";
  }

  return "general_enquiry";
}

export function inferPriority(messages: ChatMessage[], category: IssueCategory): Priority {
  const conversation = text(messages);

  if (isUnsafeElectricalIssue(messages) || /(cannot charge|can't charge|cant charge|no charging|urgent|vulnerable|repeated fault)/i.test(conversation)) {
    return "high";
  }

  if (
    category === "wifi_connectivity" ||
    category === "app_issue" ||
    category === "charging_not_starting" ||
    /(intermittent|sometimes|schedule|degraded)/i.test(conversation)
  ) {
    return "medium";
  }

  return "low";
}

export function inferComplexity(messages: ChatMessage[], category: IssueCategory): Complexity {
  if (isUnsafeElectricalIssue(messages) || category === "installation_issue" || category === "warranty_hardware_fault") {
    return "complex";
  }

  if (category === "wifi_connectivity" || category === "app_issue" || category === "charging_speed_load_management" || category === "solar_ct_energy_readings") {
    return "medium";
  }

  return "simple";
}

export function createTicketDraft(messages: ChatMessage[]): TicketDraft {
  const category = inferIssueCategory(messages);
  const priority = inferPriority(messages, category);
  const complexity = inferComplexity(messages, category);
  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user")?.content ?? "Customer needs support.";
  const unsafe = isUnsafeElectricalIssue(messages);

  return {
    category,
    complexity,
    customer: {},
    escalationReason: unsafe
      ? "The customer mentioned a possible electrical safety issue. This must be handled by qualified support or an installer."
      : priority === "high"
        ? "The issue may prevent the customer from charging or needs urgent human review."
        : undefined,
    priority,
    summary: latestUserMessage,
    title: titleFromCategory(category),
    transcript: messages,
    troubleshootingStepsTried: messages
      .filter((message) => message.role === "assistant" && /check|try|restart|open|confirm|please/i.test(message.content))
      .slice(-5)
      .map((message) => message.content),
  };
}

export function fallbackAssistantReply(messages: ChatMessage[]) {
  const category = inferIssueCategory(messages);

  if (isUnsafeElectricalIssue(messages)) {
    return "Thanks for explaining. Because this may involve electrical safety, I cannot guide you through wiring, consumer unit, RCD, PEN fault, CT clamp or internal charger checks. Please stop using the charger if there is heat, burning smell, exposed wiring or repeated tripping. I can help create a support ticket now. Please send your name, email, postcode, charger model and serial number.";
  }

  if (category === "wifi_connectivity") {
    return "I can help with Wi-Fi checks. First, is the charger showing as offline in the app, and has anything changed with your router or Wi-Fi password recently?";
  }

  if (category === "app_issue") {
    return "I can help with the app side. Which phone are you using, and what app message or error do you see when the problem happens?";
  }

  if (category === "charging_not_starting") {
    return "Let us check the safe customer-level basics first. Is the cable fully seated at the car and charger, and does the app show any schedule, lock, or error message?";
  }

  if (category === "order_delivery_sales") {
    return "I can help route this to the right team. Is this about an existing order, a delivery update, or choosing a charger model?";
  }

  return "I can help with that. Which charger model do you have, and what changed when the issue first started?";
}

function titleFromCategory(category: IssueCategory) {
  const titles: Record<IssueCategory, string> = {
    app_issue: "App support request",
    cable_plug_issue: "Cable or plug support request",
    charging_not_starting: "Charging not starting",
    charging_speed_load_management: "Charging speed or load management issue",
    general_enquiry: "Customer help centre enquiry",
    installation_issue: "Installation support review required",
    order_delivery_sales: "Order, delivery or sales enquiry",
    solar_ct_energy_readings: "Solar or energy readings issue",
    warranty_hardware_fault: "Warranty or hardware fault review",
    wifi_connectivity: "Wi-Fi or connectivity issue",
  };

  return titles[category];
}
