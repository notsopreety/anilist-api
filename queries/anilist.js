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

module.exports = {
  searchManga,
  getMangaById,
  getTop100Manga,
  getTrendingManga,
  getTopManhwa
};