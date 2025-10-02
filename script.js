// Utilities
function $(sel, root=document){ return root.querySelector(sel); }
function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

// Persistência
const STORAGE_KEY = 'rca_hub_v1';

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
    }))
  };
  return data;
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

// Fishbone highlight
function toggleBranchHighlight(category, active){
  // find a <g> with data-cat that matches the category text present
  const groups = $all('#fishbone g.branch');
  for(const g of groups){
    if(g.getAttribute('data-cat') === category){
      if(active) g.classList.add('active'); else g.classList.remove('active');
    }
  }
}

// Print
function toPDF(){
  window.print();
}

// Init
window.addEventListener('DOMContentLoaded', () => {
  // wire buttons
  $('#btnAddAcao').addEventListener('click', () => addAcao());
  $('#btnAddCausa').addEventListener('click', () => addCausa());
  $('#btnSalvar').addEventListener('click', save);
  $('#btnLimpar').addEventListener('click', clearAll);
  $('#btnPDF').addEventListener('click', toPDF);

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

  load(); // restore persisted data
});


// === OnePage builder & exporter ===
function buildOnePage() {
  const data = collectData();

  // compact helpers
  const safe = (v) => (v && String(v).trim()) ? v : '—';

  // Take top 6 ações and causas for compact layout
  const acoes = data.acoes.filter(a => a.desc?.trim()).slice(0, 6);
  const causas = data.causas.filter(c => c.desc?.trim()).slice(0, 6);

  const chips = data.fishbone.map(f => {
    const on = !!f.contribuiu;
    return `<span class="op-chip ${on ? 'on' : ''}">${f.cat}${on ? ' • contribuiu' : ''}</span>`;
  }).join('');

  // 5 porquês (mostrar da primeira hipótese, se houver)
  const pq = causas[0] || {};
  const porques = [pq.pq1, pq.pq2, pq.pq3, pq.pq4, pq.pq5].filter(Boolean);

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

    <div class="op-grid">
      <div class="op-card">
        <h3>Descrição & Contexto</h3>
        <div class="op-list">
          <div><b>Problema:</b> ${safe(data.problema.desc)}</div>
          <div><b>Não detectado antes:</b> ${safe(data.problema.naoDetectado)}</div>
          <div><b>Ação que agravou:</b> ${safe(data.problema.acaoAgravou)}</div>
          <div><b>Reincidente:</b> ${data.problema.reincidente === 'sim' ? 'Sim' : 'Não'}</div>
          <div><b>Relatórios anteriores:</b> ${data.problema.relatorios === 'sim' ? 'Sim' : 'Não'}</div>
        </div>
      </div>

      <div class="op-card">
        <h3>Ações Imediatas (top 6)</h3>
        <div class="op-list">
          ${acoes.length ? acoes.map((a, i) => `
            <div>${i+1}. ${safe(a.desc)} — <i>${safe(a.resp)}</i> ${a.prazo ? `(prazo: ${a.prazo})` : ''}</div>
          `).join('') : '<div>—</div>'}
        </div>
      </div>

      <div class="op-card">
        <h3>Hipóteses & 5 Porquês</h3>
        <div class="op-list">
          ${causas.length ? causas.map((c, i) => `<div><b>${i+1}.</b> ${safe(c.desc)}</div>`).join('') : '<div>—</div>'}
          <div style="margin-top:8px;"><b>5 Porquês (1ª hipótese):</b></div>
          ${porques.length ? porques.map((p, i) => `<div>${i+1}º por quê: ${safe(p)}</div>`).join('') : '<div>—</div>'}
        </div>
      </div>
    </div>

    <div class="op-footer">
      <div class="op-card">
        <h3>Espinha de Peixe — Categorias</h3>
        <div>${chips || '—'}</div>
      </div>
      <div class="op-card">
        <h3>Observações</h3>
        <div class="op-small">Use esta seção para anotações finais, referências ou links para evidências.</div>
      </div>
    </div>
  `;
}

async function exportOnePagePDF(){
  buildOnePage();
  const el = document.getElementById('onepage');
  el.classList.remove('hidden'); // show for render

  // Allow layout to paint
  await new Promise(r => setTimeout(r, 50));

  const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
  const imgData = canvas.toDataURL('image/png');

  const { jsPDF } = window.jspdf;
  // Create PDF with the canvas dimensions to avoid rescaling artifacts
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: [canvas.width, canvas.height],
    compress: true
  });

  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save('RCA-OnePage.pdf');

  el.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btnOnePage');
  if(btn){ btn.addEventListener('click', exportOnePagePDF); }
});
