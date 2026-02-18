---
layout: docs
title: "Kom i gang"
display_title: "Kom i gang"
permalink: /nb/docs/getting-started/
lang: nb
ref: docs-getting-started
redirect_from:
  - /docs/getting-started/
nav_order: 3
---

> **ARIELLE-fokus:** Denne delen er hands-on **P**rompts og **S**kills — bygg dine første primitiver.

Nå som du forstår [ARIELLE-spesifikasjonen](../arielle/), er det tid for å bygge ditt AI Native Development-miljø. Denne praktiske implementeringen gir deg umiddelbare produktivitetsforbedringer og etablerer fundamentet for mer avanserte arbeidsflyter.

Oppsettet følger en logisk progresjon: start med å installere Skills som gir umiddelbare kapabiliteter, legg deretter til lokale instrukser for prosjektspecifikke føringer, konfigurer tilpassede agenter for trygge grenser, bygg gjenbrukbare prompts for vanlige oppgaver, og lag spesifikasjonsmaler som bygger bro mellom planlegging og implementering.

## Start med Skills

Før du lager egne primitiver, utnytt **[Agent Skills](https://agentskills.io)**-økosystemet. Skills er ferdigpakkede kapabiliteter som agenter auto-oppdager og henter inn basert på oppgaverelevans — det gir umiddelbar produktivitet uten konfigurasjon.

**✅ Hurtighandlinger:**
- Installer [APM (Agent Package Manager)](https://github.com/microsoft/apm) hvis du ikke har gjort det. Les mer under [Verktøy](../tooling/).
- Bla i [community Skills](https://github.com/github/awesome-copilot/tree/main/skills) for din teknologistakk
- Installer relevante Skills: `apm install awesome-copilot/skill/<skill-name>`

> 💡 **Progressiv kontekst-distribusjon**: Når de er installert, trenger du ikke å kalle på Skills eksplisitt. Agenter skanner tilgjengelige Skills automatisk og laster bare det som er relevant for oppgaven — mindre kontekstforurensing og høyere svarkvalitet.

**⚠️ Sjekkpunkt:** Skills installert og kompilert — agenter har nå tilgang til pakkede kapabiliteter

---

Med Skills som baseline vil du legge til prosjektspecifikke føringer som ikke hører hjemme i en distribuert Skill. Her kommer lokale primitiver inn.

## Instruksjonsarkitektur {#a-instructions-architecture}

Instrukser er grunnfjellet for pålitelig AI-atferd: de er de vedvarende reglene som styrer agenten uten å tette den umiddelbare konteksten. I stedet for å gjenta samme veiledning i hver samtale, bygger instrukser teamets kunnskap direkte inn i AI-ens resonnering.

Nøkkelinnsikten er modularitet: i stedet for én massiv instruksjonsfil som gjelder overalt, lager du målrettede filer som aktiveres bare når du jobber med bestemte teknologier eller filtyper. Denne kontekstingeniør-tilnærmingen holder AI-en fokusert og veiledningen relevant.

**✅ Hurtighandlinger:**
- Opprett den generelle [`copilot-instructions.md`](https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilot-instructionsmd-file)-filen i `.github`-mappen med felles regler
- Opprett modulære [`.instructions.md`-filer](https://code.visualstudio.com/docs/copilot/copilot-customization#_use-instructionsmd-files) i `.github/instructions/`-mappen etter domene (frontend, backend, testing, docs, specs...)
- Bruk [`applyTo: "**/*.{js,ts...}"`](https://code.visualstudio.com/docs/copilot/copilot-customization#_instructions-file-structure)-mønstre for selektiv bruk
- Kompiler til [AGENTS.md-standarden](https://agents.md) så konteksten fungerer på tvers av alle kodingsagenter. Se [Verktøy](../tooling/) for **kontekstkompilering**

> 💡 **Kontekstengineering i praksis**: Modulære instrukser bevarer kontekstrom ved å laste bare relevante retningslinjer når du jobber med bestemte filtyper, og etterlater maksimal buffer for kodeforståelse.

### 🔧 Verktøy og filer:
```
.github/
├── copilot-instructions.md          # Globale repo-regler
└── instructions/
    ├── frontend.instructions.md     # applyTo: "**/*.{jsx,tsx,css}"
    ├── backend.instructions.md      # applyTo: "**/*.{py,go,java}"
    └── testing.instructions.md      # applyTo: "**/test/**"

# Etter kontekstkompilering:
# Nestede AGENTS.md-filer autogenereres på optimale lokasjoner
```

### Eksempel: Markdown Prompt Engineering i instrukser
Lag `.github/instructions/frontend.instructions.md`-filen:

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

**⚠️ Sjekkpunkt:** Instrukser er modulære, målrettede og klare til kompilering

## Konfigurasjon av tilpassede agenter {#b-chat-modes-configuration}

Med instruksjonsarkitekturen på plass trenger du en måte å håndheve domenebegrensninger og forhindre at AI-agenter trår utenfor sin ekspertise. Tilpassede agenter løser dette ved å etablere profesjonelle grenser, slik vi kjenner fra virkelige lisenser — arkitekter planlegger, men bygger ikke; ingeniører utfører, men setter ikke strategi.

**✅ Hurtighandlinger:**
- Definer domenespesifikke [tilpassede agenter](https://code.visualstudio.com/docs/copilot/customization/custom-agents) med MCP-verktøygrenser
- Kapsle inn kunnskap og retningslinjer per modus
- Velg mest passende [LLM-modell](https://code.visualstudio.com/docs/copilot/customization/custom-agents#_custom-agent-example) for modusen, f.eks. `Claude Sonnet 4`
- Konfigurer sikker [MCP-verktøytilgang](https://code.visualstudio.com/docs/copilot/customization/custom-agents#_custom-agent-example) for å hindre sikkerhetsbrudd på tvers av domener

> 💡 **Sikkerhet gjennom MCP-verktøygrenser**: Hver chat-modus får bare MCP-verktøyene den trenger for sitt domene — dette hindrer farlig tilgangseskalering og krysskontaminasjon. Som profesjonell lisensiering kan en planleggingsmodus ikke kjøre destruktive kommandoer, og en frontend-modus kan ikke aksessere backend-databaser.

### 🔧 Verktøy og filer:
```
.github/
└── chatmodes/
    ├── architect.chatmode.md             # Planleggingsspesialist - designer, kan ikke utføre
    ├── frontend-engineer.chatmode.md     # UI-spesialist - bygger grensesnitt, ingen backend-tilgang
    ├── backend-engineer.chatmode.md      # API-spesialist - bygger tjenester, ingen UI-endringer
    └── technical-writer.chatmode.md      # Dokumentasjonsspesialist - skriver docs, kan ikke kjøre kode
```

### Eksempel: MCP-verktøygrense-implementering
Lag `.github/chatmodes/backend-engineer.chatmode.md`-filen:

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

### Sikkerhet og profesjonelle grenser:
- **Arkitektmodus**: Kun research-verktøy - **kan ikke kjøre destruktive kommandoer eller endre produksjonskode**
- **Frontend Engineer-modus**: Kun UI-verktøy - **kan ikke aksessere databaser eller backend-tjenester** 
- **Backend Engineer-modus**: Kun API- og databaseverktøy - **kan ikke endre brukergrensesnitt eller frontend-ressurser**
- **Technical Writer-modus**: Kun dokumentasjonsverktøy - **kan ikke kjøre kode, deploye eller aksessere sensitive systemer**

*Som profesjonelle lisenser opererer hver modus innenfor sitt kompetanseområde og kan ikke trå inn i farlige områder.*

**⚠️ Sjekkpunkt:** Hver modus har klare grenser og verktøyrestriksjoner

## Agentiske arbeidsflyter {#c-agentic-workflows}

Tilpassede agenter skaper sikkerhetsgrensene, men du trenger fortsatt effektive måter å gjennomføre komplette utviklingsprosesser. **Agentiske arbeidsflyter** implementeres som gjenbrukbare `.prompt.md`-filer som orkestrerer alle primitivene dine til systematiske, ende-til-ende prosesser.

**✅ Hurtighandlinger:**
- Opprett [`.prompt.md`-filer](https://code.visualstudio.com/docs/copilot/customization/prompt-files) for komplette utviklingsprosesser
- Bygg inn obligatoriske menneskelige valideringspunkter
- Design arbeidsflyter for både lokal kjøring og asynkron delegering

> 💡 **Agentiske arbeidsflyter**: Disse `.prompt.md`-filene er fullstendige, systematiske prosesser som kombinerer alle primitiver (instrukser, moduser, spesifikasjoner, kontekst) til repeterbare arbeidsflyter som kan kjøres lokalt eller delegeres til asynkrone agenter.

### 🔧 Verktøy og filer:
```
.github/prompts/
├── code-review.prompt.md           # Med valideringssjekkpunkter
├── feature-spec.prompt.md          # Spec-first-metodikk
└── async-implementation.prompt.md  # GitHub Coding Agent-delegering
```

### Eksempel: Komplett agentisk arbeidsflyt
Lag `.github/prompts/feature-spec.prompt.md`-filen:

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

**⚠️ Sjekkpunkt:** Prompts inneholder eksplisitte valideringsporter

## Spesifikasjonsmaler {#d-specification-templates}

Den siste brikken i fundamentet ditt adresserer gapet mellom planlegging og implementering. Spesifikasjonsmaler forvandler idéer på høyt nivå til implementeringsklare blåkopier som fungerer konsistent enten de utføres av mennesker eller AI-agenter.

Disse `.spec.md`-malene er grunnlaget for **spec-drevne teamarbeidsflyter**. Når du skalerer til team (se [Team & Enterprise Scale](../team-adoption/)), bruker produkteiere disse malene i sprintplanlegging for å lage eksplisitte, agent-kjørbare spesifikasjoner. [Spec-Kit](https://github.com/github/spec-kit) tilbyr `/speckit.specify`-kommandoer som genererer disse filene etter mønsteret constitution → specify → plan → tasks → implement, men å forstå den underliggende malstrukturen gir deg fleksibilitet til å tilpasse til teamets behov.

**✅ Hurtighandlinger:**
- Lag standardiserte [`.spec.md`-maler](https://docs.github.com/en/copilot/copilot-chat/copilot-chat-cookbook) for funksjonsspesifikasjoner
- Bygg implementeringsklare blåkopier med valideringskriterier
- Design for deterministisk overlevering mellom planleggings- og utførelsesfaser

> 💡 **Bro-primitiv**: Spesifikasjonsfiler transformerer planleggingsfasens tenkning til implementeringsklare artefakter som fungerer pålitelig på tvers av ulike utførere (menneske eller AI).

### 🔧 Verktøy og filer:
```
.github/specs/
├── feature-template.spec.md        # Standard mal for funksjonsspesifikasjon
├── api-endpoint.spec.md           # API-spesifikk spesifikasjonsmal
└── component.spec.md              # Spesifikasjonsmal for UI-komponent
```

### Eksempel: Implementeringsklar spesifikasjon

Lag en `.github/specs/jwt-auth.spec.md`-fil:

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

**⚠️ Sjekkpunkt:** Spesifikasjoner er implementeringsklare før delegering

---

## Lag din første Skill {#e-context-organization--discovery}

Når du har utviklet nyttige mønstre — instrukser, prompts eller arbeidsflyter som kan gagne andre prosjekter — er det tid for å pakke dem som en **Skill** for distribusjon og gjenbruk.

Skills har én nøkkelfil:
- **SKILL.md** (obligatorisk): Forteller agentene *hva* Skill-en gjør og *når* den skal brukes

**✅ Hurtighandlinger:**
- Identifiser en gjenbrukbar agentkapabilitet i prosjektet
- Lag en Skill-pakke ved å opprette en mappe med skill-navn under `.github/skills`
- Skriv SKILL.md discovery-filen i mappen
- Test lokalt, og push deretter til GitHub for deling

### Eksempel: SKILL.md for agentoppdagelse

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

**⚠️ Sjekkpunkt:** Mønstrene dine er nå pakket og kan deles med fellesskapet

---

## Hurtigstartsjekkliste {#quick-start-checklist}

Med Skills og primitiver på plass har du nå et komplett fundament for systematisk AI-utvikling. Sjekklisten under guider deg gjennom implementeringsrekkefølgen.

### Konseptuelt grunnlag
1. **[ ]** Forstå prinsippene for **Markdown Prompt Engineering** (semantisk struktur + presisjon + verktøy)
2. **[ ]** Forstå grunnleggende **Context Engineering** (kontekstvinduoptimalisering + øktstrategi)
3. **[ ]** Forstå **Skills vs Primitiver** (Skills distribueres; primitiver er interne eller lokale)

### Skills-oppsett
4. **[ ]** Installer [APM](https://github.com/microsoft/apm) for Skills-håndtering
5. **[ ]** Installer relevante Skills for din teknologistakk: `apm install owner/skill-name`

### Lokale primitiver
6. **[ ]** Lag [`.github/copilot-instructions.md`](https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilot-instructionsmd-file) med prosjektspecifikke retningslinjer
7. **[ ]** Sett opp domenespesifikke [`.instructions.md`-filer](https://code.visualstudio.com/docs/copilot/copilot-customization#_use-instructionsmd-files) med `applyTo`-mønstre
8. **[ ]** Konfigurer [tilpassede agenter](https://code.visualstudio.com/docs/copilot/customization/custom-agents) for domenene i teknologistakken
9. **[ ]** Lag din første [`.prompt.md` Agentic Workflow](https://code.visualstudio.com/docs/copilot/copilot-customization#_prompt-files-experimental)
10. **[ ]** Bygg din første `.spec.md`-mal for funksjonsspesifikasjoner

### Skaler og del
11. **[ ]** Pakk gjenbrukbare mønstre som Skills: `apm init skill`
12. **[ ]** Praktiser spec-first-arbeidsflyt med øktdeling

## Hva nå?

**Fundamentet på plass?** Du har installert Skills og bygget lokale primitiver. Fortsett til [Verktøy](../tooling/) for å forstå infrastrukturen som får dette til å skalere — kontekstkompilering, Skills-komposisjon og pakkestyringen som muliggjør alt videre.

**Vil du forstå disiplinene?** Gå tilbake til [Praksisen](../concepts/) for dypere forståelse av hvordan teknikkene implementerer ARIELLE-begrensningene.

**Klar til å hoppe videre?** Etter Verktøy dekker [Agentdelegasjon](../agent-delegation/) utførelsesstrategier, og [Team & Enterprise Scale](../team-adoption/) viser organisatorisk implementering.

*Du har nå Skills installert, lokale primitiver konfigurert, og forstår hvordan du pakker agentkapabiliteter for gjenbruk. Neste steg er å forstå infrastrukturen som gjør disse primitivene kjørbare, delbare og produksjonsklare.*
