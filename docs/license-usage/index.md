---
layout: docs
title: "Lisensbruk"
display_title: "Lisensbruk"
permalink: /nb/docs/license-usage/
lang: nb
ref: docs-license-usage
---

<div class="license-usage-hero">
  <div class="license-usage-card">
    <div class="license-usage-eyebrow">Tillatte verktøy</div>
    <h2>GitHub Copilot og Claude er tillatt.</h2>
    <p>Dette gjelder bruk i Digdir sine arbeidsprosesser.</p>
  </div>
</div>

<section class="survey-dashboard" data-survey-dashboard data-csv="{{ '/assets/Kartlegging.av.bruk.av.generativ.kunstig.intelligens.KI.i.Digdir.1-140.csv' | relative_url }}" data-loading-label="Laster grafer..." data-error-label="Kunne ikke laste data." data-meta-template="N={n} svar">
  <div class="survey-header">
    <div>
      <h2 id="survey-results">Resultater fra kartleggingen</h2>
      <p>Interaktive grafer basert på svar fra ansatte.</p>
    </div>
    <div class="survey-controls">
      <label>Avdeling
        <select data-filter="department">
          <option value="*">Alle avdelinger</option>
        </select>
      </label>
      <button type="button" class="survey-reset" data-action="reset">Nullstill filter</button>
    </div>
  </div>

  <div class="survey-grid">
    <div class="chart-card" data-chart="usage-frequency" data-enabled="true" data-empty-label="Ingen svar">
      <div class="chart-head">
        <h3 id="usage-frequency">Bruk av KI i jobben</h3>
        <p>Hvor ofte KI-verktøy brukes.</p>
      </div>
      <div class="chart-meta" data-meta></div>
      <div class="chart-body" data-chart-body></div>
    </div>

    <div class="chart-card" data-chart="tools" data-enabled="true" data-top="8" data-other-label="Andre" data-top-note="Viser topp 8. Resten er Andre." data-empty-label="Ingen svar">
      <div class="chart-head">
        <h3 id="tools-in-use">KI-verktøy i bruk</h3>
        <p>Hvilke verktøy som brukes mest.</p>
      </div>
      <div class="chart-meta" data-meta></div>
      <div class="chart-body" data-chart-body></div>
    </div>

    <div class="chart-card" data-chart="models" data-enabled="true" data-top="8" data-other-label="Andre" data-top-note="Viser topp 8. Resten er Andre." data-empty-label="Ingen svar">
      <div class="chart-head">
        <h3>Foretrukne språkmodeller</h3>
        <p>Modellene som nevnes oftest.</p>
      </div>
      <div class="chart-meta" data-meta></div>
      <div class="chart-body" data-chart-body></div>
    </div>

    <div class="chart-card" data-chart="tasks" data-enabled="true" data-top="8" data-other-label="Andre" data-top-note="Viser topp 8. Resten er Andre." data-empty-label="Ingen svar">
      <div class="chart-head">
        <h3 id="tasks">Oppgaver der KI brukes</h3>
        <p>Hva KI hovedsakelig brukes til.</p>
      </div>
      <div class="chart-meta" data-meta></div>
      <div class="chart-body" data-chart-body></div>
    </div>

    <div class="chart-card" data-chart="reasons" data-enabled="true" data-top="8" data-other-label="Andre" data-top-note="Viser topp 8. Resten er Andre." data-empty-label="Ingen svar">
      <div class="chart-head">
        <h3>Hvorfor KI brukes</h3>
        <p>Viktigste drivere for bruk av KI.</p>
      </div>
      <div class="chart-meta" data-meta></div>
      <div class="chart-body" data-chart-body></div>
    </div>

    <div class="chart-card" data-chart="confidence" data-enabled="true" data-empty-label="Ingen svar">
      <div class="chart-head">
        <h3 id="confidence">Trygghet i bruk av KI</h3>
        <p>Opplevd trygghet ved bruk i jobbhverdagen.</p>
      </div>
      <div class="chart-meta" data-meta></div>
      <div class="chart-body" data-chart-body></div>
    </div>

    <div class="chart-card" data-chart="training" data-enabled="true" data-empty-label="Ingen svar">
      <div class="chart-head">
        <h3>Opplæring gjennom jobben</h3>
        <p>Har ansatte fått opplæring i KI?</p>
      </div>
      <div class="chart-meta" data-meta></div>
      <div class="chart-body" data-chart-body></div>
    </div>

    <div class="chart-card" data-chart="payer" data-enabled="true" data-empty-label="Ingen svar">
      <div class="chart-head">
        <h3 id="payer">Hvem betaler for verktøyene</h3>
        <p>Hvordan lisensene finansieres i praksis.</p>
      </div>
      <div class="chart-meta" data-meta></div>
      <div class="chart-body" data-chart-body></div>
    </div>
  </div>
</section>

<script src="{{ '/assets/license-usage-survey.js' | relative_url }}" defer></script>
