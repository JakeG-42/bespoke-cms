import type { CollectionConfig } from "payload";

import { adminsOnly } from "../access.ts";

const categoryOptions = [
  { label: "Wi-Fi / connectivity", value: "wifi_connectivity" },
  { label: "App issue", value: "app_issue" },
  { label: "Charging not starting", value: "charging_not_starting" },
  { label: "Charging speed / load management", value: "charging_speed_load_management" },
  { label: "Solar / CT clamp / energy readings", value: "solar_ct_energy_readings" },
  { label: "Cable / plug issue", value: "cable_plug_issue" },
  { label: "Installation issue", value: "installation_issue" },
  { label: "Warranty / hardware fault", value: "warranty_hardware_fault" },
  { label: "Order / delivery / sales", value: "order_delivery_sales" },
  { label: "General enquiry", value: "general_enquiry" },
] as const;

export const SupportTickets: CollectionConfig = {
  slug: "support-tickets",
  access: {
    create: () => true,
    delete: adminsOnly,
    read: adminsOnly,
    update: adminsOnly,
  },
  admin: {
    defaultColumns: ["title", "category", "priority", "complexity", "status", "updatedAt"],
    group: "Support",
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "In review", value: "in_review" },
        { label: "Waiting for customer", value: "waiting_for_customer" },
        { label: "Resolved", value: "resolved" },
      ],
      required: true,
    },
    {
      name: "category",
      type: "select",
      options: [...categoryOptions],
      required: true,
    },
    {
      name: "priority",
      type: "select",
      options: [
        { label: "Low", value: "low" },
        { label: "Medium", value: "medium" },
        { label: "High", value: "high" },
      ],
      required: true,
    },
    {
      name: "complexity",
      type: "select",
      options: [
        { label: "Simple", value: "simple" },
        { label: "Medium", value: "medium" },
        { label: "Complex", value: "complex" },
      ],
      required: true,
    },
    {
      name: "customer",
      type: "group",
      fields: [
        { name: "name", type: "text" },
        { name: "email", type: "email" },
        { name: "phone", type: "text" },
        { name: "postcode", type: "text" },
        { name: "chargerModel", type: "text", label: "Charger model" },
        { name: "serialNumber", type: "text", label: "Serial number" },
        { name: "installerName", type: "text", label: "Installer name" },
        { name: "appVersion", type: "text", label: "App version" },
        { name: "phoneType", type: "text", label: "Phone type" },
      ],
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
    },
    {
      name: "troubleshootingStepsTried",
      type: "array",
      fields: [
        {
          name: "step",
          type: "textarea",
          required: true,
        },
      ],
      label: "Troubleshooting tried",
    },
    {
      name: "escalationReason",
      type: "textarea",
      label: "Escalation reason",
    },
    {
      name: "transcript",
      type: "json",
      admin: {
        description: "Full Help Centre chat transcript captured at ticket creation.",
      },
    },
  ],
};
