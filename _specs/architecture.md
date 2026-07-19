# Architecture

## 1. Purpose

This document defines the technical architecture for the static website.

The website is built using Vite, Preact and TypeScript and is deployed as static files through GitHub Pages.

The architecture is intended to:

* Support incremental, feature-based development
* Provide reusable layouts and UI components
* Minimise client-side JavaScript
* Avoid unnecessary backend infrastructure
* Remain simple to build, test and deploy
* Preserve the existing application scaffold as features are added

All feature implementations must conform to this architecture unless an architectural change is explicitly documented and approved.

---

## 2. Architecture Summary

The website uses a client-side static-site architecture.

Vite compiles the source code into static HTML, CSS, JavaScript and asset files. GitHub Pages serves those generated files directly to the user's browser.

```text
Source files
    ↓
Vite build
    ↓
Static HTML, CSS, JavaScript and assets
    ↓
GitHub Pages
    ↓
User's browser
```

The site does not require:

* A continuously running application server
* Server-side rendering
* A server-side application runtime
* An application database

Interactive functionality is implemented using Preact components running in the browser.

---

## 3. Technology Stack

### Build tool

Use:

```text
Vite
```

Vite is responsible for:

* Local development
* Module resolution
* TypeScript compilation
* CSS and asset processing
* Development hot-module replacement
* Production optimisation
* Static build generation

### Frontend framework

Use:

```text
Preact
```

Preact is responsible for:

* Reusable UI components
* Client-side interaction
* Component state
* Event handling
* Rendering dynamic interface states

Preact is selected because it provides a lightweight component model while retaining familiar React-style patterns.

### Programming language

Use:

```text
TypeScript
```

TypeScript should be used for:

* Components
* Shared utilities
* Data structures
* Service interfaces
* Application configuration
* Client-side business rules

Avoid untyped JavaScript unless required by an external library.

### Styling

Use:

```text
CSS
```

Shared design tokens must be implemented using CSS custom properties.

Component-specific styles may use:

* CSS Modules
* Component-level CSS files
* Scoped naming conventions

Do not introduce a CSS framework unless it is explicitly approved as an architectural decision.

### Package management

Use:

```text
npm
```

### Hosting

Use:

```text
GitHub Pages
```

### Source control

Use:

```text
GitHub
```

### Continuous integration and deployment

Use:

```text
GitHub Actions
```

---

## 4. Application Type

The application is a static single-page application with statically generated entry files.

The site may use client-side routing where needed, but it should not become dependent on complex single-page application behaviour without a clear requirement.

For simple public websites, prefer:

* Static page content
* Native browser navigation
* Minimal JavaScript
* Progressive enhancement

Use Preact only where component reuse or browser interaction provides clear value.

---

## 5. Repository Structure

Use the following repository structure:

```text
project-root/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml
│
├── public/
│   ├── favicon.svg
│   ├── images/
│   ├── files/
│   └── 404.html
│
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── routes.ts
│   │   └── app-config.ts
│   │
│   ├── components/
│   │   ├── layout/
│   │   ├── navigation/
│   │   ├── content/
│   │   ├── forms/
│   │   └── ui/
│   │
│   ├── features/
│   │   ├── home/
│   │   ├── about/
│   │   └── contact/
│   │
│   ├── hooks/
│   ├── services/
│   ├── data/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── specs/
│   ├── product.md
│   ├── architecture.md
│   ├── design-system.md
│   ├── scaffold-status.md
│   ├── feature-index.md
│   ├── decisions/
│   └── features/
│
├── tests/
│   ├── unit/
│   └── integration/
│
├── .claude/
│   └── skills/
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── CLAUDE.md
```

---

## 6. Application Entry Point

The application entry point is:

```text
src/main.tsx
```

It is responsible only for:

* Importing global styles
* Locating the application root element
* Rendering the root `App` component
* Initialising approved application-wide services

Example responsibility:

