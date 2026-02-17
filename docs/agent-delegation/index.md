---
layout: docs
title: "Agent-delegering"
display_title: "Agent-delegering"
permalink: /docs/agent-delegation/
nav_order: 5
---

> **ARIELLE-fokus:** Mestre **O**rchestrering—koordinere agenter og delegere arbeid.

Når dine **Agentic Workflows** er bygget og klare, står du overfor et viktig valg: hvordan utføre dem. Enten workflowene kommer fra installerte Skills eller lokale `.prompt.md`-filer, vil utførelsessstrategiene du velger—fra lokal kontroll til avansert asynkron orchestrering—i grunnleggende grad forme både utviklingshastigheten og læringsutbyttet.

Denne guiden dekker hele spekteret av utførelsestilnærminger, fra å beholde tett kontroll i din lokale IDE til å delegere komplekse workflows til flere asynkrone agenter som jobber parallelt. Hver strategi har optimale bruksområder, og å mestre beslutningsrammeverket sikrer at du velger riktig tilnærming for hver situasjon.

## Oversikt over utførelsessstrategi

**Agentic Workflows** kan utføres gjennom tre hovedstrategier, som hver tilbyr ulik balanse mellom kontroll, hastighet og læring:

1. **Lokal IDE-utføring** – Direkte workflow-utføring i utviklingsmiljøet ditt for maksimal kontroll og læring
2. **Asynkron agent-delegering** – Gi hele workflows videre til GitHub Coding Agents for parallell produktivitet
3. **Hybrid orchestrering** – Strategisk kombinasjon av lokal kontroll og asynkron delegering med bevaring av kontekst

Det sentrale er at **den samme Agentic Workflow** kan utføres gjennom ulike strategier basert på dine behov, workflow-modenhet og toleranse for agent-avvik.

## Eksempel på utføring av Agentic Workflow {#agentic-workflow-execution-example}

For å demonstrere utførelsessstrategiene bruker vi en fullstendig **Agentic Workflow** for implementering av OAuth-autentisering. Denne workflowen orkestrerer alle dine Agent Primitives til en systematisk prosess som kan utføres gjennom noen av strategiene nedenfor.

**Eksempel-workflow:** `implement-oauth-feature.prompt.md`

### Workflow-komponenter i praksis:
1. **Mode Activation** → Utløser `backend-dev.chatmode.md` med sikkerhetsfokuserte MCP-verktøygrenser  
2. **Context Loading** → Laster `[auth patterns](./auth.memory.md)` og `[security standards](./security.context.md)`
3. **Specification Generation** → Bruker `oauth-feature.spec.md`-mal med valideringskriterier
4. **Implementation Execution** → Styrt av `security.instructions.md` brukt via `applyTo: "auth/**"`-mønster
5. **Learning Integration** → Oppdaterer `.memory.md` med vellykkede mønstre og oppdagede edge cases

**Nøkkelinnsikt:** Denne samme workflowen gir konsistente resultater enten den utføres lokalt for læring eller delegert asynkront for hastighet. Utførelsessstrategien blir en egen beslutning fra workflow-designet.

La oss nå se på hvordan du velger og utfører den optimale strategien for din situasjon.

## A. Valg av utførelsessstrategi {#a-execution-strategy-selection}

Når du har bygget din Agentic Workflow, må du bestemme hvordan den skal utføres. Valget mellom lokal kontroll og asynkron delegering former i grunnleggende grad både utviklingshastigheten og læringsutbyttet.

