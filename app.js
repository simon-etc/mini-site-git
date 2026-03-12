// ============================================================
// League of Legends – Lore, Champions, Runes & Patch Notes
// Sources : Riot Data Dragon (officiel) + Meraki Analytics
// ============================================================

const DDragon = {
  versions: 'https://ddragon.leagueoflegends.com/api/versions.json',
  champions: v => `https://ddragon.leagueoflegends.com/cdn/${v}/data/fr_FR/champion.json`,
  champion:  (v, id) => `https://ddragon.leagueoflegends.com/cdn/${v}/data/fr_FR/champion/${id}.json`,
  runes:     v => `https://ddragon.leagueoflegends.com/cdn/${v}/data/fr_FR/runesReforged.json`,
  imgChamp:  (v, img) => `https://ddragon.leagueoflegends.com/cdn/${v}/img/champion/${img}`,
  splash:    name => `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${name}_0.jpg`,
  runeIcon:  path => `https://ddragon.leagueoflegends.com/cdn/img/${path}`,
};

const Meraki = {
  champions: 'https://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions.json',
};

// ── Recommandations de runes par tag ──────────────────────────────────────────
const RUNE_RECS = {
  Assassin: [
    {
      situation: 'Burst / Général',
      keystone: 'Électrocution',
      primary: 'Domination', secondary: 'Précision',
      runes: ['Électrocution', 'Coup Sombre', 'Empreinte', 'Chasseur Vorace', 'Triomphe', 'Légende : Agilité'],
      stats: ['PA', 'PA', 'PV'],
      tip: 'Dégâts explo­sifs sur 3 touches. Idéal pour les assassins burst comme Zed, Talon, Katarina.',
    },
    {
      situation: 'Late Game / Snowball',
      keystone: 'Moisson Noire',
      primary: 'Domination', secondary: 'Sorcellerie',
      runes: ['Moisson Noire', 'Collecte de Têtes', 'Œil Affûté', 'Chasseur Impitoyable', 'Météore', 'Absolue Concentration'],
      stats: ['PA', 'PA', 'PV'],
      tip: 'Puissance croissante à chaque kill. Meilleur en late game ou si vous avez de l\'avance.',
    },
  ],
  Fighter: [
    {
      situation: 'Duel / Général',
      keystone: 'Conquérant',
      primary: 'Précision', secondary: 'Résolution',
      runes: ['Conquérant', 'Triomphe', 'Légende : Ténacité', 'Dernier Combat', 'Marque des Anciens', 'Os Solide'],
      stats: ['PA', 'PA', 'PV'],
      tip: 'Optimal pour les combats prolongés. Gagnez en puissance au fil du combat. Idéal pour Darius, Fiora, Renekton.',
    },
    {
      situation: 'Tank Bruiser',
      keystone: 'Emprise des Morts',
      primary: 'Résolution', secondary: 'Précision',
      runes: ['Emprise des Morts', 'Démolition', 'Conditionnement', 'Croissance Excessive', 'Triomphe', 'Légende : Ténacité'],
      stats: ['PV', 'Armure', 'Rés. Mag.'],
      tip: 'Jouer tanky tout en restant dangereux. Très fort pour les bruisers de top comme Malphite, Nasus.',
    },
  ],
  Tank: [
    {
      situation: 'Frontline / Général',
      keystone: 'Emprise des Morts',
      primary: 'Résolution', secondary: 'Précision',
      runes: ['Emprise des Morts', 'Démolition', 'Conditionnement', 'Croissance Excessive', 'Triomphe', 'Légende : Ténacité'],
      stats: ['PV', 'Armure', 'Rés. Mag.'],
      tip: 'Devenez un mur indestructible. Excellent pour Malphite, Leona, Nautilus.',
    },
    {
      situation: 'Engage / CC Chain',
      keystone: 'Contrecœur',
      primary: 'Résolution', secondary: 'Inspiration',
      runes: ['Contrecœur', 'Soudure', 'Conditionnement', 'Croissance Excessive', 'Chaussures Magiques', 'Livraison de Biscuits'],
      stats: ['PV', 'Armure', 'Rés. Mag.'],
      tip: 'Pour les tanks qui initient les teamfights avec des CC forts.',
    },
  ],
  Mage: [
    {
      situation: 'Poke / Lane',
      keystone: 'Comète Arcane',
      primary: 'Sorcellerie', secondary: 'Inspiration',
      runes: ['Comète Arcane', 'Phase de Lancement', 'Absolue Concentration', 'Brûlure', 'Livraison de Biscuits', 'Chaussures Magiques'],
      stats: ['PA', 'PA', 'PV'],
      tip: 'Poke constant depuis la distance. Idéal pour Lux, Xerath, Morgana.',
    },
    {
      situation: 'Burst / All-in',
      keystone: 'Électrocution',
      primary: 'Domination', secondary: 'Sorcellerie',
      runes: ['Électrocution', 'Coup Sombre', 'Empreinte', 'Chasseur Vorace', 'Transposition', 'Célérité'],
      stats: ['PA', 'PA', 'PV'],
      tip: 'Maximiser les dégâts en un burst. Pour Sylas, Annie, Veigar.',
    },
    {
      situation: 'Mobilité / Kiting',
      keystone: 'Phase de Ruée',
      primary: 'Sorcellerie', secondary: 'Domination',
      runes: ['Phase de Ruée', 'Mana Flow Band', 'Absolue Concentration', 'Brûlure', 'Coup Sombre', 'Chasseur Vorace'],
      stats: ['PA', 'PA', 'PV'],
      tip: 'Kiter l\'ennemi facilement et rester hors de portée. Pour Cassiopeia, Ryze.',
    },
  ],
  Marksman: [
    {
      situation: 'DPS / Général',
      keystone: 'Tempo Mortel',
      primary: 'Précision', secondary: 'Domination',
      runes: ['Tempo Mortel', 'Présence d\'Esprit', 'Légende : Agilité', 'Achèvement', 'Collecte de Têtes', 'Chasseur Vorace'],
      stats: ['PA', 'PA', 'PV'],
      tip: 'DPS maximal sur cibles immobiles. Idéal pour Jinx, Caitlyn, Kog\'Maw.',
    },
    {
      situation: 'Burst / Early',
      keystone: 'Pression sur la Plaie',
      primary: 'Précision', secondary: 'Domination',
      runes: ['Pression sur la Plaie', 'Triomphe', 'Légende : Agilité', 'Achèvement', 'Collecte de Têtes', 'Chasseur Vorace'],
      stats: ['PA', 'PA', 'PV'],
      tip: 'Fort en early game avec anti-soin. Pour Draven, Kalista, Miss Fortune.',
    },
  ],
  Support: [
    {
      situation: 'Enchanteur / Soin',
      keystone: 'Aery de l\'Invocateur',
      primary: 'Sorcellerie', secondary: 'Inspiration',
      runes: ['Aery de l\'Invocateur', 'Mana Flow Band', 'Transcendance', 'Puissance Récoltée', 'Chaussures Magiques', 'Livraison de Biscuits'],
      stats: ['PA', 'PA', 'PV'],
      tip: 'Pour les supports de soin et bouclier : Lulu, Nami, Soraka, Yuumi.',
    },
    {
      situation: 'Tank / Engage',
      keystone: 'Gardien',
      primary: 'Résolution', secondary: 'Inspiration',
      runes: ['Gardien', 'Démolition', 'Conditionnement', 'Croissance Excessive', 'Chaussures Magiques', 'Livraison de Biscuits'],
      stats: ['PV', 'Armure', 'Rés. Mag.'],
      tip: 'Protéger son carry et initier. Pour Alistar, Leona, Blitzcrank, Nautilus.',
    },
    {
      situation: 'Carry Support',
      keystone: 'Électrocution',
      primary: 'Domination', secondary: 'Sorcellerie',
      runes: ['Électrocution', 'Coup Sombre', 'Empreinte', 'Chasseur Vorace', 'Transposition', 'Brûlure'],
      stats: ['PA', 'PA', 'PV'],
      tip: 'Jouer carry agressif. Pour Lux support, Brand, Vel\'Koz support.',
    },
  ],
};

