/**
 * Regression: the homepage lazy PostHog bootstrap must disable the SDK's
 * automatic capture_pageview while it keeps its manual, marked $pageview
 * capture in loaded(). Both firing = two pageviews per single page load.
 *
 * This exercises the ACTUAL inline script from index.html (extracted and run
 * in node:vm with a minimal fake window/document), not a substring check.
 */
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(repoRoot, "index.html"), "utf-8");

/** The lazy PostHog bootstrap is the inline <script> wiring posthog.init + $pageview. */
function extractLazyPostHogBootstrap(source: string): string {
  const matches = [...source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)];
  const hits = matches
    .filter(
      (m) =>
        /posthog\s*\.\s*init/.test(m[2]) &&
        /\$pageview/.test(m[2]) &&
        /requestIdleCallback/.test(m[2])
    )
    .map((m) => m[2]);
  if (hits.length !== 1) {
    throw new Error(
      `expected exactly one lazy PostHog bootstrap inline script in index.html, found ${hits.length}`
    );
  }
  return hits[0];
}

interface Harness {
  window: Record<string, any>;
  idle: Array<{ fn: () => void; opts: any }>;
  timeouts: Array<{ fn: () => void; ms: number }>;
  listeners: Array<{ type: string; fn: () => void; opts: any }>;
  createdScripts: any[];
}

/** Execute the bootstrap source the way a browser would: lazy, then triggered. */
function runBootstrap(source: string): Harness {
  const idle: Harness["idle"] = [];
  const timeouts: Harness["timeouts"] = [];
  const listeners: Harness["listeners"] = [];
  const createdScripts: Harness["createdScripts"] = [];

  const firstScript = { parentNode: { insertBefore: () => {} } };
  const fakeDocument = {
    createElement: (tag: string) => {
      const el: Record<string, any> = { tag, parentNode: null };
      createdScripts.push(el);
      return el;
    },
    getElementsByTagName: () => [firstScript],
  };

  const sandbox: Record<string, any> = {};
  sandbox.window = sandbox;
  sandbox.document = fakeDocument;
  sandbox.requestIdleCallback = (fn: () => void, opts: any) => {
    idle.push({ fn, opts });
  };
  sandbox.setTimeout = (fn: () => void, ms: number) => {
    timeouts.push({ fn, ms });
    return 0;
  };
  sandbox.addEventListener = (type: string, fn: () => void, opts: any) => {
    listeners.push({ type, fn, opts });
  };

  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "index.html#lazy-posthog-bootstrap" });

  return { window: sandbox, idle, timeouts, listeners, createdScripts };
}

describe("index.html lazy PostHog bootstrap", () => {
  it("stays lazy: schedules idle + activity triggers but loads nothing before the callback fires", () => {
    const h = runBootstrap(extractLazyPostHogBootstrap(html));

    expect(h.idle).toHaveLength(1);
    expect(h.idle[0].opts).toEqual({ timeout: 3000 });
    expect(h.listeners.map((l) => l.type).sort()).toEqual([
      "click",
      "keydown",
      "mousemove",
      "scroll",
      "touchstart",
    ]);
    expect(
      h.listeners.every((l) => l.opts?.once === true && l.opts?.passive === true && l.opts?.capture === true)
    ).toBe(true);
    expect(h.createdScripts).toHaveLength(0); // array.js not requested yet
    expect(h.window.posthog?._i ?? []).toHaveLength(0); // init not called yet
  });

  it("inits exactly once with capture_pageview:false so one load yields only the marked manual $pageview", () => {
    const h = runBootstrap(extractLazyPostHogBootstrap(html));
    h.idle[0].fn(); // fire the deferred load, as the browser would

    const posthog = h.window.posthog;
    expect(posthog._i).toHaveLength(1); // exactly one init
    const [token, initConfig] = posthog._i[0];
    expect(String(token)).toMatch(/^phc_[A-Za-z0-9]+$/); // public token preserved
    expect(initConfig.api_host).toBe("https://eu.i.posthog.com"); // EU endpoint preserved
    expect(initConfig.person_profiles).toBe("identified_only");
    expect(initConfig.capture_pageview).toBe(false); // automatic pageviews off

    // What the real array.js does once loaded: call the inline loaded() with the live client.
    const captures: any[][] = [];
    initConfig.loaded({ capture: (...args: any[]) => captures.push(args) });
    expect(captures).toEqual([["$pageview", { deferred: true }]]); // exactly one, marked
  });

  it("does not re-init when activity events fire after the load already happened", () => {
    const h = runBootstrap(extractLazyPostHogBootstrap(html));
    h.idle[0].fn();
    const posthog = h.window.posthog;
    for (const l of h.listeners) l.fn(); // user interacts right after load
    expect(posthog._i).toHaveLength(1);
    const captures: any[][] = [];
    posthog._i[0][1].loaded({ capture: (...args: any[]) => captures.push(args) });
    expect(captures).toHaveLength(1);
  });
});
