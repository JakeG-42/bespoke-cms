export type Role = "assistant" | "system" | "user";

export type ChatMessage = {
  content: string;
  createdAt: string;
  id: string;
  role: Role;
};

export type IssueCategory =
  | "wifi_connectivity"
  | "app_issue"
  | "charging_not_starting"
  | "charging_speed_load_management"
  | "solar_ct_energy_readings"
  | "cable_plug_issue"
  | "installation_issue"
  | "warranty_hardware_fault"
  | "order_delivery_sales"
  | "general_enquiry";

export type Priority = "high" | "low" | "medium";

export type Complexity = "complex" | "medium" | "simple";

export type CustomerInfo = {
  appVersion?: string;
  chargerModel?: string;
  email?: string;
  installerName?: string;
  name?: string;
  phone?: string;
  phoneType?: string;
  postcode?: string;
  serialNumber?: string;
};

export type TicketDraft = {
  category: IssueCategory;
  complexity: Complexity;
  customer: CustomerInfo;
  escalationReason?: string;
  priority: Priority;
  summary: string;
  title: string;
  transcript: ChatMessage[];
  troubleshootingStepsTried: string[];
};

export type ChatResponse = {
  message: ChatMessage;
  shouldEscalate: boolean;
  ticketDraft: TicketDraft;
};
