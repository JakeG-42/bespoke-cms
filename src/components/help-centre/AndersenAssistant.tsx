"use client";

import { type FormEvent, type MouseEvent, useState } from "react";
import { ChevronDown, LockKeyhole, Sparkles, X } from "lucide-react";

import { HelpCentreChat } from "./HelpCentreChat";

type AndersenAssistantProps = {
  intro?: string;
  title?: string;
};

const assistantPin = "0000";
const shouldLockAssistant = process.env.NODE_ENV !== "production";

export function AndersenAssistant({ intro, title }: AndersenAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(!shouldLockAssistant);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");

  function toggleAssistant(event: MouseEvent<HTMLElement>) {
    event.preventDefault();

    if (isUnlocked) {
      setIsOpen((current) => !current);
      return;
    }

    setPin("");
    setPinError("");
    setIsPinModalOpen(true);
  }

  function unlockAssistant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pin !== assistantPin) {
      setPinError("Incorrect PIN. Please try again.");
      return;
    }

    setIsUnlocked(true);
    setIsOpen(true);
    setIsPinModalOpen(false);
    setPin("");
    setPinError("");
  }

  return (
    <>
      <details className="puck-ai-helper-card" open={isOpen}>
        <summary className="puck-ai-helper-card-header" onClick={toggleAssistant}>
          <span className="puck-ai-helper-icon">
            <Sparkles aria-hidden="true" size={18} strokeWidth={2} />
          </span>
          <span className="puck-ai-helper-title-group">
            <span className="puck-ai-helper-brow">Experimental</span>
            <h2>Andersen Assistant</h2>
          </span>
          <span aria-hidden="true" className={`puck-ai-helper-chevron ${!isUnlocked ? "is-locked" : ""}`}>
            <ChevronDown size={16} strokeLinecap="square" strokeLinejoin="miter" strokeWidth={4} />
            {!isUnlocked ? <LockKeyhole className="puck-ai-helper-lock" size={12} strokeWidth={2.4} /> : null}
          </span>
        </summary>
        <div className="puck-ai-helper-content">
          <HelpCentreChat intro={intro} title={title} />
        </div>
      </details>

      {isPinModalOpen ? (
        <div aria-modal="true" className="puck-ai-helper-pin-modal" role="dialog">
          <div className="puck-ai-helper-pin-card">
            <button aria-label="Close PIN modal" className="puck-ai-helper-pin-close" onClick={() => setIsPinModalOpen(false)} type="button">
              <X aria-hidden="true" size={16} />
            </button>
            <span className="puck-ai-helper-pin-icon">
              <LockKeyhole aria-hidden="true" size={18} strokeWidth={2.4} />
            </span>
            <h2>Developer access</h2>
            <p>Enter the PIN to open Andersen Assistant.</p>
            <form onSubmit={unlockAssistant}>
              <input
                aria-label="Andersen Assistant PIN"
                autoFocus
                inputMode="numeric"
                maxLength={4}
                onChange={(event) => setPin(event.currentTarget.value)}
                placeholder="0000"
                type="password"
                value={pin}
              />
              <button type="submit">Unlock</button>
            </form>
            {pinError ? <p className="puck-ai-helper-pin-error">{pinError}</p> : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