```tsx
import { render } from 'preact';
import { App } from './app/App';
import './styles/global.css';

const root = document.getElementById('app');

if (!root) {
  throw new Error('Application root element was not found.');
}

render(<App />, root);
```

Business logic must not be placed in `main.tsx`.

---

## 7. Application Shell

The main application shell is:

```text
src/app/App.tsx
```

It is responsible for composing:

* Global layout
* Site header
* Main navigation
* Page content
* Site footer
* Routing where required
* Global error boundaries where supported

The application shell is a persistent project asset.

Feature implementations must not recreate or replace it unless an approved architectural decision requires that change.

---

## 8. Component Architecture

Reusable components must be stored under:

```text
src/components/
```

Components should be organised by responsibility.

```text
components/
├── layout/
├── navigation/
├── content/
├── forms/
└── ui/
```

Examples:

```text
components/layout/PageLayout.tsx
components/layout/SiteHeader.tsx
components/layout/SiteFooter.tsx
components/navigation/MainNavigation.tsx
components/ui/Button.tsx
components/ui/Card.tsx
components/forms/FormField.tsx
```

Components must:

* Have one clear responsibility
* Receive data through typed properties
* Avoid direct access to unrelated application state
* Use design-system tokens
* Support keyboard use where interactive
* Remain reusable where practical

Before creating a component, inspect existing components for something that can be reused or extended.

---

## 9. Feature Architecture

Feature-specific code must be stored under:

```text
src/features/
```

Each feature should own its feature-specific:

* Components
* Types
* Hooks
* Data
* Validation
* Tests
* Service wrappers

Example:

```text
src/features/contact/
├── components/
│   ├── ContactForm.tsx
│   └── ContactConfirmation.tsx
├── contact.types.ts
├── contact.validation.ts
├── contact.service.ts
└── contact.test.tsx
```

Feature directories must not duplicate shared application components.

Feature-specific components should be promoted to `src/components/` only when they become genuinely reusable across features.

---

## 10. Separation of Concerns

The architecture separates responsibilities as follows:

```text
src/components/
    Shared presentation components

src/features/
    Feature-specific behaviour and presentation

src/services/
    External APIs and integrations

src/data/
    Static shared data

src/hooks/
    Shared Preact hooks

src/types/
    Shared TypeScript types

src/utils/
    General-purpose utility functions

src/styles/
    Global styling and design tokens
```

UI components should not contain direct external-service integration where that logic can be isolated in a service module.

---

## 11. State Management

Use local component state by default.

Preferred state mechanisms are:

* Preact component state
* Derived values
* Properties passed between components
* Small shared context providers where necessary

Do not introduce a separate state-management library unless:

* State is genuinely shared across multiple unrelated feature areas
* Passing state through component properties becomes unmanageable
* The requirement is documented in an architectural decision record

Avoid storing values in global state when local component state is sufficient.

---

## 12. Routing

Routing should remain as simple as the site requirements allow.

For a small static website, preferred options are:

1. Separate static entry pages
2. Simple browser navigation
3. A lightweight client-side router only when required

If client-side routing is used, route definitions must be centralised in:

```text
src/app/routes.ts
```

Example routes:

```text
/
/about
/services
/contact
```

Routing must account for GitHub Pages deployment constraints.

GitHub Pages does not provide general-purpose server fallback routing. Direct navigation to client-side routes may fail unless a compatible fallback strategy is implemented.

For public content pages, prefer static entry points over unnecessary client-side routing.

---

## 13. GitHub Pages Base Path

The Vite configuration must account for the GitHub Pages deployment location.

For a project site hosted at:

```text
https://username.github.io/repository-name/
```

configure:

```ts
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  base: '/repository-name/',
});
```

For a user or organisation site hosted at:

```text
https://username.github.io/
```

configure:

```ts
base: '/'
```

The base path must not be hard-coded throughout components.

Asset references should use:

* Imported assets
* Vite-managed URLs
* The configured base URL
* Root-relative paths only when deployment at the root is guaranteed

