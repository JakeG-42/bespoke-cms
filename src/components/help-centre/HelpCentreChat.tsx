"use client";

import { Send, ShieldAlert, TicketCheck } from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";

import type { ChatMessage, ChatResponse, CustomerInfo, IssueCategory, TicketDraft } from "@/lib/help-centre/types";

type HelpCentreChatProps = {
  intro?: string;
  title?: string;
};

const initialMessage: ChatMessage = {
  content: "Hi, I can help troubleshoot common charger, app and connectivity issues. What do you need help with today?",
  createdAt: new Date().toISOString(),
  id: "assistant-welcome",
  role: "assistant",
};

const categoryLabels: Record<IssueCategory, string> = {
  app_issue: "App issue",
  cable_plug_issue: "Cable / plug issue",
  charging_not_starting: "Charging not starting",
  charging_speed_load_management: "Charging speed / load management",
  general_enquiry: "General enquiry",
  installation_issue: "Installation issue",
  order_delivery_sales: "Order / delivery / sales",
  solar_ct_energy_readings: "Solar / CT clamp / energy readings",
  warranty_hardware_fault: "Warranty / hardware fault",
  wifi_connectivity: "Wi-Fi / connectivity",
};

function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

function createEmptyTicketDraft(messages: ChatMessage[]): TicketDraft {
  return {
    category: "general_enquiry",
    complexity: "simple",
    customer: {},
    priority: "low",
    summary: "",
    title: "Customer help centre enquiry",
    transcript: messages,
    troubleshootingStepsTried: [],
  };
}

export function HelpCentreChat({ intro, title }: HelpCentreChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [ticketDraft, setTicketDraft] = useState<TicketDraft>(() => createEmptyTicketDraft([initialMessage]));
  const [customer, setCustomer] = useState<CustomerInfo>({});
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [ticketReference, setTicketReference] = useState("");
  const [error, setError] = useState("");
  const visibleTicketDraft = useMemo(
    () => ({
      ...ticketDraft,
      customer,
      transcript: messages,
    }),
    [customer, messages, ticketDraft],
  );

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = input.trim();

    if (!trimmed || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      content: trimmed,
      createdAt: new Date().toISOString(),
      id: createId(),
      role: "user",
    };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setIsSending(true);
    setError("");

    const response = await fetch("/api/help-centre/chat", {
      body: JSON.stringify({ messages: nextMessages }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      setIsSending(false);
      setError("I could not reach the helper right now. You can still create a ticket below.");
      setIsTicketOpen(true);
      return;
    }

    const data = (await response.json()) as ChatResponse;

    setMessages([...nextMessages, data.message]);
    setTicketDraft(data.ticketDraft);
    setIsTicketOpen(data.shouldEscalate);
    setIsSending(false);
  }

  async function createTicket() {
    setIsCreatingTicket(true);
    setError("");

    const response = await fetch("/api/help-centre/tickets", {
      body: JSON.stringify({ ticket: visibleTicketDraft }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;

      setError(data?.error ?? "Ticket creation failed. Please check the required details.");
      setIsCreatingTicket(false);
      return;
    }

    const data = (await response.json()) as { reference: string };

    setTicketReference(data.reference);
    setIsCreatingTicket(false);
  }

  function updateCustomer(key: keyof CustomerInfo, value: string) {
    setCustomer((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return (
    <div className="help-centre-chat">
      <div className="help-centre-chat-panel">
        <div className="help-centre-chat-intro">
          <span>AI helper</span>
          <h2>{title || "How can we help?"}</h2>
          {intro ? <p>{intro}</p> : null}
        </div>

        <div aria-live="polite" className="help-centre-messages">
          {messages.map((message) => (
            <article className={`help-centre-message ${message.role}`} key={message.id}>
              <span>{message.role === "assistant" ? "Helper" : "You"}</span>
              <p>{message.content}</p>
            </article>
          ))}
          {isSending ? (
            <article className="help-centre-message assistant loading">
              <span>Helper</span>
              <p>Checking the safest next step...</p>
            </article>
          ) : null}
        </div>

        <form className="help-centre-input-row" onSubmit={sendMessage}>
          <input
            aria-label="Ask the Help Centre assistant"
            onChange={(event) => setInput(event.currentTarget.value)}
            placeholder="Describe the issue..."
            value={input}
          />
          <button disabled={isSending || !input.trim()} type="submit">
            <Send aria-hidden="true" size={18} />
            <span>Send</span>
          </button>
        </form>
      </div>

      <aside className="help-centre-ticket-panel">
        <div className="help-centre-ticket-header">
          <ShieldAlert aria-hidden="true" size={20} />
          <div>
            <span>Ticket draft</span>
            <h3>{visibleTicketDraft.title}</h3>
          </div>
        </div>
        <dl className="help-centre-ticket-meta">
          <div>
            <dt>Category</dt>
            <dd>{categoryLabels[visibleTicketDraft.category]}</dd>
          </div>
          <div>
            <dt>Priority</dt>
            <dd>{visibleTicketDraft.priority}</dd>
          </div>
          <div>
            <dt>Complexity</dt>
            <dd>{visibleTicketDraft.complexity}</dd>
          </div>
        </dl>
        <button className="help-centre-secondary-button" onClick={() => setIsTicketOpen((current) => !current)} type="button">
          {isTicketOpen ? "Hide ticket details" : "Create support ticket"}
        </button>

        {isTicketOpen ? (
          <div className="help-centre-ticket-form">
            <label>
              Name
              <input onChange={(event) => updateCustomer("name", event.currentTarget.value)} value={customer.name ?? ""} />
            </label>
            <label>
              Email
              <input onChange={(event) => updateCustomer("email", event.currentTarget.value)} type="email" value={customer.email ?? ""} />
            </label>
            <label>
              Phone
              <input onChange={(event) => updateCustomer("phone", event.currentTarget.value)} value={customer.phone ?? ""} />
            </label>
            <label>
              Postcode
              <input onChange={(event) => updateCustomer("postcode", event.currentTarget.value)} value={customer.postcode ?? ""} />
            </label>
            <label>
              Charger model
              <input onChange={(event) => updateCustomer("chargerModel", event.currentTarget.value)} value={customer.chargerModel ?? ""} />
            </label>
            <label>
              Serial number
              <input onChange={(event) => updateCustomer("serialNumber", event.currentTarget.value)} value={customer.serialNumber ?? ""} />
            </label>
            <label>
              Installer
              <input onChange={(event) => updateCustomer("installerName", event.currentTarget.value)} value={customer.installerName ?? ""} />
            </label>
            <label>
              App version
              <input onChange={(event) => updateCustomer("appVersion", event.currentTarget.value)} value={customer.appVersion ?? ""} />
            </label>
            <label className="wide">
              Issue summary
              <textarea
                onChange={(event) => setTicketDraft((current) => ({ ...current, summary: event.currentTarget.value }))}
                value={visibleTicketDraft.summary}
              />
            </label>
            {visibleTicketDraft.escalationReason ? <p className="help-centre-safety-note">{visibleTicketDraft.escalationReason}</p> : null}
            <button className="help-centre-ticket-button" disabled={isCreatingTicket || Boolean(ticketReference)} onClick={createTicket} type="button">
              <TicketCheck aria-hidden="true" size={18} />
              <span>{ticketReference ? `Created ${ticketReference}` : isCreatingTicket ? "Creating..." : "Create ticket"}</span>
            </button>
          </div>
        ) : null}
        {error ? <p className="help-centre-error">{error}</p> : null}
      </aside>
    </div>
  );
}
