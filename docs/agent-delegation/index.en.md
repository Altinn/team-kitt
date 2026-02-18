---
layout: docs
title: "Agent Delegation"
display_title: "Agent Delegation"
permalink: /en/docs/agent-delegation/
lang: en
ref: docs-agent-delegation
---

> **ARIELLE Focus:** Master **O**rchestration—coordinate agents and delegate work.

When your **Agentic Workflows** are built and ready, you face a critical choice: how to execute them. Whether the workflows come from installed Skills or local `.prompt.md` files, the execution strategies you choose—from local control to advanced async orchestration—will fundamentally shape both development speed and learning outcomes.

This guide covers the full spectrum of execution approaches, from maintaining tight control in your local IDE to delegating complex workflows to multiple async agents working in parallel. Each strategy has optimal use cases, and mastering the decision framework ensures you choose the right approach for each situation.

## Execution Strategy Overview

**Agentic Workflows** can be executed through three primary strategies, each offering a different balance of control, speed, and learning:

1. **Local IDE Execution** – Direct workflow execution in your development environment for maximum control and learning
2. **Async Agent Delegation** – Hand off full workflows to GitHub Coding Agents for parallel productivity
3. **Hybrid Orchestration** – Combine local control with async delegation for optimal flow

## Agentic Workflow Execution Example {#agentic-workflow-execution-example}

This section shows how a complete agentic workflow moves from specification to implementation, with human validation gates and controlled handoffs.

### Workflow Components in Practice:

- **Specification** (`.spec.md`) defining requirements
- **Instructions** (`.instructions.md`) guiding execution
- **Prompt** (`.prompt.md`) orchestrating the process
- **Agent mode** enforcing boundaries

## A. Execution Strategy Selection {#a-execution-strategy-selection}

Choosing a strategy is about risk tolerance, time criticality, and complexity.

### 🔧 Strategic Decision Matrix:

- **High risk / high complexity** → Local IDE
- **Low risk / repeatable work** → Async agent
- **Mixed needs** → Hybrid orchestration

### Quick Decision Guide: Choose Your Execution Strategy

- Need tight control? Choose local IDE.
- Need speed and parallelism? Choose async delegation.
- Need both? Choose hybrid.

## B. Local IDE Execution {#b-local-ide-execution}

Local execution gives you full control and direct learning. It’s ideal for high‑risk work, architecture changes, and complex refactors.

### 🔧 Implementation Pattern:

1. Load context and specification
2. Create plan and validate with a human
3. Implement step‑by‑step with checkpoints
4. Test and document

## Local IDE Agentic Workflow Execution

This workflow runs in your IDE and gives maximum insight into how the agent thinks and delivers.

### Example: Local OAuth Implementation

This example shows a full local implementation flow with manual validation gates.

## C. Async Agent Delegation {#c-async-agent-delegation}

Async delegation provides high speed and parallelism, especially for well‑scoped, well‑specified work.

### C.1. Single Agent Delegation

Hand off a complete task to a single agent for end‑to‑end delivery.

## Single Agent Workflow Delegation

When you delegate a complete workflow, ensure the specification is precise and checkpoints exist for review.

### C.2. Parallel Multi‑Agent Delegation (Spec‑to‑Issues Pattern)

Large specifications can be decomposed into multiple issues that are delegated to separate agents.

## Agentic Workflow: Spec‑to‑Multiple‑Issues Delegation

### Phase 1: Specification Decomposition

Break the specification into independent components.

### Phase 2: Parallel Issue Generation

Create issues for each component.

### Phase 3: Parallel Agent Assignment

Assign an agent to each issue.

### Phase 4: Coordinated Integration

Coordinate outputs and integrate the changes.

### Example: OAuth System Decomposition

## Component Breakdown for Parallel Delegation:

### Issue 1: OAuth Middleware (`oauth-middleware`)
### Issue 2: Token Service (`token-service`)  
### Issue 3: User Profile Sync (`user-sync-service`)

### Integration Context References:

Ensure all agents work from the same reference context.

## D. Progress Monitoring & Async Integration {#d-progress-monitoring--async-integration}

Async execution requires structured monitoring, quality gates, and an integration strategy.

### D.1. Multi‑Channel Progress Tracking

Track work across issues, PRs, and status updates.

### D.2. Async Agent Quality Gates

Define validation gates that async outputs must pass.

## Async Agent Output Integration Process

### Phase 1: Draft PR Analysis
### Phase 2: Integration Validation  
### Phase 3: Knowledge Integration

### Example: OAuth Integration Quality Gates

## Async Agent Output Review: OAuth Components

### Component 1: OAuth Middleware (Agent A)
### Component 2: Token Service (Agent B)  
### Component 3: User Sync Service (Agent C)

### Integration Actions:

Coordinate output, test integration, and update documentation.

## E. Hybrid Orchestration Strategies {#e-hybrid-orchestration-strategies}

Hybrid orchestration combines local control with async speed. You plan, validate, and integrate locally, while delegating bounded work asynchronously.

### Example: Context‑Optimized Hybrid Session

## Session 1: Planning & Delegation Setup
### Context Loading
### Delegation Handoff

## Session 2: Local Development (Concurrent)
### Fresh Context for Local Work

## Session 3: Integration & Learning (Post‑Async Completion)
### Context Assembly
### Knowledge Accumulation

## Key Takeaways {#key-takeaways}

1. **Local IDE** provides maximum control and learning
2. **Async delegation** provides speed and parallelism
3. **Hybrid orchestration** balances quality and throughput
4. **Validation gates** are critical for quality