---

## 14. Static Assets

Files that must be copied without processing belong under:

```text
public/
```

Examples:

* Favicons
* Downloadable files
* Robots file
* Static images that do not require bundling
* Web-app manifest

Assets imported by components should generally be stored under:

```text
src/assets/
```

Vite should process imported assets so that production filenames and cache-busting are handled automatically.

---

## 15. Styling Architecture

Global styles belong under:

```text
src/styles/
```

Recommended structure:

```text
src/styles/
├── reset.css
├── tokens.css
├── typography.css
├── global.css
└── utilities.css
```

Shared values must use CSS custom properties.

Example:

```css
:root {
  --colour-primary: #1d4ed8;
  --colour-text: #1f2937;
  --colour-background: #ffffff;

  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;

  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
}
```

Feature code must not introduce arbitrary colours, spacing values or typography that conflict with `specs/design-system.md`.

---

## 16. Client-Side JavaScript

The application should use the least client-side JavaScript necessary.

Use Preact for:

* Reusable interactive components
* Forms
* Dynamic content states
* Client-side filtering
* Tabs and accordions
* Conditional rendering
* Lightweight routing where justified

Prefer HTML and CSS for:

* Static content
* Layout
* Basic navigation
* Responsive behaviour
* Native disclosure behaviour
* Non-interactive presentation

Essential page content should remain accessible without unnecessary JavaScript-dependent interaction.

---

## 17. Data Architecture

Static content and configuration may be stored in:

* TypeScript modules
* JSON
* Markdown processed at build time
* Public static files

Example:

```text
src/data/navigation.ts
src/data/services.ts
src/data/site-config.ts
```

Data modules should export typed data structures.

Example:

```ts
export interface NavigationItem {
  label: string;
  href: string;
}

export const navigationItems: NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
```

Do not embed large or repeatable content structures directly inside shared UI components.

---

## 18. External Services

GitHub Pages cannot provide server-side processing.

External services may be used for:

* Form submissions
* Analytics
* Search
* Maps
* Embedded media
* Serverless processing

External services must be accessed through modules under:

```text
src/services/
```

Example:

```text
src/services/contact-form.service.ts
src/services/analytics.service.ts
```

Components should not call external endpoints directly when the logic can be isolated behind a typed service function.

Every external service must be documented in the relevant feature specification.

---

## 19. Forms

Forms must use client-side validation and an approved external submission mechanism.

A form implementation must include:

* Accessible labels
* Typed form data
* Client-side validation
* Error messages
* Loading state
* Success state
* Failure state
* Protection against duplicate submissions where appropriate

Private API keys and secrets must never be placed in browser code.

Any endpoint invoked from the browser must be safe for public exposure.

---

## 20. Environment Configuration

Vite environment variables exposed to browser code must use the `VITE_` prefix.

Examples:

```text
VITE_SITE_URL
VITE_FORM_ENDPOINT
VITE_ANALYTICS_ID
```

All variables exposed through Vite must be treated as public.

Do not store:

* Private API keys
* Passwords
* Deployment credentials
* Private service tokens

in Vite environment variables used by frontend code.

Secrets required by GitHub Actions must be stored in GitHub repository secrets.

---

## 21. Testing Strategy

Use automated testing for:

* Component rendering
* User interaction
* Form validation
* Utility functions
* Data transformation
* Feature behaviour

Recommended tools:

```text
Vitest
Testing Library
Playwright
```

### Unit and component tests

Use Vitest and Testing Library for:

* Components
* Hooks
* Validation
* Utilities
* Services with mocked external calls

### End-to-end tests

Use Playwright for critical user journeys such as:

* Opening key pages
* Navigating the site
* Opening responsive navigation
* Completing forms
* Verifying error states

### Required verification

Every completed feature must pass:

```text
npm run lint
npm run typecheck
npm run test
npm run build
```

Critical user journeys should also pass:

```text
npm run test:e2e
```

---

## 22. Accessibility

