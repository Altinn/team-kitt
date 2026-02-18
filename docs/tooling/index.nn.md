---
layout: docs
title: "Verktøy"
display_title: "Verktøy: Skalering av agentprimitivar"
permalink: /nn/docs/tooling/
lang: nn
ref: docs-tooling
---

> **ARIELLE-fokus:** Verktøy støttar **S**kills-distribusjon og **E**ngineering-praksis.

Du har meistra [Praksisen](../concepts/) og forstår at agentprimitivane dine er **køyrbar programvare skrive i naturleg språk**. No kjem det naturlege neste spørsmålet: korleis skalerer desse markdown-filene utover din individuelle utviklingsflyt til produksjonsklar infrastruktur?

Svaret speglar utviklinga i alle programmeringsøkosystem. Akkurat som JavaScript voks frå nettlesarskript til behov for Node.js-køyretider, pakkebehandlarar og utrullingsverktøy, treng agentprimitivane dine tilsvarande infrastruktur for å nå sitt fulle potensial.

## Naturleg språk som kode {#natural-language-as-code}

Agentprimitivane dine har alle kjenneteikna på profesjonell programvare: modularitet, gjenbruk, avhengigheiter, versjonering og kontinuerleg utvikling. Dette er ikkje berre ein metafor – desse `.prompt.md`- og `.instructions.md`-filene representerer ein reell ny form for programvareutvikling som fortener skikkeleg verktøystøtte.

Sjå kva som skjer når agentprimitivane dine modnast:

- **Modularitet**: Skil ansvar på tvers av ulike primitive filer som fungerer saman
- **Gjenbruk**: Dei same primitivane fungerer påliteleg på tvers av prosjekt og kontekstar
- **Avhengigheiter**: MCP-serverar, eksterne verktøy og kontekstkrav som må handterast
- **Utvikling**: Kontinuerleg raffinering og versjonering når arbeidsflytane blir betre
- **Distribusjon**: Team vil dele velprøvde primitivar slik dei deler kodebibliotek

Denne erkjenninga endrar korleis vi tenkjer om verktøy for AI-utvikling. Program i naturleg språk treng den same infrastrukturen som annan programvare.

## Agent-CLI-køyretider {#agent-cli-runtimes}

Dei fleste utviklarar lagar og køyrer agentprimitivar direkte i VS Code med GitHub Copilot – og det er perfekt for interaktiv utvikling, feilsøking og dagleg forbetring av arbeidsflytar. Men akkurat som JavaScript til slutt trong Node.js for å bryte fri frå nettlesarbegrensingar, treng program i naturleg språk **Agent CLI-køyretider** for automatiserte og produksjonsscenario.

Det framveksande økosystemet inkluderer ulike leverandørimplementasjonar av den same kjernefunksjonaliteten: **OpenAI Codex CLI**, **Anthropic Claude Code**, **GitHub Copilot CLI** og framtidige leverandørkøyretider når økosystemet modnast. Kvar gir kommandolinjekøyring av agentprimitivane dine med tilgang til sine respektive modellkapabilitetar.

### Indre løkke vs ytre løkke

Nøkkelinnsikta er å forstå når kvart miljø tener deg best:

- **Indre løkke (VS Code + GitHub Copilot)**: Interaktiv utvikling, testing og forbetring av arbeidsflytar
- **Ytre løkke (Agent CLI-køyretider)**: Reproduserbar køyring, CI/CD-integrasjon og produksjonsutrulling

Agent-CLI-køyretider forvandlar agentprimitivane dine frå IDE-bundne filer til **autonomt køyrbare arbeidsflytar** som køyrer konsistent i alle miljø. Dei gir kommandolinjekøyring, CI/CD-integrasjon, miljøkonsistens og innebygd støtte for MCP-serverar – og bind utviklingsarbeid til produksjonsrealitet.

## Køyretidshandtering {#runtime-management}

Sjølv om VS Code + GitHub Copilot handterer individuell utvikling perfekt, treng team ekstra infrastruktur for å **dele, versjonere og produktifisere** agentprimitivar. Å handtere fleire CLI-miljø blir raskt komplekst – ulike installasjonsprosedyrar, konfigurasjonskrav og kompatibilitetsmatriser.

