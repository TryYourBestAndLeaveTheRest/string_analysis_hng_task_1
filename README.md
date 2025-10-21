# String Analysis API

A production-ready RESTful API service built with Node.js and Express.js that analyzes strings and stores their computed properties. Features include palindrome detection, character frequency analysis, word counting, and natural language query support.

## 🎯 Features

- ✅ String analysis with 6 computed properties
- ✅ SHA-256 hash-based unique identification
- ✅ In-memory storage using JavaScript Map
- ✅ RESTful API with 5 endpoints
- ✅ Natural language query parsing
- ✅ Comprehensive error handling
- ✅ Query parameter filtering
- ✅ CORS enabled for cross-origin requests

## 📊 Computed Properties

For each analyzed string, the API computes and stores:

1. **length** - Number of characters in the string
2. **is_palindrome** - Boolean indicating if the string reads the same forwards and backwards (case-insensitive)
3. **unique_characters** - Count of distinct characters in the string
4. **word_count** - Number of words separated by whitespace
5. **sha256_hash** - SHA-256 hash of the string for unique identification
6. **character_frequency_map** - Object mapping each character to its occurrence count

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)

Check your versions:
```bash
node --version
npm --version
```

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hng
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

You should see:
```
String Analysis API is running on port 3000
Access the API at http://localhost:3000
```

4. **Test your first request**

Open a new terminal and try:
```bash
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "racecar"}'
```

### Run Automated Tests

```bash
chmod +x test-api.sh
./test-api.sh
```

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.18.2 | Fast web framework for Node.js |
| cors | ^2.8.5 | Enable CORS (Cross-Origin Resource Sharing) |

All dependencies are listed in `package.json` and installed with `npm install`.

## 🖥️ Running the Application

### Development Mode
Start with auto-restart on file changes (Node.js v18.11.0+):
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Custom Port
```bash
PORT=5000 npm start
```

The API runs on `http://localhost:3000` by default.

## 📁 Project Structure

```
hng/
├── src/
│   ├── routes/
│   │   ├── stringRoutes.js          # POST, GET, DELETE endpoints
│   │   └── filterRoutes.js          # GET with filters, natural language
│   ├── storage/
│   │   └── stringStorage.js         # In-memory Map storage
│   ├── utils/
│   │   ├── stringAnalyzer.js        # String analysis functions
│   │   └── naturalLanguageParser.js # Natural language query parser
│   └── server.js                     # Main Express application
├── package.json                       # Dependencies and scripts
├── .gitignore                         # Git ignore rules
├── test-api.sh                        # Automated test script
└── README.md                          # This file
```

## 🌐 API Endpoints

### Overview

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| POST | `/strings` | Create and analyze string | 201, 400, 409, 422 |
| GET | `/strings/:value` | Get specific string | 200, 404 |
| GET | `/strings` | Get all with filters | 200, 400 |
| GET | `/strings/filter-by-natural-language` | Natural language query | 200, 400, 422 |
| DELETE | `/strings/:value` | Delete string | 204, 404 |

---

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
```

---

## 📚 Usage Examples

### Basic Operations

#### Create and Analyze a String
```bash
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "racecar"}'
```

**Example Response:**
```json
{
  "id": "be5d5d37542d75f93a87094459f76678d8b1b14f0d1b0e9d6f1e8f7f8e9d0f1a",
  "value": "racecar",
  "properties": {
    "length": 7,
    "is_palindrome": true,
    "unique_characters": 4,
    "word_count": 1,
    "sha256_hash": "be5d5d37542d75f93a87094459f76678d8b1b14f0d1b0e9d6f1e8f7f8e9d0f1a",
    "character_frequency_map": {
      "r": 2,
      "a": 2,
      "c": 2,
      "e": 1
    }
  },
  "created_at": "2025-10-21T10:00:00.000Z"
}
```

#### Get a Specific String
```bash
curl http://localhost:3000/strings/racecar
```

#### Delete a String
```bash
curl -X DELETE http://localhost:3000/strings/racecar
```

### Filtering Examples

#### Get All Palindromes
```bash
curl "http://localhost:3000/strings?is_palindrome=true"
```

#### Get Strings by Length Range
```bash
curl "http://localhost:3000/strings?min_length=5&max_length=15"
```

#### Get Strings by Word Count
```bash
curl "http://localhost:3000/strings?word_count=2"
```

#### Get Strings Containing a Character
```bash
curl "http://localhost:3000/strings?contains_character=a"
```

#### Combine Multiple Filters
```bash
curl "http://localhost:3000/strings?is_palindrome=true&word_count=1&min_length=5"
```

### Natural Language Queries

#### Find Single Word Palindromes
```bash
curl "http://localhost:3000/strings/filter-by-natural-language?query=single%20word%20palindromic%20strings"
```

**Example Response:**
```json
{
  "data": [
    {
      "id": "hash1",
      "value": "racecar",
      "properties": { ... },
      "created_at": "2025-10-21T10:00:00.000Z"
    }
  ],
  "count": 1,
  "interpreted_query": {
    "original": "single word palindromic strings",
    "parsed_filters": {
      "word_count": 1,
      "is_palindrome": true
    }
  }
}
```

#### More Natural Language Examples
```bash
# Strings longer than 10 characters
curl "http://localhost:3000/strings/filter-by-natural-language?query=strings%20longer%20than%2010%20characters"

