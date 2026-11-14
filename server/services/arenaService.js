import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dragonsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/dragons.json'), 'utf-8'));
const elementsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/elements.json'), 'utf-8'));

/**
 * Get matchup for an attacking element vs defending primary element
 */
export function getElementMatchup(attackElem, defendElem) {
  const elem = elementsData.elements.find(e => e.id === attackElem);
  if (!elem) return { multiplier: 1.0, relation: 'NORMAL' };

  if (elem.strongAgainst.includes(defendElem)) {
    return { multiplier: 2.0, relation: 'CRITICAL', label: 'Chí mạng (x2)' };
  }
  if (elem.immuneTo && elem.immuneTo.includes(defendElem)) {
    return { multiplier: 0.0, relation: 'IMMUNE', label: 'Vô hiệu hóa (x0)' };
  }
  if (elem.weakTo && elem.weakTo.includes(defendElem)) {
    return { multiplier: 0.5, relation: 'WEAK', label: 'Yếu thế (x0.5)' };
  }
  return { multiplier: 1.0, relation: 'NORMAL', label: 'Bình thường (x1)' };
}

/**
 * Recommend optimal counters against an opponent team
 */
export function recommendCounters(opponentDragonIds = []) {
  if (!opponentDragonIds || opponentDragonIds.length === 0) {
    return { success: false, message: 'Vui lòng chọn ít nhất 1 rồng của đối thủ.' };
  }

  const opponents = opponentDragonIds.map(id => dragonsData.dragons.find(d => d.id === id)).filter(Boolean);

  if (opponents.length === 0) {
    return { success: false, message: 'Không tìm thấy rồng đối thủ trong dữ liệu.' };
  }

  const recommendations = opponents.map(opponent => {
    const primaryDefend = opponent.elements[0]; // The defensive element receiving attacks
    const weaknessElements = elementsData.elements.filter(e => e.strongAgainst.includes(primaryDefend)).map(e => e.id);

    // Find dragons that have at least one of these weaknessElements
    const counterDragons = dragonsData.dragons.filter(candidate => {
      if (candidate.id === opponent.id) return false;
      return candidate.elements.some(elem => weaknessElements.includes(elem));
    }).map(c => {
      // Calculate how safe this counter is against opponent attacks
      const oppAttackElem = opponent.elements[0];
      const myDefendElem = c.elements[0];
      const incomingMatchup = getElementMatchup(oppAttackElem, myDefendElem);

      let defenseScore = 100;
      if (incomingMatchup.multiplier >= 2.0) defenseScore -= 40; // Don't pick if counter itself is weak
      if (incomingMatchup.multiplier <= 0.5) defenseScore += 30; // Bonus if resists opponent

      return {
        id: c.id,
        name: c.name,
        nameVi: c.nameVi,
        rarity: c.rarity,
        elements: c.elements,
        baseHp: c.baseHp,
        baseAtk: c.baseAtk,
        incomingDamage: incomingMatchup.label,
        counterEffectivenessScore: defenseScore + (c.rarity === 'H' ? 50 : c.rarity === 'M' ? 35 : 20)
      };
    }).sort((a, b) => b.counterEffectivenessScore - a.counterEffectivenessScore);

    return {
      opponent: {
        id: opponent.id,
        name: opponent.name,
        nameVi: opponent.nameVi,
        rarity: opponent.rarity,
        primaryElement: primaryDefend,
        elements: opponent.elements,
        vulnerabilities: weaknessElements
      },
      topCounters: counterDragons.slice(0, 4)
    };
  });

  return {
    success: true,
    totalOpponents: opponents.length,
    recommendations,
    strategyAdvice: 'Rồng đầu tiên của bạn nên là rồng có khả năng ra đòn chí mạng x2 ngay lượt đầu tiên để hạ gục nhanh rồng chủ lực của đối thủ.'
  };
}
