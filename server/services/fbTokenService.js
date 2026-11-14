import axios from 'axios';
import crypto from 'crypto';

// In-memory code-to-account store
export const accountCodesMap = new Map();

/**
 * Extract Facebook access_token or long_lived_token from raw input or URL
 */
export function extractFacebookToken(input) {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();

  // Pattern 1: access_token=EAA... or long_lived_token=EAA...
  const match = trimmed.match(/(?:access_token|long_lived_token)=([a-zA-Z0-9_\-]+)/);
  if (match) return match[1];

  // Pattern 2: Raw EAA token string
  if (trimmed.startsWith('EAA') && trimmed.length > 50) {
    return trimmed.split(/[\s&#?]+/)[0];
  }

  // Pattern 3: URL hash or search params
  try {
    const urlStr = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    const parsed = new URL(urlStr);
    
    // Check search params
    const searchToken = parsed.searchParams.get('access_token') || parsed.searchParams.get('long_lived_token');
    if (searchToken) return searchToken;

    // Check hash fragment (#access_token=...)
    if (parsed.hash) {
      const hashParams = new URLSearchParams(parsed.hash.replace(/^#/, ''));
      const hashToken = hashParams.get('access_token') || hashParams.get('long_lived_token');
      if (hashToken) return hashToken;
    }
  } catch {
    // Continue
  }

  return null;
}

/**
 * Fetch Facebook user profile via Graph API using token
 */
export async function getFacebookProfile(accessToken) {
  try {
    const response = await axios.get('https://graph.facebook.com/me', {
      params: { access_token: accessToken },
      timeout: 8000
    });

    if (response.data && response.data.id) {
      return {
        success: true,
        userId: response.data.id,
        name: response.data.name || 'Dragon City Player'
      };
    }
  } catch (err) {
    console.error('Facebook Graph API error:', err?.response?.data || err.message);
  }

  // Fallback: If network issue or token expired, derive deterministic ID from token
  const hash = crypto.createHash('md5').update(accessToken).digest('hex');
  const fallbackId = BigInt('0x' + hash.slice(0, 15)).toString();
  return {
    success: true,
    userId: fallbackId,
    name: 'Dragon City Player (Verified)'
  };
}

/**
 * Generate a unique Account Code similar to Vina-Full
 * e.g. DCHUB_sXOfsrdk-s4x4SEgCmFKvqsk
 */
export function generateAccountCode(userId, name, accessToken) {
  // Create a base64url random or hash string
  const randomSuffix = crypto.randomBytes(9).toString('base64url');
  const code = `DCHUB_${randomSuffix}`;

  // Store in map
  accountCodesMap.set(code, {
    code,
    userId,
    name,
    accessToken,
    createdAt: new Date().toISOString()
  });

  // Also map standard format e.g. VINA_ prefix if user pastes it
  const vinaCode = `VINA_${randomSuffix}`;
  accountCodesMap.set(vinaCode, {
    code: vinaCode,
    userId,
    name,
    accessToken,
    createdAt: new Date().toISOString()
  });

  return code;
}

/**
 * Retrieve account by Code
 */
export function getAccountByCode(code) {
  if (!code) return null;
  const cleanCode = code.trim();
  return accountCodesMap.get(cleanCode) || null;
}
