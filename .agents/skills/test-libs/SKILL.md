---
name: test-libs
description:
  Test every exported library of the repository in an isolated temporary project
  outside the repo. Discovers publishable packages into packages.json, then runs one
  sub-agent per library to verify every export subpath and peerDependencies across
  npm, yarn, pnpm and bun. Use before a release, after changing exports or
  peerDependencies, or whenever the user asks to validate that the published
  libraries install and import correctly. Supports `--update` to re-check for newly
  exported libraries.
---

# Test Libraries

Validates the packages this repository publishes by installing their packed tarballs
into throwaway consumer projects and importing every export.

For each library, each package manager (`npm`, `yarn`, `pnpm`, `bun`) runs one
install scenario:

| Scenario  | Installs                                                                                                                                                                                | Purpose                                                            |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `install` | the library + internal workspace closure + every external peer (`react`, `react-dom`, `solid-js`, `vitest`, `valibot`, …) + required transitive peers (for example `vite` for `vitest`) | proves every export imports when the whole peer chain is satisfied |

External peers are installed **before** the imports are checked, so a missing
`react`, `vitest` or `valibot` cannot surface as an import error. The harness
discovers them from the packed `peerDependencies` and resolves required peers of
peers from the registry.

Both ESM (`import`) and CommonJS (`require`) entry points are exercised. Type-only
subpaths are checked for the presence of their `.d.ts` file in the packed tarball.

## Files

```
.agents/skills/test-libs/
├── SKILL.md
├── packages.json              # registry of libraries to test
├── last-report.md             # generated: one report for the whole repo
└── scripts/
    ├── lib.mjs                # discovery + export parsing
    ├── discover.mjs           # registry maintenance / --update
    ├── test-lib.mjs           # per-library temporary-project harness
    └── aggregate.mjs          # writes last-report.md from the report.json files
```

`test-lib.mjs` only uses Node built-ins and `tar`; it does not require the workspace
to be installed.

## 1. Initialize or update the registry

`packages.json` lists the libraries to test. It is committed with the skill and is
safe to edit by hand.

```json
{
  "buildCommand": "vp run -r pack",
  "packages": [{ "name": "@bemedev/app", "dir": "packages/app" }]
}
```

- `dir` is the package directory relative to the repository root.
- `name` is informational; the script re-reads each `package.json`.
- `buildCommand` is optional. When present, run it once before spawning sub-agents.

### First run (no `packages.json`)

Run discovery without writing:

```bash
node .agents/skills/test-libs/scripts/discover.mjs --root .
```

It prints publishable packages and separates them into:

- the **main version family** (the most common version among publishable packages) —
  registered by default;
- **auxiliary** packages (independently versioned helpers) — ignored unless `--all`
  is used.

Show the list to the user with `ask_user`, mention that entries can be added or
removed later, and only then save:

```bash
# main version family only
node .agents/skills/test-libs/scripts/discover.mjs --root . --update --yes

# include auxiliary packages as well
node .agents/skills/test-libs/scripts/discover.mjs --root . --update --yes --all
```

### Re-check for new exported libraries (`--update`)

When the user asks to update / re-check the registry, run:

```bash
node .agents/skills/test-libs/scripts/discover.mjs --root . --update
```

It reports:

- new packages in the main version family;
- new auxiliary packages (with a reminder to use `--all`);
- registered directories whose `package.json` disappeared.

Without `--yes` nothing is written. After confirmation:

```bash
node .agents/skills/test-libs/scripts/discover.mjs --root . --update --yes
```

`--update --yes` merges new main packages into the existing registry, keeps manually
added entries, and drops packages whose directory no longer exists.

Print the current registry at any time:

```bash
node .agents/skills/test-libs/scripts/discover.mjs --root . --list
```

Discovery is generic. It understands `pnpm-workspace.yaml`, the `workspaces` field of
`package.json`, and `lerna.json`; otherwise it walks the repository. A package is
exported when it has a `name`, is not `private`, and has `exports`, `main`, `module`
or `bin`. Test fixtures, examples, demos, docs and build output are excluded.

## 2. Build before packing

The harness packs the files listed by `files` in each `package.json`, typically
`lib/`. If the build output is missing or stale, `report.json` contains a
`missingSources` list and the imports fail.

Run the repository's pack task once before spawning sub-agents. Use `buildCommand`
from `packages.json` when present; otherwise detect a `pack`, `build` or `compile`
task.

```bash
# this repository
vp run -r pack
```

Do not let each sub-agent rebuild: it is redundant and can race.

## 3. Run one sub-agent per library

For every entry in `packages.json`, spawn one sub-agent. The sub-agents are
independent and can run in parallel.

