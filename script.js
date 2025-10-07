// Utilities
function $(sel, root=document){ return root.querySelector(sel); }
function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

// Persistência
const STORAGE_KEY = 'rca_hub_v2';

// scroll suave para os links do menu
document.querySelectorAll('.sidebar nav a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', id);
    }
  });
});


function collectData(){
  const data = {
    info: {
      investigador: $('#investigador').value,
      processo: $('#processo').value,
      equipamento: $('#equipamento').value,
      data: $('#data').value,
      os: $('#os').value,
    },
    problema: {
      desc: $('#descProblema').value,
      naoDetectado: $('#naoDetectado').value,
      acaoAgravou: $('#acaoAgravou').value,
      reincidente: document.querySelector('input[name="reincidente"]:checked')?.value || 'nao',
      relatorios: document.querySelector('input[name="relatorios"]:checked')?.value || 'nao',
    },
    acoes: $all('#listaAcoes .list-item').map(item => ({
      desc: item.querySelector('.acao-desc').value,
      resp: item.querySelector('.acao-resp').value,
      prazo: item.querySelector('.acao-prazo').value,
    })),
    causas: $all('#listaCausas .list-item').map(item => ({
      desc: item.querySelector('.causa-desc').value,
      pq1: item.querySelector('.pq1').value,
      pq2: item.querySelector('.pq2').value,
      pq3: item.querySelector('.pq3').value,
      pq4: item.querySelector('.pq4').value,
      pq5: item.querySelector('.pq5').value,
    })),
    fishbone: $all('.fish-col').map(col => ({
      cat: col.dataset.cat,
      contribuiu: col.querySelector('.contrib').checked,
      fatores: col.querySelector('textarea').value,
    })),
    acoesFuturas: $all('#listaAcoesFuturas .list-item').map(item => ({
    desc: item.querySelector('.acaoF-desc').value,
    resp: item.querySelector('.acaoF-resp').value,
    prazo: item.querySelector('.acaoF-prazo').value,
    status: item.querySelector('.acaoF-status').value,
})),
  };
  return data;
}

