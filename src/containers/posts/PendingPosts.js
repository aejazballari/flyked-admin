import React, { useContext } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { AlertNotificationContext } from '../../elements/alert-notfication/alertState';
import MainContainer from '../../components/utilitiies/MainContainer';
import PendingPostsContainer from './pendingPosts/index';
import * as pendingPostAction from '../../actions/pendingPostAction';
import Pagination from '../../components/utilitiies/Pagination';
import { SELECTED_PENDING_POSTS } from '../../actions/types';

export default function PendingPosts() {
  const dispatch = useDispatch();
  const { setAlert } = useContext(AlertNotificationContext);
  const pendingPostList = useSelector((state) => state?.pendingPosts?.pendingPostList);
  const isLoading = useSelector((state) => state?.pendingPosts?.isLoading);
  const postFilter = useSelector((state) => state?.filter?.postPublished);
  function handleScroll() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  return (
    <MainContainer bodyHight="90%" footer={
      !isLoading && pendingPostList?.results?.length !== 0 && (
        <Pagination
          limit={10}
          totalResults={pendingPostList?.totalResults}
          totalPages={pendingPostList?.totalPages}
          currentPage={pendingPostList?.pagingCounter}
          onClickPrevious={() => { 
            dispatch(pendingPostAction.getPendingUnAssignedPostList('pendingPosts', pendingPostList?.prevPage, setAlert, postFilter));
            dispatch({ type: SELECTED_PENDING_POSTS, payload: [] });
            handleScroll();
          }}
          onClickNext={() => {
            dispatch(pendingPostAction.getPendingUnAssignedPostList('pendingPosts', pendingPostList?.nextPage, setAlert, postFilter));
            dispatch({ type: SELECTED_PENDING_POSTS, payload: [] });
            handleScroll();
          }}
          hasPrevPage={pendingPostList?.hasPrevPage}
          hasNextPage={pendingPostList?.hasNextPage}
        />
      )
    }>
      <PendingPostsContainer postList={pendingPostList} postTypeComponent="pendingPosts" />
    </MainContainer>
  )
}
