const express = require('express');
const cors = require('cors');
const NodeCache = require('node-cache');
const {
  // Manga functions
  searchManga,
  getMangaById,
  getTop100Manga,
  getTrendingManga,
  getTopManhwa,
  // Anime functions
  searchAnime,
  getAnimeById,
  getTop100Anime,
  getTrendingAnime
} = require('./queries/anilist');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize cache with 1-hour TTL (3600 seconds)
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

// Middleware
app.use(cors());
app.use(express.json());

/**
 * @route GET /manga/top100
 * @desc Get top 100 manga with pagination and caching
 * @query {page} - Page number (default: 1)
 * @query {perPage} - Items per page (default: 10)
 */
app.get('/manga/top100', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    if (page < 1 || perPage < 1) {
      return res.status(400).json({ success: false, message: 'Invalid page or perPage value' });
    }

    const cacheKey = `top100:${page}:${perPage}`;
    const cachedResults = cache.get(cacheKey);
    if (cachedResults) {
      return res.status(200).json({
        success: true,
        pagination: cachedResults.pageInfo,
        results: cachedResults.media,
        cached: true
      });
    }

    const results = await getTop100Manga(page, perPage);
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
 * @route GET /manga/trending
 * @desc Get trending manga with pagination and caching
 * @query {page} - Page number (default: 1)
 * @query {perPage} - Items per page (default: 10)
 */
app.get('/manga/trending', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    if (page < 1 || perPage < 1) {
      return res.status(400).json({ success: false, message: 'Invalid page or perPage value' });
    }

    const cacheKey = `trending:${page}:${perPage}`;
    const cachedResults = cache.get(cacheKey);
    if (cachedResults) {
      return res.status(200).json({
        success: true,
        pagination: cachedResults.pageInfo,
        results: cachedResults.media,
        cached: true
      });
    }

    const results = await getTrendingManga(page, perPage);
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
 * @route GET /manga/top-manhwa
 * @desc Get top manhwa with pagination and caching
 * @query {page} - Page number (default: 1)
 * @query {perPage} - Items per page (default: 10)
 */
app.get('/manga/top-manhwa', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    if (page < 1 || perPage < 1) {
      return res.status(400).json({ success: false, message: 'Invalid page or perPage value' });
    }

    const cacheKey = `top-manhwa:${page}:${perPage}`;
    const cachedResults = cache.get(cacheKey);
    if (cachedResults) {
      return res.status(200).json({
        success: true,
        pagination: cachedResults.pageInfo,
        results: cachedResults.media,
        cached: true
      });
    }

    const results = await getTopManhwa(page, perPage);
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

    const cacheKey = `search:${query}:${page}:${perPage}`;
    const cachedResults = cache.get(cacheKey);
    if (cachedResults) {
      return res.status(200).json({
        success: true,
        pagination: cachedResults.pageInfo,
        results: cachedResults.media,
        cached: true
      });
    }

    const results = await searchManga(query, page, perPage);
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

    const cacheKey = `manga:${id}`;
    const cachedManga = cache.get(cacheKey);
    if (cachedManga) {
      return res.status(200).json({
        success: true,
        manga: cachedManga,
        cached: true
      });
    }

    const manga = await getMangaById(id);
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

// ======================
// Anime Endpoints
// ======================

/**
 * @route GET /anime/top100
 * @desc Get top 100 anime with pagination and caching
 * @query {page} - Page number (default: 1)
 * @query {perPage} - Items per page (default: 10)
 */
app.get('/anime/top100', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    if (page < 1 || perPage < 1) {
      return res.status(400).json({ success: false, message: 'Invalid page or perPage value' });
    }

    const cacheKey = `anime:top100:${page}:${perPage}`;
    const cachedResults = cache.get(cacheKey);
    if (cachedResults) {
      return res.status(200).json({
        success: true,
        pagination: cachedResults.pageInfo,
        results: cachedResults.media,
        cached: true
      });
    }

    const results = await getTop100Anime(page, perPage);
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
 * @route GET /anime/trending
 * @desc Get trending anime with pagination and caching
 * @query {page} - Page number (default: 1)
 * @query {perPage} - Items per page (default: 10)
 */
app.get('/anime/trending', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    if (page < 1 || perPage < 1) {
      return res.status(400).json({ success: false, message: 'Invalid page or perPage value' });
    }

    const cacheKey = `anime:trending:${page}:${perPage}`;
    const cachedResults = cache.get(cacheKey);
    if (cachedResults) {
      return res.status(200).json({
        success: true,
        pagination: cachedResults.pageInfo,
        results: cachedResults.media,
        cached: true
      });
    }

    const results = await getTrendingAnime(page, perPage);
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
 * @route GET /anime/search/:query
 * @desc Search anime by title with pagination and caching
 * @query {page} - Page number (default: 1)
 * @query {perPage} - Items per page (default: 10)
 */
app.get('/anime/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    if (page < 1 || perPage < 1) {
      return res.status(400).json({ success: false, message: 'Invalid page or perPage value' });
    }

    const cacheKey = `anime:search:${query}:${page}:${perPage}`;
    const cachedResults = cache.get(cacheKey);
    if (cachedResults) {
      return res.status(200).json({
        success: true,
        pagination: cachedResults.pageInfo,
        results: cachedResults.media,
        cached: true
      });
    }

    const results = await searchAnime(query, page, perPage);
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
 * @route GET /anime/:id
 * @desc Get anime by AniList ID with caching
 */
app.get('/anime/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: 'Invalid ID' });

    const cacheKey = `anime:${id}`;
    const cachedAnime = cache.get(cacheKey);
    if (cachedAnime) {
      return res.status(200).json({
        success: true,
        anime: cachedAnime,
        cached: true
      });
    }

    const anime = await getAnimeById(id);
    cache.set(cacheKey, anime);

    res.status(200).json({
      success: true,
      anime,
      cached: false
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Root
app.get('/', (req, res) => {
  res.send('📺📚 Welcome to AniList Anime & Manga REST API');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ AniList Anime & Manga API running at http://localhost:${PORT}`);
});