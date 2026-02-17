---
applyTo: "**/arielle/**/*.md, **/ARIELLE*.md"
description: "Guidelines for editing ARIELLE specification documents"
---

# ARIELLE Specification Editing Guidelines

When editing ARIELLE specification documents, follow these rules to maintain consistency and rigor.

## Reference

All constraint definitions live in: [ARIELLE Spec](../../docs/arielle/index.md)

## Rules

1. **Constraint Consistency** - New content must align with existing ARIELLE constraints (Progressive Disclosure, Reduced Scope, Orchestrated Composition, Safety Boundaries, Explicit Hierarchy)

2. **Example Updates** - When adding or modifying concepts, provide concrete examples that demonstrate the principle

3. **Academic Tone** - ARIELLE specs are reference documents; maintain a rigorous, precise writing style

4. **Link Don't Duplicate** - Reference existing definitions rather than restating them

5. **Version Awareness** - Note which ARIELLE version (e.g., v0.1) a change applies to

## Validation

Before committing changes:
- [ ] New content does not contradict existing constraints
- [ ] Cross-references are valid and up-to-date
- [ ] Examples compile/work if code is included
- [ ] Changes are noted in changelog if breaking

## Anti-patterns

- Adding constraints without clear rationale
- Duplicating definitions across documents
- Breaking backward compatibility without migration path
- Over-engineering simple concepts
