---
layout: docs
title: "Agentdelegering"
display_title: "Agentdelegering"
permalink: /nn/docs/agent-delegation/
lang: nn
ref: docs-agent-delegation
---

> **ARIELLE-fokus:** Meistre **O**rkestrering—koordinere agentar og delegere arbeid.

Når dine **Agentic Workflows** er bygde og klare, står du overfor eit viktig val: korleis utføre dei. Enten workflowane kjem frå installerte Skills eller lokale `.prompt.md`-filer, vil utføringsstrategiane du vel—frå lokal kontroll til avansert asynkron orkestrering—grunnleggande forme både utviklingsfart og læringsutbyte.

Denne guiden dekkjer heile spekteret av utføringsmåtar, frå å halde tett kontroll i di lokale IDE til å delegere komplekse workflows til fleire asynkrone agentar som jobbar parallelt. Kvar strategi har optimale bruksområde, og å meistre beslutningsrammeverket sikrar at du vel riktig tilnærming for kvar situasjon.

## Oversikt over utføringsstrategi

**Agentic Workflows** kan utførast gjennom tre hovudstrategiar, som kvar tilbyr ulik balanse mellom kontroll, fart og læring:

1. **Lokal IDE-utføring** – Direkte workflow-utføring i utviklingsmiljøet ditt for maksimal kontroll og læring
2. **Asynkron agent-delegering** – Gi heile workflows vidare til GitHub Coding Agents for parallell produktivitet
3. **Hybrid orkestrering** – Kombiner lokal kontroll med asynkron delegering for optimal flyt

## Eksempel på utføring av Agentic Workflow {#agentic-workflow-execution-example}

Denne seksjonen viser korleis ein komplett agentisk arbeidsflyt kan gå frå spesifikasjon til implementering, med menneskelege valideringsportar og kontrollerte overgangar.

### Workflow-komponentar i praksis:

- **Spesifikasjon** (`.spec.md`) som definerer krav
- **Instruksar** (`.instructions.md`) som styrer utføringa
- **Prompt** (`.prompt.md`) som orkestrerer heile prosessen
- **Agentmodus** som handhevar avgrensingar

## A. Val av utføringsstrategi {#a-execution-strategy-selection}

Valet av strategi handlar om risikotoleranse, tidskritikalitet og kompleksitet.

### 🔧 Strategisk beslutningsmatrise:

- **Høg risiko / høg kompleksitet** → Lokal IDE
- **Låg risiko / repeterbart arbeid** → Asynkron agent
- **Blanda behov** → Hybrid orkestrering

### Hurtig beslutningsguide: Vel din utføringsstrategi

- Treng du tett kontroll? Vel lokal IDE.
- Treng du fart og parallellitet? Vel asynkron delegering.
- Treng du begge? Vel hybrid.

## B. Lokal IDE-utføring {#b-local-ide-execution}

Lokal utføring gir deg full kontroll og direkte læring. Det er ideelt for høgrisikoarbeid, arkitekturendringar og komplekse refaktorar.

### 🔧 Implementeringsmønster:

1. Last inn kontekst og spesifikasjon
2. Lag plan og valider med menneske
3. Implementer stegvis med kontrollpunkt
4. Test og dokumenter

## Local IDE Agentic Workflow Execution

Denne workflowen blir køyrt i IDE-en din og gir maksimal innsikt i korleis agenten tenkjer og leverer.

### Eksempel: Lokal OAuth-implementering

Dette dømet viser ein full lokal implementeringsflyt med manuelle valideringsportar.

## C. Asynkron agent-delegering {#c-async-agent-delegation}

Asynkron delegering gir høg fart og parallellitet, spesielt for avgrensa og godt spesifiserte oppgåver.

### C.1. Single Agent Delegation

Gi ei heil oppgåve til ein agent for ende-til-ende leveranse.

## Single Agent Workflow Delegation

Når du delegerer ein komplett workflow, bør du sikre at spesifikasjonen er presis, og at kontrollpunkt finst for gjennomgang.

### C.2. Parallel Multi-Agent Delegation (Spec-to-Issues Pattern)

Store spesifikasjonar kan delast i fleire issue som kvar blir delegerte til eigne agentar.

## Agentic Workflow: Spec-to-Multiple-Issues Delegation

### Phase 1: Specification Decomposition

Del spesifikasjonen i uavhengige komponentar.

### Phase 2: Parallel Issue Generation

Opprett issue for kvar komponent.

### Phase 3: Parallel Agent Assignment

Tilordne ein agent til kvar issue.

### Phase 4: Coordinated Integration

Samordn resultat og integrer endringane.

### Eksempel: OAuth-system-dekomponering

## Component Breakdown for Parallel Delegation:

### Issue 1: OAuth Middleware (`oauth-middleware`)
### Issue 2: Token Service (`token-service`)  
### Issue 3: User Profile Sync (`user-sync-service`)

### Integration Context References:

Sørg for at alle agentar arbeider med same referansekontekst.

## D. Framdriftsmonitorering og asynkron integrasjon {#d-progress-monitoring--async-integration}

Asynkron utføring krev strukturert oppfølging, kvalitetssikring og integrasjonsstrategi.

### D.1. Multi-Channel Progress Tracking

Overvak arbeid gjennom issue, PR, og statusoppdateringar.

### D.2. Async Agent Quality Gates

Definer valideringsportar som agentleveransar må passere.

## Async Agent Output Integration Process

### Phase 1: Draft PR Analysis
### Phase 2: Integration Validation  
### Phase 3: Knowledge Integration

### Eksempel: OAuth-integrasjons kvalitetsportar

## Async Agent Output Review: OAuth Components

### Component 1: OAuth Middleware (Agent A)
### Component 2: Token Service (Agent B)  
### Component 3: User Sync Service (Agent C)

### Integration Actions:

Samordn output, test integrasjon og oppdater dokumentasjon.

## E. Hybride orkestreringsstrategiar {#e-hybrid-orchestration-strategies}

Hybrid orkestrering kombinerer lokal kontroll med asynkron fart. Du planlegg, validerer og integrerer lokalt, men delegerer avgrensa arbeid asynkront.

### Eksempel: Kontekstoptimalisert hybridsesjon

## Session 1: Planning & Delegation Setup
### Context Loading
### Delegation Handoff

## Session 2: Local Development (Concurrent)
### Fresh Context for Local Work

## Session 3: Integration & Learning (Post-Async Completion)
### Context Assembly
### Knowledge Accumulation

## Hovudpoeng {#key-takeaways}

1. **Lokal IDE** gir maksimal kontroll og læring
2. **Asynkron delegering** gir fart og parallellitet
3. **Hybrid orkestrering** balanserer kvalitet og throughput
4. **Valideringsportar** er kritiske for kvalitet
