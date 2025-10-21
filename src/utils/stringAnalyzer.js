const crypto = require('crypto');

/**
 * Analyzes a string and computes various properties
 * @param {string} value - The string to analyze
 * @returns {Object} An object containing computed properties
 */
function analyzeString(value) {
  return {
    length: computeLength(value),
    is_palindrome: isPalindrome(value),
    unique_characters: countUniqueCharacters(value),
    word_count: countWords(value),
    sha256_hash: computeSHA256(value),
    character_frequency_map: getCharacterFrequencyMap(value)
  };
}

/**
 * Computes the length of the string
 * @param {string} str - Input string
 * @returns {number} Length of the string
 */
function computeLength(str) {
  return str.length;
}

/**
 * Checks if a string is a palindrome (case-insensitive)
 * @param {string} str - Input string
 * @returns {boolean} True if palindrome, false otherwise
 */
function isPalindrome(str) {
  const normalized = str.toLowerCase();
  const reversed = normalized.split('').reverse().join('');
  return normalized === reversed;
}

/**
 * Counts the number of unique characters in the string
 * @param {string} str - Input string
 * @returns {number} Count of unique characters
 */
function countUniqueCharacters(str) {
  const uniqueChars = new Set(str);
  return uniqueChars.size;
}

/**
 * Counts the number of words separated by whitespace
 * @param {string} str - Input string
 * @returns {number} Number of words
 */
function countWords(str) {
  // Trim and split by whitespace, filter out empty strings
  const words = str.trim().split(/\s+/).filter(word => word.length > 0);
  return words.length;
}

/**
 * Computes the SHA-256 hash of the string
 * @param {string} str - Input string
 * @returns {string} SHA-256 hash in hexadecimal format
 */
function computeSHA256(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

/**
 * Creates a frequency map of characters in the string
 * @param {string} str - Input string
 * @returns {Object} Object mapping characters to their occurrence count
 */
function getCharacterFrequencyMap(str) {
  const frequencyMap = {};
  
  for (const char of str) {
    frequencyMap[char] = (frequencyMap[char] || 0) + 1;
  }
  
  return frequencyMap;
}

module.exports = {
  analyzeString,
  computeLength,
  isPalindrome,
  countUniqueCharacters,
  countWords,
  computeSHA256,
  getCharacterFrequencyMap
};
