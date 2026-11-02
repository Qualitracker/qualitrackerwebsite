export type LeadKind = 'newsletter' | 'demo_request' | 'waitlist' | 'talk_to_team';

export interface SubmitLeadInput {
  kind: LeadKind;
  email: string;
  firstName?: string;
  lastName?: string;
  institution?: string;
  role?: string;
  country?: string;
  /** e.g. "Medical laboratory", "Multi-site network" — waitlist/talk-to-team only. */
  organizationType?: string;
  /** Free-text context: waitlist detail, or a talk-to-team inquiry (prefix with its category). */
  message?: string;
  source: string; // where on the site this came from, e.g. "homepage-hero", "footer"
  consent: boolean;
  /** Honeypot passthrough — leave undefined for real users. */
  website?: string;
}

// Simple honeypot field name shared with the backend. Rendered
// visually hidden in the form; real users never see or fill it.
export const HONEYPOT_FIELD_NAME = 'website';

const EMAILJS = {
  endpoint: 'https://api.emailjs.com/api/v1.0/email/send',
  serviceId: 'service_h8tr7y8',
  // EmailJS public identifiers are intended for browser use.
  publicKey: '0Iofba0xfrTcxdb3_',
  // Talk to the team shares the waitlist template for now, so the email's
  // subject says "Waitlist" while the body is prefixed with the inquiry type.
  // Create a dedicated template (docs/WAITLIST_EMAIL_SETUP.md) and change this
  // ID; no other code needs to change.
  templateId: 'template_v13pvti',
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function sendViaEmailJs(templateParams: Record<string, string | undefined>): Promise<void> {
  // Recipient and CC addresses are fixed in the EmailJS template, never
  // visitor-controlled; the visitor's work_email is the reply-to.
  const response = await fetch(EMAILJS.endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: EMAILJS.serviceId,
      template_id: EMAILJS.templateId,
      user_id: EMAILJS.publicKey,
      template_params: templateParams,
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error('SUBMIT_FAILED');
}

/**
 * Every form on this site is delivered by email through EmailJS straight from
 * the browser. The site is static (Firebase Hosting) and has no /api backend,
 * so nothing here may post to a relative API URL.
 */
export async function submitLead(input: SubmitLeadInput): Promise<void> {
  // Honeypot: silently succeed for bots without sending anything.
  if (input.website?.trim()) return;

  if (!input.email || !EMAIL_PATTERN.test(input.email.trim())) {
    throw new Error(`INVALID_${input.kind.toUpperCase()}`);
  }

  if (input.kind === 'waitlist') {
    const required = [input.firstName, input.institution, input.organizationType, input.country, input.role, input.message];
    if (required.some((value) => !value?.trim())) throw new Error('INVALID_WAITLIST');
    await sendViaEmailJs({
      full_name: [input.firstName, input.lastName].filter(Boolean).join(' ').trim(),
      work_email: input.email.trim(),
      organization: input.institution?.trim(),
      organization_type: input.organizationType?.trim(),
      country: input.country?.trim(),
      role: input.role?.trim(),
      expectations: input.message?.trim(),
      submitted_at: new Date().toISOString(),
    });
    return;
  }

  if (input.kind === 'talk_to_team') {
    if (!input.firstName?.trim() || !input.message?.trim()) throw new Error('INVALID_TALK_TO_TEAM');
    await sendViaEmailJs({
      full_name: input.firstName.trim(),
      work_email: input.email.trim(),
      organization: input.institution?.trim() || 'Not provided',
      organization_type: 'Talk to the team inquiry',
      country: input.country?.trim() || 'Not provided',
      role: 'Not provided',
      expectations: input.message.trim(),
      submitted_at: new Date().toISOString(),
    });
    return;
  }

  throw new Error(`UNSUPPORTED_${input.kind.toUpperCase()}`);
}