### Testing a single library or a subset

When the user names specific libraries (for example "test only the vitest lib"), do
not run the whole registry. Match the request against `name` or `dir` in
`packages.json`, then spawn one sub-agent per selected entry. Do not edit
`packages.json` just to filter a run.

The harness can also be run directly for one package:

```bash
node .agents/skills/test-libs/scripts/test-lib.mjs \
  --root . --package packages/vitest --out "$OUT" --pms npm,yarn,pnpm,bun
```

Create one results directory **outside the repository** and share it:

```bash
OUT="$(mktemp -d "${TMPDIR:-/tmp}/test-libs-XXXXXX")"
echo "$OUT"
```

Pass the absolute path to every sub-agent as `--out`. The script refuses an `--out`
that is inside the repository.

### Sub-agent prompt template

Give every sub-agent the complete prompt below (sub-agents do not see the parent
conversation). Replace `<...>`. Run it with the repository root as the working
directory.

```
Test one exported library in an isolated temporary project outside the repo.

Repository root: <ABS_REPO_ROOT>
Package name: <NAME>
Package directory (relative to the root): <DIR>
Skill script: <ABS_REPO_ROOT>/.agents/skills/test-libs/scripts/test-lib.mjs
Results directory (absolute, outside the repo): <ABS_OUT>

The parent already ran the build (<BUILD_COMMAND or "not required">).
Do not modify any repository file and do not edit packages.json.

Run exactly:

  node .agents/skills/test-libs/scripts/test-lib.mjs \
    --root <ABS_REPO_ROOT> \
    --package <DIR> \
    --out <ABS_OUT> \
    --pms npm,yarn,pnpm,bun

The script writes <ABS_OUT>/<slug>/report.json and prints a summary. Do not create
per-library markdown files; the parent builds the single repo-wide report with
`aggregate.mjs`. Use local warning numbers in your reply; the aggregate step
renumbers them globally. If the command fails, report the failure and stop; do not
retry more than once.

Return a compact report in this shape:

Package: <NAME> (<DIR>)
| PM | install | imports | Warnings | Verdict |
|----|---------|---------|----------|---------|
| npm | ... | ... | (1), (2) | ... |

Warnings:
(1) `npm/install`: short description
(2) `yarn/install`: short description

- Verdict: PASS / PASS_WITH_WARNINGS / FAIL
- Failures (max 5, with subpath + error code)
- Report path: <ABS_OUT>/<slug>/report.json
```

### Running the sub-agents

- Use `spawn_agent` once per library, with a label such as `Testing @bemedev/app`.
- Send all `spawn_agent` calls in the same message when the machine can handle the
  parallel installs; otherwise batch 3–4 libraries at a time.
- Each sub-agent has its own `work/` directory, so there are no write conflicts.
- If a package manager is not installed, its row says `not installed, skipped`. That
  is not a failure.

### Aggregate report (`last-report.md`)

`test-lib.mjs` writes only `<ABS_OUT>/<slug>/report.json` per library. After all
sub-agents finish, produce the single repo-wide markdown report:

```bash
node .agents/skills/test-libs/scripts/aggregate.mjs --root . --out "$OUT"
```

It writes `.agents/skills/test-libs/last-report.md` by default and prints the path.
The file contains:

- one row per library with the npm / yarn / pnpm / bun verdicts;
- a `Warnings` column with numbered markers (`(1)`, `(2)`, …);
- a legend below the table expanding each marker with its scope, the affected
  libraries and the raw peer-warning / import-error lines;
- a `Failures` section when there are hard failures.

`last-report.md` is the **only** markdown report for the repository. It is deleted
and rewritten on every aggregate run. The script also removes stale per-library
`report.md` files left by older versions of the harness.

Use `--file <path>` to write elsewhere, but keep the default for the normal workflow.
The per-library `report.json` files remain available for machine-readable data.

## 4. Aggregate

The script exits with `1` when any library fails to install or import. After all
sub-agents finish:

1. Read each `<ABS_OUT>/<slug>/report.md` (or `report.json`), or use the sub-agent
   messages.
2. Print one table with a `Warnings` column. Number every warning once and repeat its
   marker on every library / package-manager row it applies to:

   | Library                | npm  | yarn | pnpm | bun  | Warnings | Verdict            |
   | ---------------------- | ---- | ---- | ---- | ---- | -------- | ------------------ |
   | `@bemedev/app`         | PASS | PASS | PASS | PASS | —        | PASS               |
   | `@bemedev/app-reactjs` | PASS | PASS | PASS | PASS | (1), (2) | PASS_WITH_WARNINGS |

