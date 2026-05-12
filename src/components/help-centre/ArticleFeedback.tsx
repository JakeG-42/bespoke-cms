"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type ArticleFeedbackProps = {
  articlePath: string;
  articleTitle: string;
  categorySlug: string;
};

type Vote = "helpful" | "notHelpful";

const browserStorageKey = "andersen-help-centre-browser-id";
const voteStorageEvent = "andersen-help-centre-vote-storage";

export function ArticleFeedback({ articlePath, articleTitle, categorySlug }: ArticleFeedbackProps) {
  const voteStorageKey = `andersen-help-centre-vote:${articlePath}`;
  const selectedVote = useSyncExternalStore(
    subscribeToVoteStorage,
    () => readStoredVote(voteStorageKey),
    () => null,
  );
  const [hasRecordedView, setHasRecordedView] = useState(false);
  const activeSinceRef = useRef<number | null>(null);

  useEffect(() => {
    const browserId = getBrowserId();
    activeSinceRef.current = Date.now();

    postAnalytics({
      articlePath,
      articleTitle,
      browserId,
      categorySlug,
      type: "view",
    }).then(() => setHasRecordedView(true)).catch(() => setHasRecordedView(false));

    const flushTime = () => {
      const activeSince = activeSinceRef.current;

      if (!activeSince) {
        return;
      }

      const seconds = Math.round((Date.now() - activeSince) / 1000);
      activeSinceRef.current = Date.now();

      if (seconds < 2) {
        return;
      }

      sendAnalyticsBeacon({
        articlePath,
        articleTitle,
        browserId,
        categorySlug,
        seconds,
        type: "time",
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flushTime();
      } else {
        activeSinceRef.current = Date.now();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", flushTime);

    return () => {
      flushTime();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", flushTime);
    };
  }, [articlePath, articleTitle, categorySlug]);

  const vote = async (nextVote: Vote) => {
    if (selectedVote) {
      return;
    }

    const browserId = getBrowserId();
    window.localStorage.setItem(voteStorageKey, nextVote);
    notifyVoteStorage();

    await postAnalytics({
      articlePath,
      articleTitle,
      browserId,
      categorySlug,
      type: "vote",
      vote: nextVote,
    }).catch(() => {
      window.localStorage.removeItem(voteStorageKey);
      notifyVoteStorage();
    });
  };

  return (
    <section className="help-article-feedback" aria-label="Article feedback">
      <div>
        <p>Was this helpful?</p>
        <span>{selectedVote ? "Thanks for the feedback." : "Your answer helps us improve this article."}</span>
      </div>
      <div className="help-article-feedback-actions">
        <button aria-pressed={selectedVote === "helpful"} disabled={Boolean(selectedVote)} onClick={() => void vote("helpful")} type="button">
          <ThumbsUp aria-hidden="true" size={17} strokeWidth={2} />
          <span>Yes</span>
        </button>
        <button aria-pressed={selectedVote === "notHelpful"} disabled={Boolean(selectedVote)} onClick={() => void vote("notHelpful")} type="button">
          <ThumbsDown aria-hidden="true" size={17} strokeWidth={2} />
          <span>No</span>
        </button>
      </div>
      <span className="help-article-feedback-status" aria-live="polite">
        {hasRecordedView ? "" : " "}
      </span>
    </section>
  );
}

function subscribeToVoteStorage(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const listener = () => onStoreChange();

  window.addEventListener("storage", listener);
  window.addEventListener(voteStorageEvent, listener);

  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(voteStorageEvent, listener);
  };
}

function notifyVoteStorage() {
  window.dispatchEvent(new Event(voteStorageEvent));
}

function readStoredVote(voteStorageKey: string): Vote | null {
  if (typeof window === "undefined") {
    return null;
  }

  const existingVote = window.localStorage.getItem(voteStorageKey);

  return existingVote === "helpful" || existingVote === "notHelpful" ? existingVote : null;
}

function getBrowserId() {
  const existing = window.localStorage.getItem(browserStorageKey);

  if (existing) {
    return existing;
  }

  const nextId = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  window.localStorage.setItem(browserStorageKey, nextId);

  return nextId;
}

function postAnalytics(payload: Record<string, unknown>) {
  return fetch("/api/help-centre/article-analytics", {
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    keepalive: true,
  });
}

function sendAnalyticsBeacon(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/help-centre/article-analytics", blob);
    return;
  }

  void postAnalytics(payload);
}
