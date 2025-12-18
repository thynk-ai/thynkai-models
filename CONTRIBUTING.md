# Contributing to thynkai-models

This repository is a registry. The bar is correctness, consistency, and traceability.

## Development

```bash
npm ci
npm run ci
```

## Expectations

- Keep entries factual and verifiable (links, digests where possible).
- Do not upload model weights here. Use URIs + optional digests.
- Use SemVer for model versions.
- Keep `PERFORMANCE.md` concise and reproducible.

## Review process

Maintainers review for:
- spec compliance (`MODEL_SPEC.md`)
- completeness (required fields, version alignment)
- integrity fields (sha256 digest format if provided)
- clarity of benchmark notes

## Community

Follow `CODE_OF_CONDUCT.md`. For security issues, see `SECURITY.md`.
