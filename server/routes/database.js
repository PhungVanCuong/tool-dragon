import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const dragonsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/dragons.json'), 'utf-8'));
const elementsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/elements.json'), 'utf-8'));
const heroicRacesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/heroicRaces.json'), 'utf-8'));
const breedingRulesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/breedingRules.json'), 'utf-8'));

/**
 * GET /api/database/dragons
 * Search & filter dragons
 */
router.get('/dragons', (req, res) => {
  const { query, rarity, element } = req.query;
  let list = [...dragonsData.dragons];

  if (query) {
    const q = query.toLowerCase().trim();
    list = list.filter(d => 
      d.name.toLowerCase().includes(q) || 
      (d.nameVi && d.nameVi.toLowerCase().includes(q))
    );
  }

  if (rarity && rarity !== 'ALL') {
    list = list.filter(d => d.rarity === rarity);
  }

  if (element && element !== 'ALL') {
    list = list.filter(d => d.elements.includes(element));
  }

  return res.json({
    success: true,
    total: list.length,
    dragons: list
  });
});

/**
 * GET /api/database/elements
 */
router.get('/elements', (req, res) => {
  return res.json({
    success: true,
    elements: elementsData.elements
  });
});

/**
 * GET /api/database/heroic-race
 */
router.get('/heroic-race', (req, res) => {
  return res.json({
    success: true,
    race: heroicRacesData
  });
});

/**
 * GET /api/database/breeding-rules
 */
router.get('/breeding-rules', (req, res) => {
  return res.json({
    success: true,
    rules: breedingRulesData
  });
});

export default router;
