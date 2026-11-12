import { execSync } from 'child_process';

export function teardown() {
  execSync('vp fmt');
  console.log('');
  console.log('*'.repeat(12));
  console.log('Reformat all files');
  console.log('*'.repeat(12));
}
