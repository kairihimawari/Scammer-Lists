let items = load() || [
  {id:crypto.randomUUID(),name:'Juan Dela Cruz',alias:'ShopScam',number:'+63 912 000 0000',description:'Fake online store, took payments and did not deliver',verifiedBy:'Community A'},
  {id:crypto.randomUUID(),name:'Maria Santos',alias:'QuickLoanX',number:'+63 927 111 2222',description:'Loan scam - asked for upfront payment',verifiedBy:''},
  {id:crypto.randomUUID(),name:'Carlos Reyes',alias:'PhGoods',number:'+63 917 333 4444',description:'Cloned profiles used to scam buyers',verifiedBy:'User B'}
];

let editingId = null;

const qEl = document.getElementById('q');
const resultsEl = document.getElementById('results');
const countEl = document.getElementById('count');
const emptyEl = document.getElementById('empty');
const filterVerified = document.getElementById('filterVerified');
const modal = document.getElementById('modal');
const entryForm = document.getElementById('entryForm');
const addBtn = document.getElementById('addBtn');

function render() {
  const q = qEl.value.trim().toLowerCase();
  const filter = filterVerified.value;
  const filtered = items.filter(it => {
    if (filter === 'verified' && !it.verifiedBy) return false;
    if (filter === 'unverified' && it.verifiedBy) return false;
    if (!q) return true;
    return [it.name, it.alias, it.number, it.description, it.verifiedBy].join(' ').toLowerCase().includes(q);
  });

  resultsEl.innerHTML = '';
  if (filtered.length === 0) {
    emptyEl.style.display = 'block';
    countEl.textContent = 0;
    return;
  } else {
    emptyEl.style.display = 'none';
  }

  countEl.textContent = filtered.length;
  const grid = document.createElement('div');
  grid.className = 'grid';

  filtered.forEach(it => {
    const card = document.createElement('div');
    card.className = 'card';
    const head = document.createElement('div');
    head.className = 'item-head';

    const left = document.createElement('div');
    left.innerHTML = `<div style="font-weight:700">${escapeHtml(it.name)} <span class="alias">${it.alias ? `(${escapeHtml(it.alias)})` : ''}</span></div>
      <div class="meta">${escapeHtml(it.number)} &middot; ${it.verifiedBy ? `Verified by ${escapeHtml(it.verifiedBy)}` : 'Unverified'}</div>`;
    head.appendChild(left);

    const right = document.createElement('div');
    right.innerHTML = `<div class="actions">
      <button data-id="${it.id}" class="editBtn ghost" ${!isAdmin ? 'disabled' : ''}>Edit</button>
      <button data-id="${it.id}" class="delBtn" style="background:var(--danger);color:#fff" ${!isAdmin ? 'disabled' : ''}>Delete</button>
    </div>`;
    head.appendChild(right);
    card.appendChild(head);

    const desc = document.createElement('div');
    desc.className = 'desc';
    desc.textContent = it.description || '—';
    card.appendChild(desc);

    grid.appendChild(card);
  });

  resultsEl.appendChild(grid);

  document.querySelectorAll('.editBtn').forEach(b => b.onclick = e => { if (isAdmin) openEdit(b.dataset.id); });
  document.querySelectorAll('.delBtn').forEach(b => b.onclick = e => { if (isAdmin) delItem(b.dataset.id); });
}

function escapeHtml(s) {
  if (!s) return '';
  return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function openModal(prefill) {
  if (!isAdmin) return;
  modal.style.display = 'flex';
  document.getElementById('formTitle').textContent = prefill ? 'Edit entry' : 'Add entry';
  if (prefill) {
    document.getElementById('name').value = prefill.name;
    document.getElementById('alias').value = prefill.alias;
    document.getElementById('number').value = prefill.number;
    document.getElementById('description').value = prefill.description;
    document.getElementById('verifiedBy').value = prefill.verifiedBy;
    editingId = prefill.id;
  } else {
    entryForm.reset();
    editingId = null;
  }
  document.getElementById('name').focus();
}

function closeModal() { modal.style.display = 'none'; editingId = null; }

function openEdit(id) { const it = items.find(x => x.id === id); if (!it || !isAdmin) return; openModal(it); }

function delItem(id) {
  if (!isAdmin) return;
  if (!confirm('Delete this entry?')) return;
  items = items.filter(x => x.id !== id);
  save(); render();
}

document.getElementById('cancelBtn').addEventListener('click', closeModal);
document.getElementById('addBtn').addEventListener('click', () => { if (isAdmin) openModal(); });
document.getElementById('saveBtn').addEventListener('click', () => {
  if (!isAdmin) return;
  const obj = {
    id: editingId || crypto.randomUUID(),
    name: document.getElementById('name').value.trim(),
    alias: document.getElementById('alias').value.trim(),
    number: document.getElementById('number').value.trim(),
    description: document.getElementById('description').value.trim(),
    verifiedBy: document.getElementById('verifiedBy').value.trim()
  };
  if (!obj.name) { alert('Name is required'); return; }
  if (editingId) {
    items = items.map(it => it.id === editingId ? obj : it);
    editingId = null;
  } else {
    items.unshift(obj);
  }
  save(); closeModal(); render();
});

function save() { localStorage.setItem('scammer_list_v1', JSON.stringify(items)); }
function load() { try { const raw = localStorage.getItem('scammer_list_v1'); return raw ? JSON.parse(raw) : null; } catch (e) { return null; } }

qEl.addEventListener('input', render);
filterVerified.addEventListener('change', render);

render();