# Strings containing the letter z
curl "http://localhost:3000/strings/filter-by-natural-language?query=strings%20containing%20the%20letter%20z"

# Two word strings
curl "http://localhost:3000/strings/filter-by-natural-language?query=two%20word%20strings"
```

### Advanced Use Cases

#### Character Frequency Analysis
```bash
# Create a string
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "mississippi"}'

# Retrieve to see character frequency
curl http://localhost:3000/strings/mississippi
```

#### Find Short Palindromes
```bash
# Create test data
curl -X POST http://localhost:3000/strings -H "Content-Type: application/json" -d '{"value": "a"}'
curl -X POST http://localhost:3000/strings -H "Content-Type: application/json" -d '{"value": "aba"}'
curl -X POST http://localhost:3000/strings -H "Content-Type: application/json" -d '{"value": "racecar"}'

# Find palindromes with max 3 characters
curl "http://localhost:3000/strings?is_palindrome=true&max_length=3"
```

---

## 🧪 Testing

### Automated Testing

Run the comprehensive test script:
```bash
chmod +x test-api.sh
./test-api.sh
```

This script tests all 20+ scenarios including:
- ✅ Creating strings (valid and duplicate)
- ✅ Invalid requests (400, 422 errors)
- ✅ Getting strings (existing and non-existent)
- ✅ All filter combinations
- ✅ Natural language queries
- ✅ Deleting strings

### Manual Testing Checklist

**Test 1: Create String**
```bash
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "racecar"}'
# Expected: 201 Created
```

**Test 2: Duplicate String**
```bash
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "racecar"}'
# Expected: 409 Conflict
```

**Test 3: Missing Value Field**
```bash
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"wrong": "test"}'
# Expected: 400 Bad Request
```

**Test 4: Invalid Data Type**
```bash
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": 123}'
# Expected: 422 Unprocessable Entity
```

**Test 5: Get Non-existent String**
```bash
curl http://localhost:3000/strings/nonexistent
# Expected: 404 Not Found
```

**Test 6: Invalid Filter Parameter**
```bash
curl "http://localhost:3000/strings?is_palindrome=maybe"
# Expected: 400 Bad Request
```

### Using Postman or Thunder Client

1. Import base URL: `http://localhost:3000`
2. Create requests for each endpoint
3. Set `Content-Type: application/json` header for POST requests
4. Test all status codes (200, 201, 204, 400, 404, 409, 422)

---

## ⚠️ Error Handling

The API provides comprehensive error handling with appropriate HTTP status codes:

| Status Code | Error Type | When It Occurs |
|-------------|------------|----------------|
| 400 | Bad Request | Invalid request parameters or body, missing required fields |
| 404 | Not Found | Resource does not exist in the system |
| 409 | Conflict | Attempting to create a duplicate string |
| 422 | Unprocessable Entity | Invalid data type or conflicting filters |
| 500 | Internal Server Error | Unexpected server error |

### Error Response Format

All error responses follow this structure:
```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

### Common Error Examples

**Duplicate String (409 Conflict):**
```json
{
  "error": "Conflict",
  "message": "String already exists in the system"
}
```

**Missing Value Field (400 Bad Request):**
```json
{
  "error": "Bad Request",
  "message": "Missing \"value\" field in request body"
}
```

**Invalid Data Type (422 Unprocessable Entity):**
```json
{
  "error": "Unprocessable Entity",
  "message": "Invalid data type for \"value\" (must be string)"
}
```

**String Not Found (404):**
```json
{
  "error": "Not Found",
  "message": "String does not exist in the system"
}
```

---

## 💾 Data Storage

The API uses an **in-memory Map** for storage:

- ✅ **Fast O(1) lookups** for get and delete operations
- ✅ **SHA-256 hash as key** ensures uniqueness
- ✅ **No database setup** required
- ⚠️ **Data persists only while server is running**
- ✅ **Perfect for development and testing**

### Performance Characteristics

| Operation | Time Complexity | Notes |
|-----------|----------------|-------|
| Create String | O(n) | n = string length for analysis |
| Get String | O(1) | Direct Map lookup |
| Delete String | O(1) | Direct Map delete |
| Filter All | O(m) | m = number of stored strings |
| SHA-256 Hash | O(n) | n = string length |

Typical response time: **< 10ms**

---

## 🛠️ Development

### Project Architecture

**Design Decisions:**
- **In-memory Map**: Fast O(1) lookups, suitable for development
- **SHA-256 as Key**: Ensures uniqueness, prevents duplicates
- **Separate Route Files**: Logical separation of concerns
- **Middleware Chain**: Consistent request/response flow
- **Pattern Matching**: Extensible natural language parser

### Adding New Features

1. **Add new analysis property**: Edit `src/utils/stringAnalyzer.js`
2. **Add new filter**: Edit `src/storage/stringStorage.js` and route handlers
3. **Add new natural language pattern**: Edit `src/utils/naturalLanguageParser.js`
4. **Add new endpoint**: Create route in `src/routes/`

### Code Style

- Use consistent indentation (2 spaces)
- Add JSDoc comments for functions
- Follow RESTful API conventions
- Handle errors appropriately
- Validate input before processing

---

## 🔧 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Use a different port
PORT=5000 npm start
```