[Agent Package Manager](https://github.com/microsoft/apm) løyser dette ved å tilby einsarta køyretidshandtering og distribusjon av agentpakkar. I staden for å installere og konfigurere kvar leverandør-CLI manuelt, handterer APM kompleksiteten og bevarer VS Code-arbeidsflyten.

Slik fungerer køyretidshandtering i praksis:

```bash
# Installer APM éin gong
curl -sSL https://raw.githubusercontent.com/microsoft/apm/main/install.sh | sh

# Valfritt: set opp GitHub PAT for å bruke GitHub Copilot CLI
export GITHUB_COPILOT_PAT=your_token_here

# APM handterer køyretidsinstallasjon for deg
apm runtime setup copilot        # Installerer GitHub Copilot CLI (Anbefalt)
apm runtime setup codex          # Installerer OpenAI Codex CLI-ar

# Sjekk kva som er tilgjengeleg
apm runtime list                 # Viser installerte køyretider
apm runtime status               # Viser kva køyretid som blir brukt

# Installer MCP-avhengigheiter (som npm install)
# Merk: denne funksjonen er under utvikling
apm install

# Kompiler Instructions-filer til AGENTS.md-filer
apm compile

# Køyr arbeidsflytar mot vald køyretid
# Dette vil trigge kommandoen 'copilot --log-level all --log-dir copilot-logs --allow-all-tools -p  security-review.prompt.md'
# Sjå eksempel på apm.yml litt lenger ned i denne guiden
apm run copilot-sec-review --param pr_id=123 
```

Dei viktigaste fordelane blir umiddelbart tydelege: den daglege utviklinga i VS Code er uendra, APM installerer og konfigurerer køyretider automatisk, arbeidsflytene køyrer uavhengig av kva køyretid som er installert, og den same `apm run`-kommandoen fungerer konsistent på tvers av alle køyretider.

**✅ Sjekkpunkt:** Køyretidskompleksitet blir abstrahert bort, samstundes som fleksibiliteten i utviklingsflyten blir bevart

## Kontekstkompilering og optimalisering

Dei modulære `.instructions.md`-filene fungerer godt i VS Code, men dei er låste til det éine miljøet. For å fungere på tvers av alle kodingsagentar (Cursor, Claude Desktop, osv.) treng du den universelle `AGENTS.md`-standarden. Og når primitivane kjem frå fleire pakkar, må dei flettast smart utan kontekstforureining.

**Kompilering løyser begge delar:** Den transformerer VS Code-native instruksar til portable `AGENTS.md`-filer samstundes som den optimaliserer korleis kontekst frå avhengigheiter og lokale primitivar blir kombinert. Dette gjer **spec-drivne teamkoordinering** mogleg frå [Team & Enterprise Scale](../team-adoption/).

[APM-kompilatoren](https://github.com/microsoft/apm) analyserer `applyTo`-mønstra dine, kartlegg katalogstrukturen og genererer optimal `AGENTS.md`-hierarki som garanterer full dekning med minimal redundans:

```bash
# 1. Skriv modulære primitivar som vanleg
.apm/instructions/
├── security.instructions.md      # applyTo: "**/auth/**"
├── react.instructions.md         # applyTo: "**/*.{tsx,jsx}"
└── api-design.instructions.md    # applyTo: "backend/api/**"

# 2. Køyr kompilering
apm compile

# 3. Optimalt AGENTS.md-hierarki genererast automatisk
├── AGENTS.md                     # Global kontekst (minimal)
├── frontend/AGENTS.md           # React-mønster
└── backend/
    ├── AGENTS.md                # Backend-mønster
    └── auth/AGENTS.md           # Tryggleik + backend
```

**Nøkkelfordelar:**
- **Portabilitet**: Fungerer på tvers av alle kodingsagentar som støttar AGENTS.md-standarden
- **Effektivitet**: Reduksjon i kontekst per fil samanlikna med manuelle tilnærmingar
- **Dekning**: Matematisk garanti for at kvar fil får nødvendige instruksar
- **Vedlikehald**: Endre primitivar, rekkompiler – `AGENTS.md` blir oppdatert automatisk
- **Teamkoordinering**: Endringar i teamstandardar spreier seg umiddelbart gjennom kompilering

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

For små prosjekt (5–10 instruksjonsfiler) fungerer manuell `AGENTS.md`-organisering fint — sjå [Kom i gang](../getting-started/). Når du skalerer utover det eller byrjar å bruke avhengigheiter, blir kompilering essensiell. Sjå [APM sine kompileringdocs](https://github.com/microsoft/apm/blob/main/docs/compilation.md) for tekniske detaljar.

**✅ Sjekkpunkt:** Kompilering skaper portabel, optimalisert kontekst som skalerer på tvers av agentar og prosjekt

## Distribusjon og pakking {#distribution-and-packaging}

Når agentprimitivane dine viser seg å vere verdifulle, vil du naturleg nok **dele dei med teamet** og etter kvart **ta dei i produksjon**. Det er her parallellane til tradisjonell programvareutvikling blir tydelege – du treng pakkestyring, avhengigheitsløysing, versjonskontroll og distribusjonsmekanismar.

Utfordringa kjem raskt: Du har bygd kraftige agentprimitivar, teamet vil bruke dei, men distribusjon av markdown-filer og konsistente MCP-avhengigheiter på tvers av miljø blir uhåndterleg. Du treng ekvivalenten til npm for program i naturleg språk.

[APM](https://github.com/microsoft/apm) gir npm-stil pakkestyring for program i naturleg språk – bygg distribuerbare pakkar med avhengigheiter, versjonering og komposisjon. Dette er grunnlaget for **agent-onboarding** og **enterprise governance** frå [Team & Enterprise Scale](../team-adoption/).

### Pakkestyring i praksis

```bash
# Opprett ein APM-pakke
apm init security-review-workflow

# Skriv .apm/instructions/*.instructions.md-filer

# Utvikle og test den agentiske arbeidsflyten lokalt
cd security-review-workflow 
apm compile && apm install
apm run copilot-sec-review --param pr_id=123

# Publiser APM-pakken til GitHub: 
git tag v1.0.0 && git push --tags
```

APM-prosjekt har ein `apm.yml`-konfigurasjonsfil som fungerer som `package.json`-ekvivalenten for agentprimitivar, og definerer skript, avhengigheiter og inputparametrar:

```yaml
# Teammedlemmer kan installere og bruke primitivane dine
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

Ved kontekstkompilering kan fleire APM-pakkar bidra til dei same `applyTo`-mønstra utan konfliktar. Når `company/compliance-rules`, `company/design-guidelines` og ditt lokale prosjekt alle målrettar `**/auth/**`, blir alle tre kontekstane fletta med kildeattribusjon – lagdelt, komponerbar kontekst byggd på felles fundament.

**Reelt døme:** [corporate-website](https://github.com/danielmeppiel/corporate-website) bruker `compliance-rules` + `design-guidelines` som avhengigheiter. Etter `apm install && apm compile` gjeld compliance-mønster automatisk for datahandteringskode, designstandardar for frontend-komponentar, begge komponerer med lokal kontekst – null konfliktar, full dekning.

**Enterprise governance-mønster:** Når compliance-teamet oppdaterer `company/compliance-rules` med nye retningslinjer for datalagring, køyrer alle team i organisasjonen `apm install && apm compile`. Kvar agent, kvart prosjekt, blir umiddelbart compliant. Dette er **deterministisk agent-onboarding i skala** – policyar blir håndhevbare primitivar, ikkje opplæringsmateriell.

Fordelane akkumulerer raskt: distribuer testa arbeidsflytar og instruksar som versjonerte pakkar med avhengigheiter, installer og løyse opp nødvendige MCP-avhengigheiter automatisk, spor utviklinga av arbeidsflytar og oppretthald kompatibilitet på tvers av oppdateringar, bygg vidare på delte primitivbibliotek frå fellesskapet, sikre konsistent køyring på tvers av teammedlemmars oppsett, og mogleggjer umiddelbare policy-oppdateringar på tvers av heile verksemda.

**✅ Sjekkpunkt:** Agentprimitivane dine er no pakka som distribuerbar programvare med handterte avhengigheiter

## Produksjonsutrulling {#production-deployment}

Den siste delen av verktøyøkosystemet gjer **Continuous AI** mogleg – automatisert køyring av pakka agentprimitivar i produksjonsmiljø. Dei nøye utvikla arbeidsflytane kan no køyre automatisk i CI/CD-pipelines med same pålitelegheit som tradisjonell programvareutrulling.

Med utgangspunkt i `security-review-workflow`-eksemplet over, ser du her korleis det same APM-prosjektet blir deploya til produksjon med fleksibilitet på tvers av køyretider.

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

**Nøkkelforbindelse**: `matrix.script`-verdiane (`codex-sec-review`, `copilot-sec-review`, `codex-debug`) tilsvarer nøyaktig skripta som er definert i `apm.yml`-konfigurasjonen over. [APM](https://github.com/microsoft/apm) installerer MCP-avhengigheiter automatisk (`ghcr.io/github/github-mcp-server`, `security-scanner-mcp`) og sender inputparametrar (`pr_id`) til `security-review.prompt.md`-arbeidsflyten.

Dette skaper produksjonsklare AI-arbeidsflytar med fleksibilitet i køyretider, parallell køyring, konsistent utrulling på tvers av miljø, og automatiserte kvalitetsprosessar integrert i standard CI/CD-pipelines.

**✅ Sjekkpunkt:** Agentprimitivane dine køyrer no automatisk i produksjon med same pålitelegheit som tradisjonell programvare

## Økosystemutvikling {#ecosystem-evolution}

Denne verktøyprogresjonen følgjer same føreseielege mønster som alle vellukka programmeringsøkosystem. Å forstå dette mønsteret hjelper deg å sjå kvar AI Native Development er på veg og korleis du kan posisjonere arbeidet ditt strategisk.

Utviklinga skjer i fire steg:

1. **Råkode** → Agentprimitivar (.prompt.md, .instructions.md-filer)
2. **Køyretidsmiljø** → Agent-CLI-køyretider (Codex CLI, Claude Code, osv.)
3. **Pakkestyring** → [APM](https://github.com/microsoft/apm) (distribusjons- og orkestreringslag)
4. **Levende økosystem** → Delte bibliotek, verktøy og fellesskapspakkar

Akkurat som npm gjorde JavaScripts eksplosive vekst mogleg ved å løyse pakkedistribusjonsproblemet, gjer [APM](https://github.com/microsoft/apm) at agentprimitiv-økosystemet blomstrar ved å tilby det manglande infrastrukturlaget som gjer deling og skalering av program i naturleg språk praktisk.

## Nøkkelpunkta {#key-takeaways}

1. **Naturleg språk som kode** – Agentprimitivane dine er reell programvare som fortener skikkeleg verktøystøtte
2. **Agent-CLI-køyretider** gjer køyring mogleg utanfor VS Code, spesielt for CI/CD og produksjon
3. **Køyretidshandtering** via APM forenklar portabilitet i fleirleverandør agentiske kodingsmiljø, samstundes som VS Code-arbeidsflyten blir bevart
4. **Kontekstkompilering** transformerer modulære `.instructions.md` til portable, optimaliserte `AGENTS.md`-hierarki
5. **Pakkestyring** gjer npm-stil distribusjon mogleg med avhengigheiter, versjonering og komposisjon
6. **Produksjonsutrulling** gjer agentprimitivar til førsteklasses borgarar i moderne programvareleveranse

**Klar til å køyre arbeidsflytar?** Med produksjonsklar infrastruktur på plass kan du halde fram til [Agentdelegasjon](../agent-delegation/) for å meistre utføringsstrategiar – frå lokal IDE-kontroll til sofistikert asynkron orkestrering som utnyttar alt du nettopp lærte.

**Vil du sjå avanserte utføringsmønster?** Gå til [Agentdelegasjon](../agent-delegation/) for omfattande orkestreringsstrategiar som bygg på denne verktøybasen for både lokal og asynkron agentkoordinering.
