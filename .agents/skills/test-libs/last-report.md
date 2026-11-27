# Test libraries — last report

Generated: 2026-11-27T03:05:49.616Z

Results directory: `/tmp/test-libs-QIsXT3`

**Summary:** 10 libraries · 9 PASS · 1 PASS_WITH_WARNINGS · 0 FAIL

This file is deleted and rewritten on every `test-libs` run.

| Library | npm | yarn | pnpm | bun | Warnings | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| @bemedev/app | PASS | PASS | PASS | PASS | — | PASS |
| @bemedev/app-bemedev-plugins | PASS | PASS | PASS | PASS | — | PASS |
| @bemedev/app-cli | PASS | PASS | PASS | PASS | — | PASS |
| @bemedev/app-contract | PASS | PASS | PASS | PASS | — | PASS |
| @bemedev/app-options | PASS | PASS | PASS | PASS | — | PASS |
| @bemedev/app-plugins | PASS | PASS | PASS | PASS | — | PASS |
| @bemedev/app-reactjs | PASS | PASS | PASS | PASS | (1), (2), (3) | PASS_WITH_WARNINGS |
| @bemedev/app-solidjs | PASS | PASS | PASS | PASS | — | PASS |
| @bemedev/app-valibot | PASS | PASS | PASS | PASS | — | PASS |
| @bemedev/app-vitest | PASS | PASS | PASS | PASS | — | PASS |

## Warnings

1. `npm/install` — 4 peer warning(s)
   - Applies to: `@bemedev/app-reactjs`
   - `npm warn ERESOLVE overriding peer dependency`
   - `npm warn peer react@"^18.3.1" from @bemedev/react-sync@0.1.1`
   - `npm warn Conflicting peer dependency: react@18.3.1`
   - `npm warn   peer react@"^18.3.1" from @bemedev/react-sync@0.1.1`

2. `pnpm/install` — 1 peer warning(s)
   - Applies to: `@bemedev/app-reactjs`
   - `[WARN] Issues with peer dependencies found. Run "pnpm peers check" to list them.`

3. `yarn/install` — 1 peer warning(s)
   - Applies to: `@bemedev/app-reactjs`
   - `➤ YN0086: │ Some peer dependencies are incorrectly met by your project; run yarn explain peer-requirements <hash> for details, where <hash> is the six-letter p-prefixed code.`

## Failures

None.