The site must target WCAG 2.2 Level AA.

All components and features must support:

* Semantic HTML
* Keyboard navigation
* Visible focus indicators
* Accessible names
* Form labels
* Meaningful error messages
* Appropriate heading hierarchy
* Sufficient colour contrast
* Reduced-motion preferences
* Responsive text scaling
* Alternative text for meaningful images

Native HTML elements should be preferred over recreating native behaviour using generic elements.

---

## 23. Performance

The architecture should preserve the performance benefits of static hosting.

Requirements include:

* Minimal JavaScript bundles
* Code splitting where it provides value
* Lazy loading for non-critical content
* Optimised images
* Limited third-party scripts
* No unnecessary dependencies
* No large UI framework for simple behaviours
* Production asset compression where supported

A new dependency must not be introduced when a small local implementation would be clearer and more maintainable.

---

## 24. Security

The frontend must:

* Use HTTPS
* Avoid exposing secrets
* Validate user input
* Avoid unsafe HTML rendering
* Avoid executing untrusted content
* Use trusted dependencies
* Keep dependencies current
* Minimise third-party scripts
* Avoid storing sensitive data in browser storage

Do not use Preact's raw HTML injection capabilities unless content is trusted and sanitised.

---

## 25. Browser Storage

Browser storage may be used only for non-sensitive, non-critical data such as:

* Theme preferences
* Dismissed notices
* Interface settings

Do not store:

* Passwords
* Authentication credentials
* Private personal information
* Sensitive form content
* Security tokens not specifically designed for browser storage

The site must not depend on browser storage for essential content.

---

## 26. Error Handling

The application must provide clear handling for:

* Missing content
* Invalid form input
* Failed network requests
* Unavailable external services
* Unexpected component errors
* Unknown routes

User-facing errors must explain:

* What happened
* Whether the user's action was completed
* What they can do next

Errors must not expose stack traces or implementation details.

---

## 27. GitHub Pages Deployment

Production deployment must use GitHub Actions.

The workflow must:

1. Check out the repository.
2. Install the supported Node.js version.
3. Install dependencies using `npm ci`.
4. Run linting.
5. Run type checking.
6. Run tests.
7. Build the Vite application.
8. Upload the `dist/` directory.
9. Deploy the artifact to GitHub Pages.

The deployment output directory is:

```text
dist/
```

The `dist/` directory must not normally be committed to source control.

---

## 28. Branch and Deployment Rules

The production deployment branch is:

```text
main
```

Pull requests should run:

```text
npm run lint
npm run typecheck
npm run test
npm run build
```

Merging to `main` should trigger production deployment.

Deployed files must not be edited manually.

---

## 29. Dependency Rules

Before adding a dependency:

1. Confirm the requirement cannot be met reasonably using the existing stack.
2. Check whether an existing dependency already provides the capability.
3. Evaluate bundle-size impact.
4. Evaluate maintenance activity.
5. Evaluate browser compatibility.
6. Evaluate security risk.
7. Document major architectural dependencies.

Do not introduce:

* A second frontend framework
* A second routing system
* Multiple component libraries
* A state-management library without a demonstrated need
* A full utility library for one small function

---

## 30. Architectural Constraints

The following constraints apply:

* The application must build using Vite.
* The frontend framework must remain Preact unless an architectural decision approves a change.
* The output must be deployable as static files.
* The application must not require a continuously running server.
* Core functionality must not require a database.
* Secrets must not be exposed in frontend code.
* GitHub Pages is the production hosting platform.
* Features must extend the existing application scaffold.
* Shared components must be reused before creating alternatives.
* Feature implementation must not regenerate the application shell.
* External services must be isolated behind service modules.
* The GitHub Pages base path must be respected.

---

## 31. Architectural Decision Process

An architectural decision record is required when a feature proposes:

* A different frontend framework
* A backend application
* A database
* Authentication
* Private data storage
* Server-side rendering
* A different hosting platform
* A state-management library
* A component framework
* A substantial new external dependency
* A change to the routing model

