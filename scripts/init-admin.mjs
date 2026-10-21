import path from 'node:path';
import { initializeAdmin } from '../server/cms.mjs';
// Explicit provisioning/reset, with credentials passed through the environment.
try {
  await initializeAdmin(path.resolve(process.env.DATA_DIR || 'var'), process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);
  console.log('Administrator credentials initialized. Restart the server to activate.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
