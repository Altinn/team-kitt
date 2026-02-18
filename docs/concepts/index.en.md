---
layout: docs
title: "Practice"
display_title: "Practice"
permalink: /en/docs/concepts/
lang: en
ref: docs-concepts
---

The [ARIELLE Specification](../arielle/) defines five architectural constraints for reliable AI-native development. This guide shows how to implement them through three interwoven disciplines: structured prompting, reusable primitives, and strategic context management.

Whether you’re coming from the specification or discovering these practices for the first time, mastering these disciplines gives you the skills to make AI collaboration reliable at scale.

## How Practice Implements ARIELLE

Each discipline implements concrete [ARIELLE constraints](../arielle/#the-five-constraints):

| Discipline | What you learn | ARIELLE constraints |
|------------|----------------|-------------------|
| **Prompt Engineering** | Structured natural language syntax | Enables all constraints |
| **Agent Primitives** | Reusable, composable configuration | Orchestrated Composition, Safety Boundaries |
| **Context Engineering** | Strategic context management | Reduced Scope, Explicit Hierarchy |

## Discipline 1: Prompt Engineering {#discipline-1-prompt-engineering}

**Prompt Engineering** is the craft of structuring natural language for deterministic execution. In AI Native Development, prompting isn’t improvisation — it’s engineering.

### Core Techniques

- **Micro-structured prompts**: Use fixed sections and checklists to reduce ambiguity.
- **Validation gates**: Require explicit verification before the next step.
- **Systematic output formats**: Define output formats that can be evaluated.

### Quick Win Example

```markdown
# Task: Update API Endpoint

## Context
- Service: Billing API
- Endpoint: /v2/invoices
- Constraints: No breaking changes

## Requirements
- [ ] Add optional `currency` query param
- [ ] Update OpenAPI schema
- [ ] Add unit tests

## Validation
STOP. Confirm API contract and test plan before coding.
```

## Discipline 2: Agent Primitives {#discipline-2-agent-primitives}

Agent Primitives are modular units of agent behavior: instructions, prompts, and specifications that can be composed and reused. This is the infrastructure that makes AI work consistent at scale.

### Core Primitives

- **Instructions** (`.instructions.md`) for persistent guidance
- **Prompts** (`.prompt.md`) for workflows
- **Specifications** (`.spec.md`) for handoff between planning and implementation

### The Transformation Effect

Once primitives are in place, productivity shifts from improvisation to industrial capacity: higher quality, fewer errors, lower coordination cost.

## Discipline 3: Context Engineering {#discipline-3-context-engineering}

Context Engineering is about managing attention and memory in large language models. When the context window is a scarce resource, you must optimize what gets included — and when.

### Why Context Matters

- Limited context means irrelevant information pushes out critical details.
- Output quality is directly tied to context quality.
- Modularization and selective loading are essential for scale.

### The Universal Discovery Challenge

Agents need to find what they need exactly when they need it—without loading everything every time. This requires standards like `AGENTS.md` and strategic organization.

### Core Techniques

- **ApplyTo patterns** for selective context
- **Compilation to AGENTS.md** for portability
- **Reduced scope** for complex tasks

### Practical Benefits

- Lower cost per interaction
- Higher relevance in agent responses
- Better quality and consistency

## Agentic Workflows: all disciplines in action {#agentic-workflows-all-disciplines-in-action}

When you combine prompt engineering, agent primitives, and context engineering, you get **agentic workflows**—repeatable processes that can run locally or be delegated asynchronously.

### Key Properties:

- **Deterministic structure** for quality
- **Context discipline** for focus
- **Validation gates** for safety
- **Composition** for scalability

## The AI Native Development Framework

AI Native Development is not a new tool—it’s a new way of building. The practice disciplines here are the building blocks that make ARIELLE useful in practice.

## Key Takeaways {#key-takeaways}

1. **Prompt Engineering** makes AI execution deterministic
2. **Agent Primitives** make knowledge and workflows reusable
3. **Context Engineering** makes scale possible without context pollution
4. **Agentic Workflows** combine all three disciplines into production-ready orchestration
