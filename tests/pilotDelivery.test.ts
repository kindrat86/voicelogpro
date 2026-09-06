import { it, expect } from 'vitest';
import { mkdtemp, writeFile, readFile, rm, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import os from 'node:os';

it('versions corrections without extra slots and binds source, input and PDF hashes', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'vlp-correction-'));
  try {
    const sourcePath = path.join(dir, 'source.txt');
    const inputPath = path.join(dir, 'input.json');
    const pilotDir = path.join(dir, 'pilot');
    const input = {report: {id: 'SYNTHETIC-1', reportDate: '2026-09-01'}, company: {name: 'SYNTHETIC'}, project: {name: 'Fictional'}, receivedAt: '2026-09-06T00:00:00Z', additionalNotes: 'SYNTHETIC'};
    await writeFile(sourcePath, 'SYNTHETIC original written source');
    await writeFile(inputPath, JSON.stringify(input));
    const { preparePilotReport } = await import('../scripts/prepare-pilot-report.mjs');
    const args = {inputPath, sourcePath, pilotDir, crewId: 'fictional-crew'};
    const first = await preparePilotReport(args);
    const original = await readFile(first.outputPath);
    await writeFile(sourcePath, 'SYNTHETIC correction request');
    await writeFile(inputPath, JSON.stringify({...input, additionalNotes: 'SYNTHETIC corrected note'}));
    const second = await preparePilotReport({...args, expectedRevision: 1, correctionReason: 'Synthetic correction'});
    expect(second.revision).toBe(2);
    expect(second.previousPdfSha256).toBe(first.pdfSha256);
    expect(second.sourceSha256).not.toBe(first.sourceSha256);
    const digest = (b: Buffer) => createHash('sha256').update(b).digest('hex');
    expect(second.pdfSha256).toBe(digest(await readFile(second.outputPath)));
    expect(second.sourceSha256).toBe(digest(await readFile(sourcePath)));
    expect(second.inputSha256).toBe(digest(await readFile(inputPath)));
    expect(await readFile(first.outputPath)).toEqual(original);
    expect((await readdir(path.join(pilotDir, 'reports'))).length).toBe(1);
    await writeFile(inputPath, JSON.stringify({...input, report: {...input.report, id: 'SYNTHETIC-2'}}));
    await expect(preparePilotReport({...args, crewId: 'other-crew'})).rejects.toThrow(/one company and crew/);
    await writeFile(inputPath, JSON.stringify(input));
    await expect(preparePilotReport({...args, expectedRevision: 1, correctionReason: 'stale'})).rejects.toThrow(/revision/);
  } finally { await rm(dir, {recursive: true, force: true}); }
});
import path from 'node:path';

it('persists a five-report cap across independent generator invocations', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'vlp-control-'));
  try {
    const source = path.join(dir, 'source.txt');
    const input = path.join(dir, 'input.json');
    await writeFile(source, 'SYNTHETIC written fixture: fictional work.');
    const { preparePilotReport } = await import('../scripts/prepare-pilot-report.mjs');
    for (let n = 1; n <= 5; n++) {
      await writeFile(input, JSON.stringify({ report: { id: `SYNTHETIC-${n}`, reportDate: `2026-09-0${n}` }, company: {name: 'SYNTHETIC'}, project: {name: 'Fictional'}, receivedAt: '2026-09-06T00:00:00Z', additionalNotes: 'SYNTHETIC fixture only' }));
      await preparePilotReport({ inputPath: input, sourcePath: source, pilotDir: path.join(dir, 'pilot'), crewId: 'fictional-crew' });
    }
    await writeFile(input, JSON.stringify({ report: { id: 'SYNTHETIC-6', reportDate: '2026-09-06' }, company: {name: 'SYNTHETIC'}, project: {name: 'Fictional'}, receivedAt: '2026-09-06T00:00:00Z' }));
    await expect(preparePilotReport({ inputPath: input, sourcePath: source, pilotDir: path.join(dir, 'pilot'), crewId: 'fictional-crew' })).rejects.toThrow(/five-report limit/);
    expect((await readdir(path.join(dir, 'pilot', 'reports'))).length).toBe(5);
  } finally { await rm(dir, {recursive: true, force: true}); }
});
