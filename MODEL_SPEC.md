# ThynkAI Model Registry Spec

This document defines the minimum standard for entries in `thynkai-models`.

## Directory layout

Each model lives in:

- `models/text/<model-slug>/`
- `models/vision/<model-slug>/`
- `models/multimodal/<model-slug>/`

Required files per model:
- `model.json` (stable model metadata)
- `versions/<semver>.json` (version + artifact metadata)
- `PERFORMANCE.md` (human-readable benchmark notes)

## `model.json` (required)

Fields:
- `id` (string) — globally unique model id (recommended: `org/name` style)
- `name` (string)
- `modality` ("text" | "vision" | "multimodal")
- `description` (string, optional)
- `owner` (object) — `contributorId` (string) + `displayName` (string)
- `createdAt` (ISO8601 string)
- `version` (SemVer string) — current primary version
- `tags` (string[], optional)
- `links` (object, optional) — `repo`, `paper`, `homepage` (strings)
- `license` (string, optional) — SPDX identifier when known

Rules:
- `model.json:modality` must match the directory (text/vision/multimodal).
- `model.json:version` must have a matching `versions/<version>.json`.

## `versions/<semver>.json` (required)

Fields:
- `modelId` (string) — must match `model.json:id`
- `version` (SemVer string) — must match filename
- `releasedAt` (ISO8601 string)
- `artifact` (object) with:
  - `uri` (string) — where the artifact can be fetched (not stored here)
  - `digest` (string, optional) — `sha256:<64 hex>`
  - `sizeBytes` (number, optional)
  - `builtWith` (object, optional) — `framework`, `runtime`, `notes`
- `benchmarks` (array, optional) — references to benchmark runs or reports

## `PERFORMANCE.md` (required)

A short, factual note describing performance claims:
- benchmark id + version
- date of run
- environment (hardware/runtime) when relevant
- link to report artifact when available

Keep it reproducible. Avoid marketing language.

## Benchmarks registry

`benchmarks/benchmark-registry.json` is an index of benchmark ids and basic metadata.
Optional deeper docs may live under `benchmarks/<benchmark-id>/`.
