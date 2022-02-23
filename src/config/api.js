export const BASE_URL = 'https://dev.flyked.com/api/v1/admin';

export const API = {
  LOGIN: `${BASE_URL}/login`,
  PENDING_PAGES: `${BASE_URL}/page/pending`,
  PUBLISHED_PAGES: `${BASE_URL}/page/published`,
  SEARCH_PAGES: `${BASE_URL}/page/search?title=`,
  CATEGORY: `${BASE_URL}/category`,
  PAGE: `${BASE_URL}/page`,
  SUB_CATEGORY: `${BASE_URL}/subcategory`,
  MEDIA_UPLOAD: `${BASE_URL}/uploadImage`,
  PUBLISHED_POSTS: `${BASE_URL}/post/published`,
  SEARCH_CONTRIBUTORS: `${BASE_URL}/user/search?searchTerm=`,
  GET_PENDING_POSTS: `${BASE_URL}/post/pending`,
  GET_UNASSIGNED_POSTS: `${BASE_URL}/post/unassigned`,
  GET_ARCHIVED_POSTS: `${BASE_URL}/post/archive`,
  ARCHIVE_POST: `${BASE_URL}/post/archive`,
  UNARCHIVE_POST: `${BASE_URL}/post/unarchive`,
  GET_SEARCH_PAGE_LIST: `${BASE_URL}/page/search`,
  POST_APPROVIE_API: `${BASE_URL}/post/approve`,
  POST_REJECT_API: `${BASE_URL}/post/reject`,
  POST_DETAILS_UPDATE_API: `${BASE_URL}/post/`,
  POST_COMMENTS_LIST: `${BASE_URL}/post`,
}
