import React, { useContext } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { AlertNotificationContext } from '../../elements/alert-notfication/alertState';
import MainContainer from '../../components/utilitiies/MainContainer';
import PendingPostsContainer from './pendingPosts/index';
import * as pendingPostAction from '../../actions/pendingPostAction';
import Pagination from '../../components/utilitiies/Pagination';
import { SELECTED_PENDING_POSTS } from '../../actions/types';

export default function UnassignedPosts() {
  const dispatch = useDispatch();
  const { setAlert } = useContext(AlertNotificationContext);
  const unassignedPostList = useSelector((state) => state?.pendingPosts?.unassignedPostList);
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
      !isLoading && unassignedPostList?.results?.length !== 0 &&  (
        <Pagination
          limit={10}
          totalResults={unassignedPostList?.totalResults}
          totalPages={unassignedPostList?.totalPages}
          currentPage={unassignedPostList?.pagingCounter}
          onClickPrevious={() => { 
            dispatch(pendingPostAction.getPendingUnAssignedPostList('unAssignedPosts', unassignedPostList?.prevPage, setAlert, postFilter));
            dispatch({ type: SELECTED_PENDING_POSTS, payload: [] });
            handleScroll();
          }}
          onClickNext={() => {
            dispatch(pendingPostAction.getPendingUnAssignedPostList('unAssignedPosts', unassignedPostList?.nextPage, setAlert, postFilter));
            dispatch({ type: SELECTED_PENDING_POSTS, payload: [] });
            handleScroll();
          }}
          hasPrevPage={unassignedPostList?.hasPrevPage}
          hasNextPage={unassignedPostList?.hasNextPage}
        />
      )
    }>
      <PendingPostsContainer postList={unassignedPostList} postTypeComponent="unAssignedPosts" />
    </MainContainer>
  )
}
