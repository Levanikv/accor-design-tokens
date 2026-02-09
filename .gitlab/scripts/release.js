import fs from 'fs';
import { execSync } from 'child_process';
import semver from 'semver';

function run(cmd) {
  return execSync(cmd, { stdio: 'pipe' }).toString().trim();
}

/* if (/^chore\(release\):/.test(commitMsg)) {
    console.log('⏭️ Release commit detected, skipping');
    process.exit(0);
}
 */
const pkgPath = 'package.json';
const changelogPath = 'CHANGELOG.md';

const commitMsg = run('git log -1 --pretty=%B');

let bump = 'patch';
if (/BREAKING CHANGE|!:/i.test(commitMsg)) bump = 'major';
else if (/^feat:/i.test(commitMsg)) bump = 'minor';

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const currentVersion = pkg.version;
const nextVersion = semver.inc(currentVersion, bump);

if (!nextVersion) {
  console.error('❌ Failed to compute next version');
  process.exit(1);
}

pkg.version = nextVersion;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

const date = new Date().toISOString().split('T')[0];
const changelogEntry = `## ${nextVersion} - ${date}\n\n- ${commitMsg.trim()}\n\n`;

let existing = fs.existsSync(changelogPath)
  ? fs.readFileSync(changelogPath, 'utf8')
  : '';

if (!existing.startsWith('# Changelog')) {
  existing = `# Changelog\n\n${existing}`;
}

if (existing.includes(`## ${nextVersion}`)) {
  console.log('ℹ️ Changelog already contains this version');
} else {
  existing = existing.replace(
    /^# Changelog\s*\n+/,
    `# Changelog\n\n${changelogEntry}`
  );
}

fs.writeFileSync(changelogPath, existing);


run('git add package.json package-lock.json CHANGELOG.md');
run(`git commit -m "chore(release): ${nextVersion} [skip ci]"`);

console.log(`✅ Release prepared: ${nextVersion}`);
