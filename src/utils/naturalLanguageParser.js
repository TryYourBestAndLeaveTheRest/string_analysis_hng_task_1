/**
 * Parses natural language queries into filter objects
 * @param {string} query - Natural language query string
 * @returns {Object} Parse result with filters and success status
 */
function parseNaturalLanguageQuery(query) {
  const normalizedQuery = query.toLowerCase().trim();
  const filters = {};
  const conflicts = [];

  try {
    // Check for palindrome-related keywords
    if (normalizedQuery.includes('palindrom')) {
      filters.is_palindrome = true;
    }

    // Check for word count patterns
    // Pattern: "single word" or "one word"
    if (normalizedQuery.match(/\b(single|one)\s+word\b/)) {
      filters.word_count = 1;
    }
    // Pattern: "two words"
    else if (normalizedQuery.match(/\btwo\s+words?\b/)) {
      filters.word_count = 2;
    }
    // Pattern: "three words"
    else if (normalizedQuery.match(/\bthree\s+words?\b/)) {
      filters.word_count = 3;
    }
    // Pattern: "X words" where X is a number
    else {
      const wordCountMatch = normalizedQuery.match(/\b(\d+)\s+words?\b/);
      if (wordCountMatch) {
        filters.word_count = parseInt(wordCountMatch[1], 10);
      }
    }

    // Check for length patterns
    // Pattern: "longer than X" or "more than X characters"
    const longerThanMatch = normalizedQuery.match(/\b(?:longer|more)\s+than\s+(\d+)(?:\s+characters?)?\b/);
    if (longerThanMatch) {
      filters.min_length = parseInt(longerThanMatch[1], 10) + 1;
    }

    // Pattern: "shorter than X" or "less than X characters"
    const shorterThanMatch = normalizedQuery.match(/\b(?:shorter|less)\s+than\s+(\d+)(?:\s+characters?)?\b/);
    if (shorterThanMatch) {
      filters.max_length = parseInt(shorterThanMatch[1], 10) - 1;
    }

    // Pattern: "at least X characters"
    const atLeastMatch = normalizedQuery.match(/\bat\s+least\s+(\d+)(?:\s+characters?)?\b/);
    if (atLeastMatch) {
      filters.min_length = parseInt(atLeastMatch[1], 10);
    }

    // Pattern: "at most X characters"
    const atMostMatch = normalizedQuery.match(/\bat\s+most\s+(\d+)(?:\s+characters?)?\b/);
    if (atMostMatch) {
      filters.max_length = parseInt(atMostMatch[1], 10);
    }

    // Pattern: "exactly X characters"
    const exactlyMatch = normalizedQuery.match(/\bexactly\s+(\d+)(?:\s+characters?)?\b/);
    if (exactlyMatch) {
      const exactLength = parseInt(exactlyMatch[1], 10);
      filters.min_length = exactLength;
      filters.max_length = exactLength;
    }

    // Check for character containment patterns
    // Pattern: "containing letter X" or "containing character X" or "with letter X"
    const containsLetterMatch = normalizedQuery.match(/\b(?:containing|with|that\s+contain)\s+(?:the\s+)?(?:letter|character)\s+([a-z])\b/);
    if (containsLetterMatch) {
      filters.contains_character = containsLetterMatch[1];
    }

    // Pattern: "containing X" where X is a single character
    const containsCharMatch = normalizedQuery.match(/\bcontaining\s+([a-z])\b/);
    if (containsCharMatch && !containsLetterMatch) {
      filters.contains_character = containsCharMatch[1];
    }

    // Pattern: "first vowel" -> 'a', "second vowel" -> 'e', etc.
    if (normalizedQuery.includes('first vowel')) {
      filters.contains_character = 'a';
    } else if (normalizedQuery.includes('second vowel')) {
      filters.contains_character = 'e';
    } else if (normalizedQuery.includes('third vowel')) {
      filters.contains_character = 'i';
    } else if (normalizedQuery.includes('fourth vowel')) {
      filters.contains_character = 'o';
    } else if (normalizedQuery.includes('fifth vowel')) {
      filters.contains_character = 'u';
    }

    // Check for conflicting filters
    if (filters.min_length !== undefined && filters.max_length !== undefined) {
      if (filters.min_length > filters.max_length) {
        conflicts.push('min_length is greater than max_length');
      }
    }

    // If no filters were extracted, return error
    if (Object.keys(filters).length === 0) {
      return {
        success: false,
        error: 'Could not extract any valid filters from the query',
        filters: {}
      };
    }

    return {
      success: true,
      filters: filters,
      conflicts: conflicts.length > 0 ? conflicts : undefined
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      filters: {}
    };
  }
}

module.exports = {
  parseNaturalLanguageQuery
};
