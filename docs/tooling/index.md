---
layout: docs
title: "Verktøy"
display_title: "Verktøy: Skalering av agentprimitiver"
permalink: /nb/docs/tooling/
lang: nb
ref: docs-tooling
redirect_from:
  - /docs/tooling/
nav_order: 4
---

> **ARIELLE-fokus:** Verktøy støtter **S**kills-distribusjon og **E**ngineering-praksis.

Du har mestret [Praksisen](../concepts/) og forstår at agentprimitivene dine er **kjørbar programvare skrevet i naturlig språk**. Nå kommer det naturlige neste spørsmålet: Hvordan skalerer disse markdown-filene fra individuell utviklingsflyt til produksjonsklar infrastruktur?

Svaret speiler utviklingen i alle programmeringsøkosystemer. Akkurat som JavaScript gikk fra nettleserskript til behov for Node.js-kjøretider, pakkebehandlere og deployment-verktøy, trenger agentprimitivene dine tilsvarende infrastruktur for å nå sitt fulle potensial.

## Naturlig språk som kode {#natural-language-as-code}

Agentprimitivene dine har alle kjennetegnene på profesjonell programvare: modularitet, gjenbruk, avhengigheter, versjonering og kontinuerlig utvikling. Dette er ikke bare en metafor - disse `.prompt.md`- og `.instructions.md`-filene representerer en reell ny form for programvareutvikling som fortjener ordentlig verktøystøtte.

Se hva som skjer når agentprimitivene dine modnes:

- **Modularitet**: Skille ansvar på tvers av ulike primitive filer som fungerer sammen
- **Gjenbruk**: De samme primitivene fungerer pålitelig på tvers av prosjekter og kontekster
- **Avhengigheter**: MCP-servere, eksterne verktøy og kontekstkrav som må håndteres
- **Utvikling**: Kontinuerlig raffinering og versjonering etter hvert som arbeidsflytene forbedres
- **Distribusjon**: Team vil dele velprøvde primitiver slik de deler kodebiblioteker

Denne erkjennelsen endrer hvordan vi tenker om verktøy for AI-utvikling. Programmer i naturlig språk trenger den samme infrastrukturen som annen programvare.

## Agent-CLI-kjøretider {#agent-cli-runtimes}

De fleste utviklere lager og kjører agentprimitiver direkte i VS Code med GitHub Copilot - og det er perfekt for interaktiv utvikling, feilsøking og daglig forbedring av arbeidsflyter. Men akkurat som JavaScript til slutt trengte Node.js for å bryte fri fra nettleserbegrensninger, trenger programmer i naturlig språk **Agent CLI-kjøretider** for automatiserte og produksjonsscenarier.

Det fremvoksende økosystemet inkluderer ulike leverandørimplementasjoner av den samme kjernefunksjonaliteten: **OpenAI Codex CLI**, **Anthropic Claude Code**, **GitHub Copilot CLI** og fremtidige leverandørkjøretider etter hvert som økosystemet modnes. Hver gir kommandolinjekjøring av agentprimitivene dine med tilgang til sine respektive modellkapabiliteter.

### Indre løkke vs ytre løkke

Nøkkelinnsikten er å forstå når hvert miljø tjener deg best:

- **Indre løkke (VS Code + GitHub Copilot)**: Interaktiv utvikling, testing og forbedring av arbeidsflyter
- **Ytre løkke (Agent CLI-kjøretider)**: Reproduserbar kjøring, CI/CD-integrasjon og produksjonsutrulling

Agent-CLI-kjøretider transformerer agentprimitivene dine fra IDE-bundne filer til **autonomt kjørbare arbeidsflyter** som kjører konsistent i alle miljøer. De gir kommandolinjekjøring, CI/CD-integrasjon, miljøkonsistens og innebygd støtte for MCP-servere - og binder utviklingsarbeid til produksjonsvirkelighet.

## Kjøretidsadministrasjon {#runtime-management}

Selv om VS Code + GitHub Copilot håndterer individuell utvikling perfekt, trenger team ekstra infrastruktur for å **dele, versjonere og produktifisere** agentprimitiver. Å administrere flere CLI-miljøer blir raskt komplekst - ulike installasjonsprosedyrer, konfigurasjonskrav og kompatibilitetsmatriser.

