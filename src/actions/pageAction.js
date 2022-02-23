import { API } from '../config/api'
import { axiosGetWithToken, axiosPut } from '../services/apiServices'
import {
  PUBLISHED_PAGES,
  PENDING_PAGES,
  SEARCH_PAGES,
  EDIT_PAGE,
  PAGE_POST,
  SET_CURRENT_PUBLISHED_PAGE,
  SET_CURRENT_PENDING_PAGE,
  SELECTED_PAGE_TITLE,
  SET_CURRENT_PAGE_POSTS_PAGE,
} from './types'

export const fetchPublishedPages = (onLoad, limit = 10, currentpage = 1) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    axiosGetWithToken(
      `${API.PUBLISHED_PAGES}?limit=${limit}&page=${currentpage}`,
      token
    ).then((res) => {
      onLoad()
      if (res?.status === 200) {
        dispatch({
          type: PUBLISHED_PAGES,
          payload: res.data.data,
        })
      } else {
        console.log('SOME EROR')
      }
    })
  }
}

export const fetchPendingPages = (onLoad, limit = 10, currentpage = 1) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    axiosGetWithToken(
      `${API.PENDING_PAGES}?limit=${limit}&page=${currentpage}`,
      token
    ).then((res) => {
      onLoad()
      if (res.status === 200) {
        dispatch({
          type: PENDING_PAGES,
          payload: res.data.data,
        })
      } else {
        console.log('SOME EROR')
      }
    })
  }
}

export const searchPages = (term) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    axiosGetWithToken(`${API.SEARCH_PAGES}${term}`, token).then((res) => {
      if (res?.status === 200) {
        dispatch({
          type: SEARCH_PAGES,
          payload: res.data.data,
        })
      } else {
        console.log('SOME EROR')
      }
    })
  }
}

export const approvePages = (id, body, refresh, handleClickOpen, callback) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    axiosPut(`${API.PAGE}/${id}/approve`, body, token).then((res) => {
      if (res.status === 200) {
        if (refresh) refresh()
        if (handleClickOpen) handleClickOpen()
        callback();
      } else {
        console.log('SOME EROR')
      }
    })
  }
}
export const rejectPages = (id, refresh, handleClickOpen, callback) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    axiosPut(`${API.PAGE}/${id}/reject`, {}, token).then((res) => {
      if (res.status === 200) {
        if (refresh) refresh()
        if (handleClickOpen) handleClickOpen()
        callback();
      } else {
        console.log('SOME EROR')
      }
    })
  }
}

export const mergePage = (id, body, refresh, handleClickOpen, callback) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    axiosPut(`${API.PAGE}/${id}/merge`, body, token).then((res) => {
      if (res.status === 200) {
        if (refresh) refresh()
        if (handleClickOpen) handleClickOpen()
        callback();
      } else {
        console.log('SOME EROR')
      }
    })
  }
}

export const editPage = (id, data, refresh, editClose, setAlert) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    axiosPut(`${API.PAGE}/${id}`, data, token).then((res) => {
      if(data?.title && data?.description) editClose()
      if (res.status === 200) {
        setAlert('success', 'Page edited successfully');
        if (refresh) refresh()
        dispatch({
          type: EDIT_PAGE,
          payload: res.data.data,
        })
      } else {
        setAlert('error', res.data.message || 'Something went wrong please try again');
        console.log('SOME EROR')
      }
    })
  }
}

export const filterPendingPage = (onLoad, limit, page, data) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    axiosGetWithToken(
      `${API.PENDING_PAGES}?page=${page}&limit=${limit}&${data}`,
      token
    ).then((res) => {
      onLoad()
      if (res.status === 200) {
        dispatch({
          type: PENDING_PAGES,
          payload: res.data.data,
        })
      } else {
        console.log('SOME EROR')
      }
    })
  }
}

export const filterPublishedPage = (onLoad, limit, page, data) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    axiosGetWithToken(
      `${API.PUBLISHED_PAGES}?page=${page}&limit=${limit}&${data}`,
      token
    ).then((res) => {
      onLoad()
      if (res.status === 200) {
        dispatch({
          type: PUBLISHED_PAGES,
          payload: res.data.data,
        })
      } else {
        console.log('SOME EROR')
      }
    })
  }
}

export const fetchPagePosts = (onLoad, id, limit = 10, currentpage = 1) => {
  console.log('gvkjhghfghv', id)
  return async (dispatch, getState) => {
    const token = getState().auth.token
    axiosGetWithToken(`${API.PAGE}/${id}/post`, token).then((res) => {
      console.log('respobse', res)
      if (onLoad) onLoad()
      if (res?.status === 200) {
        dispatch({
          type: PAGE_POST,
          payload: res.data.data,
        })
      } else {
        console.log('SOME EROR')
      }
    })
  }
}

export const filterPagePosts = (onLoad, id, limit, page, data) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    axiosGetWithToken(
      `${API.PAGE}/${id}/post?page=${page}&limit=${limit}&${data}`,
      token
    ).then((res) => {
      if(onLoad) onLoad()
      if (res?.status === 200) {
        dispatch({
          type: PAGE_POST,
          payload: res.data.data,
        })
      } else {
        console.log('SOME EROR')
      }
    })
  }
}

export const setPublishedPageCurrentPage = (page) => async (dispatch) => {
  dispatch({
    type: SET_CURRENT_PUBLISHED_PAGE,
    payload: page,
  })
}

export const setPendingPageCurrentPage = (page) => async (dispatch) => {
  dispatch({
    type: SET_CURRENT_PENDING_PAGE,
    payload: page,
  })
}
export const setPublishedPagePostsCurrentPage = (page) => async (dispatch) => {
  dispatch({
    type: SET_CURRENT_PAGE_POSTS_PAGE,
    payload: page,
  })
}

export const getSelectedPageTitle = (title) => async (dispatch) => {
  dispatch({
    type: SELECTED_PAGE_TITLE,
    payload: title,
  })
}
