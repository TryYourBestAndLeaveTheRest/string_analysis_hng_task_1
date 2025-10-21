# String Analysis API

A RESTful API service that analyzes strings and stores their computed properties. The API provides endpoints to create, retrieve, filter, and delete analyzed strings with various computed properties including length, palindrome detection, character frequency, and more.

## Features

- ✅ Analyze strings and compute multiple properties
- ✅ Store analyzed strings in memory using Map
- ✅ Filter strings using query parameters
- ✅ Natural language query support
- ✅ SHA-256 hash-based unique identification
- ✅ Comprehensive error handling

## Computed Properties

For each analyzed string, the API computes and stores:

- **length**: Number of characters in the string
- **is_palindrome**: Boolean indicating if the string reads the same forwards and backwards (case-insensitive)
- **unique_characters**: Count of distinct characters in the string
- **word_count**: Number of words separated by whitespace
- **sha256_hash**: SHA-256 hash of the string for unique identification
- **character_frequency_map**: Object mapping each character to its occurrence count

## Prerequisites

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hng
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Dependencies

The project uses the following dependencies:

- **express** (^4.18.2): Fast, unopinionated web framework for Node.js
- **cors** (^2.8.5): Middleware to enable CORS (Cross-Origin Resource Sharing)

### Installing Dependencies

All dependencies are listed in `package.json` and can be installed with:

```bash
npm install
```

## Running the Application

### Development Mode

Start the server with auto-restart on file changes (Node.js v18.11.0+):

```bash
npm run dev
```

### Production Mode

Start the server normally:

```bash
npm start
```

The API will start on `http://localhost:3000` by default.

### Custom Port

To run on a different port, set the `PORT` environment variable:

```bash
PORT=5000 npm start
```

## API Endpoints

### 1. Create/Analyze String

**Endpoint:** `POST /strings`

**Description:** Analyzes a string and stores it in the system.

**Request Body:**
```json
{
  "value": "string to analyze"
}
```

**Success Response (201 Created):**
```json
{
  "id": "sha256_hash_value",
  "value": "string to analyze",
  "properties": {
    "length": 17,
    "is_palindrome": false,
    "unique_characters": 12,
    "word_count": 3,
    "sha256_hash": "abc123...",
    "character_frequency_map": {
      "s": 2,
      "t": 3,
      "r": 2
    }
  },
  "created_at": "2025-10-21T10:00:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request body or missing "value" field
- `409 Conflict`: String already exists in the system
- `422 Unprocessable Entity`: Invalid data type for "value" (must be string)

**Example:**
```bash
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "racecar"}'
```

### 2. Get Specific String

**Endpoint:** `GET /strings/{string_value}`

**Description:** Retrieves a previously analyzed string by its exact value.

**Success Response (200 OK):**
```json
{
  "id": "sha256_hash_value",
  "value": "requested string",
  "properties": {
    "length": 16,
    "is_palindrome": false,
    "unique_characters": 13,
    "word_count": 2,
    "sha256_hash": "def456...",
    "character_frequency_map": {
      "r": 3,
      "e": 3
    }
  },
  "created_at": "2025-10-21T10:00:00Z"
}
```

**Error Responses:**
- `404 Not Found`: String does not exist in the system

**Example:**
```bash
curl http://localhost:3000/strings/racecar
```

### 3. Get All Strings with Filtering

**Endpoint:** `GET /strings`

**Description:** Retrieves all analyzed strings with optional filtering.

**Query Parameters:**
- `is_palindrome`: boolean (`true` or `false`)
- `min_length`: integer (minimum string length)
- `max_length`: integer (maximum string length)
- `word_count`: integer (exact word count)
- `contains_character`: string (single character to search for)

**Success Response (200 OK):**
```json
{
  "data": [
    {
      "id": "hash1",
      "value": "string1",
      "properties": { },
      "created_at": "2025-10-21T10:00:00Z"
    }
  ],
  "count": 1,
  "filters_applied": {
    "is_palindrome": true,
    "min_length": 5,
    "max_length": 20,
    "word_count": 2,
    "contains_character": "a"
  }
}
```

**Error Response:**
- `400 Bad Request`: Invalid query parameter values or types

**Examples:**
```bash
# Get all palindromes
curl "http://localhost:3000/strings?is_palindrome=true"

# Get strings with 2 words
curl "http://localhost:3000/strings?word_count=2"

# Get strings between 5 and 20 characters
curl "http://localhost:3000/strings?min_length=5&max_length=20"

