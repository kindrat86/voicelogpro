#!/usr/bin/env node
// Private local preparation only. Never sends or records human approval.
import { readFile, writeFile, mkdir, readdir, rename, rm, chmod } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash, randomUUID } from 'node:crypto';
import { generateFoundingPilotReport } from './generate-founding-pilot-report.mjs';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const safe = value => typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/.test(value);

export async function preparePilotReport({ inputPath, sourcePath, pilotDir, crewId, expectedRevision = 0, correctionReason = '' }) {
  if (!safe(crewId)) throw new Error('A filesystem-safe crewId is required');
  const inputBytes = await readFile(inputPath);
  const sourceBytes = await readFile(sourcePath);
  if (!sourceBytes.length) throw new Error('Source must not be empty');
  const input = JSON.parse(inputBytes.toString('utf8'));
  if (!safe(input.report?.id)) throw new Error('A filesystem-safe report.id is required');
  const root = path.resolve(pilotDir);
  await mkdir(root, {recursive: true, mode: 0o700});
  await chmod(root, 0o700);
  const lock = path.join(root, '.prepare-lock');
  try { await mkdir(lock, {mode: 0o700}); }
  catch (error) { if (error.code === 'EEXIST') throw new Error('Pilot locked: operator must inspect any interrupted preparation'); throw error; }
  let stage;
  try {
    const reports = path.join(root, 'reports');
    await mkdir(reports, {recursive: true, mode: 0o700});
    const ids = await readdir(reports);
    for (const id of ids) {
      const saved = JSON.parse(await readFile(path.join(reports, id, 'receipt.json'), 'utf8'));
      if (saved.company !== input.company?.name || saved.crewId !== crewId) throw new Error('Pilot permits one company and crew');
    }
    const reportDir = path.join(reports, input.report.id);
    let previous = null;
    let revision = 1;
    if (ids.includes(input.report.id)) {
      const revisions = (await readdir(reportDir)).filter(name => /^revision-[2-9][0-9]*$|^revision-1[0-9]+$/.test(name));
      revision = revisions.length + 2;
      const priorDir = revision === 2 ? reportDir : path.join(reportDir, `revision-${revision - 1}`);
      previous = JSON.parse(await readFile(path.join(priorDir, 'receipt.json'), 'utf8'));
      if (expectedRevision !== revision - 1 || previous.revision !== expectedRevision || !correctionReason.trim()) throw new Error('Correction requires current expected revision and reason');
      if (previous.reportDate !== input.report.reportDate || previous.company !== input.company?.name || previous.project !== input.project?.name || previous.crewId !== crewId) throw new Error('Correction must retain report identity');
    } else {
      if (expectedRevision !== 0 || correctionReason) throw new Error('Cannot correct an unknown report revision');
      if (ids.length >= 5) throw new Error('Pilot five-report limit reached');
    }
    stage = path.join(root, `.pending-${randomUUID()}`);
    await mkdir(stage, {mode: 0o700});
    const output = path.join(stage, 'report.pdf');
    const result = await generateFoundingPilotReport(input, output);
    await chmod(output, 0o600);
    await writeFile(path.join(stage, 'input.json'), inputBytes, {mode: 0o600});
    await writeFile(path.join(stage, 'source.bin'), sourceBytes, {mode: 0o600});
    const receipt = { schemaVersion: 1, reportId: input.report.id, reportDate: input.report.reportDate, company: input.company.name, project: input.project.name, crewId, revision, correctionReason, previousPdfSha256: previous?.pdfSha256 || null, inputSha256: hash(inputBytes), sourceSha256: hash(sourceBytes), pdfSha256: hash(await readFile(output)), status: 'prepared_not_approved_not_sent', generatedAt: result.generatedAt };
    await writeFile(path.join(stage, 'receipt.json'), JSON.stringify(receipt, null, 2) + '\n', {mode: 0o600});
    const destination = revision === 1 ? reportDir : path.join(reportDir, `revision-${revision}`);
    await rename(stage, destination);
    stage = undefined;
    return { ...receipt, outputPath: path.join(destination, 'report.pdf') };
  } finally {
    if (stage) await rm(stage, {recursive: true, force: true});
    await rm(lock, {recursive: true});
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [, , inputPath, sourcePath, pilotDir, crewId] = process.argv;
  if (!inputPath || !sourcePath || !pilotDir || !crewId) {
    console.error('Usage: node scripts/prepare-pilot-report.mjs INPUT.json SOURCE_FILE PRIVATE_PILOT_DIR CREW_ID');
    process.exitCode = 2;
  } else preparePilotReport({inputPath, sourcePath, pilotDir, crewId}).then(result => {
    console.log(JSON.stringify({status: result.status, revision: result.revision, pdfSha256: result.pdfSha256}));
  }).catch(() => { console.error('Preparation failed. Inspect local input and pilot state; nothing sent.'); process.exitCode = 1; });
}
