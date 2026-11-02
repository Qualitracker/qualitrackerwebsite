// Real Django model STATUS_CHOICES from the QMS repository (documents/models.py)
// — not an idealized or invented lifecycle.
export const DOCUMENT_STAGES = [
  { label: 'Draft', detail: 'A new SOP or policy starts here — editable, not yet in force.' },
  { label: 'Pending Collaboration', detail: 'Open for co-author input before it moves to formal review.' },
  { label: 'Under Review', detail: "A reviewer checks it against the standard it's meant to satisfy." },
  { label: 'Under Approval', detail: 'A final approver signs off before the document takes effect.' },
  { label: 'Approved', detail: 'In force — version-locked, and citable as evidence from this point on.', branch: 'Rejected sends it back to Draft, with the review history kept.' },
];

// Real Django model STATUS_CHOICES from non_conformance/models.py — including
// the actual two-stage independent review, not the simplified version most
// QMS marketing copy assumes.
export const CAPA_STAGES = [
  { label: 'Registered', detail: 'A finding is logged with a unique, auto-generated NC number and classified Major or Minor.' },
  { label: 'Pending Review 1', detail: 'Waiting on the first reviewer.' },
  { label: 'Review 1 Complete', detail: 'First reviewer has signed off.' },
  { label: 'Pending Review 2', detail: 'A second, independent reviewer checks the first review — not a rubber stamp.' },
  { label: 'Review 2 Complete', detail: 'Independent sign-off recorded.' },
  { label: 'Pending Closure', detail: 'Corrective action taken; waiting on final closure sign-off.' },
  { label: 'Closed', detail: 'Resolved, with the full two-reviewer trail preserved.', branch: 'Declined at review 2 returns it for further work, not silently dropped.' },
];
