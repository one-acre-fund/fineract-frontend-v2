# Feature Flagging POC: Branch, Deployment, and Runtime Release Control

## Slide 1 — Why are we discussing feature flags?

We want to reduce the risk of merging feature branches into `develop` while still deploying `develop` regularly to Test/QA/UAT.

Today, once a feature branch is merged and deployed, the feature can become visible immediately.

Feature flags let us separate:

- Code merge
- Environment deployment
- User-facing release

---

## Slide 2 — Main question from the team

> If a branch is created from `develop`, adds a new feature, and later gets merged back into `develop`, can we deploy `develop` but keep that feature hidden?

Answer:

Yes, if the feature was intentionally implemented behind a feature flag before merge.

Example flag:

```text
clients.kyc-v2=false
```

When false, the merged code exists in the deployed app, but users do not see or access that feature path.

---

## Slide 3 — Important clarification

Feature flags do not automatically hide a Git branch.

After merge, the browser does not know which code came from which branch.

So we do not hide branches directly.

Instead, we hide feature behavior using a stable feature label:

```text
clients.kyc-v2
```

The developer must put the new user-facing/risky behavior behind that flag.

---

## Slide 4 — Current project foundation

This frontend already has runtime configuration support:

- `src/assets/env.template.js`
- `src/assets/env.js`
- `Dockerfile` uses `envsubst` at container startup
- Helm/GitHub Actions pass environment-specific values

That means we can build once and configure behavior per environment.

This is why Phase 1 is enough for an initial POC.

---

## Slide 5 — What Phase 1 gives us

Phase 1 uses runtime env config:

```text
FEATURE_FLAGS=clients.kyc-v2=false
```

or:

```text
FEATURE_FLAGS=clients.kyc-v2=true
```

This controls visibility per environment:

| Environment | FEATURE_FLAGS | Result |
|---|---|---|
| Test | `clients.kyc-v2=false` | hidden |
| QA | `clients.kyc-v2=true` | visible |
| UAT | `clients.kyc-v2=false` | hidden |
| Production | `clients.kyc-v2=false` | hidden |

---

## Slide 6 — What was implemented in this POC

New runtime feature flag support:

- `src/app/core/feature-flags/feature-flags.service.ts`
- `src/app/core/feature-flags/feature-flag.guard.ts`
- `src/app/directives/feature-flag/feature-flag.directive.ts`
- `src/app/home/feature-flag-demo/feature-flag-demo.component.*`

Config updates:

- `src/assets/env.template.js`
- `src/assets/env.js`
- `env.sample`
- `docker-compose.yml`
- `nginx.conf`
- `.github/actions/helm_fineract_frontend/action.yml`
- `.github/workflows/build.yml`
- `helm/values-*.yaml`

---

## Slide 7 — Demo flag used

The POC uses this flag:

```text
clients.kyc-v2
```

Default value:

```text
clients.kyc-v2=false
```

Meaning:

- false: hide the demo button and block the demo route
- true: show the demo button and allow the demo route

---

## Slide 8 — How the runtime config flows

```text
GitHub/Helm/Docker env var
        ↓
FEATURE_FLAGS=clients.kyc-v2=false
        ↓
Docker envsubst generates assets/env.js
        ↓
Browser loads assets/env.js
        ↓
window['env']['featureFlags']
        ↓
FeatureFlagsService
        ↓
Directive / route guard / components
```

---

## Slide 9 — Demo behavior when flag is false

Config:

```text
FEATURE_FLAGS=clients.kyc-v2=false
```

Expected behavior:

- Home page does not show the KYC V2 demo button
- Direct route access is blocked
- User is redirected back to `/home`
- Code is deployed, but the feature is unreleased

Demo route:

```text
/#/feature-flags/clients-kyc-v2-demo
```

---

## Slide 10 — Demo behavior when flag is true

Config:

```text
FEATURE_FLAGS=clients.kyc-v2=true
```

Expected behavior:

- Home page shows `KYC V2 Flag Demo`
- Clicking the button opens the feature demo page
- Direct route access is allowed

Demo route:

```text
/#/feature-flags/clients-kyc-v2-demo
```

---

## Slide 11 — Local demo steps

Set the flag off:

```bash
# src/assets/env.js
window['env']['featureFlags'] = 'clients.kyc-v2=false';
```

Run the app:

```bash
npm run start
```

Expected:

- demo button hidden
- direct demo URL redirects to Home

---

## Slide 12 — Local demo steps: turn it on

Change:

```bash
# src/assets/env.js
window['env']['featureFlags'] = 'clients.kyc-v2=true';
```

Refresh the browser.

Expected:

- demo button appears on Home
- demo route opens successfully

---

## Slide 13 — Docker Compose demo

In `docker-compose.yml`:

```yaml
- FEATURE_FLAGS=clients.kyc-v2=false
```

To enable the demo:

