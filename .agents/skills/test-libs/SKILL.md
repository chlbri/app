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

For each library, each package manager (`npm`, `yarn`, `pnpm`, `bun`) runs two
scenarios:

| Scenario   | Installs                                                  | Purpose                                                            |
| ---------- | --------------------------------------------------------- | ------------------------------------------------------------------ |
| `minimal`  | the library + internal workspace closure                  | out-of-the-box availability, surfaces peer warnings                |
| `complete` | also the declared external peers and their required peers | proves every export imports when the whole peer chain is satisfied |

Both ESM (`import`) and CommonJS (`require`) entry points are exercised. Type-only
subpaths are checked for the presence of their `.d.ts` file in the packed tarball.

## Files

```
.agents/skills/test-libs/
├── SKILL.md
├── packages.json              # registry of libraries to test
└── scripts/
    ├── lib.mjs                # discovery + export parsing
    ├── discover.mjs           # registry maintenance / --update
    └── test-lib.mjs           # per-library temporary-project harness
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

The script writes <ABS_OUT>/<slug>/report.json and prints a summary.
If the command fails, report the failure and stop; do not retry more than once.

Return a compact report in this shape:

Package: <NAME> (<DIR>)
| PM | minimal install | minimal imports | complete install | complete imports | peer warnings | verdict |
|----|-----------------|-----------------|------------------|------------------|---------------|---------|
| npm | ... | ... | ... | ... | ... | ... |

- Verdict: PASS / PASS_WITH_WARNINGS / FAIL
- Failures (max 5, with subpath + error code)
- Warnings (max 5)
- Report path: <ABS_OUT>/<slug>/report.json
```

### Running the sub-agents

- Use `spawn_agent` once per library, with a label such as `Testing @bemedev/app`.
- Send all `spawn_agent` calls in the same message when the machine can handle the
  parallel installs; otherwise batch 3–4 libraries at a time.
- Each sub-agent has its own `work/` directory, so there are no write conflicts.
- If a package manager is not installed, its row says `not installed, skipped`. That
  is not a failure.

## 4. Aggregate

The script exits with `1` only when the `complete` scenario fails. After all
sub-agents finish:

1. Read each `<ABS_OUT>/<slug>/report.json` (or use the sub-agent messages).
2. Print one table:

   | Library        | npm  | yarn | pnpm | bun  | Verdict |
   | -------------- | ---- | ---- | ---- | ---- | ------- |
   | `@bemedev/app` | PASS | PASS | PASS | PASS | PASS    |

3. List every `FAIL` with its package manager, stage, export subpath and error code.
4. Summarize peer warnings separately and distinguish:
   - **missing declared peer** — a problem in the library's `peerDependencies`;
   - **conflicting peer range** — two peers disagree (for example React 18 vs 19),
     which is a real consumer-facing issue;
   - **minimal-only failure** — expected when external peers are not installed.
5. Point to the results directory and offer to delete it.

## Reading `report.json`

| Field                          | Meaning                                                         |
| ------------------------------ | --------------------------------------------------------------- |
| `verdict`                      | `PASS`, `PASS_WITH_WARNINGS` or `FAIL`                          |
| `entries`                      | every export subpath with `hasImport`, `hasRequire`, `typeOnly` |
| `typeOnly`                     | subpaths that only expose types (runtime import skipped)        |
| `missingSources`               | build output referenced by `exports` but absent in the package  |
| `packedCheck.missing`          | referenced files absent from the packed tarball (hard failure)  |
| `internalClosure`              | workspace packages packed alongside the library                 |
| `externalPeers`                | external peers installed in the `complete` scenario             |
| `pms.<pm>.minimal`/`.complete` | install status, peer warnings, per-subpath import results       |
| `failures` / `warnings`        | pre-aggregated verdict inputs                                   |

`FAIL` means the `complete` scenario could not install the library or one of its
runtime exports threw. A failure that only occurs in `minimal` is a warning: the
declared peers were not installed yet.

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
3. installs the tarballs into a fresh consumer project.

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