**✅ Hurtighandlinger:**
- **Lokal IDE-utføring:** Behold maksimal kontroll over implementeringsprosessen for læring og komplekse oppgaver
- **Asynkron agent-delegering:** Maksimer produktivitet for godt spesifiserte oppgaver med lav avviksrisiko med [GitHub Coding Agent](https://docs.github.com/en/copilot/how-tos/agents/copilot-coding-agent)
- **Hybrid orchestrering:** Kombiner lokal kontroll med asynkron delegering samtidig som kontekst og tilsyn bevares

> 💡 **Kontroll vs. produktivitet:** Velg utførelsesspor basert på behov for kontroll, workflow-modenhet og toleranse for agent-avvik. Mer kontroll = lokal utføring. Høyere produktivitet = asynkron delegering.

### 🔧 Strategisk beslutningsmatrise:
```
Kontrollpreferanse → Anbefalt strategi:
├── Høy kontroll nødvendig → Lokal IDE-utføring (Lær, iterer, guid)
├── Produktivitet i fokus → Asynkron agent-delegering (Deleger og overvåk)  
└── Balansert tilnærming → Hybrid orchestrering (Deleger med aktiv tilsyn)
```

### Hurtig beslutningsguide: Velg din utførelsessstrategi

| Situasjon | Lokal IDE | Asynkron delegering | Hybrid orchestrering |
|-----------|:---------:|:-------------------:|:--------------------:|
| **Første gang med denne workflowen** | ✅ | ❌ | ✅ |
| **Velfastlagt workflow** | ❌ | ✅ | ❌ |
| **Høyrisiko-/kritisk funksjon** | ✅ | ❌ | ✅ |
| **Trenger hastighet/parallelt arbeid** | ❌ | ✅ | ✅ |
| **Vil lære og forstå** | ✅ | ❌ | ✅ |
| **Lav toleranse for feil** | ✅ | ❌ | ✅ |

**⚠️ Sjekkpunkt:** Strategivalg er i tråd med kontrollpreferanser og modenhet i dine Agent Primitives

**📊 Suksessmåler:** Optimal balanse mellom produktivitet og kvalitetskontroll

Utførelsessstrategien du velger bestemmer ikke bare utviklingshastigheten, men også hvor mye du lærer av hver implementering og hvor mye tilsyn du beholder gjennom prosessen.

## B. Lokal IDE-utføring {#b-local-ide-execution}

For maksimal kontroll og læring utfører du Agentic Workflows direkte i utviklingsmiljøet ditt. Denne strategien er optimal når du jobber med nye mønstre, komplekse krav eller vil forstå implementeringsprosessen grundig.

**✅ Hurtighandlinger:**
- **Direkte prompt-utføring:** Bruk `/workflow-name` i VSCode-chat for å kjøre `.prompt.md`-filene dine
- **Stegvis kontroll:** Gå manuelt gjennom hver workflow-fase med full oversikt
- **Sanntidslæring:** Observer og guid AI-en gjennom komplekse beslutningspunkter

> 💡 **Læringsoptimalisering:** Lokal utføring bevarer maksimal kontekst for å forstå både vellykkede mønstre og feilmoduser, noe som gjør den ideell for å bygge ekspertise og finpasse workflows.

### 🔧 Implementeringsmønster:
```markdown
## Local IDE Agentic Workflow Execution

1. **Workflow Selection** → Choose the `<workflow-name>.prompt.md` workflow file to execute
2. **Context Preparation** → Ensure relevant files and specifications are ready
3. **Execution Control** → Use `/workflow-name` in VSCode chat to trigger the workflow
4. **Interactive Guidance** → Provide input at validation gates and decision points
5. **Learning Capture** → Document insights and refine workflow based on outcomes
```

### Eksempel: Lokal OAuth-implementering
Med `implement-oauth-feature.prompt.md`-workflow:

```markdown
Developer in VSCode Chat:
> /implement-oauth-feature ./specs/oauth-integration.spec.md

AI Response:
> Loading workflow: implement-oauth-feature.prompt.md
> 
> ## Context Loading Phase ✅
> - Loaded specification: oauth-integration.spec.md
> - Reviewed auth patterns: 3 previous implementations found
> - Security standards: OAuth 2.0 + JWT validation requirements loaded
> 
> ## Human Validation Gate 🚨
> Architecture review required before proceeding:
> 
> **Proposed Implementation:**
> 1. OAuth middleware with PKCE flow
> 2. JWT service with refresh token rotation  
> 3. User sync service with conflict resolution
> 
> **Security considerations:**
> - CSRF protection via state parameter
> - Token storage in httpOnly cookies
> - Rate limiting on auth endpoints
> 
> Approve this architecture? [Yes/No/Modify]

Developer:
> Yes, but add rate limiting to 5 attempts per minute

AI Response:
> ✅ Architecture approved with rate limiting enhancement
> 
> Proceeding with implementation...
> [Generated secure OAuth implementation with enhanced rate limiting]
> 
> ## Learning Integration Phase
> 🎯 New pattern discovered: Enhanced rate limiting for auth endpoints
> 
> Should I update security.instructions.md with this pattern? [Yes/No]
```

**Fordeler med lokal utføring:**
- **Full kontroll:** Guid hver beslutning og valider hvert steg
- **Dyp læring:** Forstå resonnementet bak implementeringsvalg  
- **Umiddelbar finpussing:** Juster workflows i sanntid basert på resultater
- **Kontekstbevaring:** Behold full utviklingskontekst gjennom hele prosessen

**⚠️ Sjekkpunkt:** Lokal utføring maksimerer læring og kontroll på bekostning av hastighet

**📊 Suksessmåler:** Implementeringer av høy kvalitet med god forståelse og workflow-finpussing

## C. Asynkron agent-delegering {#c-async-agent-delegation}

Når hastighet og parallell produktivitet er prioritet, kan du delegere hele Agentic Workflows til GitHub Coding Agents. Denne strategien fungerer best med modne workflows, tydelige spesifikasjoner og etablerte mønstre der implementeringsveien er godt forstått.

Dine Agentic Workflows kan utføres gjennom ulike asynkrone delegeringsmønstre, fra single-agent-utføring til avansert parallell orchestrering.

### C.1. Single Agent Delegation
**✅ Hurtighandlinger:**
- **VSCode Native:** Bruk [`#copilotCodingAgent`](https://github.blog/changelog/2025-07-14-start-and-track-github-copilot-coding-agent-sessions-from-visual-studio-code/) i Ask-chatmodus for direkte delegering. Du trenger [GitHub Pull Requests VSCode-utvidelsen](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github) installert.
- **GitHub MCP Server:** Bruk `create_issue` og `assign_copilot_to_issue` fra [GitHub MCP Server-verktøyene](https://github.com/github/github-mcp-server?tab=readme-ov-file#tools) fra enhver MCP-vertapplikasjon
- **GitHub Web/Mobil:** Direkte oppgavetildeling via [Agents control plane](https://github.com/copilot/agents)

**🔧 Implementeringsmønster:**
```markdown
## Single Agent Workflow Delegation

1. **Spec Approval** → Validate `.spec.md` with human reviewer
2. **Entry Point Selection**:
   - VSCode: "#copilotCodingAgent implement the OAuth feature per specification"
   - MCP: Use `create_issue` and `assign_copilot_to_issue` tool with spec reference
   - GitHub: the human needs to create task via Agents page with spec attachment
3. **Handoff Confirmation** → Confirm with user and proceed
```

### C.2. Parallel Multi-Agent Delegation (Spec-to-Issues Pattern)
**✅ Hurtighandlinger:**
- **Spec Decomposition:** Del komplekse spesifikasjoner i ikke-overlappende komponentissues
- **Issue Generation:** Bruk GitHub MCP Server `create_issue`-verktøy for systematisk opprettelse av issues
- **Parallel Assignment:** Delegér flere issues til separate GitHub Coding Agents samtidig med `assign_copilot_to_issue` GitHub MCP-verktøy

> 💡 **Parallell orchestrering:** Store spesifikasjoner kan dekomponeres til uavhengige, parallelle arbeidsstrømmer samtidig som arkitekturkoherens bevares gjennom delte kontekstreferanser.

**🔧 Implementeringsmønster:**
```markdown
## Agentic Workflow: Spec-to-Multiple-Issues Delegation

### Phase 1: Specification Decomposition
1. **Component Analysis** → Identify independent, non-overlapping components
2. **Dependency Mapping** → Define integration points and sequence constraints
3. **Context Distribution** → Ensure each component references shared architecture decisions
4. **Implementation dependencies** → Ensure issues have an implementation order based on mutual dependencies by creating sub-issue hierarchies

### Phase 2: Parallel Issue Generation
Use GitHub MCP Server tools:
- `create_issue(title: "OAuth Middleware Component", body: spec_section_1)`
- `create_issue(title: "Token Service Component", body: spec_section_2)`  
- `create_issue(title: "User Sync Service Component", body: spec_section_3)`

### Phase 3: Parallel Agent Assignment
- `assign_copilot_to_issue(issue_1)` → Agent A works on middleware
- `assign_copilot_to_issue(issue_2)` → Agent B works on token service
- `assign_copilot_to_issue(issue_3)` → Agent C works on user sync

### Phase 4: Coordinated Integration
- **Progress Monitoring** → Track all agents via GitHub Agents control plane
- **Integration Testing** → Validate component interactions
- **Conflict Resolution** → Address any overlapping changes
```

### Eksempel: OAuth-system-dekomponering
```markdown
# Parent Spec: OAuth 2.0 Authentication System

## Component Breakdown for Parallel Delegation:

### Issue 1: OAuth Middleware (`oauth-middleware`)
**Scope:** Request interception, provider routing, error handling
**Dependencies:** None (independent component)
**Agent Focus:** Middleware patterns, HTTP handling

### Issue 2: Token Service (`token-service`)  
**Scope:** JWT generation, validation, refresh logic
**Dependencies:** None (independent component)
**Agent Focus:** Cryptographic operations, token lifecycle

### Issue 3: User Profile Sync (`user-sync-service`)
**Scope:** OAuth callback handling, user data synchronization
**Dependencies:** Token Service (for user identification)
**Agent Focus:** Data transformation, persistence patterns

### Integration Context References:
- Architecture patterns: [Auth system design](./auth.memory.md#oauth-architecture)
- API conventions: [REST standards](./api-sec.context.md#api-design)
- Security requirements: [OAuth security checklist](./security.instructions.md#oauth)
```

**⚠️ Sjekkpunkt:** Hver komponent er uavhengig implementerbar med tydelige integrasjonskontrakter
**📊 Suksessmåler:** Parallelle agenter fullfører uten scope-konflikter eller integrasjonsfeil

Asynkron delegering skaper nye utfordringer rundt kvalitetskontroll og læringsintegrasjon. Mens agenter jobber uavhengig, trenger du systematiske tilnærminger for å validere deres output og innlemme deres funn i dine utviklende Agent Primitives.

## D. Fremdriftsmonitorering og asynkron integrasjon {#d-progress-monitoring--async-integration}

Når agentene dine jobber asynkront, blir synlighet og kontroll avgjørende. Denne seksjonen dekker grunnleggende praksis for å opprettholde tilsyn og lære av asynkron agent-utføring. 

### D.1. Multi-Channel Progress Tracking
**✅ Hurtighandlinger:**
- **VSCode-integrasjon:** Overvåk asynkrone oppgaver via GitHub Pull Request-utvidelsen sin «Copilot on My Behalf»-seksjon
- **GitHub Control Plane:** Sentralisert agentstatussporing via Agents-siden

**🔧 Overvåkingsmuligheter:**
```
Progress Visibility Across Channels:
├── VSCode GitHub PR Extension:
│   ├── Real-time agent status indicators
│   ├── Draft PR previews and progress logs
│   └── Direct session viewing capabilities
└── GitHub Agents Page:
    ├── Multi-agent orchestration dashboard  
    ├── Task status across all repositories
    └── Agent performance metrics
```

### D.2. Async Agent Quality Gates
**✅ Hurtighandlinger:**
1. **Draft PR Review:** Systematisk gjennomgang av asynkron agent-output før merge
2. **Integration Testing:** Valider komponentinteraksjoner fra parallelt asynkront arbeid
3. **Context Synchronization:** Oppdater lokal kunnskap med asynkrone agent-funn

> 💡 **Kvalitetskontrollstrategi:** Behandl asynkron agent-output som høykvalitetsutkast som krever menneskelig validering, ikke ferdige implementeringer—og oppretthold kvalitetsstandarder samtidig som du utnytter automasjonshastighet.

**🔧 Kvalitetskontroll-workflow:**
```markdown
## Async Agent Output Integration Process

### Phase 1: Draft PR Analysis
1. **Code Review** → Systematic review of async agent implementation
2. **Architecture Alignment** → Validate adherence to original specification
3. **Security Assessment** → Verify security best practices and patterns
4. **Test Coverage Validation** → Ensure comprehensive test implementation

### Phase 2: Integration Validation  
1. **Component Interface Testing** → Validate contracts between parallel components
2. **End-to-End Testing** → Verify complete feature functionality
3. **Performance Assessment** → Check for performance regressions
4. **Documentation Review** → Ensure adequate documentation coverage

### Phase 3: Knowledge Integration
1. **Memory Updates** → Record successful patterns in `.memory.md` files
2. **Instruction Enhancement** → Improve `.instructions.md` based on discoveries
3. **Template Refinement** → Update `.spec.md` templates with learned patterns
```

### Eksempel: OAuth-integrasjons kvalitetsporter
```markdown
## Async Agent Output Review: OAuth Components

### Component 1: OAuth Middleware (Agent A)
- [x] Code adheres to middleware patterns
- [x] Error handling comprehensive
- [x] Security validations implemented
- [x] Unit tests >90% coverage
- [ ] **Issue**: Missing CSRF protection → Local fix required

### Component 2: Token Service (Agent B)  
- [x] JWT operations secure
- [x] Refresh logic implemented
- [x] Comprehensive error handling
- [x] Integration tests complete
- [x] **Excellent**: Discovered improved token rotation pattern

### Component 3: User Sync Service (Agent C)
- [x] OAuth callback handling robust
- [x] User data transformation secure
- [x] Database operations optimized
- [ ] **Issue**: Race condition in concurrent requests → Local fix required

### Integration Actions:
1. **Local Fixes**: Address CSRF and race condition issues
2. **Knowledge Capture**: Document token rotation improvement in `auth.memory.md`
3. **Process Enhancement**: Add CSRF and concurrency checks to OAuth spec template
```

**⚠️ Sjekkpunkt:** All asynkron output oppfyller kvalitetskrav før integrasjon
**📊 Suksessmåler:** Ingen produksjonsproblemer fra asynkrone agent-implementeringer

## E. Hybrid orchestreringsstrategier {#e-hybrid-orchestration-strategies}

Den mest avanserte tilnærmingen kombinerer lokal kontroll med asynkron delegering gjennom strategisk kontekststyring. Denne hybridstrategien bevarer fordeler fra begge utførelsestilnærminger og minimerer deres ulemper når du utfører komplekse Agentic Workflows.

*Bygger på grunnleggende delegering for komplekse flerkomponent-workflows*

**✅ Hurtighandlinger:**
- **Sesjonsgrenser:** Skill planlegging-, delegerings- og integrasjonsfaser
- **Context Handoff:** Bevar workflow-kunnskap på tvers av sync-/async-utførelsessstrategier  
- **Memory Preservation:** Oppdater `.memory.md`-filer med asynkrone agent-resultater

> 💡 **Hybrid kontekststrategi:** Oppretthold kognitiv klarhet ved å behandle asynkron delegering som kontekstbevarende overdragelser i stedet for konteksttap, slik at du kan fortsette lokalt arbeid sømløst mens agenter utfører workflows parallelt.

### Eksempel: Kontekstoptimalisert hybridsesjon
```markdown
## Session 1: Planning & Delegation Setup
### Context Loading
- Review [project requirements](./requirements.md)
- Load [existing auth patterns](./auth.memory.md)
- Generate OAuth specification with component breakdown

### Delegation Handoff
- Create 3 parallel issues via GitHub MCP Server
- Assign GitHub Coding Agents to each component
- Preserve delegation context in [delegation.memory.md](./delegation.memory.md#oauth-parallel)

## Session 2: Local Development (Concurrent)
### Fresh Context for Local Work
- Continue on frontend components (independent of OAuth backend)
- Monitor async agent progress via VSCode GitHub PR extension
- Address any integration questions from async agents

## Session 3: Integration & Learning (Post-Async Completion)
### Context Assembly
- Review async agent outputs from draft PRs
- Load integration context from [delegation.memory.md](./delegation.memory.md#oauth-parallel)
- Perform integration testing and conflict resolution

### Knowledge Accumulation
- Update [auth.memory.md](./auth.memory.md) with successful patterns
- Enhance [security.instructions.md](./.github/instructions/security.instructions.md) based on discoveries
- Refine delegation patterns for future complex features
```

**⚠️ Sjekkpunkt:** Kontekstbevaring muliggjør sømløs hybrid sync/async Agentic Workflow-utføring

**📊 Suksessmåler:** Ingen kognitiv belastning ved å bytte mellom lokale og asynkrone arbeidskontekster

## Hovedpoenger {#key-takeaways}

1. **Valg av utførelsessstrategi** balanserer kontroll mot produktivitet basert på workflow-modenhet og konkrete behov
2. **Lokal IDE-utføring** maksimerer læring og kontroll for komplekse eller ukjente Agentic Workflows
3. **Asynkron agent-delegering** muliggjør parallell utføring og produktivitet for prøvde workflows med tydelige spesifikasjoner
4. **Hybrid orchestrering** kombinerer fordeler fra begge tilnærminger gjennom strategisk kontekstbevaring
6. **Intelligence Refinement** skaper sammensatt læring som forbedrer Agent Primitives over tid

**Klar for å skaleres til team?** Gå videre til [Team og bedriftsmål](../team-adoption/) for å bygge bro fra individuell mestring til teamkoordinering gjennom spec-drevne workflows og enterprise-styring.

**Trenger du implementeringsmaler?** Se [Eksempler](../examples/) for klare-til-bruk primitives.

*Du har nå komplette agentic workflow-mønstre og delegeringsstrategier. Neste steg er å skaleres disse teknikkene i hele organisasjonen.*
