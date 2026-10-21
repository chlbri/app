---
name: bump-versions
description:
  Bump the version of the repository's main packages together. Discovers the main
  packages on first run, asks the user to confirm them, stores the approved list in
  `packages.json`, and supports patch, minor, major and pre-release bumps, an exact
  version override, and a `--branch` channel suffix (latest/main, alpha, beta,
  canary). Use when releasing a new version or preparing a pre-release.
---

# Bump Versions

Updates the `version` field of the registered main packages in one shot.

## Registry

The list of main packages lives in `.agents/skills/bump-versions/packages.json`:

```json
{
  "packages": [
    "packages/app",
    "packages/cli",
    "packages/reactjs",
    "packages/solidjs",
    "packages/valibot",
    "packages/vitest"
  ]
}
```

Each entry is a package directory relative to the repository root. The user may
freely add or remove entries in this file.

### First run (no `packages.json`)

The script must never register packages on its own. The agent runs the discovery,
asks the user, and only then saves.

1. Run the discovery:

   ```bash
   node .agents/skills/bump-versions/scripts/bump.mjs --recheck
   ```

   It prints the discovered main packages (top-level directories under `packages/`
   that contain a `package.json`) and does **not** write anything.

2. Show the list to the user and ask whether these are the right packages, using the
   `ask_user` tool. Mention that the list can be edited later in `packages.json`.

3. If the user confirms, run:

   ```bash
   node .agents/skills/bump-versions/scripts/bump.mjs --recheck --yes
   ```

   This writes `packages.json`. If the user wants changes, create or edit
   `packages.json` accordingly, run `--list` to validate it, then continue.

4. Apply the requested bump (see below).

### Re-checking later

`--recheck` rediscovers the main packages. Without `--yes` it only prints them; ask
the user before running `--recheck --yes`, which overwrites `packages.json`.

`--recheck --yes <mode>` re-registers and bumps in a single command, but only after
the user has confirmed the discovered list.

## Usage

```bash
node .agents/skills/bump-versions/scripts/bump.mjs <mode> [-b <branch>] [-o <version>]
node .agents/skills/bump-versions/scripts/bump.mjs --list
```

### Modes

| Mode          | Effect (from `2.7.1`) | Result       |
| ------------- | --------------------- | ------------ |
| `patch`       | increment the patch   | `2.7.2`      |
| `minor`       | increment the minor   | `2.8.0`      |
| `major`       | increment the major   | `3.0.0`      |
| `pre-release` | patch + `-rc.0`       | `2.7.2-rc.0` |

`prerelease` is accepted as an alias of `pre-release`.

When the current version already has a pre-release, `pre-release` increments its
trailing counter instead of bumping the patch:

- `2.7.2-rc.0` → `2.7.2-rc.1`
- `2.7.2-rc` → `2.7.2-rc.0`

### Branch

`-b <branch>` (or `--branch <branch>`) appends `-<branch>` to the resulting version.
It never performs git operations and never changes which package files are touched.

| Branch            | Tail added | From `2.7.1` + `patch` |
| ----------------- | ---------- | ---------------------- |
| `latest` / `main` | none       | `2.7.2`                |
| `alpha`           | `-alpha`   | `2.7.2-alpha`          |
| `beta`            | `-beta`    | `2.7.2-beta`           |
| `canary`          | `-canary`  | `2.7.2-canary`         |

`latest` and `main` are the same channel — `main` is accepted for convenience.

The branch replaces any existing pre-release tail, so switching channels never
produces compound versions such as `2.7.2-beta-canary`:

- `2.7.1-beta` + `patch -b canary` → `2.7.2-canary`
- `2.7.2-alpha.1` + `-o 3.0.0 -b main` → `3.0.0`

`--branch` requires a mode or `-o <version>`.

#### Pre-release on a channel

Combining `pre-release` with a channel increments the channel counter when the
current version is already on that channel:

| Current         | Command                | Result          |
| --------------- | ---------------------- | --------------- |
| `2.7.1`         | `pre-release -b alpha` | `2.7.2-alpha`   |
| `2.7.2-alpha`   | `pre-release -b alpha` | `2.7.2-alpha.0` |
| `2.7.2-alpha.0` | `pre-release -b alpha` | `2.7.2-alpha.1` |

On any other channel, `pre-release` behaves like `patch` for the core version and
then applies the channel: `2.7.2-beta` + `pre-release -b alpha` → `2.7.3-alpha`.

### Override

`-o <version>` (or `--override <version>`) sets every registered package to the exact
given version and takes precedence over the mode:

```bash
node .agents/skills/bump-versions/scripts/bump.mjs -o 2.7.1
```

The value must be a valid semver (`X.Y.Z` or `X.Y.Z-prerelease`). Combined with `-b`,
the branch tail is applied on top of the override.

## Behavior

1. Reads `packages.json` (or stops with discovery instructions when missing).
2. Without `-o`, aborts if the registered versions differ (use `-o` to align them).
3. Computes the next version, applies `--branch` when given, and writes only the
   top-level `version` field, preserving the rest of each `package.json`.
4. Prints the old → new version for each package.
5. Exits without writing when the target version is already in place.

## Scope

Only the registered `package.json` files (plus `packages.json` when confirming
discovery) are modified. Nothing else is touched: no `CHANGELOG.md`, no `README.md`,
no `pnpm-lock.yaml`, no dependency installation, no git commit or tag.

## Workflow

1. Follow the first-run flow if `packages.json` is missing.
2. Run the command with the desired mode or override, plus `--branch` when the
   release targets a channel.
3. Show the result of `git diff -- 'packages/*/package.json'`.
4. Stop there unless the user explicitly asks for changelog, lockfile, or commit
   updates.

## Examples

```bash
# Discovery only (no write)
node .agents/skills/bump-versions/scripts/bump.mjs --recheck

# Save the confirmed discovery
node .agents/skills/bump-versions/scripts/bump.mjs --recheck --yes

# List the registered packages
node .agents/skills/bump-versions/scripts/bump.mjs --list

# Standard release
node .agents/skills/bump-versions/scripts/bump.mjs patch

# Pre-release
node .agents/skills/bump-versions/scripts/bump.mjs pre-release

# Release on a channel
node .agents/skills/bump-versions/scripts/bump.mjs patch -b beta
node .agents/skills/bump-versions/scripts/bump.mjs minor --branch canary

# Stable release (latest and main are equivalent)
node .agents/skills/bump-versions/scripts/bump.mjs major -b main

# Force an exact version
node .agents/skills/bump-versions/scripts/bump.mjs -o 2.7.1

# Force an exact channel version
node .agents/skills/bump-versions/scripts/bump.mjs -o 2.7.1 -b alpha
```