Store decisions under:

```text
specs/decisions/
```

Example:

```text
specs/decisions/
├── ADR-001-use-preact.md
├── ADR-002-use-github-pages.md
└── ADR-003-contact-form-provider.md
```

Each decision record must contain:

* Status
* Context
* Decision
* Alternatives considered
* Consequences
* Date

---

## 32. Feature Implementation Rules

When implementing a feature:

1. Read `CLAUDE.md`.
2. Read this architecture document.
3. Read `specs/design-system.md`.
4. Read the relevant feature specification.
5. Inspect the existing code.
6. Identify existing components and services to reuse.
7. Identify the smallest coherent change.
8. Avoid unrelated refactoring.
9. Do not regenerate the scaffold.
10. Do not replace the application shell.
11. Keep feature-specific code under `src/features/`.
12. Promote code to shared folders only when it is genuinely reusable.
13. Add or update tests.
14. Run the full production build.
15. Verify the GitHub Pages base path.
16. Update `specs/feature-index.md`.

---

## 33. Definition of Architectural Compliance

A feature is architecturally compliant when:

* It builds successfully using Vite.
* It uses Preact and TypeScript consistently.
* It produces static deployable output.
* It works under the configured GitHub Pages base path.
* It reuses the established application shell.
* It reuses existing shared components where appropriate.
* It does not expose secrets.
* It does not require an unsupported server runtime.
* It passes linting, type checking, tests and production build.
* It meets accessibility requirements.
* Any architectural deviation has an accepted decision record.

---

## 34. Scaffold Implementation Notes (2026-07-19)

Recorded during initial scaffolding for DavesFunRC. See
`_specs/scaffold-status.md` for full detail.

* **Routing**: implemented as a small hand-rolled `history`-based router
  (`src/app/router.tsx`, `src/app/routes.ts`) rather than a router
  package, per §29's preference for a local implementation when the
  route table is small. GitHub Pages' lack of fallback routing (§12) is
  handled with the standard `public/404.html` redirect technique plus a
  decode script in `index.html`.
* **Base path**: configured as `base: '/'` with `public/CNAME` set to
  `DavesFunRC.com`, per user decision to target that custom domain now
  rather than the `Trevbenn5.github.io/DavesFunRC-Spec/` project-page
  path. If the custom domain is dropped later, `vite.config.ts`'s `base`
  and `public/CNAME` need to change together.
* **Navigation layout**: `_specs/design-system.md`'s Navigation section
  specifies horizontal desktop navigation with a mobile hamburger menu,
  which the scaffold implements directly
  (`src/components/navigation/MainNavigation.tsx`). Note that several
  other sections of that design system (Tables, Dialogs, Toasts) read as
  generic app/dashboard component-library boilerplate rather than
  something written specifically for this public content site — only
  the components actually needed so far (Button, Card) were built.
* **Linting**: `eslint-plugin-preact` was evaluated and rejected
  (unmaintained since 2020, no ESLint 9 flat-config support, pulled in
  vulnerable transitive dependencies). Lint relies on `@eslint/js` +
  `typescript-eslint` recommended rules only.
* **Dependency versions**: `vitest` was pinned to `^4.1.10` (rather than
  the `^2.x` line) because `vitest@2.1.8`'s bundled `vite-node`/`vite`
  transitive deps resolved to a pre-patch `esbuild` (dev-server CORS
  advisory, GHSA-67mh-4wv8-2f99). `vite` itself stayed on the `^6.4.2`
  line, which already satisfies `vitest@4`'s peer range and ships a
  patched `esbuild`. `npm audit` reports 0 vulnerabilities as of this
  scaffold.
* **`_specs/static-assets/`**: referenced by `CLAUDE.md` and by a
  `color_pallette.jpeg` mentioned in `design-system.md`, but neither
  exists in this repo. The colour palette was applied from the hex
  values written directly in `design-system.md` §Colour Palette instead.

