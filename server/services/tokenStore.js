/**
 * In-memory token storage (for OAuth tokens).
 * Replace with persistent store in production!
 */

const _store = new Map();

/**
 * Get token data for a given key.
 * @param {string} key 
 * @returns {object | undefined}
 */
export function getToken(key) {
  return _store.get(key);
}

/**
 * Set token data for a given key.
 * @param {string} key 
 * @param {object} value 
 */
export function setToken(key, value) {
  _store.set(key, value);
}