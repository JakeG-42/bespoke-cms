"use client";

import { Send } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";

import type { ChatMessage, ChatResponse } from "@/lib/help-centre/types";

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

function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

export function HelpCentreChat({ intro, title }: HelpCentreChatProps) {
  const messagesRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const messagesElement = messagesRef.current;

    if (!messagesElement) {
      return;
    }

    messagesElement.scrollTop = messagesElement.scrollHeight;
  }, [isSending, messages]);

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
      setError("I could not reach the helper right now. Please try again shortly.");
      return;
    }

    const data = (await response.json()) as ChatResponse;

    setMessages([...nextMessages, data.message]);
    setIsSending(false);
  }

  return (
    <div className="help-centre-chat">
      <div className="help-centre-chat-panel">
        <div className="help-centre-chat-intro">
          <span>AI helper</span>
          <h2>{title || "How can we help?"}</h2>
          {intro ? <p>{intro}</p> : null}
        </div>

        <div aria-live="polite" className="help-centre-messages" ref={messagesRef}>
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
        {error ? <p className="help-centre-error">{error}</p> : null}
      </div>
    </div>
  );
}
