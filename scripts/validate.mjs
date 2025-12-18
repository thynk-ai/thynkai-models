import { readdirSync, statSync, readFileSync } from "node:fs";
import { join } from "node:path";

const SEMVER_RE =
  /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+([0-9A-Za-z.-]+))?$/;
const SHA256_RE = /^sha256:[0-9a-f]{64}$/i;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function parseJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    throw new Error(`invalid_json: ${path}`);
  }
}

function isIsoDate(s) {
  const t = Date.parse(s);
  return Number.isFinite(t);
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function validateModelEntry(path) {
  const obj = parseJson(path);

  assert(typeof obj.id === "string" && obj.id.trim(), `model.id required: ${path}`);
  assert(typeof obj.name === "string" && obj.name.trim(), `model.name required: ${path}`);
  assert(["text", "vision", "multimodal"].includes(obj.modality), `model.modality invalid: ${path}`);

  assert(obj.owner && typeof obj.owner === "object", `model.owner required: ${path}`);
  assert(
    typeof obj.owner.contributorId === "string" && obj.owner.contributorId.trim(),
    `owner.contributorId required: ${path}`
  );
  assert(
    typeof obj.owner.displayName === "string" && obj.owner.displayName.trim(),
    `owner.displayName required: ${path}`
  );

  assert(typeof obj.createdAt === "string" && isIsoDate(obj.createdAt), `createdAt must be ISO date: ${path}`);
  assert(typeof obj.version === "string" && SEMVER_RE.test(obj.version), `model.version must be SemVer: ${path}`);

  return obj;
}

function validateVersionEntry(path) {
  const obj = parseJson(path);

  assert(typeof obj.modelId === "string" && obj.modelId.trim(), `version.modelId required: ${path}`);
  assert(typeof obj.version === "string" && SEMVER_RE.test(obj.version), `version.version must be SemVer: ${path}`);
  assert(typeof obj.releasedAt === "string" && isIsoDate(obj.releasedAt), `releasedAt must be ISO date: ${path}`);

  assert(obj.artifact && typeof obj.artifact === "object", `artifact required: ${path}`);
  assert(typeof obj.artifact.uri === "string" && obj.artifact.uri.trim(), `artifact.uri required: ${path}`);

  if (obj.artifact.digest !== undefined) {
    assert(
      typeof obj.artifact.digest === "string" && SHA256_RE.test(obj.artifact.digest),
      `artifact.digest invalid (sha256:<64 hex>): ${path}`
    );
  }

  if (obj.artifact.sizeBytes !== undefined) {
    assert(
      typeof obj.artifact.sizeBytes === "number" && obj.artifact.sizeBytes >= 0,
      `artifact.sizeBytes invalid: ${path}`
    );
  }

  return obj;
}

function main() {
  const files = walk("models");
  const modelFiles = files.filter((p) => p.endsWith("model.json"));
  const versionFiles = files.filter((p) => /versions[\\/]/.test(p) && p.endsWith(".json"));

  assert(modelFiles.length > 0, "no model.json entries found under models/");

  for (const mf of modelFiles) {
    const m = validateModelEntry(mf);

    const parts = mf.split(/\\|\//);
    const idx = parts.indexOf("models");
    const folderModality = idx >= 0 ? parts[idx + 1] : undefined;
    assert(
      folderModality === m.modality,
      `modality folder mismatch for ${m.id}: folder=${folderModality} file=${m.modality}`
    );

    const perfPath = mf.replace(/model\.json$/, "PERFORMANCE.md");
    try {
      const st = statSync(perfPath);
      assert(st.isFile(), `PERFORMANCE.md missing for ${m.id}: ${perfPath}`);
    } catch {
      throw new Error(`PERFORMANCE.md missing for ${m.id}: ${perfPath}`);
    }

    const versionsDir = mf.replace(/model\.json$/, "versions");
    const expectedFileNormalized = join(versionsDir, `${m.version}.json`).replace(/\\/g, "/");

    const matching = versionFiles
      .filter((vf) => vf.replace(/\\/g, "/").startsWith(versionsDir.replace(/\\/g, "/")))
      .map((vf) => vf.replace(/\\/g, "/"));

    assert(matching.length > 0, `no versions found for model ${m.id} (${versionsDir})`);
    assert(matching.includes(expectedFileNormalized), `missing versions/${m.version}.json for model ${m.id}`);

    for (const vf of matching) {
      const v = validateVersionEntry(vf);
      assert(v.modelId === m.id, `version.modelId mismatch: ${vf}`);
      const fileName = vf.split("/").pop();
      const versionFromFile = fileName?.replace(/\.json$/, "");
      assert(versionFromFile === v.version, `version filename mismatch: ${vf}`);
    }
  }

  const reg = parseJson("benchmarks/benchmark-registry.json");
  assert(reg && Array.isArray(reg.benchmarks), "benchmarks/benchmark-registry.json must contain { benchmarks: [] }");

  console.log("OK: thynkai-models registry validation passed.");
}

main();