// Régions de l'univers LoL – contenu statique enrichi
const REGIONS = [
  { name: 'Demacia', icon: '⚔️', color: '#4a90d9', desc: 'Royaume de l\'honneur et de la vertu, où la magie est pourchassée. Berceau de champions comme Garen, Lux et Jarvan IV.', champions: ['Garen', 'Lux', 'Jarvan IV', 'Fiora', 'Poppy'] },
  { name: 'Noxus',   icon: '🩸', color: '#c0392b', desc: 'Empire brutal fondé sur la force. La puissance seule confère le pouvoir. Champions : Darius, Draven, Katarina, Swain.', champions: ['Darius', 'Draven', 'Katarina', 'Swain', 'Cassiopeia'] },
  { name: 'Freljord', icon: '❄️', color: '#5dade2', desc: 'Terres gelées du nord, habitées par des clans guerriers et des dieux anciens. Ashe, Lissandra et Tryndamere y règnent.', champions: ['Ashe', 'Lissandra', 'Tryndamere', 'Sejuani', 'Volibear'] },
  { name: 'Ionie',   icon: '🌸', color: '#e056fd', desc: 'Terre de magie et de spiritualité, déchirée par l\'invasion Noxienne. Foyer d\'Ahri, Zed, Yasuo et Karma.', champions: ['Ahri', 'Zed', 'Yasuo', 'Karma', 'Irelia'] },
  { name: 'Piltover', icon: '⚙️', color: '#f1c40f', desc: 'Cité des merveilles technologiques, appelée la Cité du Progrès. Jinx, Vi et Jayce y sont nés.', champions: ['Jinx', 'Vi', 'Jayce', 'Caitlyn', 'Ekko'] },
  { name: 'Zaun',    icon: '☣️', color: '#2ecc71', desc: 'Ville des bas-fonds sous Piltover, noyée dans les fumées chimiques. Viktor, Warwick et Singed y survivent.', champions: ['Viktor', 'Warwick', 'Singed', 'Urgot', 'Zac'] },
  { name: 'Shurima', icon: '🏜️', color: '#e67e22', desc: 'Empire du désert autrefois glorieux, désormais en ruines. Azir cherche à le ressusciter avec Nasus et Renekton.', champions: ['Azir', 'Nasus', 'Renekton', 'Taliyah', 'Sivir'] },
  { name: "Îles de l'Ombre", icon: '💀', color: '#8e44ad', desc: 'Terres maudites envahies par la Brume Noire. Thresh, Kalista et Hecarim errent pour l\'éternité.', champions: ['Thresh', 'Kalista', 'Hecarim', 'Yorick', 'Karthus'] },
];