[Agent Package Manager](https://github.com/microsoft/apm) løser dette ved å tilby enhetlig kjøretidsadministrasjon og distribusjon av agentpakker. I stedet for å installere og konfigurere hver leverandør-CLI manuelt, håndterer APM kompleksiteten og bevarer VS Code-arbeidsflyten.

Slik fungerer kjøretidsadministrasjon i praksis:

```bash
# Installer APM én gang
curl -sSL https://raw.githubusercontent.com/microsoft/apm/main/install.sh | sh

# Valgfritt: sett opp GitHub PAT for å bruke GitHub Copilot CLI
export GITHUB_COPILOT_PAT=your_token_here

# APM håndterer kjøretidsinstallasjon for deg
apm runtime setup copilot        # Installerer GitHub Copilot CLI (Anbefalt)
apm runtime setup codex          # Installerer OpenAI Codex CLI-er

# Sjekk hva som er tilgjengelig
apm runtime list                 # Viser installerte kjøretider
apm runtime status               # Viser hvilken kjøretid som vil brukes

# Installer MCP-avhengigheter (som npm install)
# Merk: denne funksjonen er under utvikling
apm install

# Kompiler Instructions-filer til AGENTS.md-filer
apm compile

# Kjør arbeidsflyter mot valgt kjøretid
# Dette vil trigge kommandoen 'copilot --log-level all --log-dir copilot-logs --allow-all-tools -p  security-review.prompt.md'
# Se eksempel på apm.yml litt lenger ned i denne guiden
apm run copilot-sec-review --param pr_id=123 
```

De viktigste fordelene blir umiddelbart tydelige: den daglige utviklingen i VS Code er uendret, APM installerer og konfigurerer kjøretider automatisk, arbeidsflytene kjører uavhengig av hvilken kjøretid som er installert, og den samme `apm run`-kommandoen fungerer konsistent på tvers av alle kjøretider.

**✅ Sjekkpunkt:** Kjøretidskompleksitet abstraheres bort samtidig som fleksibilitet i utviklingsflyten bevares

## Kontekstkompilering og optimalisering

De modulære `.instructions.md`-filene fungerer godt i VS Code, men de er låst til det ene miljøet. For å fungere på tvers av alle kodingsagenter (Cursor, Claude Desktop, osv.) trenger du den universelle `AGENTS.md`-standarden. Og når primitivene kommer fra flere pakker, må de flettes smart uten kontekforurensing.

**Kompilering løser begge deler:** Den transformerer VS Code-native instrukser til portable `AGENTS.md`-filer samtidig som den optimaliserer hvordan kontekst fra avhengigheter og lokale primitiver kombineres. Dette muliggjør **spec-drevet teamkoordinering** fra [Team & Enterprise Scale](../team-adoption/).

[APM-kompilatoren](https://github.com/microsoft/apm) analyserer `applyTo`-mønstrene dine, kartlegger katalogstrukturen, og genererer optimal `AGENTS.md`-hierarki som garanterer full dekning med minimal redundans:

```bash
# 1. Skriv modulære primitiver som vanlig
.apm/instructions/
├── security.instructions.md      # applyTo: "**/auth/**"
├── react.instructions.md         # applyTo: "**/*.{tsx,jsx}"
└── api-design.instructions.md    # applyTo: "backend/api/**"

# 2. Kjør kompilering
apm compile

# 3. Optimalt AGENTS.md-hierarki genereres automatisk
├── AGENTS.md                     # Global kontekst (minimal)
├── frontend/AGENTS.md           # React-mønstre
└── backend/
    ├── AGENTS.md                # Backend-mønstre
    └── auth/AGENTS.md           # Sikkerhet + backend
```

**Nøkkelfordeler:**
- **Portabilitet**: Fungerer på tvers av alle kodingsagenter som støtter AGENTS.md-standarden
- **Effektivitet**: Reduksjon i kontekst per fil sammenlignet med manuelle tilnærminger
- **Dekning**: Matematisk garanti for at hver fil får nødvendige instrukser
- **Vedlikehold**: Endre primitiver, rekkompiler - `AGENTS.md` oppdateres automatisk
- **Teamkoordinering**: Endringer i teamstandarder sprer seg umiddelbart gjennom kompilering

```bash
$ apm compile --verbose

Generated 5 AGENTS.md files --- Context efficiency: 46.7%

Placement Distribution
├─ .                      Constitution and 5 instructions from 4 sources
├─ tests                  2 instructions from 3 sources
├─ docs                   1 instructions from 2 sources
├─ backend/api            2 instructions from 4 sources
└─ scripts/deployment     1 instructions from 1 source
```

For små prosjekter (5-10 instruksjonsfiler) fungerer manuell `AGENTS.md`-organisering fint — se [Kom i gang](../getting-started/). Når du skalerer utover det eller begynner å bruke avhengigheter, blir kompilering essensielt. Se [APM sine kompileringdocs](https://github.com/microsoft/apm/blob/main/docs/compilation.md) for tekniske detaljer.

**✅ Sjekkpunkt:** Kompilering skaper portabel, optimalisert kontekst som skalerer på tvers av agenter og prosjekter

## Distribusjon og pakking {#distribution-and-packaging}

Når agentprimitivene dine viser seg å være verdifulle, vil du naturlig nok **dele dem med teamet** og etter hvert **ta dem i produksjon**. Det er her parallellene til tradisjonell programvareutvikling blir tydelige - du trenger pakkestyring, avhengighetsløsning, versjonskontroll og distribusjonsmekanismer.

Utfordringen kommer raskt: Du har bygget kraftige agentprimitiver, teamet vil bruke dem, men distribusjon av markdown-filer og konsistente MCP-avhengigheter på tvers av miljøer blir uhåndterlig. Du trenger ekvivalenten til npm for programmer i naturlig språk.

[APM](https://github.com/microsoft/apm) gir npm-stil pakkestyring for programmer i naturlig språk - bygg distribuerbare pakker med avhengigheter, versjonering og komposisjon. Dette er grunnlaget for **agent-onboarding** og **enterprise governance** fra [Team & Enterprise Scale](../team-adoption/).

### Pakkestyring i praksis

```bash
# Opprett en APM-pakke
apm init security-review-workflow

# Skriv .apm/instructions/*.instructions.md-filer

# Utvikle og test den agentiske arbeidsflyten lokalt
cd security-review-workflow 
apm compile && apm install
apm run copilot-sec-review --param pr_id=123

# Publiser APM-pakken til GitHub: 
git tag v1.0.0 && git push --tags
```

APM-prosjekter har en `apm.yml`-konfigurasjonsfil som fungerer som `package.json`-ekvivalenten for agentprimitiver, og definerer skript, avhengigheter og inputparametere:

```yaml
# Teammedlemmer kan installere og bruke primitivene dine
# apm.yml i prosjektroten (som package.json)
name: security-review-workflow
version: 1.2.0
description: Comprehensive security review process with GitHub integration
scripts:
  copilot-sec-review: "copilot --log-level all --log-dir copilot-logs --allow-all-tools -p  security-review.prompt.md"
  codex-sec-review: "codex security-review.prompt.md"
  codex-debug: "RUST_LOG=debug codex security-review.prompt.md"
  
dependencies:
  apm:
    - company/compliance-rules
    - company/design-guidelines
  mcp:
    - github/github-mcp-server
```

Ved kontekstkompilering kan flere APM-pakker bidra til de samme `applyTo`-mønstrene uten konflikter. Når `company/compliance-rules`, `company/design-guidelines` og ditt lokale prosjekt alle målretter `**/auth/**`, flettes alle tre kontekstene med kildeattribusjon - lagdelt, komponerbar kontekst bygges på felles fundament.

**Reelt eksempel:** [corporate-website](https://github.com/danielmeppiel/corporate-website) bruker `compliance-rules` + `design-guidelines` som avhengigheter. Etter `apm install && apm compile` gjelder compliance-mønstre automatisk for datahåndteringskode, designstandarder for frontend-komponenter, begge komponerer med lokal kontekst - null konflikter, full dekning.

**Enterprise governance-mønster:** Når compliance-teamet oppdaterer `company/compliance-rules` med nye retningslinjer for datalagring, kjører alle team i organisasjonen `apm install && apm compile`. Hver agent, hvert prosjekt, blir umiddelbart compliant. Dette er **deterministisk agent-onboarding i skala** - policyer blir håndhevbare primitiver, ikke opplæringsmateriell.

Fordelene akkumuleres raskt: distribuer testede arbeidsflyter og instruksjoner som versjonerte pakker med avhengigheter, installer og løs opp nødvendig MCP-avhengigheter automatisk, spor utviklingen av arbeidsflyter og oppretthold kompatibilitet på tvers av oppdateringer, bygg videre på delte primitivbiblioteker fra fellesskapet, sikre konsistent kjøring på tvers av teammedlemmers oppsett, og muliggjør umiddelbare policy-oppdateringer på tvers av hele virksomheten.

**✅ Sjekkpunkt:** Agentprimitivene dine er nå pakket som distribuerbar programvare med håndterte avhengigheter

## Produksjonsutrulling {#production-deployment}

Den siste delen av verktøyøkosystemet muliggjør **Continuous AI** - automatisert kjøring av pakkede agentprimitiver i produksjonsmiljøer. De nøye utviklede arbeidsflytene kan nå kjøre automatisk i CI/CD-pipelines med samme pålitelighet som tradisjonell programvareutrulling.

Med utgangspunkt i `security-review-workflow`-eksemplet over, ser du her hvordan det samme APM-prosjektet deployes til produksjon med fleksibilitet på tvers av kjøretider.

```yaml
# .github/workflows/security-review.yml
name: AI Security Review Pipeline
on: 
  pull_request:
    types: [opened, synchronize]

jobs:
  security-analysis:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        script: [codex-sec-review, copilot-sec-review, codex-debug]  # Maps to apm.yml scripts
    permissions:
      models: read
      pull-requests: write
      contents: read
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Run Security Review (${{ matrix.script }})
      uses: danielmeppiel/action-apm-cli@v1
      with:
        script: ${{ matrix.script }}
        parameters: |
          {
            "pr_id": "${{ github.event.number }}"
          }
      env:
        GITHUB_COPILOT_PAT: ${{ secrets.GITHUB_COPILOT_PAT }}
      
```

**Nøkkelforbindelse**: `matrix.script`-verdiene (`codex-sec-review`, `copilot-sec-review`, `codex-debug`) tilsvarer nøyaktig skriptene som er definert i `apm.yml`-konfigurasjonen over. [APM](https://github.com/microsoft/apm) installerer MCP-avhengigheter automatisk (`ghcr.io/github/github-mcp-server`, `security-scanner-mcp`) og sender inputparametere (`pr_id`) til `security-review.prompt.md`-arbeidsflyten.

Dette skaper produksjonsklare AI-arbeidsflyter med fleksibilitet i kjøretider, parallell kjøring, konsistent utrulling på tvers av miljøer, og automatiserte kvalitetsprosesser integrert i standard CI/CD-pipelines.

**✅ Sjekkpunkt:** Agentprimitivene dine kjører nå automatisk i produksjon med samme pålitelighet som tradisjonell programvare

## Økosystemutvikling {#ecosystem-evolution}

Denne verktøyprogresjonen følger samme forutsigbare mønster som alle vellykkede programmeringsøkosystemer. Å forstå dette mønsteret hjelper deg å se hvor AI Native Development er på vei og hvordan du kan posisjonere arbeidet ditt strategisk.

Utviklingen skjer i fire steg:

1. **Råkode** → Agentprimitiver (.prompt.md, .instructions.md-filer)
2. **Kjøretidsmiljøer** → Agent-CLI-kjøretider (Codex CLI, Claude Code, osv.)
3. **Pakkestyring** → [APM](https://github.com/microsoft/apm) (distribusjons- og orkestreringslag)
4. **Levende økosystem** → Delte bibliotek, verktøy og fellesskapspakker

Akkurat som npm muliggjorde JavaScripts eksplosive vekst ved å løse pakkedistribusjonsproblemet, muliggjør [APM](https://github.com/microsoft/apm) at agentprimitiv-økosystemet blomstrer ved å tilby den manglende infrastrukturlaget som gjør deling og skalering av programmer i naturlig språk praktisk.

## Nøkkelpunkter {#key-takeaways}

1. **Naturlig språk som kode** - Agentprimitivene dine er reell programvare som fortjener ordentlig verktøystøtte
2. **Agent-CLI-kjøretider** muliggjør kjøring utenfor VS Code, spesielt for CI/CD og produksjon
3. **Kjøretidsadministrasjon** via APM forenkler portabilitet i flerleverandør agentiske kodingsmiljøer, samtidig som VS Code-arbeidsflyten bevares
4. **Kontekstkompilering** transformerer modulære `.instructions.md` til portable, optimaliserte `AGENTS.md`-hierarkier
5. **Pakkestyring** muliggjør npm-stil distribusjon med avhengigheter, versjonering og komposisjon
6. **Produksjonsutrulling** gjør agentprimitiver til førsteklasses borgere i moderne programvareleveranse

**Klar til å kjøre arbeidsflyter?** Med produksjonsklar infrastruktur på plass kan du fortsette til [Agentdelegasjon](../agent-delegation/) for å mestre utførelsesstrategier - fra lokal IDE-kontroll til sofistikert asynkron orkestrering som utnytter alt du nettopp lærte.

**Vil du se avanserte utførelsesmønstre?** Gå til [Agentdelegasjon](../agent-delegation/) for omfattende orkestreringsstrategier som bygger på denne verktøybasen for både lokal og asynkron agentkoordinering.
