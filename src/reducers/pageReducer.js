import {
  PENDING_PAGES,
  PUBLISHED_PAGES,
  SEARCH_PAGES,
  PAGE_POST,
  SET_CURRENT_PUBLISHED_PAGE,
  SET_CURRENT_PENDING_PAGE,
  SELECTED_PAGE_TITLE,
  SET_CURRENT_PAGE_POSTS_PAGE,
  SEARCH_CONTRIBUTORS,
} from '../actions/types'
import {UPDATE_PUBLISHED_PAGEPOSTLIST}  from '../actions/postAction'

const initialState = {
  publishedPageList: {},
  pendingPageList: {},
  searchList: {},
  pagePostList: {},
  publishedPageCurrentPage: 1,
  pendingPageCurrentPage: 1,
  selectedPageName: '',
  publishedPagePostsCurrentPage: 1,
  searchContributorsList: [],
}

const pageReducer = (state = initialState, action) => {
  switch (action.type) {
    case PUBLISHED_PAGES: {
      return {
        ...state,
        publishedPageList: action.payload,
        publishedPageCurrentPage: action.payload.currentPage,
      }
    }
    case PENDING_PAGES: {
      return {
        ...state,
        pendingPageList: action.payload,
      }
    }
    case SEARCH_PAGES: {
      return {
        ...state,
        searchList: action.payload,
      }
    }
    case PAGE_POST: {
      return {
        ...state,
        pagePostList: action.payload,
      }
    }
    case SET_CURRENT_PUBLISHED_PAGE: {
      return {
        ...state,
        publishedPageCurrentPage: action.payload,
      }
    }

    case SET_CURRENT_PENDING_PAGE: {
      return {
        ...state,
        pendingPageCurrentPage: action.payload,
      }
    }
    case SELECTED_PAGE_TITLE: {
      return {
        ...state,
        selectedPageName: action.payload,
      }
    }
    case SET_CURRENT_PAGE_POSTS_PAGE: {
      return {
        ...state,
        publishedPagePostsCurrentPage: action.payload,
      }
    }
  
  case SEARCH_CONTRIBUTORS: {
    return {
      ...state,
      searchContributorsList: action.payload,
    }
  }

    case UPDATE_PUBLISHED_PAGEPOSTLIST: {
    return {
      ...state,
      pagePostList: {
        ...state.pagePostList,
        results: action.payload,
      }
    }
  }

    default:
      return state
  }
}

export default pageReducer
