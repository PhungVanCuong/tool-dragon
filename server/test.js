import assert from 'assert';
import { parseDragonCityToken } from './services/accountParser.js';
import {
  extractFacebookToken,
  getFacebookProfile,
  generateAccountCode,
  getAccountByCode
} from './services/fbTokenService.js';
import {
  fetchAccountProfile,
  harvestGreenhouse,
  boostGreenhouse,
  clearObstacles,
  convertGoldToFood,
  claimDragonTvReward,
  claimDailyStreak,
  simulateArenaBattle
} from './services/dcApiClient.js';
import {
  calculateBreeding,
  reverseBreeding,
  calculateFeedingCost
} from './services/breedingService.js';
import { recommendCounters, getElementMatchup } from './services/arenaService.js';

console.log('🧪 Starting Dragon City Backend Tests...\n');

// 1. Test Facebook Token & Code Generator (Vina-Full flow)
console.log('1. Testing Facebook Token Extractor & Code Generator...');
const fbSampleUrl = 'https://apps.facebook.com/dragoncity/#access_token=EAAETazWuuhcBS1wNzJ6qE9gTrF2TN6etZAqLE1bebPrjoLjokoSv4lGu49o3yZBe67PKfyNAEerLQ38z4Y19jBVRdFnMGWUGDxfHoYiMBTrww0am91cvyI7SohR1epDfurImTUiHRoBtSl9bhtFmwhL9JW3xf1kZCDZBr9sVTxe7YrwjI84tknIL3edCzcuTEOBxwbHRvjPrcoV9FPwJZBItZAhOdKVyUf8U6YssxHg4gG8TYFaMZABgSKQoQZAAG2buNUybyVEGSzxwr4U4QtUslo4ZA27kyhAhgsbCH2aO2i26n&data_access_expiration_time=1802425037&expires_in=4963&long_lived_token=...';

const extractedToken = extractFacebookToken(fbSampleUrl);
assert(extractedToken !== null, 'Token should be extracted from Facebook redirect URL');
assert(extractedToken.startsWith('EAAETazWuuhcBS'), 'Token should start with EAAETazWuuhcBS');

const code = generateAccountCode('549093523579670', 'Cường Phùng', extractedToken);
assert(code.startsWith('DCHUB_'), 'Code should start with DCHUB_ prefix');

const retrieved = getAccountByCode(code);
assert.strictEqual(retrieved.userId, '549093523579670');
assert.strictEqual(retrieved.name, 'Cường Phùng');
console.log('✅ Facebook Token & Code Generator tests passed!\n');

// 2. Test accountParser
console.log('2. Testing "Connect My Dragon City Information" Parser...');
const urlInput = 'https://game.dragoncitymobile.com/?user_id=123456789&session_id=abcdef1234567890';
const p1 = parseDragonCityToken(urlInput);
assert.strictEqual(p1.success, true);
assert.strictEqual(p1.data.userId, '123456789');
assert.strictEqual(p1.data.sessionId, 'abcdef1234567890');

const jsonInput = '{"user_id": "987654321", "session_id": "sess_tok_998877665544"}';
const p2 = parseDragonCityToken(jsonInput);
assert.strictEqual(p2.success, true);
assert.strictEqual(p2.data.userId, '987654321');

const textInput = 'uid: 55443322, session: secret_session_token_xyz';
const p3 = parseDragonCityToken(textInput);
assert.strictEqual(p3.success, true);
assert.strictEqual(p3.data.userId, '55443322');
console.log('✅ Account Parser tests passed!\n');

// 3. Test dcApiClient
console.log('3. Testing Player Profile & Actions...');
async function runClientTests() {
  const profile = await fetchAccountProfile('549093523579670', 'test_sess', 'Cường Phùng');
  assert.strictEqual(profile.success, true);
  assert.strictEqual(profile.data.userId, '549093523579670');
  assert.strictEqual(profile.data.name, 'Cường Phùng');

  const harvest = await harvestGreenhouse('549093523579670', 'test_sess');
  assert.strictEqual(harvest.success, true);

  const boost = await boostGreenhouse('549093523579670', 'test_sess');
  assert.strictEqual(boost.success, true);

  const clean = await clearObstacles('549093523579670', 'test_sess', 2);
  assert.strictEqual(clean.success, true);

  const conv = await convertGoldToFood('549093523579670', 'test_sess', 1000000);
  assert.strictEqual(conv.success, true);

  const tv = await claimDragonTvReward('549093523579670', 'test_sess');
  assert.strictEqual(tv.success, true);

  const streak = await claimDailyStreak('549093523579670', 'test_sess');
  assert.strictEqual(streak.success, true);

  const battle = await simulateArenaBattle('549093523579670', 'test_sess');
  assert.strictEqual(battle.success, true);
  console.log('✅ Player Actions & Sandbox tests passed!\n');
}

// 4. Test breedingService
console.log('4. Testing Breeding & Feeding Service...');
const breed = calculateBreeding('c_flame', 'c_sea', 8, 2, 2);
assert.strictEqual(breed.success, true);
assert(breed.possibleOffspring.length > 0);

const reverse = reverseBreeding('l_apocalypse');
assert.strictEqual(reverse.success, true);
assert(reverse.recommendedPairs.length > 0);

const feed = calculateFeedingCost(1, 40);
assert.strictEqual(feed.success, true);
assert(feed.totalFoodRequired > 1000000);
console.log('✅ Breeding & Feeding tests passed!\n');

// 5. Test arenaService
console.log('5. Testing Arena Tactics & Counter-Picks...');
const matchup = getElementMatchup('flame', 'nature');
assert.strictEqual(matchup.multiplier, 2.0);

const counter = recommendCounters(['h_master_karma', 'm_prideful_vampire']);
assert.strictEqual(counter.success, true);
assert.strictEqual(counter.recommendations.length, 2);
console.log('✅ Arena Counter-Pick tests passed!\n');

runClientTests().then(() => {
  console.log('🎉 ALL BACKEND & CODE GENERATOR TESTS PASSED SUCCESSFULLY! 100% READY.');
});
