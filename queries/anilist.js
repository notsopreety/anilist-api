const axios = require('axios');

const ANILIST_API = 'https://graphql.anilist.co';

// Base media fields for reuse in queries
const MEDIA_FIELDS = `
  id
  title {
    romaji
    english
    native
  }
  coverImage {
    large
  }
  description(asHtml: false)
  chapters
  volumes
  status
  genres
  averageScore
  siteUrl
`;

const SEARCH_MANGA_QUERY = `
query ($search: String, $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media(search: $search, type: MANGA) {
      ${MEDIA_FIELDS}
    }
  }
}`;

const MANGA_BY_ID_QUERY = `
query ($id: Int) {
  Media(id: $id, type: MANGA) {
    ${MEDIA_FIELDS}
  }
}`;

const TOP_100_MANGA_QUERY = `
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media(type: MANGA, sort: SCORE_DESC) {
      ${MEDIA_FIELDS}
    }
  }
}`;

const TRENDING_MANGA_QUERY = `
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media(type: MANGA, sort: TRENDING_DESC) {
      ${MEDIA_FIELDS}
    }
  }
}`;

const TOP_MANHWA_QUERY = `
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media(type: MANGA, countryOfOrigin: "KR", sort: SCORE_DESC) {
      ${MEDIA_FIELDS}
    }
  }
}`;

// Anime Queries
const SEARCH_ANIME_QUERY = `
query ($search: String, $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media(search: $search, type: ANIME) {
      ${MEDIA_FIELDS}
      episodes
      duration
      season
      seasonYear
      studios(isMain: true) {
        nodes {
          name
        }
      }
    }
  }
}`;

const ANIME_BY_ID_QUERY = `
query ($id: Int) {
  Media(id: $id, type: ANIME) {
    ${MEDIA_FIELDS}
    episodes
    duration
    season
    seasonYear
    studios(isMain: true) {
      nodes {
        name
      }
    }
  }
}`;

const TOP_100_ANIME_QUERY = `
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media(type: ANIME, sort: SCORE_DESC) {
      ${MEDIA_FIELDS}
      episodes
      season
      seasonYear
    }
  }
}`;

const TRENDING_ANIME_QUERY = `
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media(type: ANIME, sort: TRENDING_DESC) {
      ${MEDIA_FIELDS}
      episodes
      season
      seasonYear
    }
  }
}`;

/**
 * Fetches search results for manga title with pagination.
 * @param {string} search - The search string.
 * @param {number} page - The page number.
 * @param {number} perPage - Items per page.
 */
async function searchManga(search, page = 1, perPage = 10) {
  try {
    const res = await axios.post(ANILIST_API, {
      query: SEARCH_MANGA_QUERY,
      variables: { search, page, perPage }
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    return res.data.data.Page;
  } catch (err) {
    throw new Error(err.response?.data?.errors?.[0]?.message || 'AniList search error');
  }
}

/**
 * Fetches manga details by ID.
 * @param {number} id - The AniList manga ID.
 */
async function getMangaById(id) {
  try {
    const res = await axios.post(ANILIST_API, {
      query: MANGA_BY_ID_QUERY,
      variables: { id }
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    return res.data.data.Media;
  } catch (err) {
    throw new Error(err.response?.data?.errors?.[0]?.message || 'AniList ID error');
  }
}

/**
 * Fetches top 100 manga with pagination.
 * @param {number} page - The page number.
 * @param {number} perPage - Items per page.
 */
async function getTop100Manga(page = 1, perPage = 10) {
  try {
    const res = await axios.post(ANILIST_API, {
      query: TOP_100_MANGA_QUERY,
      variables: { page, perPage }
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    return res.data.data.Page;
  } catch (err) {
    throw new Error(err.response?.data?.errors?.[0]?.message || 'AniList top 100 error');
  }
}

/**
 * Fetches trending manga with pagination.
 * @param {number} page - The page number.
 * @param {number} perPage - Items per page.
 */
async function getTrendingManga(page = 1, perPage = 10) {
  try {
    const res = await axios.post(ANILIST_API, {
      query: TRENDING_MANGA_QUERY,
      variables: { page, perPage }
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    return res.data.data.Page;
  } catch (err) {
    throw new Error(err.response?.data?.errors?.[0]?.message || 'AniList trending error');
  }
}

/**
 * Fetches top manhwa with pagination.
 * @param {number} page - The page number.
 * @param {number} perPage - Items per page.
 */
async function getTopManhwa(page = 1, perPage = 10) {
  try {
    const res = await axios.post(ANILIST_API, {
      query: TOP_MANHWA_QUERY,
      variables: { page, perPage }
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    return res.data.data.Page;
  } catch (err) {
    throw new Error(err.response?.data?.errors?.[0]?.message || 'AniList top manhwa error');
  }
}

/**
 * Fetches search results for anime title with pagination.
 * @param {string} search - The search string.
 * @param {number} page - The page number.
 * @param {number} perPage - Items per page.
 */
async function searchAnime(search, page = 1, perPage = 10) {
  try {
    const res = await axios.post(ANILIST_API, {
      query: SEARCH_ANIME_QUERY,
      variables: { search, page, perPage }
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    return res.data.data.Page;
  } catch (err) {
    throw new Error(err.response?.data?.errors?.[0]?.message || 'AniList anime search error');
  }
}

/**
 * Fetches anime details by ID.
 * @param {number} id - The AniList anime ID.
 */
async function getAnimeById(id) {
  try {
    const res = await axios.post(ANILIST_API, {
      query: ANIME_BY_ID_QUERY,
      variables: { id }
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    return res.data.data.Media;
  } catch (err) {
    throw new Error(err.response?.data?.errors?.[0]?.message || 'AniList anime ID error');
  }
}

/**
 * Fetches top 100 anime with pagination.
 * @param {number} page - The page number.
 * @param {number} perPage - Items per page.
 */
async function getTop100Anime(page = 1, perPage = 10) {
  try {
    const res = await axios.post(ANILIST_API, {
      query: TOP_100_ANIME_QUERY,
      variables: { page, perPage }
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    return res.data.data.Page;
  } catch (err) {
    throw new Error(err.response?.data?.errors?.[0]?.message || 'AniList top 100 anime error');
  }
}

/**
 * Fetches trending anime with pagination.
 * @param {number} page - The page number.
 * @param {number} perPage - Items per page.
 */
async function getTrendingAnime(page = 1, perPage = 10) {
  try {
    const res = await axios.post(ANILIST_API, {
      query: TRENDING_ANIME_QUERY,
      variables: { page, perPage }
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    return res.data.data.Page;
  } catch (err) {
    throw new Error(err.response?.data?.errors?.[0]?.message || 'AniList trending anime error');
  }
}

module.exports = {
  // Manga exports
  searchManga,
  getMangaById,
  getTop100Manga,
  getTrendingManga,
  getTopManhwa,
  
  // Anime exports
  searchAnime,
  getAnimeById,
  getTop100Anime,
  getTrendingAnime
};