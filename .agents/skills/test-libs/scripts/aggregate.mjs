#!/usr/bin/env node
/**
 * Aggregate every `report.json` produced by `test-lib.mjs` into one repository-wide
 * markdown report.
 *
 * The report is written to `.agents/skills/test-libs/last-report.md` by default.
 * It is deleted and rewritten on every run.
 *
 * Usage:
 *   node aggregate.mjs --out <results-dir> [--root <dir>] [--file <path>]
 */
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { SKILL_DIR, findRepoRoot, readJson } from './lib.mjs';

const DEFAULT_FILE = join(SKILL_DIR, 'last-report.md');

const USAGE = `Usage:
  aggregate.mjs --out <results-dir> [--root <dir>] [--file <path>]

Reads every <results-dir>/*/report.json and writes one markdown report.
The output file is deleted and rewritten on every run.

Options:
  --out <dir>    Results directory passed to test-lib.mjs (required)
  --root <dir>   Repository root (defaults to the nearest workspace/git root)
  --file <path>  Markdown output (default: .agents/skills/test-libs/last-report.md)
  -h, --help     Show this help`;

const fail = message => {
  console.error(`Error: ${message}`);
  process.exit(1);
};

const parseArgs = argv => {
  const args = { file: DEFAULT_FILE };

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];

    if (arg === '-h' || arg === '--help') args.help = true;
    else if (arg === '--root') args.root = argv[++index];
    else if (arg === '--out') args.out = argv[++index];
    else if (arg === '--file') args.file = argv[++index];
    else fail(`unknown option: ${arg}`);
  }

  if (!args.help && !args.out) fail(`--out is required\n\n${USAGE}`);

  return args;
};

const splitWarning = warning => {
  const index = warning.indexOf(': ');
  if (index === -1) return { scope: 'general', message: warning, details: [] };
  return {
    scope: warning.slice(0, index),
    message: warning.slice(index + 2),
    details: [],
  };
};

const enrichDetails = (report, entry) => {
  if (entry.details?.length) return [...new Set(entry.details)];

  const match = entry.message.match(/^(\S+) (import|require) -> /);
  if (!match) return [];

  const [, subpath, kind] = match;
  const [pm, stage] = entry.scope.split('/');
  const failures = report.pms?.[pm]?.[stage]?.runtimeFailures ?? [];

  return [
    ...new Set(
      failures
        .filter(failure => failure.subpath === subpath && failure.kind === kind)
        .map(failure => failure.message)
        .filter(Boolean),
    ),
  ];
};

const collectGroups = (reports, field, fallbackField) => {
  const groups = new Map();

  for (const report of reports) {
    const entries = report[field]?.length
      ? report[field]
      : (report[fallbackField] ?? []).map(splitWarning);

    for (const entry of entries) {
      const key = `${entry.scope}::${entry.message}`;
      const group = groups.get(key) ?? {
        scope: entry.scope,
        message: entry.message,
        libraries: new Set(),
        details: new Set(),
      };

      group.libraries.add(report.name);
      for (const detail of enrichDetails(report, entry)) {
        group.details.add(detail);
      }
      groups.set(key, group);
    }
  }

  return [...groups.values()].sort(
    (left, right) =>
      left.scope.localeCompare(right.scope) ||
      left.message.localeCompare(right.message),
  );
};

const pmCell = data => {
  if (!data) return '—';
  if (!data.available) return 'skip';

  const complete = data.complete;
  if (!complete) return '—';

  return complete.installOk && complete.runtimeFailures.length === 0
    ? 'PASS'
    : 'FAIL';
};

const cell = value => String(value).replace(/\|/g, '\\|');