```yaml
- FEATURE_FLAGS=clients.kyc-v2=true
```

Then rebuild/restart the container:

```bash
docker-compose up --build
```

---

## Slide 14 — GitHub/Helm environment demo

The workflow now passes:

```yaml
FEATURE_FLAGS: "${{ vars.FEATURE_FLAGS }}"
```

Each GitHub Environment can define its own value:

```text
FEATURE_FLAGS=clients.kyc-v2=false
```

or:

```text
FEATURE_FLAGS=clients.kyc-v2=true
```

This lets Test, QA, UAT, and Production behave differently with the same deployed frontend code.

---

## Slide 15 — Clean control points

We should not sprinkle `if clients.kyc-v2` everywhere.

Clean places to apply flags:

- Navigation/menu entry
- Route guard
- Tab boundary
- Button/action boundary
- Wrapper component
- Service/facade
- Backend enforcement for sensitive behavior

The POC demonstrates:

- Template boundary: `*mifosxFeatureFlag`
- Route boundary: `FeatureFlagGuard`

---

## Slide 16 — Template directive example

Implemented directive:

```html
<ng-container *mifosxFeatureFlag="'clients.kyc-v2'">
  <button>KYC V2 Flag Demo</button>
</ng-container>
```

When the flag is false, Angular does not render the content.

When the flag is true, Angular renders it.

---

## Slide 17 — Route guard example

Implemented route metadata:

```typescript
{
  path: 'feature-flags/clients-kyc-v2-demo',
  component: FeatureFlagDemoComponent,
  canActivate: [FeatureFlagGuard],
  data: {
    featureFlag: 'clients.kyc-v2'
  }
}
```

If the flag is disabled, direct URL access is blocked.

---

## Slide 18 — What happens after a branch is merged?

Flow:

```text
feature branch from develop
        ↓
new feature added behind clients.kyc-v2
        ↓
branch merged into develop
        ↓
develop deployed to Test/QA/UAT
        ↓
environment config decides visibility
```

If `clients.kyc-v2=false`, users continue seeing the old behavior.

---

## Slide 19 — What developers must do

For a feature branch that needs rollout control:

1. Define the flag name first.
2. Keep old behavior working when the flag is false.
3. Put new UI behind directive/menu/route boundaries.
4. Block direct routes with `FeatureFlagGuard`.
5. Avoid changing shared old behavior unless backward-compatible.
6. Test both flag states.
7. Add cleanup/removal ticket after release.

---

## Slide 20 — What this can do

This can:

- Hide merged frontend features per environment
- Let QA test a feature before UAT/Production sees it
- Reduce long-lived branches
- Allow safer merges into `develop`
- Support quick rollback of frontend visibility
- Demonstrate the same build behaving differently by environment

---

## Slide 21 — What this cannot do

This cannot:

- Automatically hide all code from a Git branch
- Remove hidden code from the browser bundle
- Protect sensitive backend actions by itself
- Replace permissions or backend authorization
- Make incompatible backend/database changes safe automatically
- Do per-user/country/percentage rollout in Phase 1

---

## Slide 22 — Security boundary reminder

Frontend feature flags are not security.

Users can inspect frontend JavaScript.

Therefore:

- Use frontend flags to hide UI and control release visibility.
- Use backend permissions/configuration to enforce sensitive behavior.

Rule:

```text
Frontend flags control visibility.
Backend controls authority.
```

---

## Slide 23 — When Phase 1 is enough

Phase 1 is enough when we only need:

- Environment-level flags
- Test vs QA vs UAT vs Production visibility
- Hide/show frontend routes, buttons, tabs, and pages
- Release control after merging to `develop`

This matches the immediate branch/deployment concern.

---

## Slide 24 — When Phase 2 is needed

Move to backend-managed flags when we need:

- Change flags without frontend redeploy/restart
- Per-country rollout
- Per-office rollout
- Per-user or role-based targeting
- Percentage rollout
- Audit history
- Admin UI to manage flags

Possible future source:

```text
/configurations/name/feature.clients.kyc-v2
```

---

## Slide 25 — Recommended team rule

A branch can be merged safely behind a flag only if:

```text
flag off = current behavior remains unchanged
```

If the old behavior breaks when the flag is false, the feature is not safely flagged.

---

## Slide 26 — Recommended PR checklist

For feature-flagged work:

- [ ] Flag name agreed
- [ ] Default value is false
- [ ] Menu/button hidden when false
- [ ] Route blocked when false
- [ ] Old behavior works when false
- [ ] New behavior works when true
- [ ] Backend-sensitive behavior protected server-side
- [ ] Tests cover false and true states
- [ ] Owner and cleanup date documented

---

## Slide 27 — Final message

Feature flags let us move from:

```text
branch controls release
```

to:

```text
branch controls code integration
feature flag controls release visibility
```

This gives the team safer deployments, less branch pressure, and a clearer path to progressive delivery.

