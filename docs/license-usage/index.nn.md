---
layout: docs
title: "Lisensbruk"
display_title: "Lisensbruk"
permalink: /nn/docs/license-usage/
lang: nn
ref: docs-license-usage
---

<div class="license-usage-hero">
  <div class="license-usage-card">
    <div class="license-usage-eyebrow">Tillatne verktøy</div>
    <h2>GitHub Copilot og Claude er tillatne.</h2>
    <p>Dette gjeld bruk i Digdir sine arbeidsprosessar.</p>
  </div>
</div>

<section class="survey-dashboard" data-survey-dashboard data-csv="{{ '/assets/Kartlegging.av.bruk.av.generativ.kunstig.intelligens.KI.i.Digdir.1-140.csv' | relative_url }}" data-loading-label="Lastar grafar..." data-error-label="Kunne ikkje laste data." data-meta-template="N={n} svar">
  <div class="survey-header">
    <div>
      <h2 id="survey-results">Resultat frå kartlegginga</h2>
      <p>Interaktive grafar baserte på svar frå tilsette.</p>
    </div>
    <div class="survey-controls">
      <label>Avdeling
        <select data-filter="department">
          <option value="*">Alle avdelingar</option>
        </select>
      </label>
      <button type="button" class="survey-reset" data-action="reset">Nullstill filter</button>
    </div>
  </div>

  <div class="survey-grid">
    <div class="chart-card" data-chart="usage-frequency" data-enabled="true" data-empty-label="Ingen svar">
      <div class="chart-head">
        <h3 id="usage-frequency">Bruk av KI i jobben</h3>
        <p>Kor ofte KI-verktøy blir brukt.</p>
      </div>
      <div class="chart-meta" data-meta></div>
      <div class="chart-body" data-chart-body></div>
    </div>

    <div class="chart-card" data-chart="tools" data-enabled="true" data-top="8" data-other-label="Andre" data-top-note="Viser topp 8. Resten er Andre." data-empty-label="Ingen svar">
      <div class="chart-head">
        <h3 id="tools-in-use">KI-verktøy i bruk</h3>
        <p>Kva verktøy som blir brukt mest.</p>
      </div>
      <div class="chart-meta" data-meta></div>
      <div class="chart-body" data-chart-body></div>
    </div>

    <div class="chart-card" data-chart="models" data-enabled="true" data-top="8" data-other-label="Andre" data-top-note="Viser topp 8. Resten er Andre." data-empty-label="Ingen svar">
      <div class="chart-head">
        <h3>Føretrekte språkmodellar</h3>
        <p>Modellane som blir nemnde oftast.</p>
      </div>
      <div class="chart-meta" data-meta></div>
      <div class="chart-body" data-chart-body></div>
    </div>

    <div class="chart-card" data-chart="tasks" data-enabled="true" data-top="8" data-other-label="Andre" data-top-note="Viser topp 8. Resten er Andre." data-empty-label="Ingen svar">
      <div class="chart-head">
        <h3 id="tasks">Oppgåver der KI blir brukt</h3>
        <p>Kva KI hovudsakleg blir brukt til.</p>
      </div>
      <div class="chart-meta" data-meta></div>
      <div class="chart-body" data-chart-body></div>
    </div>

    <div class="chart-card" data-chart="reasons" data-enabled="true" data-top="8" data-other-label="Andre" data-top-note="Viser topp 8. Resten er Andre." data-empty-label="Ingen svar">
      <div class="chart-head">
        <h3>Kvifor KI blir brukt</h3>
        <p>Viktigaste drivkrefter for bruk av KI.</p>
      </div>
      <div class="chart-meta" data-meta></div>
      <div class="chart-body" data-chart-body></div>
    </div>

    <div class="chart-card" data-chart="confidence" data-enabled="true" data-empty-label="Ingen svar">
      <div class="chart-head">
        <h3 id="confidence">Tryggleik i bruk av KI</h3>
        <p>Opplevd tryggleik ved bruk i jobbkvardagen.</p>
      </div>
      <div class="chart-meta" data-meta></div>
      <div class="chart-body" data-chart-body></div>
    </div>

    <div class="chart-card" data-chart="training" data-enabled="true" data-empty-label="Ingen svar">
      <div class="chart-head">
        <h3>Opplæring gjennom jobben</h3>
        <p>Har tilsette fått opplæring i KI?</p>
      </div>
      <div class="chart-meta" data-meta></div>
      <div class="chart-body" data-chart-body></div>
    </div>

    <div class="chart-card" data-chart="payer" data-enabled="true" data-empty-label="Ingen svar">
      <div class="chart-head">
        <h3 id="payer">Kven betaler for verktøya</h3>
        <p>Korleis lisensane blir finansierte i praksis.</p>
      </div>
      <div class="chart-meta" data-meta></div>
      <div class="chart-body" data-chart-body></div>
    </div>
  </div>
</section>

<script src="{{ '/assets/license-usage-survey.js' | relative_url }}" defer></script>