**Dependencies Not Installed**
```bash
# Reinstall dependencies
npm install
```

**Server Not Running**
```bash
# Check if server is running
curl http://localhost:3000
```

**JSON Parsing Errors**
- Ensure `Content-Type: application/json` header is set
- Validate JSON syntax

**URL Encoding Issues**
- Use `%20` for spaces: `hello%20world`
- URL encode special characters

### Debugging Tips

1. **Check Server Logs**: The server logs all requests with timestamps
2. **Use curl -v**: See full HTTP headers
3. **Pretty Print JSON**: Pipe to `jq`: `curl ... | jq`
4. **Check Status Codes**: Add `-w "\nStatus: %{http_code}\n"` to curl

---

## 🌐 Deployment

The API is ready for deployment on:

- **Heroku**
- **AWS** (EC2, Lambda, Elastic Beanstalk)
- **Google Cloud Platform**
- **DigitalOcean**
- **Vercel**
- **Railway**

### Environment Variables

Set the `PORT` variable for your platform:
```bash
PORT=8080 npm start
```

---

## 🎓 Learning Outcomes

This project demonstrates:

- ✅ RESTful API design principles
- ✅ Express.js routing and middleware
- ✅ Error handling patterns
- ✅ Input validation and sanitization
- ✅ Hash functions (SHA-256)
- ✅ In-memory data structures (Map)
- ✅ Natural language parsing basics
- ✅ HTTP status codes and semantics
- ✅ CRUD operations
- ✅ API documentation best practices

---

## 🔮 Future Enhancements

Potential improvements:

- [ ] Database integration (MongoDB, PostgreSQL)
- [ ] Authentication and authorization (JWT)
- [ ] Rate limiting and throttling
- [ ] Pagination for large datasets
- [ ] More analysis metrics (sentiment, language detection)
- [ ] Batch operations
- [ ] Export functionality (JSON, CSV)
- [ ] WebSocket support for real-time updates
- [ ] Caching layer (Redis)
- [ ] GraphQL API alternative

---

## 💡 Tips and Best Practices

### URL Encoding
Always URL encode string values with spaces or special characters:
- Space: `%20`
- Example: "hello world" → `hello%20world`

### Boolean Parameters
Use lowercase strings "true" or "false":
- ✅ Correct: `?is_palindrome=true`
- ❌ Incorrect: `?is_palindrome=True` or `?is_palindrome=1`

### JSON Formatting
Use tools like `jq` for pretty-printing responses:
```bash
curl http://localhost:3000/strings | jq
```

### Testing Workflow
```bash
# 1. Create strings
curl -X POST http://localhost:3000/strings -H "Content-Type: application/json" -d '{"value": "hello"}'
curl -X POST http://localhost:3000/strings -H "Content-Type: application/json" -d '{"value": "racecar"}'

# 2. List all strings
curl http://localhost:3000/strings

# 3. Filter palindromes
curl "http://localhost:3000/strings?is_palindrome=true"

# 4. Natural language query
curl "http://localhost:3000/strings/filter-by-natural-language?query=single%20word%20palindromic%20strings"

# 5. Delete a string
curl -X DELETE http://localhost:3000/strings/hello
```

---

## 📄 License

MIT

---

## 👨‍💻 Author

Built for **HNG Internship**

---

## 📞 Support

For issues or questions:
1. Check this README for solutions
2. Review server logs for errors
3. Run the test script: `./test-api.sh`
4. Open an issue in the GitHub repository

---

## ✨ Quick Reference

```bash
# Install and run
npm install && npm start

# Test
./test-api.sh

# Create
curl -X POST http://localhost:3000/strings -H "Content-Type: application/json" -d '{"value": "test"}'

# Get
curl http://localhost:3000/strings/test

# Filter
curl "http://localhost:3000/strings?is_palindrome=true"

# Natural language
curl "http://localhost:3000/strings/filter-by-natural-language?query=single%20word%20strings"

# Delete
curl -X DELETE http://localhost:3000/strings/test
```

---

**🎉 Success Criteria**

Your API is working correctly when:
- ✅ Server starts on port 3000
- ✅ POST creates strings (201)
- ✅ GET retrieves strings (200)
- ✅ Filters work correctly
- ✅ Natural language queries parse
- ✅ DELETE removes strings (204)
- ✅ Errors return proper codes (400, 404, 409, 422)
- ✅ All tests pass (./test-api.sh)

---

**Built with ❤️ for HNG Internship | Version 1.0.0 | Last Updated: October 21, 2025**