// ── État de l'application ─────────────────────────────────────────────────────
const state = {
  version: null,
  champions: {},
  runes: [],
  merakiChampions: {},
  filteredChampions: [],
  search: '',
  roleFilter: 'Tous',
  activeTab: 'lore',
  selectedChampion: null,
  runeChampion: null,
  runeChampSearch: '',
};

// ── Utilitaires ───────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const tag = (el, cls, html) => { const e = document.createElement(el); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function getPrimaryTag(tags = []) {
  const priority = ['Assassin', 'Mage', 'Marksman', 'Fighter', 'Tank', 'Support'];
  return tags.find(t => priority.includes(t)) || tags[0] || 'Fighter';
}

function tagLabel(tag) {
  const map = { Fighter: 'Guerrier', Mage: 'Mage', Assassin: 'Assassin', Support: 'Support', Tank: 'Tank', Marksman: 'Tireur' };
  return map[tag] || tag;
}

function tagColor(tag) {
  const map = { Fighter: '#e74c3c', Mage: '#9b59b6', Assassin: '#c0392b', Support: '#27ae60', Tank: '#2980b9', Marksman: '#e67e22' };
  return map[tag] || '#888';
}

// ── Chargement des données ────────────────────────────────────────────────────
async function loadData() {
  showLoader(true);
  try {
    const versions = await fetchJSON(DDragon.versions);
    state.version = versions[0];
    $('patch-version').textContent = `Patch ${state.version}`;

    const [champData, runeData] = await Promise.all([
      fetchJSON(DDragon.champions(state.version)),
      fetchJSON(DDragon.runes(state.version)),
    ]);

    state.champions = champData.data;
    state.runes = runeData;
    state.filteredChampions = Object.values(state.champions);

    // Meraki en parallèle (optionnel – on ignore les erreurs)
    fetchJSON(Meraki.champions).then(d => {
      state.merakiChampions = d;
    }).catch(() => {});

    renderCurrentTab();
  } catch (e) {
    showError('Impossible de charger les données. Vérifiez votre connexion.');
    console.error(e);
  } finally {
    showLoader(false);
  }
}

