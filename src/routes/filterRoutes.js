const express = require('express');
const router = express.Router();
const storage = require('../storage/stringStorage');
const { parseNaturalLanguageQuery } = require('../utils/naturalLanguageParser');

/**
 * GET /strings/filter-by-natural-language
 * Filter strings using natural language query
 * Must be defined before GET /strings to avoid route conflicts
 */
router.get('/filter-by-natural-language', (req, res) => {
  try {
    const query = req.query.query;

    if (!query) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing "query" parameter'
      });
    }

    // Parse the natural language query
    const parseResult = parseNaturalLanguageQuery(query);

    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Unable to parse natural language query',
        details: parseResult.error
      });
    }

    // Check for conflicting filters
    if (parseResult.conflicts && parseResult.conflicts.length > 0) {
      return res.status(422).json({
        error: 'Unprocessable Entity',
        message: 'Query parsed but resulted in conflicting filters',
        conflicts: parseResult.conflicts
      });
    }

    // Apply filters
    const results = storage.filter(parseResult.filters);

    return res.status(200).json({
      data: results,
      count: results.length,
      interpreted_query: {
        original: query,
        parsed_filters: parseResult.filters
      }
    });
  } catch (error) {
    console.error('Error in GET /strings/filter-by-natural-language:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while processing the request'
    });
  }
});

/**
 * GET /strings
 * Get all strings with optional filtering
 */
router.get('/', (req, res) => {
  try {
    const filters = {};
    const filtersApplied = {};

    // Parse is_palindrome filter
    if (req.query.is_palindrome !== undefined) {
      const isPalindrome = req.query.is_palindrome;
      if (isPalindrome !== 'true' && isPalindrome !== 'false') {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid value for "is_palindrome" parameter. Must be "true" or "false"'
        });
      }
      filters.is_palindrome = isPalindrome === 'true';
      filtersApplied.is_palindrome = filters.is_palindrome;
    }

    // Parse min_length filter
    if (req.query.min_length !== undefined) {
      const minLength = parseInt(req.query.min_length, 10);
      if (isNaN(minLength) || minLength < 0) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid value for "min_length" parameter. Must be a non-negative integer'
        });
      }
      filters.min_length = minLength;
      filtersApplied.min_length = minLength;
    }

    // Parse max_length filter
    if (req.query.max_length !== undefined) {
      const maxLength = parseInt(req.query.max_length, 10);
      if (isNaN(maxLength) || maxLength < 0) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid value for "max_length" parameter. Must be a non-negative integer'
        });
      }
      filters.max_length = maxLength;
      filtersApplied.max_length = maxLength;
    }

    // Parse word_count filter
    if (req.query.word_count !== undefined) {
      const wordCount = parseInt(req.query.word_count, 10);
      if (isNaN(wordCount) || wordCount < 0) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid value for "word_count" parameter. Must be a non-negative integer'
        });
      }
      filters.word_count = wordCount;
      filtersApplied.word_count = wordCount;
    }

    // Parse contains_character filter
    if (req.query.contains_character !== undefined) {
      const containsChar = req.query.contains_character;
      if (typeof containsChar !== 'string' || containsChar.length !== 1) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Invalid value for "contains_character" parameter. Must be a single character'
        });
      }
      filters.contains_character = containsChar;
      filtersApplied.contains_character = containsChar;
    }

    // Filter the strings
    const results = storage.filter(filters);

    return res.status(200).json({
      data: results,
      count: results.length,
      filters_applied: filtersApplied
    });
  } catch (error) {
    console.error('Error in GET /strings:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while processing the request'
    });
  }
});

module.exports = router;
