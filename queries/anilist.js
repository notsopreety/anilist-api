const axios = require('axios');

const ANILIST_API = 'https://graphql.anilist.co';

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
    }
  }
}`;

const MANGA_BY_ID_QUERY = `
query ($id: Int) {
  Media(id: $id, type: MANGA) {
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

module.exports = { searchManga, getMangaById };