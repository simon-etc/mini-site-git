#!/usr/bin/env node
// ============================================================
// Script de pré-chargement des données Riot Data Dragon
// Exécuté au moment du build (GitHub Actions)
// Génère data/game-data.json pour un chargement sans API call
// ============================================================

const https = require('https');
const fs    = require('fs');
const path  = require('path');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch(e) { reject(new Error(`JSON parse error for ${url}: ${e.message}`)); }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('[fetch-data] Démarrage…');

  // 1. Dernière version
  const versions = await get('https://ddragon.leagueoflegends.com/api/versions.json');
  const version  = versions[0];
  console.log(`[fetch-data] Version : ${version}`);

  // 2. Champions (fr_FR)
  const champData = await get(
    `https://ddragon.leagueoflegends.com/cdn/${version}/data/fr_FR/champion.json`
  );

  // 3. Runes (fr_FR)
  const runeData = await get(
    `https://ddragon.leagueoflegends.com/cdn/${version}/data/fr_FR/runesReforged.json`
  );

  const output = {
    version,
    fetchedAt: new Date().toISOString(),
    champions: champData.data,
    runes: runeData,
  };

  const outPath = path.join(__dirname, '..', 'data', 'game-data.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
  console.log(`[fetch-data] Données sauvegardées dans ${outPath}`);
  console.log(`[fetch-data] ${Object.keys(champData.data).length} champions, ${runeData.length} arbres de runes`);
}

main().catch(err => {
  console.error('[fetch-data] ERREUR :', err.message);
  process.exit(1);
});
