const express = require('express');
const cors = require('cors');
const NodeCache = require('node-cache');
const { searchManga, getMangaById } = require('./queries/anilist');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize cache with 1-hour TTL (3600 seconds)
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

// Middleware
app.use(cors());
app.use(express.json());

/**
 * @route GET /manga/search/:query
 * @desc Search manga by title with pagination and caching
 * @query {page} - Page number (default: 1)
 * @query {perPage} - Items per page (default: 10)
 */
app.get('/manga/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    if (page < 1 || perPage < 1) {
      return res.status(400).json({ success: false, message: 'Invalid page or perPage value' });
    }

    // Generate cache key based on query, page, and perPage
    const cacheKey = `search:${query}:${page}:${perPage}`;

    // Check cache
    const cachedResults = cache.get(cacheKey);
    if (cachedResults) {
      return res.status(200).json({
        success: true,
        pagination: cachedResults.pageInfo,
        results: cachedResults.media,
        cached: true
      });
    }

    // Fetch from AniList API
    const results = await searchManga(query, page, perPage);

    // Store in cache
    cache.set(cacheKey, results);

    res.status(200).json({
      success: true,
      pagination: results.pageInfo,
      results: results.media,
      cached: false
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @route GET /manga/:id
 * @desc Get manga by AniList ID with caching
 */
app.get('/manga/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

    // Generate cache key based on ID
    const cacheKey = `manga:${id}`;

    // Check cache
    const cachedManga = cache.get(cacheKey);
    if (cachedManga) {
      return res.status(200).json({
        success: true,
        manga: cachedManga,
        cached: true
      });
    }

    // Fetch from AniList API
    const manga = await getMangaById(id);

    // Store in cache
    cache.set(cacheKey, manga);

    res.status(200).json({
      success: true,
      manga,
      cached: false
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Root
app.get('/', (req, res) => {
  res.send('📚 Welcome to AniList Manga REST API');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ AniList Manga API running at http://localhost:${PORT}`);
});