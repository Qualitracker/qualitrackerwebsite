# Security Policy

## Scope

This repository powers the public QualiTracker marketing website (`https://www.qualitracker.com`). It is a static, build-time prerendered web frontend served via Firebase Hosting.

- **Never commit secrets, `.env` files, service-account keys, DNS zone files (`*.zone`), or server inventory/migration scripts** to this public repository.
- Internal infrastructure runbooks, DNS zone exports, and backend service code belong exclusively in private `Qualitracker` repositories and restricted cloud storage.

## Reporting a Vulnerability

If you discover a security or privacy issue affecting `qualitracker.com` or this repository, please report it privately rather than opening a public GitHub issue:

- **Email:** `info@qualitracker.com` (Subject: `SECURITY: qualitrackerwebsite`)
- Include affected URLs or file paths, reproduction steps, and potential impact.

We review security reports promptly and coordinate remediation before public disclosure.

## Transport & Browser Controls

- Served over HTTPS via Firebase Hosting (`firebase.json`) with `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Cross-Origin-Opener-Policy: same-origin`, `Permissions-Policy`, and `Content-Security-Policy-Report-Only`.
- Optional QualiBOT chat widget (`src/components/site/chat-widget.tsx`) lazy-mounts only when `VITE_QUALIBOT_URL` is configured and validates exact `postMessage` origin parity (`e.origin === embedOrigin`).
