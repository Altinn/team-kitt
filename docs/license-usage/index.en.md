---
layout: docs
title: "License Usage"
display_title: "License Usage"
permalink: /en/docs/license-usage/
lang: en
ref: docs-license-usage
---

<div class="license-usage-hero">
  <div class="license-usage-card">
    <div class="license-usage-eyebrow">Allowed tools</div>
    <h2>GitHub Copilot and Claude are allowed.</h2>
    <p>This applies to usage in Digdir workflows.</p>
  </div>
</div>

<section class="survey-dashboard" data-survey-dashboard data-csv="{{ '/assets/Kartlegging.av.bruk.av.generativ.kunstig.intelligens.KI.i.Digdir.1-140.csv' | relative_url }}" data-loading-label="Loading charts..." data-error-label="Unable to load data." data-meta-template="N={n} responses">
  <div class="survey-header">
    <div>
      <h2 id="survey-results">Survey results</h2>
      <p>Interactive charts based on employee responses.</p>
    </div>
    <div class="survey-controls">
      <label>Department
        <select data-filter="department">
          <option value="*">All departments</option>
        </select>
      </label>
      <button type="button" class="survey-reset" data-action="reset">Reset filter</button>
    </div>
  </div>

  <div class="survey-grid">
    <div class="chart-card" data-chart="usage-frequency" data-enabled="true" data-empty-label="No responses">
      <div class="chart-head">
        <h3 id="usage-frequency">AI tool usage frequency</h3>
        <p>How often AI tools are used at work.</p>
      </div>
      <div class="chart-meta" data-meta></div>
      <div class="chart-body" data-chart-body></div>
    </div>

    <div class="chart-card" data-chart="tools" data-enabled="true" data-top="8" data-other-label="Other" data-top-note="Top 8 shown. Others grouped as Other." data-empty-label="No responses">
      <div class="chart-head">
        <h3 id="tools-in-use">AI tools in use</h3>
        <p>Tools mentioned most often.</p>
      </div>
      <div class="chart-meta" data-meta></div>
      <div class="chart-body" data-chart-body></div>
    </div>

    <div class="chart-card" data-chart="models" data-enabled="true" data-top="8" data-other-label="Other" data-top-note="Top 8 shown. Others grouped as Other." data-empty-label="No responses">
      <div class="chart-head">
        <h3>Preferred language models</h3>
        <p>Models mentioned most often.</p>
      </div>
      <div class="chart-meta" data-meta></div>
      <div class="chart-body" data-chart-body></div>
    </div>

    <div class="chart-card" data-chart="tasks" data-enabled="true" data-top="8" data-other-label="Other" data-top-note="Top 8 shown. Others grouped as Other." data-empty-label="No responses">
      <div class="chart-head">
        <h3 id="tasks">Tasks where AI is used</h3>
        <p>What AI is mainly used for.</p>
      </div>
      <div class="chart-meta" data-meta></div>
      <div class="chart-body" data-chart-body></div>
    </div>

    <div class="chart-card" data-chart="reasons" data-enabled="true" data-top="8" data-other-label="Other" data-top-note="Top 8 shown. Others grouped as Other." data-empty-label="No responses">
      <div class="chart-head">
        <h3>Reasons for using AI</h3>
        <p>Primary drivers behind AI usage.</p>
      </div>
      <div class="chart-meta" data-meta></div>
      <div class="chart-body" data-chart-body></div>
    </div>

    <div class="chart-card" data-chart="confidence" data-enabled="true" data-empty-label="No responses">
      <div class="chart-head">
        <h3 id="confidence">Confidence using AI at work</h3>
        <p>How safe people feel when using AI.</p>
      </div>
      <div class="chart-meta" data-meta></div>
      <div class="chart-body" data-chart-body></div>
    </div>

    <div class="chart-card" data-chart="training" data-enabled="true" data-empty-label="No responses">
      <div class="chart-head">
        <h3>Training through work</h3>
        <p>Whether employees received AI training.</p>
      </div>
      <div class="chart-meta" data-meta></div>
      <div class="chart-body" data-chart-body></div>
    </div>

    <div class="chart-card" data-chart="payer" data-enabled="true" data-empty-label="No responses">
      <div class="chart-head">
        <h3 id="payer">Who pays for the tools</h3>
        <p>How licenses are financed in practice.</p>
      </div>
      <div class="chart-meta" data-meta></div>
      <div class="chart-body" data-chart-body></div>
    </div>
  </div>
</section>

<script src="{{ '/assets/license-usage-survey.js' | relative_url }}" defer></script>
