/**
 * In-memory storage for analyzed strings using Map
 */
class StringStorage {
  constructor() {
    // Map: sha256_hash -> string data object
    this.store = new Map();
  }

  /**
   * Adds a new string to storage
   * @param {Object} stringData - The analyzed string data
   * @returns {Object} The stored string data
   */
  add(stringData) {
    this.store.set(stringData.id, stringData);
    return stringData;
  }

  /**
   * Checks if a string with the given hash exists
   * @param {string} hash - SHA-256 hash of the string
   * @returns {boolean} True if exists, false otherwise
   */
  exists(hash) {
    return this.store.has(hash);
  }

  /**
   * Retrieves a string by its hash
   * @param {string} hash - SHA-256 hash of the string
   * @returns {Object|null} The string data or null if not found
   */
  getByHash(hash) {
    return this.store.get(hash) || null;
  }

  /**
   * Retrieves all strings from storage
   * @returns {Array} Array of all string data objects
   */
  getAll() {
    return Array.from(this.store.values());
  }

  /**
   * Deletes a string by its hash
   * @param {string} hash - SHA-256 hash of the string
   * @returns {boolean} True if deleted, false if not found
   */
  delete(hash) {
    return this.store.delete(hash);
  }

  /**
   * Filters strings based on provided criteria
   * @param {Object} filters - Filter criteria
   * @returns {Array} Array of matching string data objects
   */
  filter(filters) {
    let results = this.getAll();

    if (filters.is_palindrome !== undefined) {
      results = results.filter(item => 
        item.properties.is_palindrome === filters.is_palindrome
      );
    }

    if (filters.min_length !== undefined) {
      results = results.filter(item => 
        item.properties.length >= filters.min_length
      );
    }

    if (filters.max_length !== undefined) {
      results = results.filter(item => 
        item.properties.length <= filters.max_length
      );
    }

    if (filters.word_count !== undefined) {
      results = results.filter(item => 
        item.properties.word_count === filters.word_count
      );
    }

    if (filters.contains_character !== undefined) {
      results = results.filter(item => 
        item.value.includes(filters.contains_character)
      );
    }

    return results;
  }

  /**
   * Gets the count of stored strings
   * @returns {number} Count of strings
   */
  count() {
    return this.store.size;
  }
}

// Create a singleton instance
const storage = new StringStorage();

module.exports = storage;