3. Below the table, add a **Warnings** legend that expands every marker with the full
   detail (scope, message and the raw peer-warning / import-error lines):

   | Marker | Scope          | Detail                                                                                     |
   | ------ | -------------- | ------------------------------------------------------------------------------------------ |
   | (1)    | `npm/install`  | `ERESOLVE`: `react@^19.3.1` conflicts with `@bemedev/react-sync` requiring `react@^18.3.1` |
   | (2)    | `yarn/install` | `YN0086`: peer requirements are incorrectly met by the consumer project                    |

   Identical warnings shared by several package managers may use one marker.

4. List every `FAIL` with its package manager, stage, export subpath and error code.
5. Summarize peer warnings separately and distinguish:
   - **conflicting peer range** — two peers disagree (for example React 18 vs 19),
     which is a real consumer-facing issue;
   - **unresolvable peer** — the harness could not install a declared peer (for
     example an unpublished version); investigate the manifest;
   - **advisory peer notice** — the package manager still reports incorrectly met
     peers even though every external peer is installed (for example Yarn `YN0086`).
6. Point to the results directory and offer to delete it.

## Reading the reports

Each run writes two files:

- `<ABS_OUT>/<slug>/report.md` — human-readable table with a numbered `Warnings`
  column and a legend that expands every marker;
- `<ABS_OUT>/<slug>/report.json` — machine-readable data.

`report.json` fields:

| Field                   | Meaning                                                         |
| ----------------------- | --------------------------------------------------------------- |
| `verdict`               | `PASS`, `PASS_WITH_WARNINGS` or `FAIL`                          |
| `entries`               | every export subpath with `hasImport`, `hasRequire`, `typeOnly` |
| `typeOnly`              | subpaths that only expose types (runtime import skipped)        |
| `missingSources`        | build output referenced by `exports` but absent in the package  |
| `packedCheck.missing`   | referenced files absent from the packed tarball (hard failure)  |
| `internalClosure`       | workspace packages packed alongside the library                 |
| `externalPeers`         | external peers installed before the import checks               |
| `pms.<pm>.install`      | install status, peer warnings, per-subpath import results       |
| `warnings` / `failures` | pre-aggregated verdict inputs (scope + message strings)         |
| `warningDetails`        | numbered warning scopes, messages and raw warning lines         |
| `failureDetails`        | numbered failure scopes, messages and raw error lines           |

`FAIL` means the library could not install or one of its runtime exports threw.
Because every external peer is installed up front, any remaining peer warning is
either a real conflict or an advisory notice from the package manager.

## Script options

```bash
node .agents/skills/test-libs/scripts/test-lib.mjs --package <dir> [options]
```

| Option                | Default                    | Description                               |
| --------------------- | -------------------------- | ----------------------------------------- |
| `--root <dir>`        | nearest workspace/git root | repository root                           |
| `--package <dir>`     | required                   | package directory relative to the root    |
| `--out <dir>`         | temp dir                   | results directory, outside the repository |
| `--pms <list>`        | `npm,yarn,pnpm,bun`        | package managers to exercise              |
| `--timeout <ms>`      | `300000`                   | per-command timeout                       |
| `--pack-manager <pm>` | `pnpm` then `npm`          | tool used to pack tarballs                |
| `--build <command>`   | none                       | build command run once before packing     |
| `--clean`             | off                        | delete `work/` after writing the report   |
| `--json-only`         | off                        | print only the JSON report                |

## How internal packages are resolved

Published versions such as `4.0.0-beta-01` may not exist on the registry yet. The
harness therefore:

1. packs the library and every internal workspace package reached through
   `dependencies`, `optionalDependencies` and `peerDependencies`;
2. rewrites those internal specs in the packed manifests to `file:<absolute tarball>`
   so npm, yarn, pnpm and bun all resolve them locally;
3. installs every external peer (`react`, `react-dom`, `solid-js`, `vitest`,
   `valibot`, …) and its required peers before the import checks;
4. installs the tarballs into a fresh consumer project.

This is why the test never needs to publish and works before a release.

## Adapting to another repository

- The scripts use Node built-ins only; no workspace install is required.
- Discovery reads pnpm, npm/yarn workspaces and lerna. Edit `packages.json` manually
  if the heuristic misses a package.
- Set `buildCommand` to the repository's build/pack task.
- If some package managers are unavailable, pass a subset, for example
  `--pms npm,pnpm`.
- Network access is required to install external peers and dependencies.

## Safety

- The only file written inside the repository is `packages.json`, and only with
  `--update --yes`.
- Installs, tarballs and logs are written under `--out`, outside the repo.
- Do not run `--clean` before reading the reports.
