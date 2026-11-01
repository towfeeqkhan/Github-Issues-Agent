"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export default function ChatPage() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isBusy = status === "submitted" || status === "streaming";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = input.trim();

    if (!text || isBusy) return;

    sendMessage({ text });
    setInput("");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col p-4 sm:p-6">
      <header className="border-b pb-4">
        <h1 className="text-2xl font-bold">GitHub Issues Agent</h1>
        <p className="mt-1 text-sm text-gray-500">
          Explore issues in vercel/ai using GitHub MCP.
        </p>
      </header>

      <section
        aria-live="polite"
        className="flex-1 space-y-5 overflow-y-auto py-6"
      >
        {messages.length === 0 && (
          <div className="rounded-xl border p-5">
            <h2 className="font-semibold">Try asking</h2>

            <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-gray-600">
              <li>Find open issues in vercel/ai.</li>
              <li>Tell me more about issue #1234.</li>
              <li>Summarize the latest activity on an issue.</li>
            </ul>

            <p className="mt-3 text-xs text-gray-500">
              Issue numbers are examples; the agent must retrieve real GitHub
              data.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <article
            key={message.id}
            className={`rounded-xl p-4 ${
              message.role === "user"
                ? "ml-6 bg-blue-50 text-gray-900"
                : "mr-6 border bg-white text-gray-900"
            }`}
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              {message.role === "user" ? "You" : "Agent"}
            </p>

            <div className="whitespace-pre-wrap break-words text-sm leading-7">
              {message.parts.map((part, index) => {
                if (part.type === "text") {
                  return (
                    <span key={`${message.id}-${index}`}>{part.text}</span>
                  );
                }

                if (part.type.startsWith("tool-")) {
                  return (
                    <div
                      key={`${message.id}-${index}`}
                      className="my-2 rounded-lg bg-gray-100 p-3 text-xs text-gray-600"
                    >
                      GitHub tool: {part.type}
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </article>
        ))}

        {isBusy && <p className="text-sm text-gray-500">Agent is working...</p>}

        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            Something went wrong: {error.message}
          </p>
        )}
      </section>

      <form onSubmit={handleSubmit} className="flex gap-2 border-t pt-4">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about GitHub issues..."
          aria-label="Your message"
          className="min-w-0 flex-1 rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={!input.trim() || isBusy}
          className="rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isBusy ? "Working..." : "Send"}
        </button>
      </form>
    </main>
  );
}
