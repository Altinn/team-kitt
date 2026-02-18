---
layout: docs
title: "ARIELLE Specification"
display_title: "ARIELLE: An Architecture Style for AI-Native Development"
permalink: /en/docs/arielle/
lang: en
ref: docs-arielle
---

A new discipline is emerging. **AI-native development** recognizes natural language as a programming language in its own right—not a curiosity, but a fundamental shift in how we instruct machines.

Just as code became the medium for controlling CPUs, natural language is becoming the medium for controlling language models. But we are still in the early days of this transition. As an industry, we lack guidance on how to do this *well*—reliably, at scale, for real projects with real complexity.

**ARIELLE** stands for **AI Regulation, Innovation, Enablement, Licensing, Legal & Ethics**. It defines an architecture style for reliable, scalable collaboration between humans and AI coding agents—and it is meant for the whole team: engineers, product, design, security, legal, compliance, and leadership.

ARIELLE is a **superset** of the PROSE principles (Progressive Disclosure, Reduced Scope, Orchestrated Composition, Safety Boundaries, Explicit Hierarchy) described in the *awesome-ai-native* collection. We keep the five constraints, but expand the lens to include regulation, licensing, and ethics, so AI-native work is governed at organizational scale—not just in code.

Just as REST defined constraints for distributed systems independent of HTTP, ARIELLE defines constraints for AI-native development independent of any specific model or platform. It provides a shared language across roles and makes collaboration, accountability, and quality more predictable.

## The ARIELLE Domains

ARIELLE is more than a technical style; it is a cross-functional framework that makes AI work governable. The domains below act as a checklist for the whole team:

| Letter | Domain | Purpose | Typical questions |
|--------|--------|---------|-------------------|
| **A** | AI (capability and risk) | Clarify what AI is suited for and where the limits are | “What should the agent do on its own?” |
| **R** | Regulation | Ensure compliance with laws, standards, and sector rules | “Which regulations apply here?” |
| **I** | Innovation | Explore new solutions safely and intentionally | “Where can we experiment?” |
| **E** | Enablement | Skills, onboarding, and team workflow | “Who needs training?” |
| **L** | Licensing | Proper use of data, models, and code | “Which licenses are allowed?” |
| **L** | Legal | Contracts, liability, IP, procurement | “Who owns the output?” |
| **E** | Ethics | Fairness, transparency, societal impact | “Is this responsible?” |

## The PROSE Core (Five Constraints)

ARIELLE builds on the PROSE constraints that make AI-native work robust in practice:

| Constraint | Principle | Induced Property |
|-------------|----------|-------------------|
| **P** Progressive disclosure | Structure information so complexity is revealed gradually | Efficient context use |
| **R** Reduced scope | Fit task size to context capacity | Manageable complexity |
| **O** Orchestrated composition | Simple things compose; complex things break down | Flexibility, reusability |
| **S** Safety boundaries | Autonomy within safe limits | Reliability, safety, verifiability |
| **E** Explicit hierarchy | Specificity increases as scope narrows | Modularity, inheritance |

## Who ARIELLE Is For

ARIELLE is meant for everyone involved in delivering AI-enabled solutions:

- **Engineers and architects** who need stable workflows and quality guarantees.
- **Product and design** who ensure value, user experience, and responsibility.
- **Legal and compliance** who assess risk, licensing, and regulatory requirements.
- **Leadership** who must ensure governance, accountability, and maturity over time.

## How to Use ARIELLE

1. **Start cross‑functionally.** Walk through the ARIELLE domains early in projects.
2. **Build with the PROSE core.** Use the constraints to structure workflow and documentation.
3. **Make accountability explicit.** Document decisions, ownership, and validation.

## What ARIELLE Is Not

- **Not a framework.** ARIELLE is a style, like REST. Implementations vary; the constraints apply.
- **Not a file format.** Primitives (`.instructions.md`, etc.) implement the style; they are not the style itself.
- **Not model-specific.** ARIELLE works with GPT, Claude, Gemini, open models, and what comes next.
- **Not prescriptive about tools.** Use VS Code, Cursor, CLI agents, or any interface. The constraints are universal.

## The Problem ARIELLE Solves

Working with language models at scale exposes a fundamental challenge: **quality in, quality out**—but what does “quality” mean when your programming language is natural language?

Two failure modes dominate:

**Context overload:** Models have limited context and limited attention. When overloaded with irrelevant information, they lose focus, forget instructions, and hallucinate to fill gaps.

**Guidance failure:** Models that receive vague, unstructured, or insufficient direction produce inconsistent, unpredictable results. Unlike compilers that reject bad syntax, *LLMs always produce something*—making quality failures silent and insidious.

## The Five Constraints {#the-five-constraints}

ARIELLE defines five constraints that systematize collaboration between humans and AI:

### P — Progressive Disclosure

Provide only what is needed now. Layer information in small steps so context is not overloaded.

### R — Reduced Scope

Fit the task to the context window. Decompose large problems into smaller, bounded parts.

### O — Orchestrated Composition

Build complex systems from simple, reusable building blocks. Composition makes quality scalable.

### S — Safety Boundaries

Autonomy within safe limits. Constraints make agents robust and predictable.

### E — Explicit Hierarchy

Be more specific as scope narrows. Hierarchy provides structure and inheritance.

## How the Constraints Work Together

ARIELLE is not five separate rules. The constraints reinforce each other and provide a coherent method for managing cognitive load and risk.

## Grounding Principles {#grounding-principles}

### 1. Context is finite and fragile

Context windows have capacity limits, and attention within those limits is uneven. Information competes for attention; content far from focus disappears. Treat context as a scarce resource that degrades under load.

### 2. Context must be explicit

It’s always better to make instructions and requirements explicit than to rely on implicit knowledge. Context that is not expressed is easily lost.

### 3. Output is probabilistic

AI is not deterministic. Structure and validation are required to keep quality stable.

## ARIELLE Compliance Checklist {#arielle-compliance-checklist}

- [ ] Tasks are reduced to a manageable scope
- [ ] Instructions are explicit and targeted
- [ ] Primitives are modular and reusable
- [ ] Validation gates are defined
- [ ] Human oversight is built in

## ARIELLE Maturity Model {#arielle-maturity-model}

### Level Progression

- **Level 1 – Unstructured prompting**
- **Level 2 – Basic instructions**
- **Level 3 – Modular primitives**
- **Level 4 – Orchestrated workflows**
- **Level 5 – Team and organizational governance**

## Anti-Patterns {#anti-patterns}

- **Monolithic prompts** that try to do everything at once
- **Missing validation gates** that make errors invisible
- **Unstructured context** that overloads the model

## Results

When ARIELLE is implemented well, you get more robust, scalable, and collaborative AI workflows.

## Key Takeaways

ARIELLE provides a practical framework for making AI-native development reliable at scale. The constraints are simple, but powerful when applied consistently.
