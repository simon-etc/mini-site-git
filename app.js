// ============================================================
// League of Legends Universe – app.js
// Chargement local-first (data/game-data.json) + fallback API
// Relations de champions via data/lore.js
// ============================================================

const DDragon = {
  versions:  'https://ddragon.leagueoflegends.com/api/versions.json',
  champions: v => `https://ddragon.leagueoflegends.com/cdn/${v}/data/fr_FR/champion.json`,
  champion:  (v, id) => `https://ddragon.leagueoflegends.com/cdn/${v}/data/fr_FR/champion/${id}.json`,
  runes:     v => `https://ddragon.leagueoflegends.com/cdn/${v}/data/fr_FR/runesReforged.json`,
  imgChamp:  (v, img) => `https://ddragon.leagueoflegends.com/cdn/${v}/img/champion/${img}`,
  splash:    id => `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${id}_0.jpg`,
  loading:   id => `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${id}_0.jpg`,
  runeIcon:  p => `https://ddragon.leagueoflegends.com/cdn/img/${p}`,
};

// ── Recommandations de runes par tag ─────────────────────────────────────────
const RUNE_RECS = {
  Assassin: [
    {
      situation: 'Burst / Général',
      keystone: 'Électrocution',
      primary: 'Domination', secondary: 'Précision',
      runes: ['Électrocution', 'Coup Sombre', 'Empreinte', 'Chasseur Vorace', 'Triomphe', 'Légende : Agilité'],
      stats: ['PA', 'PA', 'PV'],
      tip: 'Dégâts explosifs sur 3 touches. Idéal pour les assassins burst comme Zed, Talon, Katarina.',
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
      tip: 'Optimal pour les combats prolongés. Idéal pour Darius, Fiora, Renekton.',
    },
    {
      situation: 'Tank Bruiser',
      keystone: 'Emprise des Morts',
      primary: 'Résolution', secondary: 'Précision',
      runes: ['Emprise des Morts', 'Démolition', 'Conditionnement', 'Croissance Excessive', 'Triomphe', 'Légende : Ténacité'],
      stats: ['PV', 'Armure', 'Rés. Mag.'],
      tip: 'Jouer tanky tout en restant dangereux. Très fort pour Malphite, Nasus.',
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
      tip: 'Kiter l\'ennemi facilement. Pour Cassiopeia, Ryze.',
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

// Régions statiques enrichies
const REGIONS = [
  { name: 'Demacia',          icon: '⚔️',  color: '#4a90d9', desc: 'Royaume de l\'honneur et de la vertu, où la magie est pourchassée. Berceau de champions comme Garen, Lux et Jarvan IV.',      champions: ['Garen', 'Lux', 'Jarvan IV', 'Fiora', 'Poppy'] },
  { name: 'Noxus',            icon: '🩸',  color: '#c0392b', desc: 'Empire brutal fondé sur la force. La puissance seule confère le pouvoir. Champions : Darius, Draven, Katarina, Swain.',       champions: ['Darius', 'Draven', 'Katarina', 'Swain', 'Cassiopeia'] },
  { name: 'Freljord',         icon: '❄️',  color: '#5dade2', desc: 'Terres gelées du nord, habitées par des clans guerriers et des dieux anciens. Ashe, Lissandra et Tryndamere y règnent.',     champions: ['Ashe', 'Lissandra', 'Tryndamere', 'Sejuani', 'Volibear'] },
  { name: 'Ionie',            icon: '🌸',  color: '#e056fd', desc: 'Terre de magie et de spiritualité, déchirée par l\'invasion Noxienne. Foyer d\'Ahri, Zed, Yasuo et Karma.',                   champions: ['Ahri', 'Zed', 'Yasuo', 'Karma', 'Irelia'] },
  { name: 'Piltover',         icon: '⚙️',  color: '#f1c40f', desc: 'Cité des merveilles technologiques, appelée la Cité du Progrès. Jinx, Vi et Jayce y sont nés.',                               champions: ['Jinx', 'Vi', 'Jayce', 'Caitlyn', 'Ekko'] },
  { name: 'Zaun',             icon: '☣️',  color: '#2ecc71', desc: 'Ville des bas-fonds sous Piltover, noyée dans les fumées chimiques. Viktor, Warwick et Singed y survivent.',                   champions: ['Viktor', 'Warwick', 'Singed', 'Urgot', 'Zac'] },
  { name: 'Shurima',          icon: '🏜️', color: '#e67e22', desc: 'Empire du désert autrefois glorieux, désormais en ruines. Azir cherche à le ressusciter avec Nasus et Renekton.',              champions: ['Azir', 'Nasus', 'Renekton', 'Taliyah', 'Sivir'] },
  { name: "Îles de l'Ombre",  icon: '💀',  color: '#8e44ad', desc: 'Terres maudites envahies par la Brume Noire. Thresh, Kalista et Hecarim errent pour l\'éternité.',                             champions: ['Thresh', 'Kalista', 'Hecarim', 'Yorick', 'Karthus'] },
  { name: 'Bilgewater',       icon: '⚓',  color: '#1abc9c', desc: 'Port de pirates et de marchands, sans loi ni pitié. Miss Fortune traque Gangplank dans ses ruelles sombres.',                  champions: ['Miss Fortune', 'Gangplank', 'Pyke', 'Illaoi', 'Twisted Fate'] },
  { name: 'Targon',           icon: '🌟',  color: '#e8c76b', desc: 'Montagne céleste où des dieux s\'incarnent dans des mortels. Leona et Diana se livrent une guerre divine.',                    champions: ['Leona', 'Diana', 'Pantheon', 'Taric', 'Soraka'] },
];

// ── État de l'application ─────────────────────────────────────────────────────
const state = {
  version:           null,
  champions:         {},
  runes:             [],
  merakiChampions:   {},
  filteredChampions: [],
  search:            '',
  roleFilter:        'Tous',
  activeTab:         'lore',
  loreSearch:        '',
};

// ── Utilitaires ───────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const el = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls)  e.className = cls;
  if (html) e.innerHTML = html;
  return e;
};

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} – ${url}`);
  return res.json();
}

function getPrimaryTag(tags = []) {
  const priority = ['Assassin', 'Mage', 'Marksman', 'Fighter', 'Tank', 'Support'];
  return tags.find(t => priority.includes(t)) || tags[0] || 'Fighter';
}

function tagLabel(t) {
  return { Fighter: 'Guerrier', Mage: 'Mage', Assassin: 'Assassin', Support: 'Support', Tank: 'Tank', Marksman: 'Tireur' }[t] || t;
}

function tagColor(t) {
  return { Fighter: '#e74c3c', Mage: '#9b59b6', Assassin: '#c0392b', Support: '#27ae60', Tank: '#2980b9', Marksman: '#e67e22' }[t] || '#888';
}

function stripHtml(html) {
  const d = document.createElement('div');
  d.innerHTML = html;
  return d.textContent || '';
}

// ── Chargement des données (local-first) ──────────────────────────────────────
async function loadData() {
  showLoader(true);
  try {
    let loaded = false;

    // Essai 1 : fichier pré-généré au build
    try {
      const local = await fetchJSON('data/game-data.json');
      if (local && local.version && local.champions) {
        state.version   = local.version;
        state.champions = local.champions;
        state.runes     = local.runes;
        loaded = true;
        console.log(`[app] Données locales chargées (patch ${state.version})`);
      }
    } catch (_) {
      console.log('[app] Pas de données locales, chargement via API…');
    }

    // Essai 2 : Data Dragon en temps réel
    if (!loaded) {
      const versions = await fetchJSON(DDragon.versions);
      state.version   = versions[0];
      const [champData, runeData] = await Promise.all([
        fetchJSON(DDragon.champions(state.version)),
        fetchJSON(DDragon.runes(state.version)),
      ]);
      state.champions = champData.data;
      state.runes     = runeData;
    }

    $('patch-version').textContent = `Patch ${state.version}`;
    state.filteredChampions = Object.values(state.champions);

    // Meraki optionnel (stats étendues)
    fetchJSON('https://cdn.merakianalytics.com/riot/lol/resources/latest/en-US/champions.json')
      .then(d => { state.merakiChampions = d; })
      .catch(() => {});

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
  applyLoreFilter();
  if (!container.dataset.listenersAdded) {
    const searchInput = $('lore-search');
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        state.loreSearch = e.target.value;
        applyLoreFilter();
      });
    }
    container.dataset.listenersAdded = '1';
  }
}

function applyLoreFilter() {
  const container = $('lore-regions');
  const q = state.loreSearch.toLowerCase().trim();
  const filtered = q
    ? REGIONS.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.desc.toLowerCase().includes(q) ||
        r.champions.some(c => c.toLowerCase().includes(q))
      )
    : REGIONS;

  container.innerHTML = '';
  if (!filtered.length) {
    container.innerHTML = '<p class="no-result" style="grid-column:1/-1">Aucune région trouvée.</p>';
    return;
  }
  filtered.forEach(r => {
    const card = el('div', 'region-card');
    card.style.setProperty('--region-color', r.color);
    card.innerHTML = `
      <div class="region-icon">${r.icon}</div>
      <h3>${r.name}</h3>
      <p>${r.desc}</p>
      <div class="region-champs">
        ${r.champions.map(c => {
          const cd = Object.values(state.champions).find(ch => ch.name === c);
          const imgHtml = cd ? `<img src="${DDragon.imgChamp(state.version, cd.image.full)}" alt="${c}" loading="lazy">` : '';
          return `<span class="region-champ-tag">${imgHtml}${c}</span>`;
        }).join('')}
      </div>
    `;
    card.addEventListener('click', () => {
      switchTab('champions');
      state.search = r.champions[0];
      $('champ-search').value = r.champions[0];
      applyFilter();
    });
    container.appendChild(card);
  });
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
    const loreData   = (window.CHAMPION_RELATIONS || {})[champ.name];
    const card = el('div', 'champ-card');
    card.innerHTML = `
      <div class="champ-img-wrap">
        <img loading="lazy"
             src="${DDragon.loading(champ.id)}"
             onerror="this.src='${DDragon.imgChamp(state.version, champ.image.full)}'"
             alt="${champ.name}">
        <span class="champ-role-badge" style="background:${tagColor(primaryTag)}">${tagLabel(primaryTag)}</span>
        ${loreData ? `<span class="champ-region-dot" style="background:${(window.REGION_COLORS || {})[loreData.region] || '#888'}" title="${loreData.region}"></span>` : ''}
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

// ── Modal Champion ────────────────────────────────────────────────────────────
async function openChampModal(id) {
  const modal = $('champ-modal');
  const body  = $('modal-body');
  modal.classList.add('open');
  body.innerHTML = '<div class="modal-loader">Chargement…</div>';

  try {
    let champ;
    try {
      const data = await fetchJSON(DDragon.champion(state.version, id));
      champ = data.data[id];
    } catch (_) {
      // Fallback : données déjà chargées (sans lore complet)
      champ = state.champions[id];
      if (!champ) throw new Error('Champion introuvable');
      champ = { ...champ, lore: champ.blurb || '' };
    }
    const meraki = state.merakiChampions[champ.name] || null;
    const tag1   = getPrimaryTag(champ.tags);
    const recs   = RUNE_RECS[tag1] || RUNE_RECS['Fighter'];
    const lore   = (window.CHAMPION_RELATIONS || {})[champ.name] || null;

    body.innerHTML = `
      <div class="modal-splash-wrap">
        <img class="modal-splash" src="${DDragon.splash(id)}" alt="${champ.name}" onerror="this.style.display='none'">
        <div class="modal-splash-overlay"></div>
        <div class="modal-title-block">
          <h2>${champ.name}</h2>
          <span class="champ-title-sub">${champ.title}</span>
          <div class="modal-tags">
            ${champ.tags.map(t => `<span style="background:${tagColor(t)}">${tagLabel(t)}</span>`).join('')}
            ${lore ? `<span class="modal-region-tag" style="background:${(window.REGION_COLORS || {})[lore.region] || '#555'}">${lore.region}</span>` : ''}
          </div>
        </div>
      </div>
      <div class="modal-content-grid">
        <section class="modal-section">
          <h3>📖 Lore</h3>
          <p class="lore-text">${champ.lore}</p>
          ${lore && lore.note ? `<p class="lore-note">${lore.note}</p>` : ''}
        </section>
        <section class="modal-section">
          <h3>📊 Statistiques (Patch ${state.version})</h3>
          ${renderStats(champ.stats, meraki)}
        </section>
        ${lore ? renderRelations(lore) : ''}
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

function renderRelations(lore) {
  const rows = [];
  if (lore.allies  && lore.allies.length)  rows.push(['🤝 Alliés',  lore.allies,  'rel-ally']);
  if (lore.rivals  && lore.rivals.length)  rows.push(['⚔️ Rivaux',  lore.rivals,  'rel-rival']);
  if (lore.enemies && lore.enemies.length) rows.push(['💀 Ennemis', lore.enemies, 'rel-enemy']);
  if (!rows.length) return '';
  return `
    <section class="modal-section">
      <h3>🔗 Relations</h3>
      <div class="relations-list">
        ${rows.map(([label, names, cls]) => `
          <div class="rel-row">
            <span class="rel-label">${label}</span>
            <div class="rel-tags">
              ${names.map(n => `
                <button class="rel-tag ${cls}" onclick="openChampByName('${n.replace(/'/g, "\\'")}')">${n}</button>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function openChampByName(name) {
  const champ = Object.values(state.champions).find(c => c.name === name);
  if (champ) openChampModal(champ.id);
}
// expose globally for inline onclick
window.openChampByName = openChampByName;

function renderStats(stats, meraki) {
  const rows = [
    ['❤️ PV de base',        stats.hp,           meraki?.stats?.health?.flat],
    ['⚔️ Dégâts d\'attaque', stats.attackdamage, meraki?.stats?.attackDamage?.flat],
    ['🛡️ Armure',            stats.armor,        meraki?.stats?.armor?.flat],
    ['✨ Rés. Magique',       stats.spellblock,   meraki?.stats?.magicResistance?.flat],
    ['💨 Vitesse de dépl.',   stats.movespeed,    meraki?.stats?.movespeed],
    ['🔮 Mana',               stats.mp,           meraki?.stats?.mana?.flat],
    ['🎯 Portée d\'attaque',  stats.attackrange,  meraki?.stats?.attackRange],
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
  buildRuneTrees();
  panel.dataset.rendered = '1';
}

function buildRuneTrees() {
  const keystoneSection = $('rune-trees');
  keystoneSection.innerHTML = '';
  state.runes.forEach(tree => {
    const div = el('div', 'rune-tree');
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
  const s       = $('rune-champ-input').value.toLowerCase();
  const results = $('rune-champ-results');
  results.innerHTML = '';
  if (!s) { results.classList.remove('open'); return; }

  const seen = new Set();
  const matches = Object.values(state.champions).filter(c => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return c.name.toLowerCase().includes(s);
  }).slice(0, 6);
  if (!matches.length) { results.classList.remove('open'); return; }

  matches.forEach(c => {
    const li = el('li', 'rune-search-result');
    li.innerHTML = `<img src="${DDragon.imgChamp(state.version, c.image.full)}" alt="${c.name}"><span>${c.name}</span>`;
    li.addEventListener('click', () => selectRuneChamp(c));
    results.appendChild(li);
  });
  results.classList.add('open');
}

function selectRuneChamp(champ) {
  const results = $('rune-champ-results');
  results.innerHTML = '';
  results.classList.remove('open');
  $('rune-champ-input').value = champ.name;
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
      <p>Les données des champions sont synchronisées automatiquement avec le dernier patch via l'API officielle Riot Data Dragon.</p>
      <a class="btn-patch" href="${patchUrl}" target="_blank" rel="noopener noreferrer">
        📋 Lire les notes de patch officielles →
      </a>
    </div>
    <div class="patch-info-grid">
      <div class="patch-info-card">
        <div class="patch-info-icon">🔄</div>
        <h4>Mise à jour automatique</h4>
        <p>Les données sont pré-chargées au build et mises à jour à chaque déploiement.</p>
      </div>
      <div class="patch-info-card">
        <div class="patch-info-icon">⚔️</div>
        <h4>Stats des champions</h4>
        <p>PV, dégâts, armure et stats reflètent exactement le patch <strong>${state.version}</strong>.</p>
      </div>
      <div class="patch-info-card">
        <div class="patch-info-icon">💎</div>
        <h4>Runes</h4>
        <p>Toutes les runes et keystones proviennent du patch actuel.</p>
      </div>
    </div>
    <div id="patch-champs-grid" class="patch-champs-grid"></div>
  `;

  const grid = $('patch-champs-grid');
  Object.values(state.champions).slice(0, 60).forEach(c => {
    const card = el('div', 'patch-champ-card');
    card.innerHTML = `
      <img src="${DDragon.imgChamp(state.version, c.image.full)}" alt="${c.name}" loading="lazy">
      <div class="patch-champ-name">${c.name}</div>
      <div class="patch-champ-stats">❤️ ${c.stats.hp} · ⚔️ ${c.stats.attackdamage} · 🛡️ ${c.stats.armor}</div>
    `;
    card.addEventListener('click', () => {
      switchTab('champions');
      state.search = c.name;
      $('champ-search').value = c.name;
      applyFilter();
    });
    grid.appendChild(card);
  });
}

// ── UI helpers ────────────────────────────────────────────────────────────────
function showLoader(on) {
  $('global-loader').style.display = on ? 'flex' : 'none';
}

function showError(msg) {
  const e = $('global-error');
  e.textContent = msg;
  e.style.display = 'block';
}

// ── Initialisation ────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Tabs
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.addEventListener('click', () => switchTab(b.dataset.tab));
  });

  // Modal
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
