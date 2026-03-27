import { execSync } from 'child_process';

function run(cmd, label) {
  try {
    console.log(`=> ${label}...`);
    execSync(cmd, { stdio: 'inherit' });
  } catch {
    console.log(`=> ${label} failed, continuing...`);
  }
}

run('npx prisma db push --skip-generate', 'Creating/syncing database tables');
run('npx tsx prisma/seed.ts', 'Seeding database');
run('npx next start', 'Starting Next.js');
