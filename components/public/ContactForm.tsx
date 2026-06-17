"use client";

import { useState } from "react";
import { getT, type Lang } from "@/lib/i18n";

/**
 * Contact form that hands off to the visitor's own email client via a
 * `mailto:` link (no server / SMTP needed). The name, email and message are
 * folded into the body so the recipient has the full context even though the
 * message is sent from the visitor's own account.
 */
export default function ContactForm({ to, lang }: { to: string; lang: Lang }) {
  const t = getT(lang).contact;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fullSubject = subject || (lang === "es" ? "Contacto — Portal de Patógenos Chile" : "Contact — Chile Pathogen Portal");
    const body =
      `${t.formName}: ${name}\n` +
      `${t.formEmail}: ${email}\n\n` +
      `${message}`;
    const url = `mailto:${to}?subject=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label small fw-semibold" htmlFor="cf-name">
            {t.formName}
          </label>
          <input
            id="cf-name"
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold" htmlFor="cf-email">
            {t.formEmail}
          </label>
          <input
            id="cf-email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="col-12">
          <label className="form-label small fw-semibold" htmlFor="cf-subject">
            {t.formSubject}
          </label>
          <input
            id="cf-subject"
            type="text"
            className="form-control"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div className="col-12">
          <label className="form-label small fw-semibold" htmlFor="cf-message">
            {t.formMessage}
          </label>
          <textarea
            id="cf-message"
            className="form-control"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-blue btn-lg">
            <i className="bi bi-envelope me-2"></i>
            {t.formSend}
          </button>
          <p className="text-muted small mt-2 mb-0">{t.formNote}</p>
        </div>
      </div>
    </form>
  );
}