// ── Navigation par onglets ────────────────────────────────────────────────────
function switchTab(tab) {
  state.activeTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.toggle('active', p.id === `tab-${tab}`));
  renderCurrentTab();
}

function renderCurrentTab() {
  if (!state.version) return;
  if (state.activeTab === 'lore')      renderLore();
  if (state.activeTab === 'champions') renderChampions();
  if (state.activeTab === 'runes')     renderRunes();
  if (state.activeTab === 'patch')     renderPatch();
}

// ── Onglet LORE ───────────────────────────────────────────────────────────────
function renderLore() {
  const container = $('lore-regions');
  if (container.dataset.rendered) return;
  container.innerHTML = '';
  REGIONS.forEach(r => {
    const card = tag('div', 'region-card');
    card.style.setProperty('--region-color', r.color);
    card.innerHTML = `
      <div class="region-icon">${r.icon}</div>
      <h3>${r.name}</h3>
      <p>${r.desc}</p>
      <div class="region-champs">${r.champions.map(c => `<span class="region-champ-tag">${c}</span>`).join('')}</div>
    `;
    card.addEventListener('click', () => {
      switchTab('champions');
      state.search = r.champions[0];
      applyFilter();
    });
    container.appendChild(card);
  });
  container.dataset.rendered = '1';
}

// ── Onglet CHAMPIONS ─────────────────────────────────────────────────────────
function renderChampions() {
  applyFilter();
}

function applyFilter() {
  const s = state.search.toLowerCase();
  const r = state.roleFilter;
  state.filteredChampions = Object.values(state.champions).filter(c => {
    const matchName = c.name.toLowerCase().includes(s);
    const matchRole = r === 'Tous' || c.tags.includes(r);
    return matchName && matchRole;
  });
  renderChampionGrid();
}

function renderChampionGrid() {
  const grid = $('champions-grid');
  grid.innerHTML = '';
  if (!state.filteredChampions.length) {
    grid.innerHTML = '<p class="no-result">Aucun champion trouvé.</p>';
    return;
  }
  state.filteredChampions.forEach(champ => {
    const primaryTag = getPrimaryTag(champ.tags);
    const card = tag('div', 'champ-card');
    card.innerHTML = `
      <div class="champ-img-wrap">
        <img loading="lazy" src="${DDragon.imgChamp(state.version, champ.image.full)}" alt="${champ.name}">
        <span class="champ-role-badge" style="background:${tagColor(primaryTag)}">${tagLabel(primaryTag)}</span>
      </div>
      <div class="champ-info">
        <strong>${champ.name}</strong>
        <small>${champ.title}</small>
      </div>
    `;
    card.addEventListener('click', () => openChampModal(champ.id));
    grid.appendChild(card);
  });
}