function escapeHTML(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function nl2br(str = '') {
  // escapa HTML e troca \n por <br>
  return escapeHTML(str).replace(/\r?\n/g, '<br>');
}

function populateData(data){
  if(!data) return;
  const {info, problema, acoes, causas, fishbone} = data;
  if(info){
    $('#investigador').value = info.investigador || '';
    $('#processo').value = info.processo || '';
    $('#equipamento').value = info.equipamento || '';
    $('#data').value = info.data || '';
    $('#os').value = info.os || '';
  }
  if(problema){
    $('#descProblema').value = problema.desc || '';
    $('#naoDetectado').value = problema.naoDetectado || '';
    $('#acaoAgravou').value = problema.acaoAgravou || '';
    if(problema.reincidente) document.querySelector(`input[name="reincidente"][value="${problema.reincidente}"]`).checked = true;
    if(problema.relatorios) document.querySelector(`input[name="relatorios"][value="${problema.relatorios}"]`).checked = true;
  }
  if(Array.isArray(acoes)){
    $('#listaAcoes').innerHTML = '';
    for(const a of acoes){ addAcao(a); }
  }
  if(Array.isArray(causas)){
    $('#listaCausas').innerHTML = '';
    for(const c of causas){ addCausa(c); }
  }
  if(Array.isArray(fishbone)){
    for(const f of fishbone){
      const col = $(`.fish-col[data-cat="${f.cat}"]`);
      if(!col) continue;
      col.querySelector('textarea').value = f.fatores || '';
      col.querySelector('.contrib').checked = !!f.contribuiu;
      toggleBranchHighlight(f.cat, !!f.contribuiu);
    }
  }
  if (Array.isArray(data.acoesFuturas)) {
  $('#listaAcoesFuturas').innerHTML = '';
  for (const a of data.acoesFuturas) { addAcaoFutura(a); }
}
}

function save(){
  const data = collectData();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  alert('Informações salvas no navegador.');
}

function load(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(!raw) return;
  try { populateData(JSON.parse(raw)); } catch(e){ console.warn(e); }
}

function clearAll(){
  if(!confirm('Tem certeza que deseja limpar todos os campos?')) return;
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}

// Ações Imediatas
function addAcao(prefill){
  const tpl = document.getElementById('tplAcao');
  const node = tpl.content.firstElementChild.cloneNode(true);
  if(prefill){
    node.querySelector('.acao-desc').value = prefill.desc || '';
    node.querySelector('.acao-resp').value = prefill.resp || '';
    node.querySelector('.acao-prazo').value = prefill.prazo || '';
  }
  node.querySelector('.btnRemover').addEventListener('click', () => node.remove());
  document.getElementById('listaAcoes').appendChild(node);
}

function addAcaoFutura(prefill){
  const tpl = document.getElementById('tplAcaoFutura');
  const node = tpl.content.firstElementChild.cloneNode(true);

  if (prefill){
    node.querySelector('.acaoF-desc').value = prefill.desc || '';
    node.querySelector('.acaoF-resp').value = prefill.resp || '';
    node.querySelector('.acaoF-prazo').value = prefill.prazo || '';
    if (prefill.status) node.querySelector('.acaoF-status').value = prefill.status;
  }

  node.querySelector('.btnRemoverFutura').addEventListener('click', () => node.remove());
  document.getElementById('listaAcoesFuturas').appendChild(node);
}

// Causas / 5 porquês
function addCausa(prefill){
  const tpl = document.getElementById('tplCausa');
  const node = tpl.content.firstElementChild.cloneNode(true);
  if(prefill){
    node.querySelector('.causa-desc').value = prefill.desc || '';
    node.querySelector('.pq1').value = prefill.pq1 || '';
    node.querySelector('.pq2').value = prefill.pq2 || '';
    node.querySelector('.pq3').value = prefill.pq3 || '';
    node.querySelector('.pq4').value = prefill.pq4 || '';
    node.querySelector('.pq5').value = prefill.pq5 || '';
  }
  node.querySelector('.btnRemoverCausa').addEventListener('click', () => node.remove());
  document.getElementById('listaCausas').appendChild(node);
}

// Fishbone highlight (na página principal)
function toggleBranchHighlight(category, active){
  const groups = $all('#fishbone g.branch');
  for(const g of groups){
    if(g.getAttribute('data-cat') === category){
      if(active) g.classList.add('active'); else g.classList.remove('active');
    }
  }
}

// Print
function toPDF(){ window.print(); }

// === OnePage: gerar SVG do Ishikawa com destaques ===
function generateFishboneSVG(factors){
  const cats = [
    { key: "Método", x: 0, upper: true, label:"Método" },
    { key: "Máquina", x: 140, upper: true, label:"Máquina" },
    { key: "Mão de Obra", x: 280, upper: true, label:"Mão de Obra" },
    { key: "Material", x: 0, upper: false, label:"Material" },
    { key: "Medida", x: 140, upper: false, label:"Medida" },
    { key: "Meio Ambiente", x: 280, upper: false, label:"Meio Ambiente" }
  ];
  const map = Object.fromEntries(factors.map(f => [f.cat, f]));
  const branch = (c) => {
    const active = !!map[c.key]?.contribuiu;
    const color = active ? "#f59e0b" : "#94a3b8";
    const y2 = c.upper ? 120 : 300;
    const ty = c.upper ? 110 : 320;
    const tx = c.key === "Mão de Obra" ? 90 : (c.key === "Meio Ambiente" ? 60 : 120);
    return `
      <g data-cat="${c.key}" class="branch${active ? " active":""}" transform="translate(${c.x},0)">
        <line x1="250" y1="210" x2="150" y2="${y2}" stroke="${color}" stroke-width="${active?4:2.5}" />
        <text x="${tx}" y="${ty}" fill="${active ? "#0f172a" : "#64748b"}" font-size="13">${c.label}</text>
      </g>
    `;
  };
  return `
  <svg viewBox="0 0 1000 420" role="img" aria-label="Diagrama de espinha de peixe">
    <line x1="80" y1="210" x2="900" y2="210" stroke="#94a3b8" stroke-width="3"/>
    <polygon points="900,210 860,195 860,225" fill="#94a3b8"/>
    ${cats.map(branch).join("")}
    <text x="910" y="215" fill="#0f172a" font-weight="700" font-size="14">Problema</text>
  </svg>`;
}

function formatDateBR(iso){
  if(!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso; // se não for ISO, retorna como veio
  return d.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}

function buildAcoesFuturasBlock(acoesFuturas = []){
  const items = (acoesFuturas || []).filter(a => (a.desc||'').trim().length);

  const rows = items.length ? items.map((a, i) => {
    const status = (a.status || 'pendente').toLowerCase();
    const statusLabel = status === 'concluida' ? 'Concluída' : 'Pendente';
    return `
      <div class="op-row">
        <div class="op-col main">
          <div class="op-title">${i+1}. ${a.desc || '—'}</div>
          <div class="op-meta">Resp.: <b>${a.resp || '—'}</b> • Prazo: <b>${formatDateBR(a.prazo)}</b></div>
        </div>
        <div class="op-col status">
          <span class="status-chip ${status}">${statusLabel}</span>
        </div>
      </div>
    `;
  }).join('') : `<div class="op-empty">— Sem ações futuras cadastradas —</div>`;

  // ✅ faltava isto:
  return rows;
}

// === OnePage builder (3 setores) & exporter ===
function buildOnePage() {
  const data = collectData();
  const safe = (v) => (v && String(v).trim()) ? v : '—';

  const acoes = data.acoes.filter(a => a.desc?.trim());
  const causas = data.causas.filter(c => c.desc?.trim());
  // separar itens do Ishikawa por contribuição
  const contribs = data.fishbone.filter(f =>
    f.contribuiu && (f.fatores || '').trim().length
  );
  const avaliados = data.fishbone.filter(f =>
    !f.contribuiu && (f.fatores || '').trim().length
  );

  // helpers de linha (usa nl2br se você já adicionou anteriormente)
  const linhasContrib = contribs.length
  ? contribs.map(f => `
      <div class="op-row">
        <div class="op-col main">
          <div class="op-title">${f.cat}</div>
          <div class="op-meta"><span class="pill contrib">Contribuiu</span></div>
          <div class="op-text">${f.fatores ? nl2br(f.fatores) : '—'}</div>
        </div>
      </div>
    `).join('')
  : `<div class="op-empty">— Nenhum item contribuinte informado —</div>`;

  const linhasAvaliados = avaliados.length
  ? avaliados.map(f => `
      <div class="op-row">
        <div class="op-col main">
          <div class="op-title">${f.cat}</div>
          <div class="op-meta"><span class="pill neutral">Avaliados</span></div>
          <div class="op-text">${f.fatores ? nl2br(f.fatores) : '—'}</div>
        </div>
      </div>
    `).join('')
  : `<div class="op-empty">— Sem itens avaliados não contribuintes —</div>`;    

  const porquesDetalhados = causas.map((c, idx) => ({
    idx: idx + 1, desc: c.desc, porques: [c.pq1, c.pq2, c.pq3, c.pq4, c.pq5].filter(Boolean)
  }));

  const fishSVG = generateFishboneSVG(data.fishbone);
  const comentariosContrib = contribs.map(f => `<div><b>${f.cat}:</b> ${f.fatores ? nl2br(f.fatores) : '—'}</div>`).join('') || '—';
  const chips = data.fishbone.map(f => `<span class="op-chip ${f.contribuiu ? 'on' : ''}">${f.cat}${f.contribuiu ? ' • contribuiu' : ''}</span>`).join('');
  
  
  
  const acoesFuturasHTML = buildAcoesFuturasBlock(data.acoesFuturas);

  const el = document.getElementById('onepage');
  el.innerHTML = `
    <div class="op-header">
      <div>
        <div class="op-title">Análise de Causa Raiz — OnePage</div>
        <div class="op-meta">
          <div><b>Investigador(a):</b> ${safe(data.info.investigador)}</div>
          <div><b>Processo:</b> ${safe(data.info.processo)}</div>
          <div><b>Equipamento:</b> ${safe(data.info.equipamento)}</div>
          <div><b>Data:</b> ${safe(data.info.data)}</div>
          <div><b>OS:</b> ${safe(data.info.os)}</div>
        </div>
      </div>
      <div class="op-small">Gerado por RCA Hub — ${new Date().toLocaleString()}</div>
    </div>

    <div class="op-three">
      <!-- Setor 1: Descrição & Ações imediatas -->
      <div class="op-card">
        <h3>Descrição & Contexto</h3>
        <div class="op-list">
          <div><b>Problema:</b> ${data.problema.desc ? nl2br(data.problema.desc) : '—'}</div>
          <div><b>Não detectado antes:</b> ${data.problema.naoDetectado ? nl2br(data.problema.naoDetectado) : '—'}</div>
          <div><b>Ação que agravou:</b> ${data.problema.acaoAgravou ? nl2br(data.problema.acaoAgravou) : '—'}</div>
          <div><b>Reincidente:</b> ${data.problema.reincidente === 'sim' ? 'Sim' : 'Não'}</div>
          <div><b>Relatórios anteriores:</b> ${data.problema.relatorios === 'sim' ? 'Sim' : 'Não'}</div>
        </div>
        <h3 style="margin-top:8px;">Ações Imediatas</h3>
        <div class="op-list">
          ${acoes.length ? acoes.map((a,i)=>`
            <div>${i+1}. ${safe(a.desc)} — <i>${safe(a.resp)}</i> ${a.prazo ? `(prazo: ${a.prazo})` : ''}</div>
          `).join('') : '—'}
        </div>
      </div>

      <!-- Setor 2: Ishikawa + comentários -->
      <div class="op-card op-fishbone-card">
        <h3>Diagrama de Ishikawa (Espinha de Peixe)</h3>
        <div class="op-fishbone">${fishSVG}</div>
        <div class="op-subgrid">
          <div class="op-card op-sub">
            <h3 style="margin-top:8px;color:#f59e0b;">Itens que contribuíram</h3>
            <div class="op-timeline">
              ${linhasContrib}
            </div>
          </div>
          <div class="op-card op-sub">
            <h3 style="margin-top:8px;color:#16a34a;">Avaliados (não contribuíram)</h3>
            <div class="op-timeline">
              ${linhasAvaliados}
            </div>
          </div>
        </div>
      </div>

      <!-- Setor 3: Hipóteses & 5 Porquês -->
      <div class="op-card">
        <h3 style="margin-top:2px;">5 Porquês (detalhados)</h3>
        <div class="op-list">
          ${porquesDetalhados.length ? porquesDetalhados.map(item => `
            <div>
              <div><b>Hipótese ${item.idx}:</b> ${safe(item.desc)}</div>
              ${item.porques.length ? item.porques.map((p, i) => `<div>${i+1}º por quê: ${safe(p)}</div>`).join('') : '<div>—</div>'}
            </div>
          `).join('') : '—'}
        </div>
        <div class="op-card op-roadmap">
          <h3>Ações Futuras</h3>
          <div class="op-timeline">
            ${acoesFuturasHTML}
          </div>
        </div>
      </div>
    </div>

    <div class="op-footer">
      <div class="op-card">
        <h3>Observações</h3>
        <div class="op-muted">Use esta seção para observações finais, referências e evidências.</div>
      </div>
      <div class="op-card">
        <h3>Categorias destacadas</h3>
        <div class="op-chips">${chips || '—'}</div>
      </div>
    </div>
  `;
}

async function exportOnePagePDF(){
  buildOnePage();
  const el = document.getElementById('onepage');
  el.classList.remove('hidden');

  await new Promise(r => setTimeout(r, 50));

  const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
  const imgData = canvas.toDataURL('image/png');

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: [canvas.width, canvas.height], compress: true });
  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save('RCA-OnePage.pdf');

  el.classList.add('hidden');
}

// Init
window.addEventListener('DOMContentLoaded', () => {
  $('#btnAddAcao').addEventListener('click', () => addAcao());
  $('#btnAddCausa').addEventListener('click', () => addCausa());
  $('#btnSalvar').addEventListener('click', save);
  $('#btnLimpar').addEventListener('click', clearAll);
  $('#btnPDF').addEventListener('click', toPDF);
  $('#btnAddAcaoFutura')?.addEventListener('click', () => addAcaoFutura());
  const btn = document.getElementById('btnOnePage');
  if(btn){ btn.addEventListener('click', exportOnePagePDF); }

  // fishbone switches
  $all('.contrib').forEach(chk => {
    chk.addEventListener('change', (e) => {
      toggleBranchHighlight(e.target.dataset.target, e.target.checked);
    });
  });

  // preencher data se vazia
  const dataInput = $('#data');
  if(!dataInput.value){
    const today = new Date();
    dataInput.value = today.toISOString().slice(0,10);
  }

  load();
});
