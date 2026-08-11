# Step 1 — Version Check

Compare the version in `package.json` against the last version documented
in `CHANGELOG.md`.

Target scope is mandatory:

- Define `PACKAGE_DIR` first (for example `packages/app`)
- Run all checks inside `${PACKAGE_DIR}`
- Compare `${PACKAGE_DIR}/package.json` and `${PACKAGE_DIR}/CHANGELOG.md`

## Script

Run [`../scripts/check-version.sh`](../scripts/check-version.sh):

```bash
cd "$PACKAGE_DIR"
bash ../../.agents/skills/update-docs/scripts/check-version.sh
```

## Decision

| Result                                    | Action                            |
| ----------------------------------------- | --------------------------------- |
| Versions **match**                        | **STOP** — docs are up to date    |
| `package.json` **greater** than CHANGELOG | Continue → [`step2.md`](step2.md) |
| `package.json` **less** than CHANGELOG    | **STOP** — warn about rollback    |
