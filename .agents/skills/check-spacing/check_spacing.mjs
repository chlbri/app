import { readFileSync } from 'fs';

const [, , filePath] = process.argv;
const lines = readFileSync(filePath, 'utf8').split('\n');

const tests = [];
let i = 0;
while (i < lines.length) {
  const line = lines[i];
  if (/^\s+test(?:\.\w+)*\(/.test(line)) {
    const isSingle = /^\s+test(?:\.\w+)*\(.*\);\s*(?:\/\/.*)?$/.test(line);
    if (isSingle) {
      tests.push({ lineNum: i + 1, type: 'single', endLine: i + 1 });
      i++;
    } else {
      let braceDepth = 0;
      let end = i;
      for (let k = i; k < lines.length; k++) {
        for (const ch of lines[k]) {
          if (ch === '{') braceDepth++;
          if (ch === '}') braceDepth--;
        }
        if (k > i && braceDepth === 0 && lines[k].includes(');')) {
          end = k;
          break;
        }
      }
      tests.push({ lineNum: i + 1, type: 'multi', endLine: end + 1 });
      i = end + 1;
    }
  } else {
    i++;
  }
}

let violations = 0;
for (let x = 0; x < tests.length - 1; x++) {
  const t1 = tests[x];
  const t2 = tests[x + 1];

  // Check if there is a block/scope boundary between t1 and t2
  let hasDescribeBoundary = false;
  for (let l = t1.endLine; l < t2.lineNum - 1; l++) {
    if (
      /^\s*(?:const|function|describe)\b/.test(lines[l]) ||
      /^\s*\}\)?;?\s*$/.test(lines[l])
    ) {
      hasDescribeBoundary = true;
      break;
    }
  }
  if (hasDescribeBoundary) continue;

  let blankCount = 0;
  for (let l = t1.endLine; l < t2.lineNum - 1; l++) {
    if (/^\s*$/.test(lines[l])) {
      blankCount++;
    }
  }
  const gap = blankCount;
  const bothSingle = t1.type === 'single' && t2.type === 'single';
  const expected = bothSingle ? 0 : 1;
  if (gap !== expected) {
    violations++;
    console.log(
      `VIOLATION L${t1.endLine}→L${t2.lineNum}: ` +
        `gap=${gap} expected=${expected} ` +
        `(${t1.type} → ${t2.type})`,
    );
    console.log(`  line ${t1.lineNum}: ${lines[t1.lineNum - 1].trim()}`);
    console.log(`  line ${t2.lineNum}: ${lines[t2.lineNum - 1].trim()}`);
  }
}
if (violations === 0) console.log('No spacing violations found.');
else console.log(`\n${violations} violation(s) total.`);
