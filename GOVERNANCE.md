# Governance (thynkai-models)

This repository is a public registry. Its primary purpose is stable, auditable metadata.

## When a proposal is required

Open a proposal (issue) before making changes that affect:
- registry schema format (`schemas/`, `MODEL_SPEC.md`)
- directory layout conventions
- validation rules in CI

## Default rule

If a change could break existing tooling that reads this registry, treat it as a proposal.

## Maintainer decision rule

Maintainers evaluate:
- backwards compatibility
- clarity and minimalism
- security implications (links, integrity fields)
- test/validation coverage
