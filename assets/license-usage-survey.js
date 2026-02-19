(() => {
  const dashboard = document.querySelector('[data-survey-dashboard]');
  if (!dashboard) return;

  const csvPath = dashboard.getAttribute('data-csv');
  if (!csvPath) return;

  const loadingLabel = dashboard.getAttribute('data-loading-label') || 'Loading charts...';
  const errorLabel = dashboard.getAttribute('data-error-label') || 'Unable to load data.';
  const metaTemplate = dashboard.getAttribute('data-meta-template') || 'N={n}';

  const chartEls = Array.from(dashboard.querySelectorAll('[data-chart]')).filter(
    (el) => el.dataset.enabled !== 'false'
  );
  const filterSelect = dashboard.querySelector('[data-filter="department"]');
  const resetButton = dashboard.querySelector('[data-action="reset"]');

  const setLoadingState = () => {
    chartEls.forEach((el) => {
      const body = el.querySelector('[data-chart-body]');
      if (!body) return;
      body.innerHTML = `<div class="chart-loading">${loadingLabel}</div>`;
    });
  };

  const setErrorState = () => {
    chartEls.forEach((el) => {
      const body = el.querySelector('[data-chart-body]');
      if (!body) return;
      body.innerHTML = `<div class="chart-loading">${errorLabel}</div>`;
    });
  };

  const normalize = (value) =>
    (value || '')
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9\u00C0-\u024f?]/g, '');

  const cleanValue = (value) =>
    (value || '')
      .replace(/\s+/g, ' ')
      .replace(/^[;,\s]+|[;,\s]+$/g, '')
      .trim();

  const splitMulti = (value) =>
    cleanValue(value)
      .split(/[;,]/)
      .map((part) => cleanValue(part))
      .filter(Boolean);

  const normalizeToken = (value) =>
    cleanValue(value)
      .toLowerCase()
      .replace(/[.]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const LABEL_OVERRIDES = {
    'github copilot': 'GitHub Copilot',
    'microsoft copilot m365': 'Microsoft Copilot M365',
    'chatgpt (gratisversjon)': 'ChatGPT (gratisversjon)',
    'chatgpt plus (betalversjon)': 'ChatGPT Plus (betalversjon)',
    'chatgpt (betalversjon)': 'ChatGPT Plus (betalversjon)',
    'claude i nettleser': 'Claude i nettleser',
    'claude desktop': 'Claude Desktop',
    'claude code': 'Claude Code',
    'google gemini': 'Google Gemini',
    'codex': 'Codex',
    'claude sonnett 4.5': 'Claude Sonnet 4.5',
    'claude  sonnett 4.5': 'Claude Sonnet 4.5',
    'claude opus 4.5': 'Claude Opus 4.5',
    'openai chatgpt 5.2 thinking': 'ChatGPT 5.2 Thinking',
    'gpt-4.1': 'GPT-4.1',
    'chatgpt': 'ChatGPT',
    'claude 4.5': 'Claude 4.5',
    'gemini 3 pro': 'Gemini 3 Pro',
    'mistral le chat pro': 'Mistral Le Chat Pro',
    'grok 4.1': 'Grok 4.1'
  };

  const formatLabel = (value) => {
    const token = normalizeToken(value);
    if (LABEL_OVERRIDES[token]) return LABEL_OVERRIDES[token];
    return cleanValue(value);
  };

  const parseCSV = (text) => {
    const rows = [];
    let row = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      const next = text[i + 1];

      if (inQuotes) {
        if (char === '"') {
          if (next === '"') {
            current += '"';
            i += 1;
          } else {
            inQuotes = false;
          }
        } else {
          current += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          row.push(current);
          current = '';
        } else if (char === '\n') {
          row.push(current);
          rows.push(row);
          row = [];
          current = '';
        } else if (char === '\r') {
          // Ignore
        } else {
          current += char;
        }
      }
    }

    if (current.length || row.length) {
      row.push(current);
      rows.push(row);
    }

    return rows;
  };

  const findHeader = (headers, prefix) => {
    const target = normalize(prefix);
    return headers.find((header) => normalize(header).startsWith(target));
  };

  const bucketTraining = (value) => {
    const lower = normalizeToken(value);
    if (!lower) return null;
    if (lower.startsWith('ja')) return 'Ja';
    if (lower.startsWith('nei')) return 'Nei';
    if (lower.startsWith('delvis') || lower.startsWith('litt')) return 'Delvis';
    return 'Annet';
  };

  const bucketPayer = (value) => {
    const lower = normalizeToken(value);
    if (!lower) return null;
    if (lower.includes('gratis')) return 'Gratisversjon';
    if (lower.includes('betaler selv')) return 'Betaler selv';
    if (lower.includes('refunder') || lower.includes('refusjon')) return 'Refundert';
    if (lower.includes('it drift') || lower.includes('anskaffet')) return 'Anskaffet av Digdir';
    if (lower.includes('bruker ikke')) return 'Bruker ikke';
    return 'Annet';
  };

  const collectCounts = (rows, field, config) => {
    const counts = new Map();
    let responses = 0;

    rows.forEach((row) => {
      const raw = cleanValue(row[field]);
      if (!raw) return;
      responses += 1;

      if (config.multi) {
        splitMulti(raw).forEach((entry) => {
          const label = formatLabel(entry);
          if (!label) return;
          counts.set(label, (counts.get(label) || 0) + 1);
        });
      } else if (config.bucket) {
        const bucketed = config.bucket(raw);
        if (!bucketed) return;
        counts.set(bucketed, (counts.get(bucketed) || 0) + 1);
      } else {
        const label = formatLabel(raw);
        if (!label) return;
        counts.set(label, (counts.get(label) || 0) + 1);
      }
    });

    return { counts, responses };
  };

  const orderWith = (items, order) => {
    if (!order || !order.length) {
      return items.sort((a, b) => b.value - a.value);
    }

    const orderMap = new Map(order.map((label, index) => [label, index]));
    return items.sort((a, b) => {
      const aIndex = orderMap.has(a.label) ? orderMap.get(a.label) : order.length + 1;
      const bIndex = orderMap.has(b.label) ? orderMap.get(b.label) : order.length + 1;
      if (aIndex !== bIndex) return aIndex - bIndex;
      return b.value - a.value;
    });
  };

  const prepareData = (counts, responses, config, el) => {
    if (!responses) return { items: [], responses };

    let items = Array.from(counts, ([label, value]) => ({
      label,
      value,
      percent: (value / responses) * 100
    }));

    items = orderWith(items, config.order);

    const top = Number(el.dataset.top || config.top || 0);
    if (top && items.length > top) {
      const otherLabel = el.dataset.otherLabel || 'Other';
      const topItems = items.slice(0, top);
      const otherValue = items.slice(top).reduce((sum, item) => sum + item.value, 0);
      topItems.push({
        label: otherLabel,
        value: otherValue,
        percent: (otherValue / responses) * 100,
        isOther: true
      });
      items = topItems;
    }

    return { items, responses };
  };

  const CHART_COLORS = [
    '#0062B8', '#1E98F5', '#F45F63', '#E5AA20',
    '#65707D', '#004F94', '#d94f53', '#c49118',
    '#4ba3f5', '#8b939e'
  ];

  const renderDonutChart = (el, data, responses, config) => {
    const body = el.querySelector('[data-chart-body]');
    const meta = el.querySelector('[data-meta]');
    if (!body || !meta) return;

    if (!responses) {
      const emptyLabel = el.dataset.emptyLabel || 'No responses';
      body.innerHTML = `<div class="chart-loading">${emptyLabel}</div>`;
      meta.textContent = '';
      return;
    }

    const metaText = metaTemplate.replace('{n}', responses);
    meta.textContent = metaText;

    const size = 140;
    const cx = size / 2;
    const cy = size / 2;
    const radius = 54;
    const stroke = 22;

    const items = data.items;
    const total = items.reduce((s, item) => s + item.value, 0);

    let cumulative = 0;
    const arcs = items.map((item, i) => {
      const frac = item.value / total;
      const startAngle = cumulative * 2 * Math.PI - Math.PI / 2;
      cumulative += frac;
      const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;
      const largeArc = frac > 0.5 ? 1 : 0;
      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);
      const gap = items.length > 1 ? 0.02 : 0;
      const adjEnd = endAngle - gap;
      const x2 = cx + radius * Math.cos(adjEnd);
      const y2 = cy + radius * Math.sin(adjEnd);
      const color = CHART_COLORS[i % CHART_COLORS.length];
      const d = frac >= 0.9999
        ? `M ${cx + radius},${cy} A ${radius},${radius} 0 1,1 ${cx + radius - 0.001},${cy}`
        : `M ${x1},${y1} A ${radius},${radius} 0 ${largeArc},1 ${x2},${y2}`;
      return { d, color, label: item.label, value: item.value, percent: item.percent };
    });

    const paths = arcs
      .map(
        (a) =>
          `<path d="${a.d}" fill="none" stroke="${a.color}" stroke-width="${stroke}" stroke-linecap="butt"><title>${a.label}: ${a.value} (${a.percent.toFixed(1)}%)</title></path>`
      )
      .join('');

    const legend = items
      .map((item, i) => {
        const color = CHART_COLORS[i % CHART_COLORS.length];
        return `<div class="donut-legend-item">
          <span class="donut-swatch" style="background:${color}"></span>
          <span class="donut-legend-label">${item.label}</span>
          <span class="donut-legend-value">${item.value} (${item.percent.toFixed(0)}%)</span>
        </div>`;
      })
      .join('');

    body.innerHTML = `<div class="donut-chart">
      <div class="donut-ring">
        <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
          ${paths}
          <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central" class="donut-center-number">${total}</text>
        </svg>
      </div>
      <div class="donut-legend">${legend}</div>
    </div>`;
  };

  const renderBarChart = (el, data, responses, config) => {
    const body = el.querySelector('[data-chart-body]');
    const meta = el.querySelector('[data-meta]');
    if (!body || !meta) return;

    if (!responses) {
      const emptyLabel = el.dataset.emptyLabel || 'No responses';
      body.innerHTML = `<div class="chart-loading">${emptyLabel}</div>`;
      meta.textContent = '';
      return;
    }

    const metaText = metaTemplate.replace('{n}', responses);
    const top = Number(el.dataset.top || config.top || 0);
    const topNote = el.dataset.topNote;
    meta.textContent = top && topNote ? `${metaText} - ${topNote}` : metaText;

    const chart = document.createElement('div');
    chart.className = 'bar-chart';

    data.items.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'bar-row';

      const label = document.createElement('div');
      label.className = 'bar-label';
      label.textContent = item.label;

      const track = document.createElement('div');
      track.className = 'bar-track';

      const fill = document.createElement('div');
      fill.className = 'bar-fill';
      fill.style.width = `${item.percent}%`;
      fill.setAttribute('data-percent', item.percent.toFixed(1));
      fill.setAttribute('data-value', item.value);
      fill.title = `${item.label}: ${item.value} (${item.percent.toFixed(1)}%)`;

      const value = document.createElement('div');
      value.className = 'bar-value';
      value.textContent = `${item.value} (${item.percent.toFixed(0)}%)`;

      track.appendChild(fill);
      row.appendChild(label);
      row.appendChild(track);
      row.appendChild(value);
      chart.appendChild(row);
    });

    body.innerHTML = '';
    body.appendChild(chart);
  };

  const buildCharts = (rows, fields) => {
    const configs = {
      'usage-frequency': {
        field: fields.useAI,
        type: 'donut',
        order: ['Ja, daglig', 'Ja, ukentlig', 'Av og til', 'Nei, aldri']
      },
      tools: {
        field: fields.tools,
        multi: true,
        top: 8
      },
      models: {
        field: fields.models,
        multi: true,
        top: 8
      },
      payer: {
        field: fields.payer,
        type: 'donut',
        bucket: bucketPayer,
        order: ['Betaler selv', 'Gratisversjon', 'Anskaffet av Digdir', 'Refundert', 'Bruker ikke', 'Annet']
      },
      confidence: {
        field: fields.confidence,
        type: 'donut',
        order: ['Svært trygg', 'Ganske trygg', 'Verken utrygg eller trygg', 'Ganske utrygg', 'Svært utrygg']
      },
      training: {
        field: fields.training,
        type: 'donut',
        bucket: bucketTraining,
        order: ['Ja', 'Delvis', 'Nei', 'Annet']
      },
      tasks: {
        field: fields.tasks,
        multi: true,
        top: 8
      },
      reasons: {
        field: fields.reasons,
        multi: true,
        top: 8
      }
    };

    const renderAll = (filteredRows) => {
      chartEls.forEach((el) => {
        const config = configs[el.dataset.chart];
        if (!config || !config.field) return;
        const { counts, responses } = collectCounts(filteredRows, config.field, config);
        const prepared = prepareData(counts, responses, config, el);
        const render = config.type === 'donut' ? renderDonutChart : renderBarChart;
        render(el, prepared, responses, config);
      });
    };

    renderAll(rows);

    if (filterSelect) {
      filterSelect.addEventListener('change', () => {
        const selected = filterSelect.value;
        const filtered = selected === '*'
          ? rows
          : rows.filter((row) => cleanValue(row[fields.department]) === selected);
        renderAll(filtered);
      });
    }

    if (resetButton) {
      resetButton.addEventListener('click', () => {
        if (filterSelect) {
          filterSelect.value = '*';
        }
        renderAll(rows);
      });
    }
  };

  const populateDepartments = (rows, field) => {
    if (!filterSelect || !field) return;
    const values = new Set();
    rows.forEach((row) => {
      const value = cleanValue(row[field]);
      if (value) values.add(value);
    });

    Array.from(values)
      .sort((a, b) => a.localeCompare(b, 'no'))
      .forEach((value) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        filterSelect.appendChild(option);
      });
  };

  const resolveFields = (headers) => ({
    department: findHeader(headers, 'Avdeling'),
    useAI: findHeader(headers, 'Bruker du KI-verktøy i jobben din?'),
    tools: findHeader(headers, 'Hvilke KI-verktøy bruker du?'),
    models: findHeader(headers, 'Hvilke språkmodeller foretrekker du?'),
    payer: findHeader(headers, 'Hvem betaler for KI-verktøyet?'),
    tasks: findHeader(headers, 'Til hvilke oppgaver bruker du KI?'),
    reasons: findHeader(headers, 'Hvorfor bruker du KI?'),
    confidence: findHeader(headers, 'Hvor trygg føler du deg på bruk av KI i jobben?'),
    training: findHeader(headers, 'Har du fått opplæring i KI gjennom jobben?')
  });

  setLoadingState();

  fetch(csvPath)
    .then((response) => response.text())
    .then((text) => {
      const cleaned = text.replace(/^\uFEFF/, '');
      const rows = parseCSV(cleaned);
      const headers = rows.shift();
      if (!headers || !headers.length) throw new Error('Missing headers');

      const fields = resolveFields(headers);
      const dataRows = rows.map((row) => {
        const entry = {};
        headers.forEach((header, index) => {
          entry[header] = row[index] || '';
        });
        return entry;
      });

      populateDepartments(dataRows, fields.department);
      buildCharts(dataRows, fields);
    })
    .catch(() => {
      setErrorState();
    });
})();
