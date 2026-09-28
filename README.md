# Ichimizu EBP Design Support — English Version

GitHub Pages-ready static site.

## Included files

- `index.html` — English user interface
- `styles.css` — site styling
- `app.js` — browser-only review, safety scan, and clipboard logic
- `prompt-template.js` — English master prompt (`v0.3.3-en-candidate`)
- `resource-links.js` — registered Ichimizu resource URLs
- `README.md` — deployment notes

## Recommended repository name

`ichimizu-ebp-design-support-en`

If GitHub Pages is enabled from the repository root, the expected URL pattern is:

`https://<account>.github.io/ichimizu-ebp-design-support-en/`

## Deployment

1. Create a new GitHub repository.
2. Upload all six files to the repository root.
3. Open **Settings → Pages**.
4. Select the branch used for deployment (normally `main`) and the root folder.
5. Save and wait for GitHub Pages to publish.

## Design principle

This English version is a localisation of the Japanese EBP Design Support site, not a literal word-for-word translation.

It preserves:
- Stage 1 → 2 → 2.5 → 3 → 4 → 5 → 6 workflow
- privacy / sensitive-information safeguards
- broad but controlled evidence searching
- `Discovery → Verified Source → Evidence Used` source filter
- handling of practitioner-generated novel interventions
- logic-model requirements
- measurement and evaluation design
- process evaluation
- stage records and PDF guidance

## Evidence-search localisation

The English prompt keeps the Japanese evidence-search rules because they are a core feature of the original tool. It also adds a jurisdiction-specific rule so that users outside Japan are directed toward official police/government sources, peer-reviewed local research, national databases, and university repositories in their own jurisdiction.

The two registered Ichimizu URLs currently point to the existing Japanese-language Research Hub and Overseas EBP Navigator. Replace them in `resource-links.js` if dedicated English versions are published later.

## Privacy

The site is static and does not itself transmit the form contents to an AI service. The prompt is generated in the browser and copied to the clipboard.

The built-in scan is only a rule-based aid. It cannot guarantee detection of all personal, operationally sensitive, non-public, or confidential information.


## Site-content governance revision — 2026-09-28

This revision makes the English site positioning explicit:

- the site generates a structured prompt only;
- it does not itself perform AI searching, police-data analysis, or operational decision-making;
- users must use only AI services permitted by their organisation;
- sensitive, investigative, confidential, and non-public information must not be entered;
- copyright and licence restrictions apply to third-party material;
- external EBP resources are navigation/evidence sources, not affiliated content;
- AI-generated claims must be checked against original sources;
- intervention/evaluation suggestions do not constitute organisational, legal, ethical, privacy, or research approval;
- the site is an experimental Ichimizu-kai prototype.

A short governance checklist is displayed immediately before the prompt-generation action.