const main = () => {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(USAGE);
    return;
  }

  findRepoRoot(args.root ?? process.cwd());

  const out = resolve(args.out);
  if (!existsSync(out)) fail(`results directory not found: ${out}`);

  const reports = [];

  for (const entry of readdirSync(out, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    // Remove per-library markdown left by older versions of the harness.
    rmSync(join(out, entry.name, 'report.md'), { force: true });

    const reportPath = join(out, entry.name, 'report.json');
    if (!existsSync(reportPath)) continue;

    try {
      const report = readJson(reportPath);
      if (typeof report?.name === 'string') reports.push(report);
    } catch {
      // Skip malformed reports.
    }
  }

  if (!reports.length) fail(`no report.json files found under ${out}`);

  reports.sort((left, right) => left.name.localeCompare(right.name));

  const warningGroups = collectGroups(reports, 'warningDetails', 'warnings');
  warningGroups.forEach((group, index) => {
    group.marker = index + 1;
  });

  const failureGroups = collectGroups(reports, 'failureDetails', 'failures');

  const markersFor = report =>
    warningGroups
      .filter(group => group.libraries.has(report.name))
      .map(group => `(${group.marker})`);

  const counts = { PASS: 0, PASS_WITH_WARNINGS: 0, FAIL: 0 };
  for (const report of reports)
    counts[report.verdict] = (counts[report.verdict] ?? 0) + 1;

  const lines = [];
  lines.push('# Test libraries — last report', '');
  lines.push(`Generated: ${new Date().toISOString()}`, '');
  lines.push(`Results directory: \`${out}\``, '');
  lines.push(
    `**Summary:** ${reports.length} libraries · ${counts.PASS ?? 0} PASS · ${counts.PASS_WITH_WARNINGS ?? 0} PASS_WITH_WARNINGS · ${counts.FAIL ?? 0} FAIL`,
    '',
  );
  lines.push('This file is deleted and rewritten on every `test-libs` run.', '');
  lines.push('| Library | npm | yarn | pnpm | bun | Warnings | Verdict |');
  lines.push('| --- | --- | --- | --- | --- | --- | --- |');

  for (const report of reports) {
    const pms = report.pms ?? {};
    const markers = markersFor(report);
    lines.push(
      `| ${cell(report.name)} | ${pmCell(pms.npm)} | ${pmCell(pms.yarn)} | ${pmCell(pms.pnpm)} | ${pmCell(pms.bun)} | ${markers.length ? markers.join(', ') : '—'} | ${report.verdict} |`,
    );
  }

  lines.push('');

  if (warningGroups.length) {
    lines.push('## Warnings', '');
    for (const group of warningGroups) {
      lines.push(
        `${group.marker}. \`${cell(group.scope)}\` — ${cell(group.message)}`,
      );
      lines.push(
        `   - Applies to: ${[...group.libraries]
          .sort()
          .map(name => `\`${cell(name)}\``)
          .join(', ')}`,
      );
      for (const detail of [...group.details]) {
        lines.push(`   - \`${cell(detail)}\``);
      }
      lines.push('');
    }
  } else {
    lines.push('## Warnings', '', 'None.', '');
  }

  if (failureGroups.length) {
    lines.push('## Failures', '');
    for (const group of failureGroups) {
      lines.push(`- \`${cell(group.scope)}\` — ${cell(group.message)}`);
      lines.push(
        `  - Applies to: ${[...group.libraries]
          .sort()
          .map(name => `\`${cell(name)}\``)
          .join(', ')}`,
      );
      for (const detail of [...group.details]) {
        lines.push(`  - \`${cell(detail)}\``);
      }
    }
    lines.push('');
  } else {
    lines.push('## Failures', '', 'None.', '');
  }

  const file = resolve(args.file);
  mkdirSync(dirname(file), { recursive: true });
  rmSync(file, { force: true });
  writeFileSync(file, `${lines.join('\n')}\n`);

  console.log(
    `Wrote ${file} (${reports.length} libraries · ${counts.PASS ?? 0} PASS · ${counts.PASS_WITH_WARNINGS ?? 0} PASS_WITH_WARNINGS · ${counts.FAIL ?? 0} FAIL)`,
  );
};

main();
