
import { useCallback, useEffect, useState } from "react";
import "./Messages.css";

const API_URL = "http://localhost:8080/api/messages";

async function readError(response) {
  const text = await response.text();

  if (!text) {
    return `Request failed with HTTP ${response.status}.`;
  }

  try {
    const body = JSON.parse(text);
    return body.detail || body.message || body.error ||
      `Request failed with HTTP ${response.status}.`;
  } catch {
    return text;
  }
}

export default function Messages() {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inboxLoading, setInboxLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [conversationLoaded, setConversationLoaded] = useState(false);

  const token = localStorage.getItem("token");

  const loadInbox = useCallback(async () => {
    if (!token) {
      setConversations([]);
      setInboxLoading(false);
      return;
    }

    setInboxLoading(true);

    try {
      const response = await fetch(`${API_URL}/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Unexpected inbox response.");
      }

      setConversations(data);
    } catch (err) {
      setError(`Could not load inbox: ${err.message}`);
    } finally {
      setInboxLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadInbox();
  }, [loadInbox]);

  async function openConversation(email) {
    const targetEmail = email.trim();

    if (!targetEmail || !token) {
      setError("Please log in again before opening messages.");
      return;
    }

    setError("");
    setNotice("");
    setRecipientEmail(targetEmail);
    setMessages([]);
    setConversationLoaded(false);
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/${encodeURIComponent(targetEmail)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) {
        throw new Error(
          `Could not load conversation (HTTP ${response.status}): ${
            await readError(response)
          }`
        );
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Unexpected conversation response.");
      }

      setMessages(data);
      setConversationLoaded(true);
    } catch (err) {
      setError(err.message || "Could not load conversation.");
    } finally {
      setLoading(false);
    }
  }

  async function loadConversation(event) {
    event.preventDefault();
    await openConversation(recipientEmail);
  }

  async function sendMessage(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!token) {
      setError("Please log in again.");
      return;
    }

    if (!recipientEmail.trim() || !draft.trim()) {
      setError("Enter a recipient email and write a message.");
      return;
    }

    setSending(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientEmail: recipientEmail.trim(),
          content: draft.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Message failed (HTTP ${response.status}): ${
            await readError(response)
          }`
        );
      }

      const sentMessage = await response.json();

      setMessages((previous) => [...previous, sentMessage]);
      setConversationLoaded(true);
      setDraft("");
      setNotice("Message sent successfully.");

      await loadInbox();
    } catch (err) {
      setError(err.message || "Could not send the message.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="messages-page">
      <div className="messages-heading">
        <div>
          <p className="messages-eyebrow">STAY CONNECTED</p>
          <h1>Messages</h1>
          <p>Your conversations with students and tutors.</p>
        </div>
      </div>

      <section className="messages-panel">
        <div className="messages-layout">
          <aside className="inbox-sidebar">
            <div className="inbox-title">
              <h2>Conversations</h2>
              <button
                type="button"
                className="refresh-inbox"
                onClick={loadInbox}
                disabled={inboxLoading}
              >
                {inboxLoading ? "Loading..." : "Refresh"}
              </button>
            </div>

            <form className="recipient-form" onSubmit={loadConversation}>
              <label htmlFor="recipientEmail">Start or find a chat</label>
              <input
                id="recipientEmail"
                type="email"
                value={recipientEmail}
                onChange={(event) => setRecipientEmail(event.target.value)}
                placeholder="Enter a registered email"
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? "Loading..." : "Open conversation"}
              </button>
            </form>

            <div className="inbox-items">
              {inboxLoading && conversations.length === 0 ? (
                <p className="inbox-message">Loading conversations...</p>
              ) : conversations.length === 0 ? (
                <p className="inbox-message">
                  No conversations yet. Start one using an email above.
                </p>
              ) : (
                conversations.map((conversation) => (
                  <button
                    type="button"
                    key={conversation.email}
                    className={
                      recipientEmail.toLowerCase() ===
                      conversation.email.toLowerCase()
                        ? "inbox-item active"
                        : "inbox-item"
                    }
                    onClick={() => openConversation(conversation.email)}
                  >
                    <strong>{conversation.email}</strong>
                    <span>{conversation.latestMessage}</span>
                    <small>
                      {conversation.sentAt
                        ? new Date(conversation.sentAt).toLocaleString()
                        : ""}
                    </small>
                  </button>
                ))
              )}
            </div>
          </aside>

          <section className="chat-panel">
            <div className="chat-heading">
              <h2>
                {recipientEmail
                  ? recipientEmail
                  : "Select a conversation"}
              </h2>
              <p>
                {recipientEmail
                  ? "Messages between you and this person"
                  : "Choose someone from your conversation list."}
              </p>
            </div>

            {error && (
              <div className="messages-alert error" role="alert">
                {error}
              </div>
            )}

            {notice && (
              <div className="messages-alert success" role="status">
                {notice}
              </div>
            )}

            <div className="conversation-list" aria-live="polite">
              {loading ? (
                <div className="messages-empty">
                  Loading conversation...
                </div>
              ) : messages.length === 0 ? (
                <div className="messages-empty">
                  <div className="messages-empty-icon">✉</div>
                  <h2>
                    {conversationLoaded
                      ? "No messages yet"
                      : "Your messages appear here"}
                  </h2>
                  <p>
                    {conversationLoaded
                      ? "Send the first message below."
                      : "Select a conversation or enter an email to open one."}
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <article
                    className={
                      message.senderEmail.toLowerCase() ===
                      (localStorage.getItem("userEmail") || "").toLowerCase()
                        ? "message-item own-message"
                        : "message-item"
                    }
                    key={message.messageId}
                  >
                    <div className="message-meta">
                      <strong>{message.senderEmail}</strong>
                      <span>
                        {message.sentAt
                          ? new Date(message.sentAt).toLocaleString()
                          : ""}
                      </span>
                    </div>
                    <p>{message.content}</p>
                  </article>
                ))
              )}
            </div>

            <form className="message-compose" onSubmit={sendMessage}>
              <label htmlFor="messageDraft">Write a message</label>
              <textarea
                id="messageDraft"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Type your message here..."
                rows={3}
                maxLength={3000}
                required
              />
              <div className="compose-footer">
                <span>{draft.length}/3000 characters</span>
                <button
                  type="submit"
                  disabled={sending || !token || !recipientEmail.trim()}
                >
                  {sending ? "Sending..." : "Send message"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}
