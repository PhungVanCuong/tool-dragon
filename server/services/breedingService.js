import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dragonsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/dragons.json'), 'utf-8'));
const breedingRules = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/breedingRules.json'), 'utf-8'));

/**
 * Calculate breeding outcomes between two dragons
 */
export function calculateBreeding(parent1Id, parent2Id, sanctuaryLevel = 8, empower1 = 0, empower2 = 0) {
  const p1 = dragonsData.dragons.find(d => d.id === parent1Id);
  const p2 = dragonsData.dragons.find(d => d.id === parent2Id);

  if (!p1 || !p2) {
    return { success: false, message: 'Không tìm thấy thông tin rồng bố hoặc rồng mẹ.' };
  }

  // Combine unique elements
  const poolElements = Array.from(new Set([...p1.elements, ...p2.elements]));

  // Find candidate offspring dragons that share at least 1 or 2 elements from the pool
  const candidates = dragonsData.dragons.filter(d => {
    // Can breed if its elements are a subset of the parents' pooled elements (or partial match for singles)
    if (d.elements.length === 1 && poolElements.includes(d.elements[0])) return true;
    return d.elements.every(e => poolElements.includes(e));
  });

  // Calculate base weights by rarity
  const rarityWeights = {
    'C': 50,
    'R': 30,
    'VR': 18,
    'E': 10,
    'L': 4,
    'M': 1.5,
    'H': 0.5
  };

  // Empower star bonuses: each star on parents adds extra weight to Legendary/Mythical offspring
  const totalStars = (empower1 || 0) + (empower2 || 0);
  const starBoost = 1 + (totalStars * 0.15);

  let totalWeight = 0;
  const weightedCandidates = candidates.map(dragon => {
    let weight = rarityWeights[dragon.rarity] || 5;
    if (['L', 'M', 'H'].includes(dragon.rarity)) {
      weight *= starBoost;
    }
    totalWeight += weight;
    return { ...dragon, weight };
  });

  // Convert to percentages
  const results = weightedCandidates.map(c => ({
    id: c.id,
    name: c.name,
    nameVi: c.nameVi,
    rarity: c.rarity,
    elements: c.elements,
    breedTimeHours: c.breedTime,
    hatchTimeHours: c.hatchTime,
    percentage: Number(((c.weight / totalWeight) * 100).toFixed(2))
  })).sort((a, b) => b.percentage - a.percentage);

  return {
    success: true,
    parent1: { id: p1.id, name: p1.name, nameVi: p1.nameVi, elements: p1.elements, empower: empower1 },
    parent2: { id: p2.id, name: p2.name, nameVi: p2.nameVi, elements: p2.elements, empower: empower2 },
    sanctuaryLevel,
    poolElements,
    possibleOffspring: results
  };
}

/**
 * Reverse breeding: find best pairs to breed a target dragon
 */
export function reverseBreeding(targetId) {
  const target = dragonsData.dragons.find(d => d.id === targetId);
  if (!target) {
    return { success: false, message: 'Không tìm thấy rồng mục tiêu.' };
  }

  // Find all pairs of dragons whose union of elements contains all elements of the target
  const allDragons = dragonsData.dragons;
  const bestPairs = [];

  for (let i = 0; i < allDragons.length; i++) {
    for (let j = i; j < allDragons.length; j++) {
      const d1 = allDragons[i];
      const d2 = allDragons[j];
      const combined = new Set([...d1.elements, ...d2.elements]);

      const containsTarget = target.elements.every(e => combined.has(e));
      if (containsTarget) {
        // Shorter breed times are preferred for speed
        const score = 100 - (d1.breedTime + d2.breedTime) / 2;
        bestPairs.push({
          parent1: { id: d1.id, name: d1.name, nameVi: d1.nameVi, rarity: d1.rarity, elements: d1.elements },
          parent2: { id: d2.id, name: d2.name, nameVi: d2.nameVi, rarity: d2.rarity, elements: d2.elements },
          efficiencyScore: Math.max(10, Math.round(score)),
          estimatedChance: target.rarity === 'L' ? '8% - 15%' : target.rarity === 'M' ? '3% - 6%' : '25% - 40%'
        });
      }
    }
  }

  return {
    success: true,
    target: { id: target.id, name: target.name, nameVi: target.nameVi, rarity: target.rarity, elements: target.elements },
    recommendedPairs: bestPairs.slice(0, 8)
  };
}

/**
 * Calculate Food needed from level A to level B
 */
export function calculateFeedingCost(fromLevel = 1, toLevel = 40) {
  const start = Math.max(1, Math.min(69, Number(fromLevel)));
  const end = Math.max(start + 1, Math.min(70, Number(toLevel)));

  // Standard Dragon City feeding formula: 4 feeds per level
  // Level 1-4: 5 food/feed
  // Level 5-9: doubles periodically
  // We compute total food accurately
  let totalFood = 0;
  const breakdown = [];

  for (let lvl = start; lvl < end; lvl++) {
    let foodPerFeed = 0;
    if (lvl <= 4) foodPerFeed = 5;
    else if (lvl <= 9) foodPerFeed = Math.round(5 * Math.pow(2, lvl - 4));
    else if (lvl <= 19) foodPerFeed = Math.round(160 * Math.pow(1.5, lvl - 9));
    else if (lvl <= 29) foodPerFeed = Math.round(10240 * Math.pow(1.25, lvl - 19));
    else if (lvl <= 39) foodPerFeed = Math.round(98304 * Math.pow(1.2, lvl - 29));
    else foodPerFeed = Math.round(655360 * Math.pow(1.15, lvl - 39));

    const levelCost = foodPerFeed * 4;
    totalFood += levelCost;

    if (lvl % 5 === 0 || lvl === start || lvl === end - 1) {
      breakdown.push({
        level: lvl,
        nextLevel: lvl + 1,
        foodPerFeed,
        totalForLevel: levelCost
      });
    }
  }

  return {
    success: true,
    fromLevel: start,
    toLevel: end,
    totalFoodRequired: totalFood,
    totalFeeds: (end - start) * 4,
    formattedTotal: totalFood.toLocaleString(),
    breakdown
  };
}
