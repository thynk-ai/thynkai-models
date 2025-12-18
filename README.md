# thynkai-models

Community registry for ThynkAI model metadata, version history, and benchmark notes.

This repository is intentionally conservative:
- It does not host model weights.
- It records stable metadata and links to external artifacts.
- It stores version history and performance notes in a consistent format.

## What lives here

- `models/` — model entries grouped by modality (text / vision / multimodal).
- `benchmarks/` — benchmark registry entries and lightweight benchmark metadata.
- `schemas/` — JSON Schemas used to validate registry entries.
- `scripts/validate.mjs` — CI validation for new/changed entries.

## Contribution model

Most changes are additions:
- new model entry
- new model version entry
- updated performance notes
- new benchmark registry entry

Changes that alter the registry format should be proposed first (see `GOVERNANCE.md`).

## Contributing

- Guide: `CONTRIBUTING.md`
- Spec: `MODEL_SPEC.md`
- Code of Conduct: `CODE_OF_CONDUCT.md`
- Security: `SECURITY.md`
- Governance: `GOVERNANCE.md`

## Links

- Org: https://github.com/thynkai
- Core protocol primitives: https://github.com/thynkai/thynkai-core
- Docs hub: https://github.com/thynkai/thynkai-docs
