# Anilist Node API

This project provides a simple Node.js API for interacting with the AniList GraphQL API. It is designed to be deployed on Vercel as a serverless function.

## Features
- Proxy requests to the AniList GraphQL API
- Easy deployment with Vercel

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Vercel CLI (optional, for local development)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/notsopreety/anilist.git
   cd anilist
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Deployment
- Deploy directly to Vercel:
  ```bash
  vercel --prod
  ```
- Or use the Vercel dashboard to import the project.

## Project Structure
- `index.js`: Main entry point for the API
- `queries/anilist.js`: Contains AniList GraphQL queries
- `vercel.json`: Vercel configuration

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Usage

Once deployed (locally or on Vercel), the API exposes the following endpoints:

### Base URL
- Local: `http://localhost:3000`
- Vercel: `https://<your-vercel-deployment-url>`

### Endpoints

#### Manga

- **Get Top 100 Manga**
  - `GET /manga/top100`
  - Query Params: `page` (default: 1), `perPage` (default: 10)
  - Example: `GET /manga/top100?page=1&perPage=10`

- **Get Trending Manga**
  - `GET /manga/trending`
  - Query Params: `page`, `perPage`
  - Example: `GET /manga/trending?page=2&perPage=5`

- **Get Top Manhwa**
  - `GET /manga/top-manhwa`
  - Query Params: `page`, `perPage`
  - Example: `GET /manga/top-manhwa?page=1&perPage=10`

- **Search Manga by Title**
  - `GET /manga/search/:query`
  - Path Param: `query` (search string)
  - Query Params: `page`, `perPage`
  - Example: `GET /manga/search/one piece?page=1&perPage=5`

#### Anime

- **Get Top 100 Anime**
  - `GET /anime/top100`
  - Query Params: `page`, `perPage`
  - Example: `GET /anime/top100?page=1&perPage=10`

- **Get Trending Anime**
  - `GET /anime/trending`
  - Query Params: `page`, `perPage`
  - Example: `GET /anime/trending?page=1&perPage=10`

- **Search Anime by Title**
  - `GET /anime/search/:query`
  - Path Param: `query` (search string)
  - Query Params: `page`, `perPage`
  - Example: `GET /anime/search/naruto?page=1&perPage=5`

- **Get Anime by ID**
  - `GET /anime/:id`
  - Path Param: `id` (AniList anime ID)
  - Example: `GET /anime/1`

### Example Request (using curl)

```bash
# Get top 10 trending anime
curl "http://localhost:3000/anime/trending?page=1&perPage=10"

# Search for manga titled 'Attack on Titan'
curl "http://localhost:3000/manga/search/Attack%20on%20Titan?page=1&perPage=5"

# Get anime by ID
curl "http://localhost:3000/anime/1"
```

### Response Format
All endpoints return JSON. Example response for `/anime/trending`:

```json
{
  "success": true,
  "pagination": {
    "total": 100,
    "currentPage": 1,
    "lastPage": 10,
    "hasNextPage": true,
    "perPage": 10
  },
  "results": [
    {
      "id": 1,
      "title": { "romaji": "Cowboy Bebop", ... },
      "coverImage": { "large": "..." },
      ...
    },
    ...
  ],
  "cached": false
}
```

## Caching
- All endpoints use in-memory caching for 1 hour to reduce API calls to AniList and improve performance.

## Error Handling
- If an error occurs, the API returns a JSON object with `success: false` and an error `message`.

## Contributing
Pull requests and suggestions are welcome! Please open an issue or PR on GitHub.

---

Created by [Samir Thakuri](https://github.com/notsopreety) 