# Get strings containing the letter 'a'
curl "http://localhost:3000/strings?contains_character=a"

# Combine multiple filters
curl "http://localhost:3000/strings?is_palindrome=true&word_count=1&contains_character=a"
```

### 4. Natural Language Filtering

**Endpoint:** `GET /strings/filter-by-natural-language`

**Description:** Filters strings using natural language queries.

**Query Parameters:**
- `query`: string (natural language query)

**Success Response (200 OK):**
```json
{
  "data": [ ],
  "count": 3,
  "interpreted_query": {
    "original": "all single word palindromic strings",
    "parsed_filters": {
      "word_count": 1,
      "is_palindrome": true
    }
  }
}
```

**Supported Natural Language Patterns:**

| Query Example | Interpreted Filters |
|--------------|-------------------|
| "all single word palindromic strings" | `word_count=1, is_palindrome=true` |
| "strings longer than 10 characters" | `min_length=11` |
| "palindromic strings that contain the first vowel" | `is_palindrome=true, contains_character=a` |
| "strings containing the letter z" | `contains_character=z` |
| "two word strings" | `word_count=2` |
| "strings shorter than 5 characters" | `max_length=4` |

**Error Responses:**
- `400 Bad Request`: Missing query parameter or unable to parse query
- `422 Unprocessable Entity`: Query parsed but resulted in conflicting filters

**Examples:**
```bash
# Find single word palindromes
curl "http://localhost:3000/strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings"

# Find strings longer than 10 characters
curl "http://localhost:3000/strings/filter-by-natural-language?query=strings%20longer%20than%2010%20characters"

# Find strings containing 'z'
curl "http://localhost:3000/strings/filter-by-natural-language?query=strings%20containing%20the%20letter%20z"
```

### 5. Delete String

**Endpoint:** `DELETE /strings/{string_value}`

**Description:** Deletes a previously analyzed string by its exact value.

**Success Response:** `204 No Content` (Empty response body)

**Error Response:**
- `404 Not Found`: String does not exist in the system

**Example:**
```bash
curl -X DELETE http://localhost:3000/strings/racecar
```

## Project Structure

```
hng/
├── src/
│   ├── routes/
│   │   ├── stringRoutes.js      # POST, GET by value, DELETE endpoints
│   │   └── filterRoutes.js      # GET all with filters, natural language
│   ├── storage/
│   │   └── stringStorage.js     # In-memory Map storage
│   ├── utils/
│   │   ├── stringAnalyzer.js    # String analysis functions
│   │   └── naturalLanguageParser.js  # Natural language query parser
│   └── server.js                # Main Express application
├── package.json
├── .gitignore
└── README.md
```

## Testing the API

### Using cURL

```bash
# Create a palindrome
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "racecar"}'

# Create a multi-word string
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "hello world"}'

# Get a specific string
curl http://localhost:3000/strings/racecar

# Get all palindromes
curl "http://localhost:3000/strings?is_palindrome=true"

# Use natural language
curl "http://localhost:3000/strings/filter-by-natural-language?query=single%20word%20palindromic%20strings"

# Delete a string
curl -X DELETE http://localhost:3000/strings/racecar
```

### Using Postman or Thunder Client

1. Import the base URL: `http://localhost:3000`
2. Create requests for each endpoint as documented above
3. Set Content-Type header to `application/json` for POST requests

## Error Handling

The API provides comprehensive error handling with appropriate HTTP status codes:

- **400 Bad Request**: Invalid request parameters or body
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists
- **422 Unprocessable Entity**: Invalid data type or conflicting filters
- **500 Internal Server Error**: Unexpected server error

All error responses follow this format:
```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

## Data Storage

The API uses an in-memory Map for storage:
- Data is stored in RAM and will be lost when the server restarts
- Each string is uniquely identified by its SHA-256 hash
- Fast O(1) lookups for get and delete operations
- Perfect for development and testing

## Development

### Adding New Features

1. **Add new analysis properties**: Edit `src/utils/stringAnalyzer.js`
2. **Add new filters**: Edit `src/storage/stringStorage.js` and route handlers
3. **Add new natural language patterns**: Edit `src/utils/naturalLanguageParser.js`

### Code Style

- Use consistent indentation (2 spaces)
- Add JSDoc comments for functions
- Follow RESTful API conventions
- Handle errors appropriately

## License

MIT

## Author

Built for HNG Internship

## GitHub Repository

[Add your repository URL here]

## Support

For issues or questions, please open an issue in the GitHub repository.
