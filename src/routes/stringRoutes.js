const express = require('express');
const router = express.Router();
const { analyzeString, computeSHA256 } = require('../utils/stringAnalyzer');
const storage = require('../storage/stringStorage');
const { parseNaturalLanguageQuery } = require('../utils/naturalLanguageParser');

/**
 * POST /strings
 * Create and analyze a new string
 */
router.post('/', (req, res) => {
  try {
    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid request body'
      });
    }

    // Check if 'value' field exists
    if (!('value' in req.body)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Missing "value" field in request body'
      });
    }

    // Validate that 'value' is a string
    if (typeof req.body.value !== 'string') {
      return res.status(422).json({
        error: 'Unprocessable Entity',
        message: 'Invalid data type for "value" (must be string)'
      });
    }

    const value = req.body.value;

    // Compute SHA-256 hash to check for duplicates
    const hash = computeSHA256(value);

    // Check if string already exists
    if (storage.exists(hash)) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'String already exists in the system'
      });
    }

    // Analyze the string
    const properties = analyzeString(value);

    // Create the string data object
    const stringData = {
      id: hash,
      value: value,
      properties: properties,
      created_at: new Date().toISOString()
    };

    // Store the string
    storage.add(stringData);

    // Return 201 Created
    return res.status(201).json(stringData);
  } catch (error) {
    console.error('Error in POST /strings:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while processing the request'
    });
  }
});

/**
 * GET /strings/:string_value
 * Get a specific string by its value
 */
router.get('/:string_value', (req, res) => {
  try {
    const stringValue = req.params.string_value;

    // Compute hash of the requested string
    const hash = computeSHA256(stringValue);

    // Retrieve the string from storage
    const stringData = storage.getByHash(hash);

    if (!stringData) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'String does not exist in the system'
      });
    }

    return res.status(200).json(stringData);
  } catch (error) {
    console.error('Error in GET /strings/:string_value:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while processing the request'
    });
  }
});

/**
 * DELETE /strings/:string_value
 * Delete a specific string by its value
 */
router.delete('/:string_value', (req, res) => {
  try {
    const stringValue = req.params.string_value;

    // Compute hash of the requested string
    const hash = computeSHA256(stringValue);

    // Try to delete the string
    const deleted = storage.delete(hash);

    if (!deleted) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'String does not exist in the system'
      });
    }

    // Return 204 No Content
    return res.status(204).send();
  } catch (error) {
    console.error('Error in DELETE /strings/:string_value:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while processing the request'
    });
  }
});

module.exports = router;