async function openChampModal(id) {
  const modal = $('champ-modal');
  const body  = $('modal-body');
  modal.classList.add('open');
  body.innerHTML = '<div class="modal-loader">Chargement...</div>';

  try {
    const data   = await fetchJSON(DDragon.champion(state.version, id));
    const champ  = data.data[id];
    const meraki = state.merakiChampions[champ.name] || null;
    const tag1   = getPrimaryTag(champ.tags);
    const recs   = RUNE_RECS[tag1] || RUNE_RECS['Fighter'];

    body.innerHTML = `
      <div class="modal-splash-wrap">
        <img class="modal-splash" src="${DDragon.splash(id)}" alt="${champ.name}" onerror="this.style.display='none'">
        <div class="modal-splash-overlay"></div>
        <div class="modal-title-block">
          <h2>${champ.name}</h2>
          <span class="champ-title-sub">${champ.title}</span>
          <div class="modal-tags">${champ.tags.map(t => `<span style="background:${tagColor(t)}">${tagLabel(t)}</span>`).join('')}</div>
        </div>
      </div>
      <div class="modal-content-grid">
        <section class="modal-section">
          <h3>📖 Lore</h3>
          <p class="lore-text">${champ.lore}</p>
        </section>
        <section class="modal-section">
          <h3>📊 Statistiques (Patch ${state.version})</h3>
          ${renderStats(champ.stats, meraki)}
        </section>
        <section class="modal-section full-width">
          <h3>💎 Runes recommandées</h3>
          <div class="rune-recs-grid">
            ${recs.map(r => `
              <div class="rune-rec-card">
                <div class="rune-rec-header">
                  <span class="rune-situation">${r.situation}</span>
                  <span class="rune-keystone">${r.keystone}</span>
                </div>
                <div class="rune-path"><strong>${r.primary}</strong> + <strong>${r.secondary}</strong></div>
                <ul class="rune-list">${r.runes.map(rn => `<li>${rn}</li>`).join('')}</ul>
                <div class="rune-tip">💡 ${r.tip}</div>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `;
  } catch(e) {
    body.innerHTML = '<p class="modal-error">Impossible de charger ce champion.</p>';
  }
}

function renderStats(stats, meraki) {
  const rows = [
    ['❤️ PV de base', stats.hp, meraki?.stats?.health?.flat],
    ['⚔️ Dégâts d\'attaque', stats.attackdamage, meraki?.stats?.attackDamage?.flat],
    ['🛡️ Armure', stats.armor, meraki?.stats?.armor?.flat],
    ['✨ Résistance Mag.', stats.spellblock, meraki?.stats?.magicResistance?.flat],
    ['💨 Vitesse de dépl.', stats.movespeed, meraki?.stats?.movespeed],
    ['🔮 Mana', stats.mp, meraki?.stats?.mana?.flat],
    ['🎯 Portée d\'attaque', stats.attackrange, meraki?.stats?.attackRange],
  ];
  return `<div class="stats-grid">${rows.map(([label, val, mval]) => `
    <div class="stat-item">
      <span class="stat-label">${label}</span>
      <span class="stat-value">${mval !== undefined ? mval : val}</span>
    </div>`).join('')}</div>`;
}

function closeModal() {
  $('champ-modal').classList.remove('open');
}

// ── Onglet RUNES ─────────────────────────────────────────────────────────────
function renderRunes() {
  const panel = $('runes-panel');
  if (panel.dataset.rendered) return;
  buildRuneChampSearch();
  panel.dataset.rendered = '1';
}

function buildRuneChampSearch() {
  // Afficher la liste des keystones depuis Data Dragon
  const keystoneSection = $('rune-trees');
  keystoneSection.innerHTML = '';
  state.runes.forEach(tree => {
    const div = tag('div', 'rune-tree');
    div.innerHTML = `
      <div class="rune-tree-header">
        <img src="${DDragon.runeIcon(tree.icon)}" alt="${tree.name}" onerror="this.style.display='none'">
        <h3>${tree.name}</h3>
      </div>
      <div class="rune-keystones">
        ${tree.slots[0].runes.map(k => `
          <div class="keystone-item">
            <img src="${DDragon.runeIcon(k.icon)}" alt="${k.name}" onerror="this.style.display='none'">
            <div>
              <strong>${k.name}</strong>
              <p>${stripHtml(k.shortDesc)}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    keystoneSection.appendChild(div);
  });
}

function updateRuneSearch() {
  const s = $('rune-champ-input').value.toLowerCase();
  const results = $('rune-champ-results');
  results.innerHTML = '';
  if (!s) { results.classList.remove('open'); return; }

  const matches = Object.values(state.champions).filter(c => c.name.toLowerCase().includes(s)).slice(0, 6);
  if (!matches.length) { results.classList.remove('open'); return; }

  matches.forEach(c => {
    const li = tag('li', 'rune-search-result');
    li.innerHTML = `<img src="${DDragon.imgChamp(state.version, c.image.full)}" alt="${c.name}"><span>${c.name}</span>`;
    li.addEventListener('click', () => selectRuneChamp(c));
    results.appendChild(li);
  });
  results.classList.add('open');
}

function selectRuneChamp(champ) {
  $('rune-champ-input').value = champ.name;
  $('rune-champ-results').classList.remove('open');
  const primaryTag = getPrimaryTag(champ.tags);
  const recs = RUNE_RECS[primaryTag] || RUNE_RECS['Fighter'];
  const panel = $('selected-rune-recs');
  panel.innerHTML = `
    <h3>Runes pour <span style="color:var(--gold)">${champ.name}</span> (${tagLabel(primaryTag)})</h3>
    <div class="rune-recs-grid">
      ${recs.map(r => `
        <div class="rune-rec-card">
          <div class="rune-rec-header">
            <span class="rune-situation">${r.situation}</span>
            <span class="rune-keystone">${r.keystone}</span>
          </div>
          <div class="rune-path"><strong>${r.primary}</strong> + <strong>${r.secondary}</strong></div>
          <ul class="rune-list">${r.runes.map(rn => `<li>${rn}</li>`).join('')}</ul>
          <div class="rune-stat-shards">Fragments : ${r.stats.join(' · ')}</div>
          <div class="rune-tip">💡 ${r.tip}</div>
        </div>
      `).join('')}
    </div>
  `;
  panel.classList.add('visible');
}

// ── Onglet PATCH ─────────────────────────────────────────────────────────────
function renderPatch() {
  if (!state.version) return;
  const [major, minor] = state.version.split('.');
  const patchUrl = `https://www.leagueoflegends.com/fr-fr/news/game-updates/patch-${major}-${minor}-notes/`;

  $('patch-main').innerHTML = `
    <div class="patch-hero">
      <h2>Patch ${major}.${minor}</h2>
      <p>Les données des champions (statistiques, sorts, lore) sont automatiquement synchronisées avec le dernier patch via l'API officielle Riot Data Dragon.</p>
      <a class="btn-patch" href="${patchUrl}" target="_blank" rel="noopener noreferrer">
        📋 Lire les notes de patch officielles →
      </a>
    </div>
    <div class="patch-info-grid">
      <div class="patch-info-card">
        <div class="patch-info-icon">🔄</div>
        <h4>Mise à jour automatique</h4>
        <p>Ce site récupère en temps réel les dernières données depuis Riot Data Dragon. Chaque statistique affiché reflète le patch actuel.</p>
      </div>
      <div class="patch-info-card">
        <div class="patch-info-icon">⚔️</div>
        <h4>Stats des champions</h4>
        <p>Les PV, dégâts, armure et autres stats de chaque champion reflètent exactement les valeurs du patch <strong>${state.version}</strong>.</p>
      </div>
      <div class="patch-info-card">
        <div class="patch-info-icon">💎</div>
        <h4>Runes</h4>
        <p>Toutes les runes disponibles proviennent du patch actuel. Les recommandations sont basées sur les méta-builds éprouvés.</p>
      </div>
    </div>
    <div id="patch-champs-grid" class="patch-champs-grid"></div>
  `;

  // Afficher tous les champions avec leurs stats actuelles
  const grid = $('patch-champs-grid');
  Object.values(state.champions).slice(0, 60).forEach(c => {
    const card = tag('div', 'patch-champ-card');
    card.innerHTML = `
      <img src="${DDragon.imgChamp(state.version, c.image.full)}" alt="${c.name}" loading="lazy">
      <div class="patch-champ-name">${c.name}</div>
      <div class="patch-champ-stats">
        ❤️ ${c.stats.hp} · ⚔️ ${c.stats.attackdamage} · 🛡️ ${c.stats.armor}
      </div>
    `;
    card.addEventListener('click', () => {
      switchTab('champions');
      state.search = c.name;
      applyFilter();
    });
    grid.appendChild(card);
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function stripHtml(html) {
  const d = document.createElement('div');
  d.innerHTML = html;
  return d.textContent || '';
}

function showLoader(on) {
  $('global-loader').style.display = on ? 'flex' : 'none';
}

function showError(msg) {
  const el = $('global-error');
  el.textContent = msg;
  el.style.display = 'block';
}

// ── Initialisation ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Tabs
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.addEventListener('click', () => switchTab(b.dataset.tab));
  });

  // Fermer modal
  $('modal-close').addEventListener('click', closeModal);
  $('champ-modal').addEventListener('click', e => { if (e.target === $('champ-modal')) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Recherche champions
  $('champ-search').addEventListener('input', e => {
    state.search = e.target.value;
    applyFilter();
  });

  // Filtre par rôle
  document.querySelectorAll('.role-btn').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.role-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      state.roleFilter = b.dataset.role;
      applyFilter();
    });
  });

  // Recherche runes
  const runeInput = $('rune-champ-input');
  if (runeInput) {
    runeInput.addEventListener('input', updateRuneSearch);
    document.addEventListener('click', e => {
      if (!runeInput.contains(e.target)) $('rune-champ-results').classList.remove('open');
    });
  }

  // Année footer
  $('footer-year').textContent = new Date().getFullYear();

  loadData();
});
