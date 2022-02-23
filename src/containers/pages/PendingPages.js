import React, { useEffect, useState, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as pageActions from '../../actions/pageAction'
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography';
import Edit from '../../components/Edit'
import PendingPageItem from '../../components/page/PendingPageItem'
import { AlertNotificationContext } from '../../elements/alert-notfication/alertState'
import MainContainer from '../../components/utilitiies/MainContainer'
import Pagination from '../../components/utilitiies/Pagination'
import MergeSuccess from '../../components/page/MergeSuccess'
import moment from 'moment-mini'

export default function PendingPages() {
  const dispatch = useDispatch()
  const { setAlert } = useContext(AlertNotificationContext);
  const pendingPages = useSelector((state) => state.page.pendingPageList)
  const filter = useSelector((state) => state.filter)
  const [pageLoader, setPageLoader] = useState(true)
  const [limit, setLimit] = useState(6)
  const [merge, setMerge] = useState(false)
  const [approve, setApprove] = useState(false)
  const [reject, setReject] = useState(false)
  // const [currentPage, setCurrentPage] = useState(pendingPages?.currentPage || 1)
  const currentPage = useSelector((state) => state.page.pendingPageCurrentPage)
  const [isEdit, setIsEdit] = useState(false)
  const [editPage, setEditPage] = useState({})

  const editOpen = () => {
    setIsEdit(true)
  }

  const editClose = () => {
    setIsEdit(false)
  }

  const handlePage = (page) => {
    setEditPage(page)
  }

  const refresh = () => {
    setPageLoader(true)
    let body = ''
    if (filter.pending.selectedCategory) {
      body = body.concat(`category=${filter.pending.selectedCategory}&`)
    }
    if (filter.pending.selectedSubCategory) {
      body = body.concat(`subCategory=${filter.pending.selectedSubCategory}&`)
    }
    if (filter.pending.date.startDate || filter.pending.date.endDate) {
      if (filter.pending.date?.startDate) {
        body = body.concat(
          `createdAt[gte]=${moment(filter.pending.date?.startDate).format(
            'YYYY-MM-DD'
          )}&`
        )
      }
      if (filter.pending.date?.endDate) {
        body = body.concat(
          `createdAt[lte]=${moment(filter.pending.date?.endDate).format(
            'YYYY-MM-DD'
          )}&`
        )
      }
    }

    dispatch(
      pageActions.filterPendingPage(
        () => setPageLoader(false),
        limit,
        currentPage,
        body
      )
    )
  }

  useEffect(() => {
    refresh()
  }, [
    currentPage,
    filter.pending.selectedCategory,
    filter.pending.selectedSubCategory,
    filter.pending.date,
  ])

  const handleClickOpen = () => {
    setMerge(true)
  }

  const handleOnApproveOpen = () => {
    setApprove(true)
  }
  const handleOnRejectOpen = () => {
    setReject(true)
  }

  const handleMerge = () => {
    setMerge(false)
  }
  const handleApprove = () => {
    setApprove(false)
  }
  const handleReject = () => {
    setReject(false)
  }

  const setCurrentPage = (page) => {
    dispatch(pageActions.setPendingPageCurrentPage(page))
  }

  const onApprove = (id, page, callback) => {
    // console.log('id',id,page);
    const body = {
      title: page?.title,
      image: page?.image,
      dob: page?.dob,
      category: page?.category?._id,
      subCategory: page?.subCategory?._id || null,
    }
    dispatch(pageActions.approvePages(id, body, refresh, handleOnApproveOpen, callback))
  }

  const onReject = (id, callback) => {
    // console.log('id',id)
    dispatch(pageActions.rejectPages(id, refresh, handleOnRejectOpen, callback))
  } 

  const onMerge = (id, body, callback) => {
    // console.log('id',id,body);
    dispatch(pageActions.mergePage(id, body, refresh, handleClickOpen, callback))
  }

  const onEdit = (id, body) => {
    dispatch(pageActions.editPage(id, body, refresh, editClose, setAlert))
  }

  return (
    <MainContainer
      footer={
        !pageLoader && pendingPages?.results?.length !== 0 &&  (
          <Pagination
            limit={limit}
            totalResults={pendingPages?.totalResults}
            totalPages={pendingPages?.totalPages}
            currentPage={pendingPages?.pagingCounter}
            onClickPrevious={() => setCurrentPage(pendingPages?.prevPage)}
            onClickNext={() => setCurrentPage(pendingPages?.nextPage)}
            hasPrevPage={pendingPages?.hasPrevPage}
            hasNextPage={pendingPages?.hasNextPage}
          />
        )
      }
    >
      <Box
        display='flex'
        flexWrap='wrap'
        justifyContent='flex-start'
        style={{
          width: '100%',
          margin: '0 auto',
          backgroundColor: '#FFFF',
          borderRadius: '10px',
          padding: '10px',
        }}
      >
        {pageLoader ? (
          <CircularProgress size={32} color='primary' className='loaderClass' />
        ) : (
          pendingPages.results && (
            <>
              {pendingPages.results.length > 0 ? (
                pendingPages.results.map((item) => (
                  <PendingPageItem
                    page={item}
                    key={item._id}
                    onApprove={onApprove}
                    onReject={onReject}
                    onMerge={onMerge}
                    handlePage={handlePage}
                    editOpen={editOpen}
                  />
                ))
              ) : (
                <Typography variant="h4" style={{ textAlign: 'center', marginTop: '20px', width: '100%' }}>Records not found</Typography>
              )}
            </>
          )
        )}
      </Box>
      {merge && <MergeSuccess
        open={merge}
        handleClose={handleMerge}
        text='Page Merged Successfully'
        subText='Page have been published, you can see them in respective pages.'
      />}
      {approve && <MergeSuccess
        open={approve}
        handleClose={handleApprove}
        text='Page Approved Successfully'
        subText='Page have been published, you can see them in respective pages.'
      />}
      {reject && <MergeSuccess
        open={reject}
        handleClose={handleReject}
        text='Page Rejected Successfully'
        subText='Page has not published, and it has been rejected.'
      />}
      {isEdit && (
        <Edit
          page={editPage}
          editClose={editClose}
          isEdit={isEdit}
          onEdit={onEdit}
        />
      )}
    </MainContainer>
  )
}
