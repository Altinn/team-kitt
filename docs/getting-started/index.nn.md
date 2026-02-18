---
layout: docs
title: "Kom i gang"
display_title: "Kom i gang"
permalink: /nn/docs/getting-started/
lang: nn
ref: docs-getting-started
---

> **ARIELLE-fokus:** Denne delen er hands-on **P**rompts og **S**kills—bygg dine første primitivar.

No som du forstår [ARIELLE-spesifikasjonen](../arielle/), er det tid for å byggje ditt AI Native Development-miljø. Denne praktiske implementeringa gir deg umiddelbare produktivitetsforbetringar og etablerer fundamentet for meir avanserte arbeidsflytar.

Oppsettet følgjer ei logisk progresjon: start med å installere Skills som gir umiddelbare kapabilitetar, legg deretter til lokale instruksar for prosjektspecifikke føringar, konfigurer tilpassa agentar for trygge grenser, bygg gjenbrukbare prompts for vanlege oppgåver, og lag spesifikasjonsmalar som bygg bru mellom planlegging og implementering.

## Start med Skills

Før du lagar eigne primitivar, utnytt **[Agent Skills](https://agentskills.io)**-økosystemet. Skills er ferdigpakkede kapabilitetar som agentar auto-oppdagar og kallar inn basert på oppgåverelevans — det gir umiddelbar produktivitet utan konfigurasjon.

**✅ Hurtighandlingar:**
- Installer [APM (Agent Package Manager)](https://github.com/microsoft/apm) dersom du ikkje har gjort det. Les meir under [Verktøy](../tooling/).
- Bla i [community Skills](https://github.com/github/awesome-copilot/tree/main/skills) for din teknologistakk
- Installer relevante Skills: `apm install awesome-copilot/skill/<skill-name>`

> 💡 **Progressiv kontekst-distribusjon**: Når dei er installerte, treng du ikkje å kalle på Skills eksplisitt. Agentar skannar tilgjengelege Skills automatisk og lastar berre det som er relevant for oppgåva — mindre kontekstforureining og høgare svarkvalitet.

**⚠️ Sjekkpunkt:** Skills installerte og kompilert — agentar har no tilgang til pakkede kapabilitetar

---

Med Skills som basis vil du leggje til prosjektspecifikke føringar som ikkje høyrer heime i ein distribuert Skill. Her kjem lokale primitivar inn.

## Instruksjonsarkitektur {#a-instructions-architecture}

Instruksar er grunnfjellet for påliteleg AI-åtferd: dei er dei vedvarande reglane som styrer agenten utan å tette den umiddelbare konteksten. I staden for å gjenta same rettleiing i kvar samtale, bygg instruksar teamet sin kunnskap direkte inn i AI-en sin resonnering.

Nøkkelinnsikta er modularitet: i staden for éi massiv instruksjonsfil som gjeld overalt, lagar du målretta filer som blir aktive berre når du jobbar med bestemte teknologiar eller filtypar. Denne kontekstingeniør-tilnærminga held AI-en fokusert og rettleiinga relevant.

**✅ Hurtighandlingar:**
- Opprett den generelle [`copilot-instructions.md`](https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilot-instructionsmd-file)-fila i `.github`-mappa med felles reglar
- Opprett modulære [`.instructions.md`-filer](https://code.visualstudio.com/docs/copilot/copilot-customization#_use-instructionsmd-files) i `.github/instructions/`-mappa etter domene (frontend, backend, testing, docs, specs...)
- Bruk [`applyTo: "**/*.{js,ts...}"`](https://code.visualstudio.com/docs/copilot/copilot-customization#_instructions-file-structure)-mønster for selektiv bruk
- Kompiler til [AGENTS.md-standarden](https://agents.md) så konteksten fungerer på tvers av alle kodingsagentar. Sjå [Verktøy](../tooling/) for **kontekstkompilering**

> 💡 **Kontekstengineering i praksis**: Modulære instruksar bevarer kontekstrom ved å laste berre relevante retningslinjer når du jobbar med bestemte filtypar, og let maksimal buffer vere att for kodeforståing.

### 🔧 Verktøy og filer:
```
.github/
├── copilot-instructions.md          # Globale repo-reglar
└── instructions/
    ├── frontend.instructions.md     # applyTo: "**/*.{jsx,tsx,css}"
    ├── backend.instructions.md      # applyTo: "**/*.{py,go,java}"
    └── testing.instructions.md      # applyTo: "**/test/**"

# Etter kontekstkompilering:
# Nestede AGENTS.md-filer autogenererast på optimale lokasjonar
```

### Døme: Markdown Prompt Engineering i instruksar
Lag `.github/instructions/frontend.instructions.md`-fila:

```markdown
---
applyTo: "**/*.{ts,tsx}"
description: "TypeScript development guidelines with context engineering"
---
# TypeScript Development Guidelines

## Context Loading
Review [project conventions](../docs/conventions.md) and 
[type definitions](../types/index.ts) before starting.

## Deterministic Requirements
- Use strict TypeScript configuration
- Implement error boundaries for React components
- Apply ESLint TypeScript rules consistently

## Structured Output
Generate code with:
- [ ] JSDoc comments for all public APIs
- [ ] Unit tests in `__tests__/` directory
- [ ] Type exports in appropriate index files
```

**⚠️ Sjekkpunkt:** Instruksar er modulære, målretta og klare til kompilering

## Konfigurasjon av tilpassa agentar {#b-chat-modes-configuration}

Med instruksjonsarkitekturen på plass treng du ein måte å handheve domenebegrensingar og hindre at AI-agentar går utanfor sin ekspertise. Tilpassa agentar løyser dette ved å etablere profesjonelle grenser, slik vi kjenner frå verkelege lisensar — arkitektar planlegg, men bygg ikkje; ingeniørar utfører, men set ikkje strategi.

**✅ Hurtighandlingar:**
- Definer domenespesifikke [tilpassa agentar](https://code.visualstudio.com/docs/copilot/customization/custom-agents) med MCP-verktøygrenser
- Kapsle inn kunnskap og retningslinjer per modus
- Vel mest passende [LLM-modell](https://code.visualstudio.com/docs/copilot/customization/custom-agents#_custom-agent-example) for modusen, t.d. `Claude Sonnet 4`
- Konfigurer trygg [MCP-verktøytilgang](https://code.visualstudio.com/docs/copilot/customization/custom-agents#_custom-agent-example) for å hindre tryggleiksbrot på tvers av domene

> 💡 **Tryggleik gjennom MCP-verktøygrenser**: Kvar chat-modus får berre MCP-verktøya den treng for sitt domene — dette hindrar farleg tilgangseskalering og krysskontaminasjon. Som profesjonell lisensiering kan ein planleggingsmodus ikkje køyre destruktive kommandoar, og ein frontend-modus kan ikkje aksessere backend-databasar.

### 🔧 Verktøy og filer:
```
.github/
└── chatmodes/
    ├── architect.chatmode.md             # Planleggingsspesialist - designar, kan ikkje utføre
    ├── frontend-engineer.chatmode.md     # UI-spesialist - byggjer grensesnitt, inga backend-tilgang
    ├── backend-engineer.chatmode.md      # API-spesialist - byggjer tenester, ingen UI-endringar
    └── technical-writer.chatmode.md      # Dokumentasjonsspesialist - skriv docs, kan ikkje køyre kode
```

### Døme: MCP-verktøygrense-implementering
Lag `.github/chatmodes/backend-engineer.chatmode.md`-fila:

```yaml
---
description: 'Backend development specialist with security focus'
tools: ['changes', 'codebase', 'editFiles', 'runCommands', 'runTasks', 
        'search', 'problems', 'testFailure', 'terminalLastCommand']
model: Claude Sonnet 4
---

You are a backend development specialist focused on secure API development, database design, and server-side architecture. You prioritize security-first design patterns and comprehensive testing strategies.

## Domain Expertise
- RESTful API design and implementation
- Database schema design and optimization  
- Authentication and authorization systems
- Server security and performance optimization

You master the backend of this project thanks to you having read all [the backend docs](../../docs/backend).

## Tool Boundaries
- **CAN**: Modify backend code, run server commands, execute tests
- **CANNOT**: Modify client-side assets
```

### Tryggleik og profesjonelle grenser:
- **Arkitektmodus**: Berre research-verktøy - **kan ikkje køyre destruktive kommandoar eller endre produksjonskode**
- **Frontend Engineer-modus**: Berre UI-verktøy - **kan ikkje aksessere databasar eller backend-tenester** 
- **Backend Engineer-modus**: Berre API- og databaseverktøy - **kan ikkje endre brukargrensesnitt eller frontend-ressursar**
- **Technical Writer-modus**: Berre dokumentasjonsverktøy - **kan ikkje køyre kode, deploye eller aksessere sensitive system**

*Som profesjonelle lisensar opererer kvar modus innanfor sitt kompetanseområde og kan ikkje gå inn i farlege område.*

**⚠️ Sjekkpunkt:** Kvar modus har klare grenser og verktøyrestriksjonar

## Agentiske arbeidsflytar {#c-agentic-workflows}

Tilpassa agentar skaper tryggleiksgrensene, men du treng framleis effektive måtar å gjennomføre komplette utviklingsprosessar. **Agentiske arbeidsflytar** blir implementerte som gjenbrukbare `.prompt.md`-filer som orkestrerer alle primitivane dine til systematiske, ende-til-ende-prosessar.

**✅ Hurtighandlingar:**
- Opprett [`.prompt.md`-filer](https://code.visualstudio.com/docs/copilot/customization/prompt-files) for komplette utviklingsprosessar
- Bygg inn obligatoriske menneskelege valideringspunkt
- Design arbeidsflytar for både lokal køyring og asynkron delegering

> 💡 **Agentiske arbeidsflytar**: Desse `.prompt.md`-filene er fullstendige, systematiske prosessar som kombinerer alle primitivar (instruksar, modusar, spesifikasjonar, kontekst) til repeterbare arbeidsflytar som kan køyrast lokalt eller delegerast til asynkrone agentar.

### 🔧 Verktøy og filer:
```
.github/prompts/
├── code-review.prompt.md           # Med valideringssjekkpunkter
├── feature-spec.prompt.md          # Spec-first-metodikk
└── async-implementation.prompt.md  # GitHub Coding Agent-delegering
```

### Døme: Komplett agentisk arbeidsflyt
Lag `.github/prompts/feature-spec.prompt.md`-fila:

```markdown
---
mode: agent
model: gpt-4
tools: ['file-search', 'semantic-search', 'github']
description: 'Feature implementation workflow with validation gates'
---
# Feature Implementation from Specification

## Context Loading Phase
1. Review [project specification](${specFile})
2. Analyze [existing codebase patterns](./src/patterns/)
3. Check [API documentation](./docs/api.md)

## Deterministic Execution
Use semantic search to find similar implementations
Use file search to locate test patterns: `**/*.test.{js,ts}`

## Structured Output Requirements
Create implementation with:
- [ ] Feature code in appropriate module
- [ ] Comprehensive unit tests (>90% coverage)
- [ ] Integration tests for API endpoints
- [ ] Documentation updates

## Human Validation Gate
🚨 **STOP**: Review implementation plan before proceeding to code generation.
Confirm: Architecture alignment, test strategy, and breaking change impact.
```

**⚠️ Sjekkpunkt:** Prompts inneheld eksplisitte valideringsportar

## Spesifikasjonsmalar {#d-specification-templates}

Den siste brikka i fundamentet ditt adresserer gapet mellom planlegging og implementering. Spesifikasjonsmalar forvandlar idéar på høgt nivå til implementeringsklare blåkopiar som fungerer konsistent anten dei blir utførte av menneske eller AI-agentar.

Desse `.spec.md`-malane er grunnlaget for **spec-drivne teamarbeidsflytar**. Når du skalerer til team (sjå [Team & Enterprise Scale](../team-adoption/)), bruker produkteigarar desse malane i sprintplanlegging for å lage eksplisitte, agent-køyrbare spesifikasjonar. [Spec-Kit](https://github.com/github/spec-kit) tilbyr `/speckit.specify`-kommandoar som genererer desse filene etter mønsteret constitution → specify → plan → tasks → implement, men å forstå den underliggjande malstrukturen gir deg fleksibilitet til å tilpasse til teamet sine behov.

**✅ Hurtighandlingar:**
- Lag standardiserte [`.spec.md`-malar](https://docs.github.com/en/copilot/copilot-chat/copilot-chat-cookbook) for funksjonsspesifikasjonar
- Bygg implementeringsklare blåkopiar med valideringskriterium
- Design for deterministisk overlevering mellom planleggings- og utføringsfasar

> 💡 **Bru-primitiv**: Spesifikasjonsfiler transformerer planleggingsfasen sin tenking til implementeringsklare artefaktar som fungerer påliteleg på tvers av ulike utførarar (menneske eller AI).

### 🔧 Verktøy og filer:
```
.github/specs/
├── feature-template.spec.md        # Standard mal for funksjonsspesifikasjon
├── api-endpoint.spec.md           # API-spesifikk spesifikasjonsmal
└── component.spec.md              # Spesifikasjonsmal for UI-komponent
```

### Døme: Implementeringsklar spesifikasjon

Lag ei `.github/specs/jwt-auth.spec.md`-fil:

```markdown
# Feature: User Authentication System

## Problem Statement
Users need secure access to the application with JWT-based authentication.

## Approach
Implement middleware-based authentication with token validation and refresh capabilities.

## Implementation Requirements
### Core Components
- [ ] JWT middleware (`src/middleware/auth.ts`)
- [ ] Token service (`src/services/token.ts`)
- [ ] User validation (`src/services/user.ts`)

### API Contracts
- `POST /auth/login` - Returns JWT token
- `POST /auth/refresh` - Refreshes expired token
- `GET /auth/verify` - Validates current token

### Validation Criteria
- [ ] Handles malformed tokens with 401 status
- [ ] Token expiration properly managed
- [ ] Refresh token rotation implemented
- [ ] Unit tests >90% coverage
- [ ] Integration tests for all endpoints

## Handoff Checklist
- [ ] Architecture approved by team lead
- [ ] Database schema finalized
- [ ] Security review completed
- [ ] Implementation ready for assignment
```

**⚠️ Sjekkpunkt:** Spesifikasjonar er implementeringsklare før delegering

---

## Lag din første Skill {#e-context-organization--discovery}

Når du har utvikla nyttige mønster — instruksar, prompts eller arbeidsflytar som kan gagne andre prosjekt — er det tid for å pakke dei som ein **Skill** for distribusjon og gjenbruk.

Skills har éi nøkkelfil:
- **SKILL.md** (obligatorisk): Fortel agentane *kva* Skill-en gjer og *når* han skal brukast

**✅ Hurtighandlingar:**
- Identifiser ein gjenbrukbar agentkapabilitet i prosjektet
- Lag ein Skill-pakke ved å opprette ei mappe med skill-namn under `.github/skills`
- Skriv SKILL.md discovery-fila i mappa
- Test lokalt, og push deretter til GitHub for deling

### Døme: SKILL.md for agentoppdaging

```markdown
---
name: form-builder
description: Build accessible forms with React Hook Form + Zod. Activate when user asks to create any form with thesse frameworks.
---
# Form Builder

Build accessible, type-safe forms in React.

## Stack

- **React Hook Form** — form state, minimal re-renders
- **Zod** — schema validation
- **@hookform/resolvers** — connects them

## Examples

- [Contact form](examples/contact-form.tsx) — full implementation
- [Newsletter signup](examples/newsletter-signup.tsx) — minimal implementation

## Install

npm install react-hook-form @hookform/resolvers zod
```

**⚠️ Sjekkpunkt:** Mønstra dine er no pakka og kan delast med fellesskapet

---

## Hurtigstartsjekkliste {#quick-start-checklist}

Med Skills og primitivar på plass har du no eit komplett fundament for systematisk AI-utvikling. Sjekklista under guidar deg gjennom implementeringsrekkjefølgja.

### Konseptuelt grunnlag
1. **[ ]** Forstå prinsippa for **Markdown Prompt Engineering** (semantisk struktur + presisjon + verktøy)
2. **[ ]** Forstå grunnleggjande **Context Engineering** (kontekstvindaugeoptimalisering + øktstrategi)
3. **[ ]** Forstå **Skills vs Primitivar** (Skills blir distribuerte; primitivar er interne eller lokale)

### Skills-oppsett
4. **[ ]** Installer [APM](https://github.com/microsoft/apm) for Skills-handtering
5. **[ ]** Installer relevante Skills for din teknologistakk: `apm install owner/skill-name`

### Lokale primitivar
6. **[ ]** Lag [`.github/copilot-instructions.md`](https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilot-instructionsmd-file) med prosjektspecifikke retningslinjer
7. **[ ]** Sett opp domenespesifikke [`.instructions.md`-filer](https://code.visualstudio.com/docs/copilot/copilot-customization#_use-instructionsmd-files) med `applyTo`-mønster
8. **[ ]** Konfigurer [tilpassa agentar](https://code.visualstudio.com/docs/copilot/customization/custom-agents) for domena i teknologistakken
9. **[ ]** Lag din første [`.prompt.md` Agentic Workflow](https://code.visualstudio.com/docs/copilot/copilot-customization#_prompt-files-experimental)
10. **[ ]** Bygg di første `.spec.md`-mal for funksjonsspesifikasjonar

### Skaler og del
11. **[ ]** Pakk gjenbrukbare mønster som Skills: `apm init skill`
12. **[ ]** Praktiser spec-first-arbeidsflyt med øktdeling

## Kva no?

**Fundamentet på plass?** Du har installert Skills og bygd lokale primitivar. Gå vidare til [Verktøy](../tooling/) for å forstå infrastrukturen som får dette til å skalere — kontekstkompilering, Skills-komposisjon og pakkestyringa som gjer alt vidare mogleg.

**Vil du forstå disiplinane?** Gå tilbake til [Praksisen](../concepts/) for djupare forståing av korleis teknikkane implementerer ARIELLE-avgrensingane.

**Klar til å hoppe vidare?** Etter Verktøy dekkjer [Agentdelegasjon](../agent-delegation/) utføringsstrategiar, og [Team & Enterprise Scale](../team-adoption/) viser organisatorisk implementering.

*Du har no Skills installerte, lokale primitivar konfigurerte, og forstår korleis du pakkar agentkapabilitetar for gjenbruk. Neste steg er å forstå infrastrukturen som gjer desse primitivane køyrbare, delbare og produksjonsklare.*
