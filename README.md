# ShippedWithAI
Static directory + newsletter of real AI-built micro-SaaS cases. Target domain: shippedwithai.com.

- Data: `data/cases.json` (one object per case; omit unsourced metrics), `categories.json`, `tools.json`, `newsletter.json` (archive: `{title,date,url}`).
- Build: `node build.js` → `dist/` (zero dependencies). Vercel builds automatically on push.
- Config (top of `build.js`): `buttondownUser` (newsletter form), `stripe` payment-link URLs.
- Submissions: GitHub issue form `.github/ISSUE_TEMPLATE/submit-case.yml`.
