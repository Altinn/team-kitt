---
layout: docs
title: "Praksis"
display_title: "Praksis"
permalink: /nn/docs/concepts/
lang: nn
ref: docs-concepts
---

[ARIELLE-spesifikasjonen](../arielle/) definerer fem arkitekturmessige avgrensingar for påliteleg AI-native utvikling. Denne guiden viser korleis du implementerer dei gjennom tre samanvevde disiplinar: strukturert prompting, gjenbrukbare primitivar og strategisk kontekststyring.

Enten du kjem frå spesifikasjonen eller oppdagar desse praksisane for første gong, gir meistring av desse disiplinane deg ferdigheitene til å gjere AI-samarbeid påliteleg i skala.

## Korleis praksisen implementerer ARIELLE

Kvar disiplin implementerer konkrete [ARIELLE-avgrensingar](../arielle/#the-five-constraints):

| Disiplin | Kva du lærer | ARIELLE-avgrensingar |
|------------|----------------|-------------------|
| **Prompt Engineering** | Strukturert naturleg språk-syntaks | Gjer alle avgrensingar moglege |
| **Agent Primitives** | Gjenbrukbar, komponerbar konfigurasjon | Orchestrated Composition, Safety Boundaries |
| **Context Engineering** | Strategisk kontekststyring | Reduced Scope, Explicit Hierarchy |

## Disiplin 1: Prompt Engineering {#discipline-1-prompt-engineering}

**Prompt Engineering** er kunsten å strukturere naturleg språk for deterministisk utføring. I AI Native Development er prompting ikkje improvisasjon—det er ingeniørarbeid.

### Sentrale teknikkar

- **Mikrostrukturerte prompts**: Bruk faste seksjonar og sjekklister for å redusere rom for misforståing.
- **Valideringsportar**: Krav til eksplisitt verifisering før neste steg.
- **Systematiske outputformat**: Definer format og innhald slik at resultat kan evaluerast.

### Rask vinnar-eksempel

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

## Disiplin 2: Agent Primitives {#discipline-2-agent-primitives}  

Agentprimitivar er modulære einingar for agentåtferd: instruksar, prompts og spesifikasjonar som kan setjast saman og gjenbrukast. Dette er infrastrukturen som gjer AI-arbeid konsistent i skala.

### Kjerneprimitivar

- **Instruksar** (`.instructions.md`) for vedvarande retningslinjer
- **Prompts** (`.prompt.md`) for arbeidsflytar
- **Spesifikasjonar** (`.spec.md`) for handoff mellom plan og implementering

### Transformasjonseffekten

Når primitivane er på plass, skiftar produktiviteten frå improvisasjon til industriell kapasitet: meir kvalitet, færre feil, lågare koordinasjonskostnad.

## Disiplin 3: Context Engineering {#discipline-3-context-engineering}

Context Engineering handlar om å styre merksemd og minne i store språkmodellar. Når kontekstvindauget er knapp ressurs, må du optimalisere kva som blir inkludert – og når.

### Kvifor kontekst betyr noko

- Avgrensa kontekst betyr at irrelevans pressar ut kritisk informasjon.
- Kvaliteten på output er direkte knytt til kvaliteten på kontekst.
- Modularisering og selektiv lasting er avgjerande for skala.

### Den universelle oppdagingsutfordringa

Agenter må kunne finne det dei treng akkurat når dei treng det—utan at alt blir lasta inn kvar gong. Dette krev standardar som `AGENTS.md` og strategisk organisering.

### Sentrale teknikkar

- **ApplyTo-mønster** for selektiv kontekst
- **Kompilering til AGENTS.md** for portabilitet
- **Avgrensa scope** for komplekse oppgåver

### Praktiske fordelar

- Lågare kostnad per interaksjon
- Høgare relevans i agentresponsar
- Betre kvalitet og konsistens

## Agentic Workflows: alle disiplinar i praksis {#agentic-workflows-all-disciplines-in-action}

Når du kombinerer prompt engineering, agentprimitivar og context engineering, får du **agentiske arbeidsflytar**—repeterbare prosessar som kan køyre lokalt eller delegerast asynkront.

### Sentrale eigenskapar:

- **Deterministisk struktur** for kvalitet
- **Kontekstdisiplin** for fokus
- **Valideringsportar** for tryggleik
- **Komposisjon** for skalerbarheit

## AI Native Development-rammeverket

AI Native Development er ikkje eit nytt verktøy—det er ein ny måte å byggje på. Praksisdisiplinane her er byggesteinane som gjer ARIELLE nyttig i praksis.

## Hovudpoeng {#key-takeaways}

1. **Prompt Engineering** gjer AI-utføring deterministisk
2. **Agentprimitivar** gjer kunnskap og arbeidsflytar gjenbrukbare
3. **Context Engineering** gjer skala mogleg utan kontekstforureining
4. **Agentiske arbeidsflytar** kombinerer alle tre disiplinar til produksjonsklar orkestrering
