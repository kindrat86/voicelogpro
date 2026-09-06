Private preparation control

Run from this worktree:
  node scripts/prepare-pilot-report.mjs INPUT.json SOURCE_FILE PRIVATE_PILOT_DIR CREW_ID

Use one private pilot directory for the entire paid pilot, not one per project. New report preparation reserves one of five slots conservatively before delivery. Corrections retain the report ID, date, company, project and crew. They do not consume another slot. Raw input/source snapshots and PDF SHA256 receipts are stored locally with restrictive permissions. Receipts are prepared_not_approved_not_sent, never evidence of human review or delivery.

Correction API:
  import { preparePilotReport } from './scripts/prepare-pilot-report.mjs';
  await preparePilotReport({inputPath, sourcePath, pilotDir, crewId, expectedRevision: 1, correctionReason: 'Exact supplied correction reason'});

Each correction preserves the prior revision and chains its PDF hash. Supply the actual current revision. Ordinary duplicate invocation fails closed rather than overwriting. Sources are byte-linked, not semantically verified; operator must compare every fact. Original generator remains a low-level renderer and does not enforce the wrapper's cap.

Safety limits: local trusted operator tool, not a tamper-proof or hostile multi-user service. Do not move, delete, or manually alter ledger directories. A process crash may leave .prepare-lock or .pending-*; inspect manually before recovery. No automatic stale-lock clearing. Atomic rename protects complete bundles from ordinary concurrent calls; power-loss durability/fsync and hostile symlink defense are not implemented. Seven-day timing, payment, same-day uniqueness, human QA, send approval, delivered-state and refunds remain operator gates. Never use this as proof of payment, factual correctness or legal outcome. No network or audio processing occurs.

Tests:
  ./node_modules/.bin/vitest run tests/foundingPilotReport.test.ts tests/pilotDelivery.test.ts

Dependencies are reused through an ignored symlink to the canonical node_modules, not copied or installed. Parent owns independent verification, integration, builds and release.
